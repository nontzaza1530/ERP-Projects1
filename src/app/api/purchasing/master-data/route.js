import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // ใช้ Path เดิมที่คุณบอกว่ารันผ่าน

export async function GET(request) {
  try {
    // 1. ดึงรายชื่อคู่ค้า (✅ เพิ่ม phone เข้ามาใน SELECT แล้ว)
    const [suppliers] = await pool.query(`
      SELECT id, code, name, credit_term, contact_name, address, phone 
      FROM suppliers 
      ORDER BY id DESC
    `);

    // 2. ดึงรายชื่อสินค้า
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
    console.error("API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}