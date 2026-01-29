import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // ⚠️ เช็ค Path ให้ตรงกับโปรเจกต์คุณ

export async function GET() {
  try {
    // 1. นับจำนวนใบลาที่สถานะเป็น 'pending' (รออนุมัติ)
    const [pendingRows] = await pool.query(
      "SELECT COUNT(*) as count FROM leave_requests WHERE status = 'pending'"
    );
    const pendingCount = pendingRows[0].count;

    // 2. หาว่า "วันนี้" มีใครลาบ้าง (Status = approved และ วันที่ครอบคลุมวันนี้)
    // ใช้ CURDATE() ของ MySQL เพื่อเทียบกับเวลาปัจจุบันของ Server
    const [whoIsAway] = await pool.query(`
      SELECT l.*, e.first_name, e.last_name 
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.emp_code
      WHERE l.status = 'approved' 
      AND CURDATE() BETWEEN l.start_date AND l.end_date
    `);

    return NextResponse.json({
      pendingLeaves: pendingCount,
      whoIsAway: whoIsAway
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}