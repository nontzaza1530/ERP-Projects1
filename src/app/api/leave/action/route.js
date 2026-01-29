import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // เช็ค path ให้ถูก

// PUT: สำหรับ Super Admin กดอนุมัติ/ปฏิเสธ
export async function PUT(request) {
  try {
    const body = await request.json();
    const { leave_id, status, approver_id, emp_code } = body; 
    // leave_id = ไอดีใบลา, status = approved/rejected, emp_code = รหัสพนักงานที่ขอลา

    if (!leave_id || !status || !emp_code) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // 1. อัปเดตสถานะในตาราง leave_requests
    await pool.query(
      `UPDATE leave_requests SET status = ?, approver_id = ? WHERE id = ?`,
      [status, approver_id, leave_id]
    );

    // 2. สร้างการแจ้งเตือนลงตาราง notifications 🔔
    let message = '';
    let type = 'info';

    if (status === 'approved') {
        message = `✅ คำขอลาของคุณได้รับการ "อนุมัติ" เรียบร้อยแล้ว`;
        type = 'success';
    } else if (status === 'rejected') {
        message = `❌ คำขอลาของคุณถูก "ปฏิเสธ"`;
        type = 'error';
    }

    await pool.query(
        `INSERT INTO notifications (emp_code, message, type) VALUES (?, ?, ?)`,
        [emp_code, message, type]
    );

    return NextResponse.json({ message: 'ดำเนินการสำเร็จ' }, { status: 200 });

  } catch (error) {
    console.error("Error updating leave:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}