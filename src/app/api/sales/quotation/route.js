import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import pool from '../../../lib/db'; // ✅ เช็ค Path ให้ถูกต้องตามโครงสร้างโปรเจคคุณ

export async function POST(request) {
  const body = await request.json();
  
  // ✅ 1. รับค่า customerPhone เพิ่มเข้ามา
  const { customerName, customerPhone, customerAddress, cart, total } = body;
  
  // 2. หา User ID คนทำ
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  const userId = payload.id;

  try {
    // 3. สร้างเลขที่ใบเสนอราคา (QT-YYYYMM-XXX)
    // เปลี่ยน format วันที่ให้เป็นแบบไทยๆ หรือแบบที่ต้องการ (ตัวอย่างนี้ใช้ ปีเดือน-สุ่ม)
    const dateStr = new Date().toISOString().slice(2, 7).replace(/-/g, ''); // 2601 (สมมติปี 2026)
    const random = Math.floor(1000 + Math.random() * 9000);
    const quotationNo = `QT-${dateStr}-${random}`;

    // ✅ 4. Insert หัวบิล (เพิ่ม customer_phone)
    const [headerResult] = await pool.query(
      `INSERT INTO quotations (
          quotation_no, 
          customer_name, 
          customer_phone, 
          customer_address, 
          total_amount, 
          created_by
       ) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [quotationNo, customerName, customerPhone, customerAddress, total, userId]
    );
    const quotationId = headerResult.insertId;

    // 5. Insert รายการสินค้า (Loop)
    for (const item of cart) {
      await pool.query(
        `INSERT INTO quotation_items (quotation_id, product_id, product_name, price, quantity, total) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          quotationId, 
          item.id, 
          item.name, 
          item.price, 
          item.qty,  // จำนวนที่ลูกค้าเลือก
          item.price * item.qty // ราคารวมของรายการนั้น
        ]
      );
    }

    return NextResponse.json({ success: true, quotationId, quotationNo });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Database Error' }, { status: 500 });
  }
}