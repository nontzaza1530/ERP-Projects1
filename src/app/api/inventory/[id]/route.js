import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// --- PUT: แก้ไขข้อมูลสินค้า ---
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { product_code, name, category, quantity, unit, price, location, min_level } = body;

    const sql = `
      UPDATE products 
      SET product_code=?, name=?, category=?, quantity=?, unit=?, price=?, location=?, min_level=?
      WHERE id=?
    `;
    const values = [product_code, name, category, quantity, unit, price, location, min_level, id];

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });

    return NextResponse.json({ message: 'แก้ไขข้อมูลสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: ลบสินค้า ---
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 404 });

    return NextResponse.json({ message: 'ลบสินค้าสำเร็จ' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}