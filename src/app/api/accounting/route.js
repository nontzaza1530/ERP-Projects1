import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

// --- GET: ดึงข้อมูลสรุปบัญชี (รวมทุกอย่าง: ขาย + ซื้อ + จ่ายทั่วไป + แจ้งหนี้/ใบเสร็จ) ---
export async function GET() {
  try {
    // ------------------------------------------------------------------
    // 1. คำนวณรายรับ (Income)
    // ------------------------------------------------------------------
    
    // 1.1 ยอดขายจาก Orders
    let totalSales = 0;
    try {
        const [salesResult] = await pool.query("SELECT SUM(total_amount) as total FROM orders");
        totalSales = Number(salesResult[0].total || 0);
    } catch (e) {
        console.log("⚠️ ยังไม่มีตาราง Orders ข้ามการคำนวณส่วนนี้");
    }

    // 1.2 รายรับอื่นๆ จาก Transactions (Manual Input)
    const [otherIncomeResult] = await pool.query("SELECT SUM(amount) as total FROM transactions WHERE type = 'Income'");
    const totalOtherIncome = Number(otherIncomeResult[0].total || 0);

    // ✨ [เพิ่มใหม่] 1.3 รายรับจาก ใบเสร็จรับเงิน (Receipts) ที่เก็บเงินลูกค้าได้แล้ว
    let totalReceiptIncome = 0;
    try {
        const [receiptResult] = await pool.query("SELECT SUM(net_amount) as total FROM receipts");
        totalReceiptIncome = Number(receiptResult[0].total || 0);
    } catch (e) {
        console.log("⚠️ ยังไม่มีตาราง Receipts ข้ามการคำนวณส่วนนี้");
    }

    // ✅ รวมรายรับทั้งหมด (ขายหน้าร้าน + กรอกมือ + ใบเสร็จรับเงิน)
    const totalIncome = totalSales + totalOtherIncome + totalReceiptIncome;

    // ------------------------------------------------------------------
    // 2. คำนวณรายจ่าย (Expenses) (คงเดิม 100%)
    // ------------------------------------------------------------------

    const [poExpenseResult] = await pool.query("SELECT SUM(total_amount) as total FROM purchase_orders WHERE status != 'Cancelled'");
    const totalPOExpense = Number(poExpenseResult[0].total || 0);

    const [manualExpenseResult] = await pool.query("SELECT SUM(amount) as total FROM transactions WHERE type = 'Expense'");
    const totalManualExpense = Number(manualExpenseResult[0].total || 0);

    const totalExpenses = totalPOExpense + totalManualExpense;

    // ------------------------------------------------------------------
    // 3. กำไรสุทธิ และ ยอดรอเก็บเงิน
    // ------------------------------------------------------------------
    const netProfit = totalIncome - totalExpenses;

    // ✨ [เพิ่มใหม่] 3.1 ยอดลูกหนี้รอเก็บเงิน (Pending Invoices)
    let totalPendingIncome = 0;
    try {
        const [pendingResult] = await pool.query("SELECT SUM(grand_total) as total FROM invoices WHERE status IN ('sent', 'pending')");
        totalPendingIncome = Number(pendingResult[0].total || 0);
    } catch (e) {
        console.log("⚠️ ยังไม่มีตาราง Invoices ข้ามการคำนวณส่วนนี้");
    }

    // ------------------------------------------------------------------
    // 4. ดึงรายการเคลื่อนไหวล่าสุด (รวมของเดิม: Orders + PO + Manual)
    // ------------------------------------------------------------------
    const sqlRecent = `
      SELECT CONCAT('PO-', id) as id, po_number as ref_number, 'Expense' as type, 'จัดซื้อสินค้า' as category, total_amount as amount, CONCAT('สั่งซื้อจาก ', (SELECT name FROM suppliers WHERE id = purchase_orders.supplier_id)) as description, order_date as date FROM purchase_orders WHERE status != 'Cancelled'
      UNION ALL
      SELECT CONCAT('TX-', id) as id, '-' as ref_number, type, category, amount, description, transaction_date as date FROM transactions
      UNION ALL
      SELECT CONCAT('ORD-', id) as id, CAST(id AS CHAR) as ref_number, 'Income' as type, 'ยอดขายสินค้า' as category, total_amount as amount, CONCAT('Order ขายสินค้าให้ ', customer_name) as description, sale_date as date FROM orders
      ORDER BY date DESC LIMIT 100
    `;

    let recentTransactions = [];
    try {
        const [result] = await pool.query(sqlRecent);
        recentTransactions = result;
    } catch (e) {
        console.log("⚠️ Query รวมมีปัญหา -> ใช้โหมดสำรอง");
        const sqlBackup = `
            SELECT CONCAT('PO-', id) as id, po_number as ref_number, 'Expense' as type, 'จัดซื้อสินค้า' as category, total_amount as amount, CONCAT('สั่งซื้อจาก Supplier ID:', supplier_id) as description, order_date as date FROM purchase_orders WHERE status != 'Cancelled'
            UNION ALL
            SELECT CONCAT('TX-', id) as id, '-' as ref_number, type, category, amount, description, transaction_date as date FROM transactions
            ORDER BY date DESC LIMIT 100
        `;
        const [resultBackup] = await pool.query(sqlBackup);
        recentTransactions = resultBackup;
    }

    // ------------------------------------------------------------------
    // ✨ 5. [เพิ่มใหม่] นำรายการ ใบเสร็จ & ใบแจ้งหนี้ มาผสมกับประวัติเดิม
    // ------------------------------------------------------------------
    let newTransactions = [];
    try {
        // ดึงประวัติใบเสร็จ (รายรับ)
        const [receiptRows] = await pool.query(`
            SELECT r.id, r.doc_number as ref_number, 'Income' as type, 'รับชำระจากใบแจ้งหนี้' as category, r.net_amount as amount, CONCAT('รับชำระจาก: ', COALESCE(i.customer_name, 'ลูกค้า')) as description, COALESCE(r.doc_date, r.created_at) as date 
            FROM receipts r LEFT JOIN invoices i ON r.invoice_id = i.id
        `);
        newTransactions.push(...receiptRows.map(r => ({ ...r, id: `RC-${r.id}` })));

        // ดึงประวัติใบแจ้งหนี้ที่รอชำระ (Pending)
        const [invoiceRows] = await pool.query(`
            SELECT id, doc_number as ref_number, 'Pending' as type, 'ลูกหนี้รอเรียกเก็บ' as category, grand_total as amount, CONCAT('รอชำระจาก: ', customer_name) as description, COALESCE(doc_date, created_at) as date 
            FROM invoices WHERE status IN ('sent', 'pending')
        `);
        newTransactions.push(...invoiceRows.map(inv => ({ ...inv, id: `INV-${inv.id}` })));

    } catch (e) {
        console.log("⚠️ ไม่สามารถดึงประวัติ Invoices/Receipts ได้");
    }

    // นำ Array เดิม มาต่อกับ Array ใหม่ แล้วเรียงวันที่ใหม่ทั้งหมด
    let combinedTransactions = [...recentTransactions, ...newTransactions];
    combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    combinedTransactions = combinedTransactions.slice(0, 100); // ตัดเอาแค่ 100 รายการล่าสุด เพื่อไม่ให้เว็บค้าง

    // ------------------------------------------------------------------
    // 6. ส่งข้อมูลกลับไปให้หน้า Frontend
    // ------------------------------------------------------------------
    return NextResponse.json({
      summary: {
        income: totalIncome,
        expenses: totalExpenses,
        profit: netProfit,
        pendingIncome: totalPendingIncome // ✅ แนบยอดรอเก็บเงินส่งไปด้วย
      },
      transactions: combinedTransactions // ✅ ใช้ชื่อ transactions เหมือนเดิม หน้าบ้านจะได้ไม่ต้องแก้เยอะ
    });

  } catch (error) {
    console.error("Accounting API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: บันทึกรายรับ/รายจ่าย เพิ่มเติม (Manual Entry) (คงเดิม 100%) ---
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, category, amount, description } = body;

    if (!amount || !category) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลหมวดหมู่และจำนวนเงิน' }, { status: 400 });
    }

    const sql = `INSERT INTO transactions (type, category, amount, description, transaction_date) VALUES (?, ?, ?, ?, NOW())`;
    await pool.query(sql, [type, category, amount, description]);

    return NextResponse.json({ success: true, message: 'บันทึกรายการสำเร็จ' });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}