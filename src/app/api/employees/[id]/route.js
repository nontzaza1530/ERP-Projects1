import { NextResponse } from 'next/server';
// ตรวจสอบ path ให้ถูกต้อง (ถอยหลัง 4 ขั้น: api -> employees -> [id] -> app -> src -> lib)
import pool from '../../../lib/db'; 

// --- 1. ดึงข้อมูลพนักงานรายคน (GET) ---
export async function GET(request, { params }) {
  try {
    const { id } = await params; 

    if (!id) return NextResponse.json({ error: 'ไม่พบ ID' }, { status: 400 });

    const sql = 'SELECT * FROM employees WHERE emp_code = ?';
    const [rows] = await pool.query(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลพนักงาน' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- 2. แก้ไขข้อมูลพนักงาน (PUT) ---
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // id = emp_code (PK เดิม)
    const body = await request.json();

    const { 
      emp_code, 
      first_name, 
      last_name, 
      email, 
      phone, birth_date, address, // ✅ รับค่าใหม่เข้ามา
      position,
      role_id, 
      role_name, 
      departments_id, 
      departments_name, 
      salary,
      status 
    } = body;

    // 1. อัปเดตข้อมูลลงตาราง employees (เพิ่ม phone, birth_date, address)
    const sqlUpdateEmp = `
      UPDATE employees 
      SET 
        emp_code = ?, 
        first_name = ?, last_name = ?, email = ?, 
        phone = ?, birth_date = ?, address = ?, 
        position = ?, role_id = ?, role_name = ?, 
        departments_id = ?, departments_name = ?, 
        salary = ?, status = ?
      WHERE emp_code = ?
    `;

    // เรียงตัวแปรให้ตรงกับ ?
    const values = [
      emp_code || id, 
      first_name, last_name, email, 
      phone || null,       // ถ้าไม่มีค่าให้ส่ง null
      birth_date || null,  // ถ้าไม่มีค่าให้ส่ง null
      address || null,     // ถ้าไม่มีค่าให้ส่ง null
      position, role_id, role_name, 
      departments_id, departments_name, 
      salary || 0, status,
      id // WHERE emp_code = id (ตัวเก่า)
    ];

    await pool.query(sqlUpdateEmp, values);

    // 2. Logic จัดการสถานะ User (Active/Resigned) เหมือนเดิม
    if (email) {
        if (status === 'resigned') {
            await pool.query("UPDATE users SET role = 'resigned' WHERE email = ?", [email]);
        } 
        else if (status === 'active') {
            const userRole = role_name ? role_name.toLowerCase().replace(/ /g, '_') : 'employee';
            await pool.query(
                "UPDATE users SET role = ?, role_id = ?, department_id = ?, employee_id = ? WHERE email = ?", 
                [userRole, role_id, departments_id, emp_code || id, email]
            );
        }
        else {
             const userRole = role_name ? role_name.toLowerCase().replace(/ /g, '_') : 'employee';
             await pool.query(
                "UPDATE users SET role = ?, role_id = ?, department_id = ?, employee_id = ? WHERE email = ?", 
                [userRole, role_id, departments_id, emp_code || id, email]
            );
        }
    }

    return NextResponse.json({ message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- 3. ลบข้อมูลพนักงาน (DELETE) ---
// (โค้ดส่วนนี้เหมือนเดิม)
export async function DELETE(request, { params }) {
  const { id } = await params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM users WHERE employee_id = ?", [id]);
    await connection.query("DELETE FROM attendance WHERE emp_code = ?", [id]);
    const [result] = await connection.query("DELETE FROM employees WHERE emp_code = ?", [id]);
    await connection.commit();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลพนักงาน' }, { status: 404 });
    }

    return NextResponse.json({ message: 'ลบข้อมูลสำเร็จ' });

  } catch (error) {
    await connection.rollback();
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}