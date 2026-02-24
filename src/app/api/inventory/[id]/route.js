import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// --- PUT: แก้ไขข้อมูลสินค้า ---
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // ✅ 1. ดึงค่า source_link เพิ่มเติมจาก body
    const { product_code, name, category, quantity, unit, price, location, min_level, source_link } = body;

    // ตรวจสอบค่าเบื้องต้น (Validation)
    if (!product_code || !name) {
      return NextResponse.json({ error: 'กรุณาระบุรหัสและชื่อสินค้า' }, { status: 400 });
    }

    // ✅ 2. เพิ่ม source_link=? ในคำสั่ง UPDATE
    const sql = `
      UPDATE products 
      SET product_code=?, name=?, category=?, quantity=?, unit=?, price=?, location=?, min_level=?, source_link=?
      WHERE id=?
    `;
    // ✅ 3. ใส่ตัวแปร source_link ลงใน array ลำดับให้ตรงกับ SQL
    const values = [product_code, name, category, quantity, unit, price, location, min_level, source_link, id];

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'ไม่พบรหัสสินค้าที่ต้องการแก้ไข' }, { status: 404 });
    }

    return NextResponse.json({ message: 'แก้ไขข้อมูลสินค้าสำเร็จ' });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + error.message }, { status: 500 });
  }
}

// --- DELETE: เปลี่ยนจากลบจริง เป็น Soft Delete ---
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const sql = `UPDATE products SET is_deleted = 1 WHERE id = ?`;
    
    const [result] = await pool.query(sql, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'ไม่พบสินค้าในระบบ' }, { status: 404 });
    }

    return NextResponse.json({ message: 'ลบสินค้าสำเร็จ (ซ่อนรายการเรียบร้อย)' });

  } catch (error) {
    console.error("❌ Soft Delete Error:", error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด: ' + error.message }, { status: 500 });
  }
}