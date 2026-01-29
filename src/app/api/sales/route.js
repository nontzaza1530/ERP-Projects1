import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

// --- GET: ดึงประวัติการขายล่าสุด ---
export async function GET() {
  try {
    // ✅ เพิ่ม customer_phone ในการดึงข้อมูลด้วย เผื่อเอาไปโชว์ในหน้าประวัติ
    const sql = `
      SELECT id, customer_name, customer_phone, total_amount, payment_method, created_at 
      FROM orders 
      ORDER BY id DESC 
      LIMIT 50
    `;
    const [rows] = await pool.query(sql);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: บันทึกการขาย และ ตัดสต็อก ---
export async function POST(request) {
  const connection = await pool.getConnection(); 
  try {
    const body = await request.json();
    
    // ✅ 1. รับค่า customer_phone เพิ่มเข้ามาจากหน้าบ้าน (Frontend)
    const { customer_name, customer_phone, customer_address, cart, total_amount, payment_method } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!cart || cart.length === 0) {
        return NextResponse.json({ error: 'ตะกร้าสินค้าว่างเปล่า' }, { status: 400 });
    }

    await connection.beginTransaction();

    // ✅ 2. เพิ่ม customer_phone ลงในคำสั่ง SQL (ถ้าไม่มีให้ใส่ขีด '-')
    const [orderResult] = await connection.query(
      'INSERT INTO orders (customer_name, customer_phone, customer_address, total_amount, payment_method) VALUES (?, ?, ?, ?, ?)',
      [
        customer_name || 'ลูกค้าทั่วไป', 
        customer_phone || '-',   // ✅ จุดที่เพิ่ม: บันทึกเบอร์โทร
        customer_address || '', 
        total_amount, 
        payment_method
      ]
    );
    const orderId = orderResult.insertId;

    for (const item of cart) {
      // 3. เช็คสต็อกล่าสุด (ล็อกแถวข้อมูลป้องกันการแย่งกันตัดสต็อก)
      const [productCheck] = await connection.query(
        'SELECT quantity FROM products WHERE id = ? FOR UPDATE', 
        [item.id]
      );
      
      const currentStock = productCheck[0]?.quantity || 0;

      if (productCheck.length === 0 || currentStock < item.qty) {
        throw new Error(`สินค้า "${item.name}" มีของไม่พอ (เหลือ ${currentStock})`);
      }

      // 4. ตัดสต็อก
      await connection.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.qty, item.id]
      );

      // 5. บันทึกรายการสินค้าลง order_items
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price_per_unit) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.qty, item.price]
      );
    }

    await connection.commit();
    
    return NextResponse.json({ 
        success: true, 
        message: 'บันทึกการขายสำเร็จ',
        orderId: orderId 
    });

  } catch (error) {
    await connection.rollback();
    console.error("Sale Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}