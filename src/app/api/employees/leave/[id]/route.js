import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // ปรับ path ให้เจอ lib/db

export async function PUT(request, { params }) {
  try {
    // ❌ ของเดิม: const { id } = params; (ใช้ไม่ได้แล้วใน Next.js ใหม่)
    
    // ✅ ของใหม่: ต้องใส่ await params ก่อนครับ
    const { id } = await params; 

    const body = await request.json();
    const { status, approver_id } = body;

    console.log(`Updating ID: ${id} to Status: ${status}`); // เช็คว่า ID มาหรือยัง

    const sql = "UPDATE leave_requests SET status = ?, approver_id = ? WHERE id = ?";
    const [result] = await pool.query(sql, [status, approver_id, id]);

    if (result.affectedRows === 0) {
        return NextResponse.json({ error: 'ไม่พบรายการที่ต้องการแก้ไข' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Success', success: true });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}