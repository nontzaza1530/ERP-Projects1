import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // เช็ค path ให้ถูกนะครับ

export async function GET() {
  try {
    // ดึงข้อมูลใบเสนอราคาล่าสุดขึ้นก่อน
    const sql = `
      SELECT * FROM quotations 
      ORDER BY created_at DESC
    `;
    const [rows] = await pool.query(sql);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch Quotations Error:", error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}