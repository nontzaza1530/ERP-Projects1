import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 
import bcrypt from 'bcryptjs'; // ✅ อย่าลืม import bcrypt

// --- GET (เหมือนเดิม) ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('user_role');
    const userId = searchParams.get('user_id');

    // Default Query
    let sql = `SELECT * FROM employees`;
    const params = [];

    // ถ้าเป็น Employee ให้เห็นแค่ของตัวเอง (Optional: กรองตาม Role)
    if (userRole === 'employee' && userId) {
        // ค้นหาจาก emp_code หรือ id (แล้วแต่ว่า userId ส่งอะไรมา)
        sql += ` WHERE emp_code = ? OR email = (SELECT email FROM users WHERE id = ?)`;
        params.push(userId, userId);
    } else {
        sql += ` ORDER BY emp_code DESC`;
    }

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST (สร้างพนักงาน + สร้าง User) ---
export async function POST(request) {
  try {
    const body = await request.json();
    
    const { 
      emp_code, first_name, last_name, 
      email, position, 
      phone, birth_date, address, // ✅ 1. รับค่าใหม่เข้ามา
      role_id, role_name, 
      departments_id, departments_name, 
      salary,
      username, 
      password 
    } = body;

    // 2. Validation (เช็คค่าหลักๆ ที่ห้ามว่าง)
    if (!emp_code || !first_name || !email || !username || !password) {
      return NextResponse.json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน (รหัส, ชื่อ, อีเมล, User, Pass)' }, { status: 400 });
    }

    // 3. เช็คข้อมูลซ้ำใน Users (กันเหนียว)
    const [existingUser] = await pool.query("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
    if (existingUser.length > 0) {
        return NextResponse.json({ error: 'Username หรือ Email นี้มีผู้ใช้งานแล้ว' }, { status: 409 });
    }

    // 4. เริ่มบันทึก: Insert Employee (เพิ่ม phone, birth_date, address)
    const sqlEmployee = `
      INSERT INTO employees 
      (emp_code, first_name, last_name, email, phone, birth_date, address, position, role_id, role_name, departments_id, departments_name, salary) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // ✅ ส่งค่าเรียงตามลำดับ VALUES
    await pool.query(sqlEmployee, [
      emp_code, 
      first_name, 
      last_name, 
      email, 
      phone || null,       // ถ้าไม่มีส่ง null
      birth_date || null,  // ถ้าไม่มีส่ง null
      address || null,     // ถ้าไม่มีส่ง null
      position, 
      role_id, 
      role_name, 
      departments_id, 
      departments_name, 
      salary || 0
    ]);

    // 5. สร้าง User ใหม่ให้ทันที
    const hashedPassword = await bcrypt.hash(password, 10); 

    const sqlUser = `
        INSERT INTO users 
        (username, email, password, role, role_id, department_id, employee_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // แปลง Role Name ให้เป็น format มาตรฐาน (เช่น Super Admin -> super_admin)
    const roleString = role_name ? role_name.toLowerCase().replace(/\s+/g, '_') : 'employee'; 

    await pool.query(sqlUser, [
        username,
        email,
        hashedPassword,
        roleString,       
        role_id,          
        departments_id,   
        emp_code // ✅ เชื่อมด้วย emp_code ตามโครงสร้าง DB ของคุณ
    ]);
    
    return NextResponse.json({ 
        message: 'เพิ่มพนักงานและสร้างบัญชีผู้ใช้เรียบร้อยแล้ว!', 
        emp_code 
    }, { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    // ดัก Error ข้อมูลซ้ำ (Duplicate Entry)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: `ข้อมูลซ้ำ (รหัสพนักงาน หรือ อีเมล อาจมีอยู่ในระบบแล้ว)` }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}