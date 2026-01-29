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
        budget, // ✅ 1. รับค่า budget มาจากหน้าบ้าน
        sale_price, 
        description, 
        selected_employees 
    } = body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // ✅ 2. เพิ่ม budget เข้าไปใน SQL INSERT
        const [result] = await connection.query(
            `INSERT INTO projects (
                project_name, customer_name, start_date, due_date, 
                budget, sale_price, description, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                project_name, 
                customer_name, 
                start_date, 
                due_date, 
                budget || 0,    // ✅ 3. ใส่ค่า budget ลงไป (ถ้าไม่มีให้เป็น 0)
                sale_price || 0, 
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

        // บันทึก Log เริ่มต้น
        await connection.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [newProjectId, 'เปิดใบสั่งผลิตใหม่', `งบประมาณ: ${budget || 0} บาท`, 'Admin']
        );

        await connection.commit();
        connection.release();

        return NextResponse.json({ success: true, projectId: newProjectId });

    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}