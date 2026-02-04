import { NextResponse } from 'next/server';
// ตรวจสอบ path ให้ถูกต้อง (ถอยหลัง 4 ขั้น: api -> employees -> [id] -> app -> src -> lib)
import pool from '../../../lib/db'; 

// --- 1. ดึงข้อมูลพนักงานรายคน (GET) ---
export async function GET(request, { params }) {
  try {
    const { id } = params; // id ในที่นี้คือ emp_code (จาก URL)

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
  const connection = await pool.getConnection(); // ✅ ใช้ connection เพื่อทำ Transaction
  try {
    const { id } = params; // id = emp_code ตัวเก่า (จาก URL)
    const body = await request.json();

    const { 
      emp_code, // รหัสใหม่ (อาจจะเหมือนเดิมหรือเปลี่ยนใหม่)
      first_name, 
      last_name, 
      email, 
      phone, birth_date, address, 
      position,
      role_id, 
      role_name, 
      departments_id, 
      departments_name, 
      salary,
      status 
    } = body;

    await connection.beginTransaction(); // 🏁 เริ่มต้น Transaction

    // ⚠️ 1. เช็คก่อนว่า "รหัสพนักงานใหม่" ซ้ำกับคนอื่นไหม? (ถ้ามีการเปลี่ยนรหัส)
    if (emp_code && emp_code !== id) {
        const [duplicateCheck] = await connection.query(
            `SELECT emp_code FROM employees WHERE emp_code = ?`,
            [emp_code]
        );
        if (duplicateCheck.length > 0) {
            throw new Error(`รหัสพนักงาน ${emp_code} มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น`);
        }
    }

    // 2. อัปเดตข้อมูลลงตาราง employees
    // หมายเหตุ: การแก้ emp_code ตรงนี้ ถ้า DB ตั้ง ON UPDATE CASCADE ไว้ ตารางอื่นจะเปลี่ยนตามเอง
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

    const values = [
      emp_code || id, 
      first_name, last_name, email, 
      phone || null, 
      birth_date || null, 
      address || null, 
      position, role_id, role_name, 
      departments_id, departments_name, 
      salary || 0, status,
      id // WHERE emp_code = ตัวเก่า
    ];

    await connection.query(sqlUpdateEmp, values);

    // 3. Logic จัดการสถานะ User (อัปเดต user ให้เชื่อมกับรหัสพนักงานใหม่ด้วย)
    if (email) {
        // เตรียม Role สำหรับ Table Users
        const userRole = (role_name || '').toLowerCase().replace(/ /g, '_') || 'employee';
        
        if (status === 'resigned') {
            await connection.query("UPDATE users SET role = 'resigned' WHERE email = ?", [email]);
        } else {
            // อัปเดตข้อมูลในตาราง users ให้ตรงกัน (สำคัญมากถ้ารหัสพนักงานเปลี่ยน)
            await connection.query(
                "UPDATE users SET role = ?, role_id = ?, department_id = ?, employee_id = ? WHERE email = ?", 
                [userRole, role_id, departments_id, emp_code || id, email]
            );
        }
    }

    await connection.commit(); // ✅ ยืนยันการบันทึก
    return NextResponse.json({ success: true, message: 'อัปเดตข้อมูลเรียบร้อยแล้ว' });

  } catch (error) {
    await connection.rollback(); // ❌ ยกเลิกทั้งหมดถ้ามี Error
    console.error("Update Error:", error);
    // ส่ง status 400 ถ้าเป็น User Error (เช่น รหัสซ้ำ) หรือ 500 ถ้าเป็น Server Error
    const status = error.message.includes('มีอยู่ในระบบแล้ว') ? 400 : 500;
    return NextResponse.json({ error: error.message }, { status: status });
  } finally {
    connection.release(); // คืน connection
  }
}

// --- 3. ลบข้อมูลพนักงาน (DELETE) ---
export async function DELETE(request, { params }) {
  const { id } = params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // ลบ User ที่ผูกกับพนักงานคนนี้
    await connection.query("DELETE FROM users WHERE employee_id = ?", [id]);
    
    // ลบประวัติการเข้างาน (ถ้าต้องการลบ)
    await connection.query("DELETE FROM attendance WHERE emp_code = ?", [id]);
    
    // ลบพนักงาน
    const [result] = await connection.query("DELETE FROM employees WHERE emp_code = ?", [id]);

    await connection.commit();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลพนักงาน' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });

  } catch (error) {
    await connection.rollback();
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}