import pool from '../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


export async function POST(request) {
  try {
    // 1. ✅ ดึงค่าทั้งหมดมาจาก JSON (รวมถึงค่าที่คุณอยากกำหนดอิสระ)
    const { 
      username, 
      email, 
      password, 
      role,           // รับค่า role
      role_id,        // รับค่า role_id
      department_id,  // รับค่า department_id
      employee_id     // รับค่า employee_id
    } = await request.json();

    // 2. Validation: เช็คเฉพาะข้อมูลสำคัญ
    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: "กรุณากรอก Username, Email และ Password" }, { status: 400 });
    }

    // 3. เช็ค Duplicate
    const [existing] = await pool.query(
        "SELECT id FROM users WHERE username = ? OR email = ?", 
        [username, email]
    );
    
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Username หรือ Email นี้มีผู้ใช้งานแล้ว" }, { status: 409 }); 
    }

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. บันทึกข้อมูล
    const sql = `
      INSERT INTO users (username, email, password, role, role_id, department_id, employee_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    // ✅ ใส่ Logic การเลือกค่า (ถ้าส่งมาให้ใช้ค่าที่ส่ง ถ้าไม่ส่งให้ใช้ Default)
    await pool.query(sql, [
        username, 
        email, 
        hashedPassword, 
        role || 'employee',       // ถ้าไม่ส่ง role มา จะให้เป็น 'employee'
        role_id || 3,             // ถ้าไม่ส่ง role_id มา จะให้เป็น 3
        department_id || null,    // ถ้าไม่ส่ง dept_id มา จะให้เป็น null (หรือใส่เลข Default เช่น 3)
        employee_id || null       // ถ้าไม่ส่ง emp_id มา จะให้เป็น null
    ]);

    return NextResponse.json({ success: true, message: "ลงทะเบียนสำเร็จ" }, { status: 201 });

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ success: false, message: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}