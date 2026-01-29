import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // อ้างอิง Path เดียวกับไฟล์ employees

export async function GET() {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง roles เรียงตาม ID
    const [rows] = await pool.query('SELECT * FROM roles ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}