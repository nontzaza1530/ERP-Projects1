import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    
    // ✅ 1. เพิ่มตัวแปร ref_pr_id มารับค่าไอดีของใบขอซื้อ
    const { supplier_id, order_date, expected_date, items, total_amount, user_id, remarks, shipping_address, ref_pr_id } = body;

    const datePart = new Date(order_date || Date.now()).toISOString().slice(0, 7).replace('-', ''); 
    const [lastPo] = await pool.query(`SELECT po_number FROM purchase_orders WHERE po_number LIKE 'PO-${datePart}-%' ORDER BY id DESC LIMIT 1`);
    
    let runNumber = 1;
    if (lastPo.length > 0) {
        const lastRun = parseInt(lastPo[0].po_number.split('-')[2]);
        runNumber = lastRun + 1;
    }
    const poNumber = `PO-${datePart}-${String(runNumber).padStart(4, '0')}`;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // ✅ 2. บันทึกหัวบิล PO
    const [resHeader] = await connection.query(
        `INSERT INTO purchase_orders (po_number, supplier_id, order_date, expected_date, total_amount, created_by, status, remarks, shipping_address) 
         VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
        [poNumber, supplier_id, order_date, expected_date, total_amount, user_id, remarks || null, shipping_address || 'สำนักงานใหญ่ (HQ)']
    );
    const poId = resHeader.insertId; 

    // ✅ 3. บันทึกรายการสินค้า (รองรับ custom_item_name ที่ส่งมาจากหน้าเว็บ)
    for (const item of items) {
        await connection.query(
            `INSERT INTO purchase_order_items (po_id, product_id, custom_item_name, quantity, unit_price, total_price) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [poId, item.product_id, item.custom_item_name, item.quantity, item.unit_price, (item.quantity * item.unit_price)]
        );
    }

    // ✅ 4. เวทมนตร์: ถ้ามีการส่ง ref_pr_id มาด้วย ให้ไปเปลี่ยนสถานะใบ PR นั้นเป็น "ออก PO แล้ว"
    if (ref_pr_id) {
        await connection.query(
            `UPDATE purchase_requests SET status = 'PO_Created' WHERE id = ?`,
            [ref_pr_id]
        );
    }

    await connection.commit();
    return NextResponse.json({ success: true, poNumber, message: 'บันทึกสำเร็จ' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Create PO Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}