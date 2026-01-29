import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '../../lib/db';

// ฟังก์ชันตรวจสอบงานล่าช้า (Auto-Check)
async function checkProductionDeadlines(connection) {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // หาโปรเจคที่ยังไม่เสร็จ
        const [projects] = await connection.query(`
            SELECT p.* FROM projects p 
            WHERE p.status NOT IN ('completed', 'canceled') 
            AND p.due_date IS NOT NULL
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
                message = `เลยกำหนดส่ง ${Math.abs(diffDays)} วันแล้ว!`;
            } else if (diffDays >= 0 && diffDays <= 3) {
                notifType = 'warning';
                title = `⏳ ใกล้ถึงกำหนด: ${project.project_name}`;
                message = `เหลือเวลาอีก ${diffDays} วัน`;
            }

            if (notifType) {
                // เช็คว่าแจ้งไปหรือยัง
                const [existing] = await connection.query(`
                    SELECT id FROM notifications 
                    WHERE title = ? AND DATE(created_at) = ?
                `, [title, today]);

                if (existing.length === 0) {
                    // ✅ แก้ไข: ใช้ emp_code แทน user_id
                    // ใช้คำว่า 'SYSTEM' เพื่อระบุว่าเป็นแจ้งเตือนส่วนกลาง
                    await connection.query(`
                        INSERT INTO notifications (emp_code, title, message, type, link)
                        VALUES ('SYSTEM', ?, ?, ?, ?)
                    `, [title, message, notifType, `/production/project/${project.id}`]);
                }
            }
        }
    } catch (err) {
        console.error("Auto Check Error:", err);
    }
}

export async function GET(request) {
  let connection;
  try {
    // 1. ตรวจสอบ Token
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json([], { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // ✅ แก้ไข: ดึง emp_code จาก Token
    const empCode = payload.emp_code; 

    connection = await pool.getConnection();

    // 2. สั่งตรวจงานอัตโนมัติ
    await checkProductionDeadlines(connection);

    // 3. ดึงแจ้งเตือน
    // ✅ แก้ไข: SELECT โดยใช้ emp_code ของคนนั้น OR ของ 'SYSTEM'
    const [rows] = await connection.query(
        `SELECT * FROM notifications 
         WHERE emp_code = ? OR emp_code = 'SYSTEM' 
         ORDER BY is_read ASC, created_at DESC 
         LIMIT 20`,
        [empCode] 
    );

    const unreadCount = rows.filter(n => !n.is_read).length;

    return NextResponse.json({ notifications: rows, unreadCount });

  } catch (error) {
    console.error("GET Notif Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const { id } = body;
        
        if (id) {
            await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [id]);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}