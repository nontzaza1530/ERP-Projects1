import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // 👈 เช็ค path ../ ให้ตรงกับตำแหน่งไฟล์ db.js ของคุณ

export async function GET(request, { params }) {
  const { id } = await params; // รับ Order ID

  try {
    // 1. ดึงหัวบิล (Orders)
    const [orders] = await pool.query(
      `SELECT * FROM orders WHERE id = ?`, 
      [id]
    );
    
    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. ดึงรายการสินค้า (Order Items)
    const [items] = await pool.query(
      `SELECT * FROM order_items WHERE order_id = ?`, 
      [id]
    );

    return NextResponse.json({ 
      order: orders[0], 
      items: items 
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}