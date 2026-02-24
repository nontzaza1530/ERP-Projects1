// src/app/api/inventory/products/route.js
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    // ✅ แก้ SQL: เปลี่ยนจาก stock เป็น quantity ให้ตรงกับตาราง products ของคุณ
    const [rows] = await pool.query('SELECT id, product_code, name, quantity, price, category FROM products');
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}