import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// --- GET: ค้นหา PO เพื่อเตรียมรับของ ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const po_number = searchParams.get('po_number'); // รับเลข PO เช่น PO-202601-0001

    if (!po_number) return NextResponse.json({ error: 'กรุณาระบุเลขที่ PO' }, { status: 400 });

    // 1. หาข้อมูลหัวบิล
    const [po] = await pool.query(`SELECT * FROM purchase_orders WHERE po_number = ?`, [po_number]);
    if (po.length === 0) return NextResponse.json({ error: 'ไม่พบใบสั่งซื้อนี้' }, { status: 404 });

    // 2. ดึงรายการสินค้า + คำนวณยอดค้างรับ (สั่ง - รับไปแล้ว = เหลือ)
    const sql = `
        SELECT 
            poi.id, poi.product_id, poi.quantity as order_qty, poi.received_qty,
            (poi.quantity - poi.received_qty) as remaining_qty,
            p.name as product_name, p.product_code, p.unit
        FROM purchase_order_items poi
        JOIN products p ON poi.product_id = p.id
        WHERE poi.po_id = ?
    `;
    const [items] = await pool.query(sql, [po[0].id]);

    return NextResponse.json({ po: po[0], items });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: บันทึกรับของ (ตัดสต็อก + อัปเดตสถานะ) ---
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { po_id, items } = body; 

    connection = await pool.getConnection();
    await connection.beginTransaction();

    let allCompleted = true; // ตัวแปรเช็คว่าจบงานไหม

    for (const item of items) {
        const qty = parseInt(item.receive_now_qty);
        if (qty > 0) {
            // 1. เพิ่มสต็อกสินค้าจริง
            await connection.query(`UPDATE products SET quantity = quantity + ? WHERE id = ?`, [qty, item.product_id]);
            // 2. บันทึกว่ารับแล้วใน PO Item
            await connection.query(`UPDATE purchase_order_items SET received_qty = received_qty + ? WHERE id = ?`, [qty, item.item_id]);
        }
        
        // เช็คว่ารายการนี้ครบยัง?
        const [check] = await connection.query(`SELECT quantity, received_qty FROM purchase_order_items WHERE id = ?`, [item.item_id]);
        if (check[0].received_qty < check[0].quantity) allCompleted = false;
    }

    // 3. เปลี่ยนสถานะหัวบิล
    const newStatus = allCompleted ? 'Received' : 'Partially Received';
    await connection.query(`UPDATE purchase_orders SET status = ? WHERE id = ?`, [newStatus, po_id]);

    await connection.commit();
    return NextResponse.json({ success: true, message: `รับสินค้าเรียบร้อย! (สถานะ: ${newStatus})` });

  } catch (error) {
    if (connection) await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}