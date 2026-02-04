import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '../../../lib/db'; // ⚠️ ตรวจสอบว่า path นี้ถูกต้องตามโครงสร้างโปรเจกต์ของคุณ

export async function GET(request) {
  try {
    // 1. รับ Token จาก Cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // 2. ✅ แก้ไขจุดที่ผิด: ดึงค่าจาก Environment Variable โดยตรง (เอาเครื่องหมายคำพูดออก)
    // และใส่ Fallback Key ไว้กันพลาด (ต้องตรงกับหน้า Login นะครับ)
    const secretKey = process.env.JWT_SECRET || 'MY_SECRET_KEY_1234'; 
    const secret = new TextEncoder().encode(secretKey);

    // 3. ตรวจสอบ Token
    const { payload } = await jwtVerify(token, secret);
    
    // Debug: ดูว่า User คือใคร (ลบออกได้ตอนใช้งานจริง)
    console.log("✅ Token Verified for User:", payload.email);

    // 4. ค้นหา emp_code จากตาราง employees
    const [empRows] = await pool.query(
        `SELECT emp_code FROM employees WHERE email = ?`,
        [payload.email]
    );

    if (empRows.length === 0) {
        return NextResponse.json({ error: 'Employee not found', requests: [] }, { status: 404 });
    }

    const currentEmpCode = empRows[0].emp_code;
    console.log("🔍 Fetching leave history for Emp Code:", currentEmpCode);

    // 5. ดึงประวัติการลา (ใช้ currentEmpCode ที่หามาได้)
    const [rows] = await pool.query(
      `SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC`,
      [currentEmpCode] 
    );

    // ส่งข้อมูลกลับไปหน้าบ้าน
    return NextResponse.json({ requests: rows });

  } catch (error) {
    // 🛑 แสดง Error ที่แท้จริงใน Terminal ฝั่ง Server
    console.error("❌ History API Error Detailed:", error);
    
    return NextResponse.json({ 
        error: 'Internal Server Error', 
        message: error.message 
    }, { status: 500 });
  }
}