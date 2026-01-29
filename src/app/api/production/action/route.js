import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, project_id, ...data } = body; 

    // 1. บันทึก Log
    if (type === 'log') {
        await pool.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [project_id, data.action, data.note, data.employee_id || 'System']
        );
    } 
    // ✅✅✅ 2. บันทึก Cost และ ตัดสต็อก (แก้ไขจุดนี้) ✅✅✅
    else if (type === 'cost') {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 2.1 บันทึกรายการต้นทุน
            // ⚠️ ต้องแน่ใจว่าตาราง project_costs มีคอลัมน์ product_id และ quantity แล้วนะครับ
            await connection.query(
                `INSERT INTO project_costs (project_id, cost_type, description, amount, recorded_date, recorded_by, product_id, quantity) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    project_id, 
                    data.cost_type, 
                    data.description, 
                    data.amount, 
                    data.recorded_date, 
                    data.recorded_by || 'Admin',
                    data.product_id || null, 
                    data.quantity || 1       
                ]
            );

            // 2.2 🔥 ตัดสต็อก: แก้ชื่อคอลัมน์จาก stock เป็น quantity ให้ตรงกับ DB ของคุณ
            if (data.cost_type === 'material' && data.product_id) {
                await connection.query(
                    `UPDATE products SET quantity = quantity - ? WHERE id = ?`, 
                    [data.quantity, data.product_id]
                );
            }

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error("Database Transaction Error:", err); // เพิ่ม log เพื่อดู error ชัดๆ
            throw err;
        } finally {
            connection.release();
        }
    } 
    // 3. เพิ่ม Plan
    else if (type === 'plan') {
        await pool.query(
            `INSERT INTO production_plans (project_id, task_name, planned_date) VALUES (?, ?, ?)`,
            [project_id, data.task_name, data.planned_date]
        );
    } 
    // 4. จบงานตาม Plan
    else if (type === 'complete_plan') {
         await pool.query(
            `UPDATE production_plans SET status = 'completed' WHERE id = ?`,
            [data.plan_id]
        );
        await pool.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [project_id, `ทำงานตามแผนเสร็จ: ${data.task_name}`, 'Completed from Plan', 'System']
        );
    }
    // 5. เปลี่ยนสถานะงาน
    else if (type === 'update_project_status') {
        await pool.query(
            `UPDATE projects SET status = ? WHERE id = ?`,
            [data.status, project_id]
        );
        await pool.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [project_id, `เปลี่ยนสถานะเป็น: ${data.status}`, 'Status Update', 'System']
        );
    }
    // 6. ส่งข้อมูลเข้าบัญชี
    else if (type === 'send_to_accounting') {
        const [projectData] = await pool.query(
            `SELECT p.sale_price, p.project_name, COALESCE(SUM(c.amount), 0) as total_cost 
             FROM projects p 
             LEFT JOIN project_costs c ON p.id = c.project_id 
             WHERE p.id = ? 
             GROUP BY p.id`,
            [project_id]
        );

        if (projectData.length > 0) {
            const { sale_price, total_cost, project_name } = projectData[0];
            const today = new Date().toISOString().split('T')[0];

            if (parseFloat(sale_price) > 0) {
                await pool.query(
                    `INSERT INTO transactions (transaction_date, description, category, type, amount) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [today, `รายได้จากโปรเจค: ${project_name}`, 'รายรับจากงานผลิต', 'income', sale_price]
                );
            }

            if (parseFloat(total_cost) > 0) {
                await pool.query(
                    `INSERT INTO transactions (transaction_date, description, category, type, amount) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [today, `ต้นทุนการผลิต: ${project_name}`, 'ต้นทุนการผลิต', 'expense', total_cost]
                );
            }
        }

        await pool.query(
            `UPDATE projects SET is_sent_to_accounting = TRUE, closed_at = NOW() WHERE id = ?`,
            [project_id]
        );

        await pool.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [project_id, 'ปิดงานสมบูรณ์: บันทึกบัญชีเรียบร้อย', 'Project Closed', 'Admin']
        );
    }
    // ✅ 7. เพิ่มสมาชิกเข้าทีม (Add Member)
    else if (type === 'add_member') {
        await pool.query(
            `INSERT INTO project_members (project_id, employee_name, role) VALUES (?, ?, ?)`,
            [project_id, data.employee_name, data.role]
        );
        // Log การเพิ่มคน
        await pool.query(
            `INSERT INTO production_logs (project_id, action, note, employee_id) VALUES (?, ?, ?, ?)`,
            [project_id, `เพิ่มสมาชิกทีม: ${data.employee_name}`, `ตำแหน่ง: ${data.role}`, 'Admin']
        );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Action API Error:", error); // ดู Error ที่ Terminal
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}