import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

// --- GET: ดึงข้อมูลสรุปบัญชี (รวมทุกอย่าง: ขาย + ซื้อ + จ่ายทั่วไป) ---
export async function GET() {
  try {
    // ------------------------------------------------------------------
    // 1. คำนวณรายรับ (Income)
    // ------------------------------------------------------------------
    
    // 1.1 ยอดขายจาก Orders (ถ้ามีตาราง orders)
    // *หมายเหตุ: ถ้ายังไม่ได้ทำตาราง orders ให้คอมเมนต์บรรทัดนี้แล้วให้ totalSales = 0
    let totalSales = 0;
    try {
        const [salesResult] = await pool.query("SELECT SUM(total_amount) as total FROM orders");
        totalSales = Number(salesResult[0].total || 0);
    } catch (e) {
        // ดัก Error ไว้ก่อน เผื่อยังไม่มีตาราง orders
        console.log("⚠️ ยังไม่มีตาราง Orders ข้ามการคำนวณส่วนนี้");
    }

    // 1.2 รายรับอื่นๆ จาก Transactions (Manual Input)
    const [otherIncomeResult] = await pool.query("SELECT SUM(amount) as total FROM transactions WHERE type = 'Income'");
    const totalOtherIncome = Number(otherIncomeResult[0].total || 0);

    const totalIncome = totalSales + totalOtherIncome;

    // ------------------------------------------------------------------
    // 2. คำนวณรายจ่าย (Expenses)
    // ------------------------------------------------------------------

    // 2.1 ต้นทุนสินค้าจาก PO (Purchase Orders) - เฉพาะที่ไม่ยกเลิก
    const [poExpenseResult] = await pool.query("SELECT SUM(total_amount) as total FROM purchase_orders WHERE status != 'Cancelled'");
    const totalPOExpense = Number(poExpenseResult[0].total || 0);

    // 2.2 รายจ่ายทั่วไปจาก Transactions (Manual Input)
    const [manualExpenseResult] = await pool.query("SELECT SUM(amount) as total FROM transactions WHERE type = 'Expense'");
    const totalManualExpense = Number(manualExpenseResult[0].total || 0);

    const totalExpenses = totalPOExpense + totalManualExpense;

    // ------------------------------------------------------------------
    // 3. กำไรสุทธิ
    // ------------------------------------------------------------------
    const netProfit = totalIncome - totalExpenses;

    // ------------------------------------------------------------------
    // 4. ดึงรายการเคลื่อนไหวล่าสุด (รวม 3 ทหารเสือ: Orders + PO + Manual)
    // ------------------------------------------------------------------
    
    // ใช้ UNION ALL เพื่อรวมข้อมูลจาก 3 ตาราง แล้วเรียงตามวันที่
    const sqlRecent = `
      /* ส่วนที่ 1: รายการซื้อของ (PO) */
      SELECT 
        CONCAT('PO-', id) as id,    -- สร้าง ID ปลอมไม่ให้ซ้ำ เช่น PO-1
        po_number as ref_number,
        'Expense' as type, 
        'จัดซื้อสินค้า' as category, 
        total_amount as amount, 
        CONCAT('สั่งซื้อจาก ', (SELECT name FROM suppliers WHERE id = purchase_orders.supplier_id)) as description, 
        order_date as date 
      FROM purchase_orders 
      WHERE status != 'Cancelled'

      UNION ALL

      /* ส่วนที่ 2: รายการทั่วไป (Transactions) */
      SELECT 
        CONCAT('TX-', id) as id,    -- สร้าง ID ปลอม เช่น TX-1
        '-' as ref_number,
        type, 
        category, 
        amount, 
        description, 
        transaction_date as date 
      FROM transactions

      /* ส่วนที่ 3: รายการขาย (Orders) - ถ้ามี */
      /* ถ้ายังไม่มีตาราง orders ให้ลบ UNION ส่วนนี้ออกได้ครับ */
      UNION ALL
      SELECT 
        CONCAT('ORD-', id) as id, 
        CAST(id AS CHAR) as ref_number,
        'Income' as type, 
        'ยอดขายสินค้า' as category, 
        total_amount as amount, 
        CONCAT('Order ขายสินค้าให้ ', customer_name) as description, 
        sale_date as date 
      FROM orders

      ORDER BY date DESC 
      LIMIT 100
    `;

    // *หมายเหตุ: ถ้ายังไม่มีตาราง orders ให้เอา SQL ส่วน Orders ออก ไม่งั้นจะ Error
    let recentTransactions = [];
    try {
        const [result] = await pool.query(sqlRecent);
        recentTransactions = result;
    } catch (e) {
        // Fallback: ถ้า Query รวมพัง (เช่นไม่มีตาราง Order) ให้ดึงแค่ PO กับ Transaction
        console.log("⚠️ Query รวมมีปัญหา (อาจจะไม่มีตาราง orders) -> ใช้โหมดสำรอง");
        const sqlBackup = `
            SELECT CONCAT('PO-', id) as id, po_number as ref_number, 'Expense' as type, 'จัดซื้อสินค้า' as category, total_amount as amount, CONCAT('สั่งซื้อจาก Supplier ID:', supplier_id) as description, order_date as date FROM purchase_orders WHERE status != 'Cancelled'
            UNION ALL
            SELECT CONCAT('TX-', id) as id, '-' as ref_number, type, category, amount, description, transaction_date as date FROM transactions
            ORDER BY date DESC LIMIT 100
        `;
        const [resultBackup] = await pool.query(sqlBackup);
        recentTransactions = resultBackup;
    }

    return NextResponse.json({
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        profit: netProfit
      },
      transactions: recentTransactions
    });

  } catch (error) {
    console.error("Accounting API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: บันทึกรายรับ/รายจ่าย เพิ่มเติม (Manual Entry) ---
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, category, amount, description } = body;

    if (!amount || !category) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลหมวดหมู่และจำนวนเงิน' }, { status: 400 });
    }

    // ใช้ NOW() เพื่อบันทึกเวลาปัจจุบันลง transaction_date
    const sql = `INSERT INTO transactions (type, category, amount, description, transaction_date) VALUES (?, ?, ?, ?, NOW())`;
    await pool.query(sql, [type, category, amount, description]);

    return NextResponse.json({ success: true, message: 'บันทึกรายการสำเร็จ' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}