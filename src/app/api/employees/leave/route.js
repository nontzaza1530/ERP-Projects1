import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // ⚠️ ตรวจสอบ path ให้ถอยกลับไปเจอ lib/db นะครับ

// ✅ บรรทัดนี้สำคัญมาก! ช่วยป้องกันไม่ให้ Browser จำค่าเก่า (Cache)
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { employee_id, leave_type, start_date, end_date, reason } = body;

    if (!employee_id || !leave_type || !start_date || !end_date) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }, { status: 400 });
    }

    const sql = `
      INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    await pool.query(sql, [employee_id, leave_type, start_date, end_date, reason]);

    return NextResponse.json({ message: 'ส่งคำขอลาเรียบร้อยแล้ว' }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.message.includes('foreign key constraint')) {
        return NextResponse.json({ error: 'ไม่พบรหัสพนักงานนี้ในระบบ' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ แก้ไข Function GET ให้ฉลาดขึ้น
export async function GET(request) {
  try {
    // รับค่าจากหน้าบ้านว่าต้องการดู "ทั้งหมด" หรือไม่?
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all');

    let sql = `
      SELECT l.*, e.first_name, e.last_name, e.departments_name, e.position
      FROM leave_requests l
      JOIN employees e ON l.employee_id = e.emp_code
    `;

    // ถ้าหน้าบ้านไม่ได้ส่ง ?all=true มา ให้ดึงแค่ pending (เหมือนเดิม)
    // แต่ถ้าส่งมา (เช่นหน้า Approve) ก็จะดึงทั้งหมด รวมถึง approved/rejected ด้วย
    if (!showAll) {
        sql += " WHERE l.status = 'pending'";
    }

    sql += " ORDER BY l.created_at DESC"; 

    const [rows] = await pool.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}