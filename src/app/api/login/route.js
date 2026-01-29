import pool from '../../lib/db'; 
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; 
import { cookies } from 'next/headers'; 

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 1. ตัดช่องว่างหัวท้ายกันพลาด (เช่น " test@gmail.com ")
    const email = body.email?.trim(); 
    const password = body.password;

    console.log("🔐 Login Request for:", email);

    // 2. Query ข้อมูล (เน้นความชัวร์ ไม่ต้อง Join เยอะ)
    // เราดึง role และ role_id มาจากตาราง users ตรงๆ เลย เพราะในรูปคุณมีครบแล้ว
    const sql = `
      SELECT u.*, d.name AS department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.email = ? 
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [email]);
    
    // ถ้าไม่เจออีเมลนี้ในระบบ
    if (rows.length === 0) {
      console.log("❌ Email not found");
      return NextResponse.json({ success: false, message: "ไม่พบอีเมลนี้ในระบบ" }, { status: 401 });
    }

    const user = rows[0]; 

    // 🔍 DEBUG: ปริ้นท์ออกมาดูเลยว่า Database ไปหยิบใครมา? (ดูใน Terminal)
    console.log(`🔎 DB Found: ID=${user.id} | Name=${user.username} | Role=${user.role}`);

    // 3. ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Password incorrect");
      return NextResponse.json({ success: false, message: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 4. สร้าง Token
    // ใช้ค่าจาก DB ตรงๆ ไม่ต้องแปลง (เพราะใน DB เก็บ 'super_admin', 'employee' ถูกต้องแล้ว)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET); 
    
    const token = await new SignJWT({ 
        id: user.id, 
        username: user.username,
        email: user.email,
        role: user.role,       // ส่ง string: 'employee'
        role_id: user.role_id, // ส่ง int: 3
        department: user.department_name
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret);

    // 5. จัดการ Cookie (สำคัญมาก! ต้องลบของเก่าก่อน)
    const cookieStore = await cookies(); 
    
    // 🧹 ลบ Cookie ผีที่อาจจะค้างอยู่
    cookieStore.delete('token'); 
    
    cookieStore.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 86400, // 1 วัน
      path: '/',
    });

    console.log(`✅ Login Success! Token created for: ${user.username}`);
    
    return NextResponse.json({ 
        success: true, 
        message: "เข้าสู่ระบบสำเร็จ", 
        user: {
            username: user.username,
            role: user.role,
            department: user.department_name
        }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}