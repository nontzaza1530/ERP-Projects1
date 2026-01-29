import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

export async function GET(request, { params }) {
  try {
    const { id } = await params; // id ในที่นี้คือ emp_code (เช่น '106')

    // ✅ แก้ไข: ดึงข้อมูลจากตาราง attendance โดยใช้ emp_code โดยตรง
    // (ให้ตรงกับตารางใน Database ปัจจุบันของคุณ)
    const sql = `
        SELECT * FROM attendance 
        WHERE emp_code = ? 
        ORDER BY work_date DESC 
        LIMIT 60
    `;
    const [rows] = await pool.query(sql, [id]);

    // คำนวณสถิติ
    const stats = {
        present: rows.filter(r => r.status === 'Present').length,
        late: rows.filter(r => r.status === 'Late').length,
        absent: rows.filter(r => r.status === 'Absent').length,
        leave: rows.filter(r => r.status === 'Leave').length
    };

    return NextResponse.json({ history: rows, stats });

  } catch (error) {
    console.error("Fetch History Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}