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
        quantity,      
        billing_type,  // ✅ 1. รับค่ารูปแบบการคิดเงิน (Billing Type) มาจากหน้าบ้าน
        description, 
        selected_employees 
    } = body;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // ✅ 2. เพิ่มคอลัมน์ billing_type เข้าไปใน SQL INSERT
        const [result] = await connection.query(
            `INSERT INTO projects (
                project_name, customer_name, start_date, due_date, 
                budget, sale_price, quantity, billing_type, description, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                project_name, 
                customer_name, 
                start_date, 
                due_date, 
                budget || 0,
                sale_price || 0, 
                quantity || 1,  
                billing_type || 'lump_sum', // ✅ 3. บันทึกประเภทการคิดเงิน (Default เป็น เหมาจ่าย)
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

        // ✅ 4. ปรับบันทึก Log ให้ระบุรูปแบบการคิดเงินด้วย
        const typeText = billing_type === 'unit_based' ? 'คิดตามรายชิ้น' : 'เหมาจ่ายทั้งก้อน';
        await connection.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [
              newProjectId, 
              'เปิดใบสั่งผลิตใหม่', 
              `จำนวน: ${quantity || 1} รายการ (${typeText}), งบประมาณ: ${budget || 0} บาท`, 
              'Admin' // ถ้าอนาคตมีระบบ Login ให้เปลี่ยนตรงนี้เป็นชื่อคนที่ Login ได้ครับ
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