import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

export async function GET() {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง departments
    const [rows] = await pool.query('SELECT * FROM departments ORDER BY id ASC');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}