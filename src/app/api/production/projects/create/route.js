import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
        project_name, 
        customer_name, 
        start_date, 
        due_date, 
        budget, 
        sale_price, 
        quantity,      // ✅ 1. รับค่าจำนวน (Quantity) มาจากหน้าบ้าน
        description, 
        selected_employees 
    } = body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // ✅ 2. เพิ่มคอลัมน์ quantity เข้าไปใน SQL INSERT
        const [result] = await connection.query(
            `INSERT INTO projects (
                project_name, customer_name, start_date, due_date, 
                budget, sale_price, quantity, description, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                project_name, 
                customer_name, 
                start_date, 
                due_date, 
                budget || 0,
                sale_price || 0, 
                quantity || 1,   // ✅ 3. ใส่ค่าจำนวนจริงลงไป (Default เป็น 1)
                description
            ]
        );
        
        const newProjectId = result.insertId;

        // บันทึกสมาชิกทีม (ถ้ามี)
        if (selected_employees && selected_employees.length > 0) {
            for (const empCode of selected_employees) {
                await connection.query(
                    `INSERT INTO project_members (project_id, employee_id, role) VALUES (?, ?, 'Staff')`,
                    [newProjectId, empCode]
                );
            }
        }

        // ✅ 4. ปรับบันทึก Log ให้ระบุจำนวนสินค้าด้วย
        await connection.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [
              newProjectId, 
              'เปิดใบสั่งผลิตใหม่', 
              `จำนวน: ${quantity || 1} รายการ, งบประมาณ: ${budget || 0} บาท`, 
              'Admin'
            ]
        );

        await connection.commit();
        connection.release();

        return NextResponse.json({ success: true, projectId: newProjectId });

    } catch (err) {
        if (connection) {
          await connection.rollback();
          connection.release();
        }
        throw err;
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}