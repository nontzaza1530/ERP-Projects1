import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // ปรับ path ตามจริง

export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    // ✅ เพิ่ม remarks มารับค่าจากหน้าบ้าน
    const { supplier_id, order_date, expected_date, items, total_amount, user_id, remarks } = body;

    // 1. สร้างเลขที่ PO (รันนัมเบอร์)
    const datePart = new Date().toISOString().slice(0, 7).replace('-', ''); 
    const [lastPo] = await pool.query(`SELECT po_number FROM purchase_orders WHERE po_number LIKE 'PO-${datePart}-%' ORDER BY id DESC LIMIT 1`);
    
    let runNumber = 1;
    if (lastPo.length > 0) {
        const lastRun = parseInt(lastPo[0].po_number.split('-')[2]);
        runNumber = lastRun + 1;
    }
    const poNumber = `PO-${datePart}-${String(runNumber).padStart(4, '0')}`;

    // 2. เริ่ม Transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 3. บันทึกหัวบิล 
    // ✅ แก้ไขตรงนี้: เพิ่มคอลัมน์ remarks และส่งค่า remarks เข้าไปใน Database
    const [resHeader] = await connection.query(
        `INSERT INTO purchase_orders (po_number, supplier_id, order_date, expected_date, total_amount, created_by, status, remarks) 
         VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)`,
        [poNumber, supplier_id, order_date, expected_date, total_amount, user_id, remarks || null]
    );
    const poId = resHeader.insertId; 

    // 4. บันทึกรายการสินค้า
    for (const item of items) {
        await connection.query(
            `INSERT INTO purchase_order_items (po_id, product_id, quantity, unit_price, total_price) 
             VALUES (?, ?, ?, ?, ?)`,
            [poId, item.product_id, item.qty, item.price, (item.qty * item.price)]
        );
    }

    // 5. Commit
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