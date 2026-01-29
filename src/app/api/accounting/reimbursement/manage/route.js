import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// 🟢 GET: ดึงรายการทั้งหมด (เรียงจากใหม่ไปเก่า)
export async function GET(request) {
  try {
    const connection = await pool.getConnection();

    // ✅ แก้ไข SQL ให้ตรงกับตาราง users ของจริง
    const sql = `
      SELECT 
        r.*, 
        u.username as first_name,  
        '' as last_name,           
        u.role as position         
      FROM reimbursements r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `;
    
    const [rows] = await connection.query(sql);
    connection.release();
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("❌ API GET Error:", error); 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🟠 PUT: อัปเดตสถานะ (อนุมัติ / ปฏิเสธ)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, reject_reason, admin_id } = body;

    const connection = await pool.getConnection();
    await connection.query(
      `UPDATE reimbursements 
       SET status = ?, reject_reason = ?, approved_by = ?, approved_at = NOW() 
       WHERE id = ?`,
      [status, reject_reason || null, admin_id, id]
    );
    connection.release();

    return NextResponse.json({ success: true, message: 'อัปเดตสถานะสำเร็จ' });
  } catch (error) {
    console.error("❌ API PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}