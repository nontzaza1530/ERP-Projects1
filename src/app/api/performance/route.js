import { NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const type = searchParams.get('type'); // 'list' หรือ 'criteria'

    if (type === 'criteria') {
        // ดึงหัวข้อการประเมิน
        const [rows] = await pool.query("SELECT * FROM performance_criteria WHERE status = 'active'");
        return NextResponse.json(rows);
    }

    // ดึงรายชื่อพนักงาน + สถานะการประเมินของเดือนนั้น
    const [rows] = await pool.query(`
        SELECT e.emp_code, e.first_name, e.last_name, e.position,
               ev.id as eval_id, ev.total_score, ev.grade, ev.status, ev.feedback
        FROM employees e
        LEFT JOIN evaluations ev ON e.emp_code = ev.emp_code AND ev.period_month = ? AND ev.period_year = ?
        WHERE e.status = 'active'
        ORDER BY e.emp_code ASC
    `, [month, year]);

    return NextResponse.json(rows);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { emp_code, month, year, scores, feedback } = body; 
    // scores = [{ criteria_id: 1, score: 8 }, { criteria_id: 2, score: 9 }]

    // 1. คำนวณคะแนนรวม และ เกรด
    let totalScore = 0;
    
    // ดึงเกณฑ์เพื่อมาเทียบน้ำหนัก
    const [criteriaList] = await pool.query("SELECT * FROM performance_criteria");
    
    // Logic: (คะแนนที่ได้ / คะแนนเต็ม) * น้ำหนัก %
    for (const item of scores) {
        const criteria = criteriaList.find(c => c.id === item.criteria_id);
        if (criteria) {
            const weightedScore = (item.score / criteria.max_score) * criteria.weight_percent;
            totalScore += weightedScore;
        }
    }

    // ตัดเกรด
    let grade = 'F';
    if (totalScore >= 90) grade = 'A';
    else if (totalScore >= 80) grade = 'B';
    else if (totalScore >= 70) grade = 'C';
    else if (totalScore >= 60) grade = 'D';

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 2. Insert/Update Header (evaluations)
        const [resEval] = await connection.query(`
            INSERT INTO evaluations (emp_code, period_month, period_year, total_score, grade, feedback, status)
            VALUES (?, ?, ?, ?, ?, ?, 'Finalized')
            ON DUPLICATE KEY UPDATE 
            total_score = VALUES(total_score),
            grade = VALUES(grade),
            feedback = VALUES(feedback),
            status = 'Finalized'
        `, [emp_code, month, year, totalScore, grade, feedback]);

        // หา ID ของใบประเมิน (ถ้า Insert ใหม่ใช้ insertId, ถ้า Update ต้อง Query หา)
        let evalId = resEval.insertId;
        if (evalId === 0) {
            const [existing] = await connection.query("SELECT id FROM evaluations WHERE emp_code = ? AND period_month = ? AND period_year = ?", [emp_code, month, year]);
            evalId = existing[0].id;
        }

        // 3. Insert Details (evaluation_items) - ลบของเก่าแล้วลงใหม่
        await connection.query("DELETE FROM evaluation_items WHERE evaluation_id = ?", [evalId]);
        
        for (const item of scores) {
            await connection.query(`
                INSERT INTO evaluation_items (evaluation_id, criteria_id, score_given)
                VALUES (?, ?, ?)
            `, [evalId, item.criteria_id, item.score]);
        }

        await connection.commit();
        connection.release();

        return NextResponse.json({ success: true, message: 'บันทึกผลการประเมินเรียบร้อย' });

    } catch (err) {
        await connection.rollback();
        connection.release();
        throw err;
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}