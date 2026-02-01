import { NextResponse } from 'next/server';
import pool from '@/app/lib/db'; 

// 1. GET: ดึงงาน + ประวัติการแก้ไข (History)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  try {
    // 1. ดึงงานหลัก
    const [tasks] = await pool.query(`SELECT * FROM production_tasks WHERE project_id = ? ORDER BY id ASC`, [projectId]);
    
    // 2. ดึงประวัติทั้งหมดของโปรเจกต์นี้
    const [histories] = await pool.query(`
        SELECT h.* FROM task_date_history h
        JOIN production_tasks t ON h.task_id = t.id
        WHERE t.project_id = ?
        ORDER BY h.changed_at DESC
    `, [projectId]);

    // 3. จับคู่ (Map) ประวัติใส่เข้าไปใน Task แต่ละตัว
    const tasksWithHistory = tasks.map(task => {
        return {
            ...task,
            history: histories.filter(h => h.task_id === task.id) // ยัดประวัติใส่ใน task
        };
    });

    return NextResponse.json(tasksWithHistory);
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { project_id, task_name, planned_date, planned_end_date } = body; 
    await pool.query(
      `INSERT INTO production_tasks (project_id, task_name, planned_date, planned_end_date, status) VALUES (?, ?, ?, ?, 'pending')`,
      [project_id, task_name, planned_date, planned_end_date] 
    );
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

// 3. PATCH: จัดการสถานะ + บันทึกประวัติแก้ไข + บันทึก Log กลาง
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, action, new_start, new_end } = body; 
    const now = new Date();
    let sql = '';
    let params = [];

    // 1️⃣ ดึงข้อมูลงานเก่าก่อน (เพื่อเอาชื่อ Project ID และ Task Name มาใช้เขียน Log)
    const [existingTasks] = await pool.query(`SELECT * FROM production_tasks WHERE id = ?`, [id]);
    if (existingTasks.length === 0) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    const currentTask = existingTasks[0];
    const projectId = currentTask.project_id;
    const taskName = currentTask.task_name;

    // เตรียมตัวแปรสำหรับ Log
    let logAction = '';
    let logNote = '';

    // 2️⃣ Logic การอัปเดตสถานะ (เหมือนเดิม แต่เพิ่มตัวแปร log)
    switch (action) {
        case 'start':
            sql = `UPDATE production_tasks SET status = 'in_progress', start_time = ? WHERE id = ?`;
            params = [now, id];
            logAction = 'เริ่มทำงาน';
            logNote = `งาน: ${taskName}`;
            break;

        case 'pause':
            sql = `UPDATE production_tasks SET status = 'paused' WHERE id = ?`;
            params = [id];
            logAction = 'พักงานชั่วคราว';
            logNote = `งาน: ${taskName}`;
            break;

        case 'resume':
            sql = `UPDATE production_tasks SET status = 'in_progress' WHERE id = ?`;
            params = [id];
            logAction = 'กลับมาทำต่อ';
            logNote = `งาน: ${taskName}`;
            break;

        case 'finish':
            sql = `UPDATE production_tasks SET status = 'completed', end_time = ? WHERE id = ?`;
            params = [now, id];
            logAction = 'จบงานผลิต';
            logNote = `งาน: ${taskName} (เสร็จสมบูรณ์)`;
            break;
        
        case 'edit':
            await pool.query(`
                INSERT INTO task_date_history (task_id, old_start, old_end, new_start, new_end)
                SELECT id, planned_date, planned_end_date, ?, ?
                FROM production_tasks WHERE id = ?
            `, [new_start, new_end, id]);

            sql = `UPDATE production_tasks SET planned_date = ?, planned_end_date = ?, is_edited = 1 WHERE id = ?`;
            params = [new_start, new_end, id];
            
            logAction = 'แก้ไขแผนงาน';
            logNote = `งาน: ${taskName} (ปรับวันที่)`;
            break;

        case 'delete':
            // ลบประวัติก่อน
            await pool.query(`DELETE FROM task_date_history WHERE task_id = ?`, [id]);
            sql = `DELETE FROM production_tasks WHERE id = ?`;
            params = [id];
            logAction = 'ลบแผนงาน';
            logNote = `ลบงาน: ${taskName}`;
            break;
    }

    // 3️⃣ รันคำสั่งอัปเดต Task
    if (sql) await pool.query(sql, params);

    // 4️⃣ ✅ เพิ่มใหม่: บันทึกลง production_logs เพื่อให้โชว์หน้า History
    if (logAction) {
        await pool.query(`
            INSERT INTO production_logs (project_id, action, note, employee_id)
            VALUES (?, ?, ?, 'Admin') 
        `, [projectId, logAction, logNote]);
        // หมายเหตุ: ตรง 'Admin' ถ้าอนาคตมีระบบ Login ให้เปลี่ยนเป็นชื่อ user จริง
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}