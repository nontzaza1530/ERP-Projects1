import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // เช็ค path ให้ถูกนะครับ (ขึ้นไป 6 ชั้นถ้าอยู่ใน src/app/api/sales/quotation/[id])
// หรือถ้า path ผิด ให้ลอง ../../../../../lib/db หรือตามโครงสร้างโปรเจคของคุณ

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    // 1. ดึงหัวบิล
    const [quotations] = await pool.query(
      `SELECT * FROM quotations WHERE id = ?`, 
      [id]
    );

    if (quotations.length === 0) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    // 2. ดึงรายการสินค้า
    const [items] = await pool.query(
      `SELECT * FROM quotation_items WHERE quotation_id = ?`, 
      [id]
    );

    return NextResponse.json({ 
      quotation: quotations[0], 
      items: items 
    });

  } catch (error) {
    console.error("Fetch Quotation Error:", error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}