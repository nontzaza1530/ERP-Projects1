import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '../../../lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode('MY_SECRET_KEY_1234');
    const { payload } = await jwtVerify(token, secret);

    // 🔍 Step 1: ค้นหา emp_code จากตาราง employees โดยใช้อีเมล (เพื่อความชัวร์ 100%)
    const [empRows] = await pool.query(
        `SELECT emp_code FROM employees WHERE email = ?`,
        [payload.email]
    );

    if (empRows.length === 0) {
        return NextResponse.json({ error: 'Employee not found', requests: [] });
    }

    const currentEmpCode = empRows[0].emp_code;
    console.log("Fetching history for Emp Code:", currentEmpCode); // ดู Log ได้ว่าหาถูกคนไหม

    // 🔍 Step 2: เอา emp_code ที่ได้ ไปดึงประวัติการลา
    const [rows] = await pool.query(
      `SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC`,
      [currentEmpCode] 
    );

    return NextResponse.json({ requests: rows });

  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json({ error: error.message, requests: [] }, { status: 500 });
  }
}