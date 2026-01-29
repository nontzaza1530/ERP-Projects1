import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // ✅ ตรวจสอบ path ให้ตรงกับโฟลเดอร์ของคุณ

export async function POST(request) {
  try {
    const body = await request.json();
    const empCodeInput = body.emp_code || body.employee_id;
    let action = body.action;
    if (action === 'IN') action = 'check_in';
    if (action === 'OUT') action = 'check_out';

    if (!empCodeInput) {
      return NextResponse.json({ success: false, message: "กรุณาระบุรหัสพนักงาน" }, { status: 400 });
    }

    const now = new Date();
    // ตั้งเวลาโซนไทย
    const thaiDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    
    // หาวันที่ yyyy-mm-dd (ใช้เป็น Key หลักในการเช็ควันต่อวัน)
    const yyyy = thaiDate.getFullYear();
    const mm = String(thaiDate.getMonth() + 1).padStart(2, '0');
    const dd = String(thaiDate.getDate()).padStart(2, '0');
    const workDate = `${yyyy}-${mm}-${dd}`;

    const [empRows] = await pool.query(
      "SELECT first_name, last_name FROM employees WHERE emp_code = ?", 
      [empCodeInput]
    );

    if (empRows.length === 0) {
      return NextResponse.json({ success: false, message: `ไม่พบรหัสพนักงาน "${empCodeInput}"` }, { status: 404 });
    }
    const employeeName = `${empRows[0].first_name} ${empRows[0].last_name}`;
    const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    // ==========================================
    // 🟢 เข้างาน (Check In)
    // ==========================================
    if (action === 'check_in') {
      // 1. เช็คว่าวันนี้มีรายการหรือยัง?
      const [existing] = await pool.query(
        "SELECT id FROM attendance WHERE emp_code = ? AND work_date = ?",
        [empCodeInput, workDate]
      );
      
      // 🔒 ถ้ามีแล้ว = ห้ามกดซ้ำ (ไม่ว่าจะเข้าหรือออกไปแล้ว)
      if (existing.length > 0) {
        return NextResponse.json({ success: false, message: `วันนี้คุณ ${employeeName} ลงเวลา "เข้างาน" ไปแล้วครับ (ลงได้วันละ 1 ครั้ง)` }, { status: 400 });
      }

      // 🕒 Logic เช็คสาย (เทียบกับ 09:30)
      const lateThreshold = new Date(now);
      lateThreshold.setHours(9, 30, 0, 0);

      let status = 'On Time'; 
      let lateMinutes = 0;

      if (now > lateThreshold) {
          status = 'Late';
          const diffMs = now - lateThreshold; 
          lateMinutes = Math.floor(diffMs / 60000); 
      }

      await pool.query(
        `INSERT INTO attendance (emp_code, work_date, check_in, status, source) 
         VALUES (?, ?, ?, ?, 'Web App')`, 
        [empCodeInput, workDate, now, status]
      );

      return NextResponse.json({
        success: true,
        type: 'check_in',
        message: `บันทึกเวลาเข้างานสำเร็จ`,
        empName: employeeName,
        checkInTime: timeString, 
        status: status,          
        lateMinutes: lateMinutes 
      });

    } 
    // ==========================================
    // 🔴 ออกงาน (Check Out)
    // ==========================================
    else if (action === 'check_out') {
      // 1. ดึงข้อมูลของวันนี้มาเช็ค
      const [existing] = await pool.query(
        "SELECT id, check_out FROM attendance WHERE emp_code = ? AND work_date = ?", 
        [empCodeInput, workDate]
      );

      // ถ้ายังไม่เคย Check In
      if (existing.length === 0) {
         return NextResponse.json({ success: false, message: `ไม่พบรายการเข้างานวันนี้ (ต้องกดเข้างานก่อน)` }, { status: 400 });
      }

      // 🔒 เช็คว่า "เคยออกไปแล้วหรือยัง"
      if (existing[0].check_out !== null) {
         return NextResponse.json({ success: false, message: `วันนี้คุณ ${employeeName} ลงเวลา "ออกงาน" เรียบร้อยแล้ว (ไม่สามารถลงซ้ำได้)` }, { status: 400 });
      }

      // 2. ถ้ายังไม่เคยออก -> อัปเดตเวลา
      await pool.query(
        "UPDATE attendance SET check_out = ? WHERE emp_code = ? AND work_date = ?", 
        [now, empCodeInput, workDate]
      );

      return NextResponse.json({
        success: true,
        type: 'check_out',
        message: `บันทึกเวลาออกงานสำเร็จ`,
        empName: employeeName,
        checkOutTime: timeString
      });
    }

    return NextResponse.json({ success: false, message: "Action ไม่ถูกต้อง" }, { status: 400 });

  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ success: false, message: "System Error: " + error.message }, { status: 500 });
  }
}