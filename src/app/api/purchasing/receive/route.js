import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// --- POST: รับสินค้าเข้าคลัง (GRN) ---
export async function POST(request) {
  let connection;
  try {
    const { po_id } = await request.json();

    if (!po_id) return NextResponse.json({ error: 'ไม่พบเลขที่เอกสาร PO' }, { status: 400 });

    // 1. เชื่อมต่อฐานข้อมูลแบบ Transaction (มัดรวมการทำงาน)
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 2. ดึงรายการสินค้าทั้งหมดในบิลนี้ออกมา
    const [items] = await connection.query(
        `SELECT product_id, quantity FROM purchase_order_items WHERE po_id = ?`, 
        [po_id]
    );

    if (items.length === 0) {
        throw new Error("ไม่พบรายการสินค้าในใบสั่งซื้อนี้");
    }

    // 3. วนลูปเอาสินค้าเข้าคลังทีละตัว (Update Stock)
    for (const item of items) {
        // บวกสต็อกเพิ่มเข้าไป (quantity = quantity + ของใหม่)
        await connection.query(
            `UPDATE products SET quantity = quantity + ? WHERE id = ?`,
            [item.quantity, item.product_id]
        );
    }

    // 4. เปลี่ยนสถานะใบสั่งซื้อเป็น "Received" (รับของแล้ว)
    await connection.query(
        `UPDATE purchase_orders SET status = 'Received' WHERE id = ?`,
        [po_id]
    );

    // 5. ยืนยันข้อมูลทั้งหมดลง Database (Commit)
    await connection.commit();

    return NextResponse.json({ success: true, message: `รับสินค้าเข้าคลังเรียบร้อย! (เพิ่มสต็อก ${items.length} รายการ)` });

  } catch (error) {
    // 💥 ถ้ามีอะไรพัง ให้ยกเลิกทั้งหมด! (Rollback) ข้อมูลจะไม่มั่ว
    if (connection) await connection.rollback();
    console.error("GRN Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}