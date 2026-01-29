import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // ใช้ Path เดิมที่คุณบอกว่ารันผ่าน

export async function GET(request) {
  try {
    // 1. ดึงรายชื่อคู่ค้า
    const [suppliers] = await pool.query(`
      SELECT id, code, name, credit_term, contact_name, address 
      FROM suppliers 
      ORDER BY id DESC
    `);

    // 2. ดึงรายชื่อสินค้า (แก้ไขใหม่ให้ตรงกับ Database จริงของคุณ)
    // - เปลี่ยน product_code AS code (เพื่อให้หน้าบ้านใช้ .code ได้เหมือนเดิม)
    // - เปลี่ยน price AS cost_price (เพื่อให้หน้าบ้านใช้ .cost_price ได้เหมือนเดิม)
    const [products] = await pool.query(`
        SELECT 
            id, 
            product_code AS code, 
            name, 
            unit, 
            price AS cost_price 
        FROM products 
        ORDER BY name ASC
    `);

    // ส่งข้อมูลกลับไปให้หน้าบ้าน
    return NextResponse.json({
      suppliers,
      products
    });

  } catch (error) {
    console.error("API Error:", error.message); // ดู Error ได้ที่ Terminal
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}