import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db'; // ⚠️ เช็คจำนวน ../ ให้ถอยกลับไปถึงโฟลเดอร์ src/lib/db นะครับ (ประมาณ 6-7 ชั้น)

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params; // รับรหัสพนักงาน

    // คำนวณผลรวมจำนวนวันลา (เฉพาะที่อนุมัติแล้ว)
    // DATEDIFF(end, start) + 1 คือสูตรหาวันรวม (เช่น ลา 21-21 คือ 1 วัน)
    const sql = `
      SELECT SUM(DATEDIFF(end_date, start_date) + 1) as total_days
      FROM leave_requests
      WHERE employee_id = ? AND status = 'approved'
    `;

    const [rows] = await pool.query(sql, [id]);
    const totalLeave = rows[0].total_days || 0;

    return NextResponse.json({ totalLeave: Number(totalLeave) });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}