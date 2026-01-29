import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '../../lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ user: null, error: 'No token found' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); 
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;

    // ✅ SQL ที่จูนตรงกับรูปตาราง Employees ของคุณเป๊ะๆ
    const sql = `
      SELECT 
        u.id, 
        u.username,
        u.email,
        u.role,        
        u.role_id,     
        u.department_id,
        u.employee_id, -- รหัสพนักงานใน users (เช่น 681101002)
        
        d.name AS department_name,
        
        -- ดึงจากตาราง employees (ตามชื่อคอลัมน์ในรูป)
        e.first_name,
        e.last_name,
        e.phone,
        e.address,
        e.position,
        e.created_at, -- ใช้อันนี้แทน start_date
        e.emp_code    -- รหัสพนักงานใน employees
        
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      -- 🔥 เชื่อมด้วย employee_id (users) = emp_code (employees)
      LEFT JOIN employees e ON u.employee_id = e.emp_code 
      WHERE u.id = ?
    `;

    const [rows] = await pool.query(sql, [userId]);

    if (rows.length === 0) {
       return NextResponse.json({ user: null, error: 'User not found' }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json({ 
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || 'employee',
            role_id: user.role_id,
            department: user.department_name,
            
            // ส่งข้อมูลกลับไปให้หน้าเว็บ (Mapping ค่าให้ตรง)
            emp_code: user.emp_code || user.employee_id, // ใช้ค่าที่มี
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || '-',
            address: user.address || '-',
            position: user.position || 'ไม่ระบุ',
            start_date: user.created_at || null // ส่งค่า created_at ไปเป็น start_date
        }
    });

  } catch (error) {
    console.error("API/me Error:", error.message);
    return NextResponse.json({ user: null, error: 'Invalid token' }, { status: 401 });
  }
}