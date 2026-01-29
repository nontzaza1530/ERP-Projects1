import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

// บังคับให้โหลดใหม่เสมอ ไม่ให้จำค่าเก่า (Prevent Cache)
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // คำสั่ง SQL: ดึงใบสั่งซื้อ + ชื่อคนขาย + จำนวนรายการสินค้า
    const sql = `
      SELECT 
        po.id,
        po.po_number,
        po.order_date,
        po.total_amount,
        po.status,
        s.name AS supplier_name,
        s.code AS supplier_code,
        (SELECT COUNT(*) FROM purchase_order_items WHERE po_id = po.id) as item_count
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id 
      ORDER BY po.id DESC
    `;
    
    const [rows] = await pool.query(sql);
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Fetch PO List Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}