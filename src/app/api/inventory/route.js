import { NextResponse } from 'next/server';

// ⚠️ แก้ไข Path: ถอยหลัง 3 ชั้น เพื่อไปหา src/lib/db
// (inventory -> api -> app -> src -> เจอ lib)
import pool from '../../lib/db'; 

// --- GET: ดึงรายการสินค้า ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM products';
    const values = [];
    const conditions = [];

    // กรองตามหมวดหมู่
    if (category) {
      conditions.push('category = ?');
      values.push(category);
    }

    // ค้นหา (ชื่อ หรือ รหัส)
    if (search) {
      conditions.push('(name LIKE ? OR product_code LIKE ?)');
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY id DESC';

    const [rows] = await pool.query(sql, values);
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Fetch Inventory Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: เพิ่มสินค้าใหม่ (รองรับ Quick Add) ---
export async function POST(request) {
  try {
    const body = await request.json();

    // 🛠️ Mapping ตัวแปรให้ยืดหยุ่น (รับค่าได้ทั้งจากหน้าคลัง และหน้า Quick Add)
    const product_code = body.product_code || body.code;
    const name = body.name;
    
    // ✅ สำคัญ: ถ้าไม่ระบุหมวดหมู่ ให้เป็น 'General'
    // (ต้องมั่นใจว่าแก้ Database เป็น VARCHAR แล้วนะครับ ไม่งั้นคำว่า General จะทำให้ error)
    const category = body.category || 'General'; 
    
    const quantity = body.quantity || body.stock_quantity || 0;
    const unit = body.unit || 'ชิ้น';
    const price = body.price || body.cost_price || 0;
    const location = body.location || '-';
    const min_level = body.min_level || 5;

    // 1. Validation
    if (!product_code || !name) {
      return NextResponse.json({ error: 'กรุณากรอกรหัสและชื่อสินค้า' }, { status: 400 });
    }

    // 2. เช็คสินค้าซ้ำ
    const [existing] = await pool.query('SELECT id FROM products WHERE product_code = ?', [product_code]);
    if (existing.length > 0) {
        return NextResponse.json({ error: 'รหัสสินค้านี้มีอยู่ในระบบแล้ว' }, { status: 400 });
    }

    // 3. บันทึก (Insert)
    const sql = `
      INSERT INTO products (product_code, name, category, quantity, unit, price, location, min_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [product_code, name, category, quantity, unit, price, location, min_level];

    await pool.query(sql, values);

    return NextResponse.json({ success: true, message: 'เพิ่มสินค้าเรียบร้อยแล้ว' });

  } catch (error) {
    console.error("Inventory Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}