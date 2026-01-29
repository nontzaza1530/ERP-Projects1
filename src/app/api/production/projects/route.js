import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

// ✅ 1. ฟังก์ชันช่วย: ตรวจสอบและสร้างการแจ้งเตือนอัตโนมัติ
async function createAutoNotifications(connection) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // หาโปรเจคที่ยังไม่เสร็จ (ตัด completed, canceled ออก) และมีวันกำหนดส่ง
    const [projects] = await connection.query(`
        SELECT p.* FROM projects p 
        WHERE p.status NOT IN ('completed', 'canceled') 
        AND p.due_date IS NOT NULL
    `);

    for (const project of projects) {
        const dueDate = new Date(project.due_date);
        const now = new Date();
        const diffTime = dueDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // คำนวณวันคงเหลือ

        let notifType = null;
        let title = '';
        let message = '';

        // 🚨 เงื่อนไข A: เลยกำหนดส่ง (Overdue)
        if (diffDays < 0) {
            notifType = 'danger';
            title = `⚠️ งานล่าช้า: ${project.project_name}`;
            message = `โปรเจคนี้เลยกำหนดส่งมา ${Math.abs(diffDays)} วันแล้ว กรุณาตรวจสอบด่วน`;
        } 
        // ⚠️ เงื่อนไข B: ใกล้ถึงกำหนด (Upcoming) ใน 3 วัน
        else if (diffDays >= 0 && diffDays <= 3) {
            notifType = 'warning';
            title = `⏳ ใกล้ถึงกำหนด: ${project.project_name}`;
            message = `เหลือเวลาอีก ${diffDays} วัน จะถึงกำหนดส่งมอบ`;
        }

        // ถ้าเข้าเงื่อนไขแจ้งเตือน
        if (notifType) {
            // เช็คก่อนว่า "วันนี้" แจ้งเตือนเรื่องนี้ไปหรือยัง (กันแจ้งซ้ำรัวๆ)
            const [existing] = await connection.query(`
                SELECT id FROM notifications 
                WHERE title = ? AND DATE(created_at) = ?
            `, [title, today]);

            if (existing.length === 0) {
                // บันทึกลงตาราง notifications (user_id = 0 คือแจ้ง Admin/System)
                await connection.query(`
                    INSERT INTO notifications (user_id, title, message, type, link)
                    VALUES (0, ?, ?, ?, ?)
                `, [title, message, notifType, `/production/project/${project.id}`]);
                
                // console.log(`Auto-Notify Created: ${title}`);
            }
        }
    }
  } catch (err) {
    console.error("Auto Notify Error:", err);
  }
}

// ✅ 2. GET: ดึงข้อมูลโปรเจกต์ทั้งหมด (และแอบเช็คแจ้งเตือนด้วย)
export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection(); // ขอ Connection แบบ manual

    // 🔥 เรียกฟังก์ชันตรวจสอบแจ้งเตือน (ทำงานเบื้องหลัง)
    await createAutoNotifications(connection);

    // ดึงข้อมูลโปรเจกต์ตามปกติ
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
    if (connection) connection.release(); // คืน Connection เสมอ
  }
}

// 3. POST: สร้างโปรเจคใหม่ (เหมือนเดิม)
export async function POST(request) {
  try {
    const body = await request.json();
    const { project_name, customer_name, start_date, due_date, budget, sale_price, description } = body;

    if (!project_name) {
        return NextResponse.json({ error: 'Missing Project Name' }, { status: 400 });
    }

    const [res] = await pool.query(`
      INSERT INTO projects (project_name, customer_name, start_date, due_date, budget, sale_price, description, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [project_name, customer_name, start_date, due_date, budget || 0, sale_price || 0, description]);

    return NextResponse.json({ success: true, id: res.insertId });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}