import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function POST(request) {
  try {
    const { id } = await request.json(); // รับ ID ที่จะยกเลิก

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // 1. เช็คก่อนว่าสถานะปัจจุบันคืออะไร (ถ้าได้รับของแล้ว ห้ามยกเลิก!)
    const [check] = await pool.query("SELECT status FROM purchase_orders WHERE id = ?", [id]);
    
    if (check.length === 0) return NextResponse.json({ error: 'ไม่พบ PO' }, { status: 404 });
    
    const status = check[0].status.toLowerCase();
    if (status === 'received' || status === 'partially received') {
        return NextResponse.json({ error: 'ไม่สามารถยกเลิกได้ เนื่องจากมีการรับสินค้าแล้ว' }, { status: 400 });
    }

    // 2. อัปเดตสถานะเป็น Cancelled
    await pool.query("UPDATE purchase_orders SET status = 'Cancelled' WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: 'ยกเลิกใบสั่งซื้อเรียบร้อยแล้ว' });

  } catch (error) {
    console.error("Cancel Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}