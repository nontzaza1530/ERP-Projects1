import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// 🟢 GET: ดึงข้อมูลรายละเอียดโปรเจกต์
export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = await params; // Next.js 15 ต้อง await
    connection = await pool.getConnection();

    // 1. ดึงข้อมูลโปรเจกต์หลัก
    const [projects] = await connection.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (projects.length === 0) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // ⚡ เทคนิค: ใช้ Promise.all ดึงข้อมูลตารางลูกพร้อมกัน (เร็วกว่ารอทีละอัน)
    const [costsResult, logsResult, plansResult, membersResult] = await Promise.all([
        connection.query("SELECT * FROM project_costs WHERE project_id = ? ORDER BY recorded_date DESC", [id]),
        connection.query("SELECT * FROM production_logs WHERE project_id = ? ORDER BY log_date DESC", [id]),
        connection.query("SELECT * FROM production_plans WHERE project_id = ? ORDER BY planned_date ASC", [id]),
        // query สมาชิกทีม (ใช้ try-catch แยกเผื่อตารางยังไม่พร้อม)
        connection.query(`
            SELECT pm.*, e.first_name, e.last_name, e.position 
            FROM project_members pm
            JOIN employees e ON pm.employee_id = e.emp_code
            WHERE pm.project_id = ?
        `, [id]).catch(() => [[], []]) // ถ้า error ให้คืนค่าว่าง
    ]);

    return NextResponse.json({ 
        project: projects[0], 
        costs: costsResult[0], 
        logs: logsResult[0], 
        plans: plansResult[0],
        members: membersResult[0] 
    });

  } catch (error) {
    console.error("❌ API GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release(); // ✅ คืน Connection เสมอ
  }
}

// 🟡 PUT: แก้ไขสถานะ หรือ ข้อมูล
export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, project_name, customer_name, due_date } = body;

    connection = await pool.getConnection();

    // กรณีเปลี่ยนสถานะ (เช่น เก็บเข้ากรุ)
    if (status) {
        await connection.query(
            'UPDATE projects SET status = ? WHERE id = ?',
            [status, id]
        );
    } 
    // กรณีแก้ไขข้อมูล (Edit)
    else {
        await connection.query(
            'UPDATE projects SET project_name = ?, customer_name = ?, due_date = ? WHERE id = ?',
            [project_name, customer_name, due_date, id]
        );
    }

    return NextResponse.json({ success: true, message: 'Updated successfully' });

  } catch (error) {
    console.error("❌ API PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// 🔴 DELETE: ลบโปรเจกต์ถาวร (แบบปลอดภัยด้วย Transaction)
export async function DELETE(request, { params }) {
  let connection;
  try {
    const { id } = await params;
    connection = await pool.getConnection();

    // 🛡️ เริ่มระบบความปลอดภัย (Transaction)
    // ถ้าบรรทัดไหนพัง มันจะยกเลิกการลบทั้งหมด (ข้อมูลไม่แหว่ง)
    await connection.beginTransaction();

    try {
        // 1. ลบตารางลูกก่อน
        await connection.query('DELETE FROM project_costs WHERE project_id = ?', [id]);
        await connection.query('DELETE FROM production_logs WHERE project_id = ?', [id]);
        await connection.query('DELETE FROM production_plans WHERE project_id = ?', [id]);
        await connection.query('DELETE FROM project_members WHERE project_id = ?', [id]);

        // 2. ลบโปรเจกต์หลัก
        await connection.query('DELETE FROM projects WHERE id = ?', [id]);

        // ✅ ยืนยันการลบทั้งหมด
        await connection.commit(); 
        
        return NextResponse.json({ success: true, message: 'Deleted permanently' });

    } catch (err) {
        // ❌ ถ้ามีอะไรผิดพลาด ให้ยกเลิกการลบทั้งหมด (กู้คืนกลับมา)
        await connection.rollback(); 
        throw err; // ส่ง error ไปข้างนอก
    }

  } catch (error) {
    console.error("❌ API DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}