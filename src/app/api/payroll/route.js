import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

// GET: ดึงข้อมูลเงินเดือน
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

    const [rows] = await pool.query(
      `SELECT p.*, e.first_name, e.last_name, e.position 
       FROM payrolls p
       JOIN employees e ON p.emp_code = e.emp_code
       WHERE p.month = ? AND p.year = ?
       ORDER BY p.emp_code ASC`,
      [month, year]
    );

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: คำนวณเงินเดือน + โบนัสจากเกรด (🔥 Highlight)
export async function POST(request) {
  try {
    const body = await request.json();
    const { month, year } = body; 

    // 1. ดึงพนักงานทั้งหมด
    const [employees] = await pool.query("SELECT emp_code, salary FROM employees WHERE status = 'active'");
    let calculatedCount = 0;

    // 2. วนลูปคำนวณ
    for (const emp of employees) {
      const baseSalary = Number(emp.salary) || 0;

      // ---------------------------------------------------------
      // 🟢 ส่วนที่ 1: ดึงผลประเมิน (Evaluation) เพื่อคิดโบนัส
      // ---------------------------------------------------------
      const [evals] = await pool.query(
        "SELECT grade FROM evaluations WHERE emp_code = ? AND period_month = ? AND period_year = ? AND status = 'Finalized'",
        [emp.emp_code, month, year]
      );

      let bonus = 0;
      if (evals.length > 0) {
          const grade = evals[0].grade;
          // 🏆 กฎการให้โบนัส (แก้ไขตัวคูณได้ตรงนี้)
          if (grade === 'A') bonus = baseSalary * 1.0;      // เกรด A ได้ 1 เดือน
          else if (grade === 'B') bonus = baseSalary * 0.5; // เกรด B ได้ครึ่งเดือน
          else if (grade === 'C') bonus = baseSalary * 0.25;// เกรด C ได้ 25%
          // เกรดอื่นไม่ได้โบนัส
      }

      // ---------------------------------------------------------
      // 🔴 ส่วนที่ 2: ดึงสถิติขาด/ลา/สาย จาก Attendance
      // ---------------------------------------------------------
      const [attStats] = await pool.query(
        `SELECT 
            SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late_count,
            SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_count
         FROM attendance 
         WHERE emp_code = ? 
         AND MONTH(work_date) = ? AND YEAR(work_date) = ?`,
        [emp.emp_code, month, year]
      );

      const lateCount = Number(attStats[0]?.late_count) || 0;
      const absentCount = Number(attStats[0]?.absent_count) || 0;

      const lateDeduction = lateCount * 100; // หักสาย 100
      const dailyWage = baseSalary / 30;
      const absentDeduction = absentCount * dailyWage; 
      
      let sso = baseSalary * 0.05;
      if (sso > 750) sso = 750;

      // ---------------------------------------------------------
      // 🏁 ส่วนที่ 3: รวมยอดสุทธิ (เงินเดือน + โบนัส - รายจ่าย)
      // ---------------------------------------------------------
      const totalDeduction = lateDeduction + absentDeduction + sso;
      const netTotal = (baseSalary + bonus) - totalDeduction;

      // บันทึกลงตาราง payrolls (เพิ่ม column bonus)
      await pool.query(
        `INSERT INTO payrolls (emp_code, month, year, base_salary, bonus, late_count, absent_count, late_deduction, absent_deduction, social_security, net_total, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft')
         ON DUPLICATE KEY UPDATE 
            base_salary = VALUES(base_salary),
            bonus = VALUES(bonus),
            late_count = VALUES(late_count),
            absent_count = VALUES(absent_count),
            late_deduction = VALUES(late_deduction),
            absent_deduction = VALUES(absent_deduction),
            social_security = VALUES(social_security),
            net_total = VALUES(net_total)`,
        [emp.emp_code, month, year, baseSalary, bonus, lateCount, absentCount, lateDeduction, absentDeduction, sso, netTotal]
      );
      
      calculatedCount++;
    }

    return NextResponse.json({ success: true, message: `คำนวณแล้ว ${calculatedCount} คน (รวมโบนัส)` });

  } catch (error) {
    console.error("Payroll POST Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: ยืนยันการจ่ายเงิน + ลงบัญชีอัตโนมัติ
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id } = body; 

    const [rows] = await pool.query("SELECT * FROM payrolls WHERE id = ?", [id]);
    if (rows.length === 0) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });

    const payroll = rows[0];
    if (payroll.status === 'Paid') return NextResponse.json({ success: false, message: 'จ่ายไปแล้ว' }, { status: 400 });

    await pool.query(
      `INSERT INTO transactions (type, category, amount, description, transaction_date) 
       VALUES (?, ?, ?, ?, NOW())`,
      [
        'Expense',
        'Salary',
        payroll.net_total, 
        `เงินเดือนรหัส ${payroll.emp_code} งวด ${payroll.month}/${payroll.year}` 
      ]
    );

    await pool.query("UPDATE payrolls SET status = 'Paid' WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: 'จ่ายเงินและลงบัญชีเรียบร้อย' });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}