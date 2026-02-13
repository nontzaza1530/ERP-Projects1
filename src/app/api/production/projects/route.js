import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// ✅ 1. ฟังก์ชันช่วย: ตรวจสอบและสร้างการแจ้งเตือนอัตโนมัติ (คงเดิม)
async function createAutoNotifications(connection) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [projects] = await connection.execute(`
    SELECT * FROM projects 
    WHERE status IN ('pending', 'in_progress', 'qc', 'completed') 
    ORDER BY 
        CASE 
            WHEN status = 'pending' THEN 1 
            WHEN status = 'in_progress' THEN 2
            WHEN status = 'qc' THEN 3
            ELSE 4 
        END,
        created_at DESC
    `);

    for (const project of projects) {
        const dueDate = new Date(project.due_date);
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        let notifType = null;
        let title = '';
        let message = '';

        if (diffDays < 0) {
            notifType = 'danger';
            title = `⚠️ งานล่าช้า: ${project.project_name}`;
            message = `โปรเจคนี้เลยกำหนดส่งมา ${Math.abs(diffDays)} วันแล้ว กรุณาตรวจสอบด่วน`;
        } 
        else if (diffDays >= 0 && diffDays <= 3) {
            notifType = 'warning';
            title = `⏳ ใกล้ถึงกำหนด: ${project.project_name}`;
            message = `เหลือเวลาอีก ${diffDays} วัน จะถึงกำหนดส่งมอบ`;
        }

        if (notifType) {
            const [existing] = await connection.query(`
                SELECT id FROM notifications 
                WHERE title = ? AND DATE(created_at) = ?
            `, [title, today]);

            if (existing.length === 0) {
                await connection.query(`
                    INSERT INTO notifications (user_id, title, message, type, link)
                    VALUES (0, ?, ?, ?, ?)
                `, [title, message, notifType, `/production/project/${project.id}`]);
            }
        }
    }
  } catch (err) {
    console.error("Auto Notify Error:", err);
  }
}

// ✅ 2. GET: ดึงข้อมูลโปรเจกต์ทั้งหมด (ส่งค่า quantity ออกไปด้วย)
export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection(); 

    await createAutoNotifications(connection);

    // p.* จะรวมเอาคอลัมน์ quantity ที่คุณเพิ่มเข้าไปใหม่ใน Database ออกมาด้วยอัตโนมัติ
    const [rows] = await connection.query(`
      SELECT 
        p.*,
        COALESCE(SUM(c.amount), 0) as total_cost 
      FROM projects p
      LEFT JOIN project_costs c ON p.id = c.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    return NextResponse.json(rows);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release(); 
  }
}

// ✅ 3. POST: สร้างโปรเจคใหม่ (เพิ่มการบันทึก quantity)
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
        quantity, // ✅ รับค่าจำนวนเพิ่มเข้ามา
        description 
    } = body;

    if (!project_name) {
        return NextResponse.json({ error: 'Missing Project Name' }, { status: 400 });
    }

    // ✅ เพิ่มคอลัมน์ quantity เข้าไปในคำสั่ง SQL INSERT
    const sql = `
      INSERT INTO projects (
        project_name, 
        customer_name, 
        start_date, 
        due_date, 
        budget, 
        sale_price, 
        quantity, 
        description, 
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    const [res] = await pool.query(sql, [
        project_name, 
        customer_name, 
        start_date, 
        due_date, 
        budget || 0, 
        sale_price || 0, 
        quantity || 1, // ✅ ถ้าหน้า Create ไม่ส่งมา ให้ Default เป็น 1
        description
    ]);

    return NextResponse.json({ success: true, id: res.insertId });

  } catch (error) {
    console.error("Create Project Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}