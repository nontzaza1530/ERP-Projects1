import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

export async function GET() {
  try {
    // 1. ดึงข้อมูลรายจ่ายจาก "ระบบจัดซื้อ" (Purchase Orders)
    // เงื่อนไข: เอาทุกใบ ยกเว้นใบที่ 'Cancelled'
    const sqlExpenses = `
      SELECT 
        id, 
        po_number, 
        order_date, 
        total_amount, 
        supplier_id,
        'Expense' as type, -- ระบุว่าเป็นรายจ่าย
        'Purchasing' as category -- หมวดหมู่จัดซื้อ
      FROM purchase_orders 
      WHERE status != 'Cancelled'
      ORDER BY order_date DESC
    `;
    const [poExpenses] = await pool.query(sqlExpenses);

    // 2. คำนวณยอดรวมรายจ่าย (Total Expenses)
    const totalExpenses = poExpenses.reduce((sum, item) => sum + Number(item.total_amount), 0);

    // 3. จำลองรายรับ (Income) - (ในอนาคตคุณอาจจะมีตาราง 'invoices' หรือ 'sales')
    // ตอนนี้สมมติเลขขึ้นมาก่อนเพื่อให้เห็นภาพ Cash Flow
    const totalIncome = 5000000; // สมมติมีรายรับ 5 ล้าน

    // 4. คำนวณกำไรสุทธิ (Net Profit)
    const netProfit = totalIncome - totalExpenses;

    // 5. เตรียมข้อมูลรายการเคลื่อนไหวล่าสุด (Transaction List)
    // เอา PO มาแปลงร่างเป็นรูปแบบรายการบัญชี
    const transactions = poExpenses.map(po => ({
        id: `PO-${po.id}`,
        date: po.order_date,
        description: `ชำระค่าสินค้าตามใบสั่งซื้อ ${po.po_number}`,
        category: 'ต้นทุนสินค้า (Cost of Goods)',
        type: 'Expense',
        amount: Number(po.total_amount)
    }));

    return NextResponse.json({
        summary: {
            totalIncome,
            totalExpenses,
            netProfit
        },
        transactions // ส่งรายการไปโชว์ในตาราง
    });

  } catch (error) {
    console.error("Accounting Dashboard Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}