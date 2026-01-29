import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  let connection;
  try {
    connection = await pool.getConnection();

    // SQL นี้สำคัญ: ดึงโปรเจกต์ + รวมยอดค่าใช้จ่าย (Total Cost)
    const sql = `
      SELECT 
        p.id,
        p.project_name,
        p.customer_name,
        p.status,
        p.sale_price,  -- ราคาขาย (Revenue)
        p.budget,      -- งบประมาณที่ตั้งไว้
        COALESCE(SUM(pc.amount), 0) as total_used, -- รวมยอดที่ผลิตใช้ไปจริง
        COUNT(pc.id) as txn_count -- จำนวนรายการที่เบิก
      FROM projects p
      LEFT JOIN project_costs pc ON p.id = pc.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    const [rows] = await connection.query(sql);
    return NextResponse.json(rows);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}