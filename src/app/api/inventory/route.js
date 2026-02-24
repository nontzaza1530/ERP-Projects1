import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

// --- GET: ดึงรายการสินค้า (กรองเฉพาะที่ยังไม่ถูกลบ) ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM products WHERE is_deleted = 0';
    const values = [];
    const conditions = [];

    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }

    if (search) {
      conditions.push('(name LIKE ? OR product_code LIKE ?)');
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      sql += ' AND ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, values);
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Fetch Inventory Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: เพิ่มสินค้าใหม่ ---
export async function POST(request) {
  try {
    const body = await request.json();

    const product_code = body.product_code || body.code;
    const name = body.name;
    const category = body.category || 'General'; 
    const quantity = body.quantity || body.stock_quantity || 0;
    const unit = body.unit || 'ชิ้น';
    const price = body.price || body.cost_price || 0;
    const location = body.location || '-';
    const min_level = body.min_level || 5;
    // ✅ 1. รับค่า source_link จากหน้าเว็บ (ถ้าไม่มีให้เป็น null)
    const source_link = body.source_link || null; 

    // 1. Validation
    if (!product_code || !name) {
      return NextResponse.json({ error: 'กรุณากรอกรหัสและชื่อสินค้า' }, { status: 400 });
    }

    // 2. เช็คสินค้าซ้ำ 
    const [existing] = await pool.query('SELECT id FROM products WHERE product_code = ? AND is_deleted = 0', [product_code]);
    if (existing.length > 0) {
        return NextResponse.json({ error: 'รหัสสินค้านี้มีอยู่ในคลังแล้ว' }, { status: 400 });
    }

    // ✅ 3. บันทึก (Insert) เพิ่มคอลัมน์ source_link เข้าไป
    const sql = `
      INSERT INTO products (product_code, name, category, quantity, unit, price, location, min_level, source_link, is_deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;
    const values = [product_code, name, category, quantity, unit, price, location, min_level, source_link];

    await pool.query(sql, values);

    return NextResponse.json({ success: true, message: 'เพิ่มสินค้าเรียบร้อยแล้ว' });

  } catch (error) {
    console.error("Inventory Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}