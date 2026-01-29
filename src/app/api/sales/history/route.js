import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// --- GET: ดึงประวัติการขาย/ใบเสนอราคา ---
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'quotation'; 
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const showArchived = searchParams.get('archived') === 'true'; 

  try {
    // 1. เลือกตาราง
    let table = type === 'order' ? 'orders' : 'quotations';
    
    // ✅ แก้จุดนี้: เลือกชื่อคอลัมน์วันที่ให้ถูกตามตาราง
    // ถ้าเป็น orders ใช้ 'sale_date' (หรือชื่อที่คุณตั้งไว้), ถ้าเป็น quotations ใช้ 'created_at'
    let dateField = type === 'order' ? 'sale_date' : 'created_at'; 
    
    // ตรวจสอบนิดนึงว่าใน DB orders ของคุณใช้ชื่ออะไรแน่ ถ้าไม่ใช่ sale_date ให้แก้ตรงนี้ครับ
    
    let sql = `SELECT * FROM ${table} WHERE 1=1`;
    const params = [];

    // 2. กรองวันที่
    if (start) {
      sql += ` AND DATE(${dateField}) >= ?`;
      params.push(start);
    }
    if (end) {
      sql += ` AND DATE(${dateField}) <= ?`;
      params.push(end);
    }

    // 3. กรองสถานะ
    if (showArchived) {
        sql += ` AND status = 'archived'`;
    } else {
        sql += ` AND (status != 'archived' OR status IS NULL)`;
    }

    // เรียงจากใหม่ไปเก่า
    sql += ` ORDER BY ${dateField} DESC LIMIT 100`;

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PATCH: อัปเดตสถานะ (จัดเก็บ, กู้คืน, หรือ ขายแล้ว) ---
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, type, action } = body; 
        // action จะมี 3 แบบ: 'archive' | 'restore' | 'ordered'

        const table = type === 'order' ? 'orders' : 'quotations';
        
        let newStatus = 'active';

        // ✅ กำหนดสถานะตาม Action ที่ส่งมา
        if (action === 'archive') {
            newStatus = 'archived'; // ลงถังขยะ
        } else if (action === 'restore') {
            newStatus = 'active';   // กู้คืน
        } else if (action === 'ordered') {
            newStatus = 'ordered';  // ✅ ขายแล้ว (เปลี่ยนจากใบเสนอราคาเป็นบิล)
        }

        await pool.query(
            `UPDATE ${table} SET status = ? WHERE id = ?`, 
            [newStatus, id]
        );
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: 'Update Failed' }, { status: 500 });
    }
}