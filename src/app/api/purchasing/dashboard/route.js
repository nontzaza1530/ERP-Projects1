import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    // 1. ดึงยอดรวมต่างๆ (แยกประเภท)
    const sqlStats = `
      SELECT 
        -- 1. ยอดซื้อสำเร็จ (ของมาแล้ว = เสียเงินแน่ๆ)
        SUM(CASE WHEN status = 'Received' THEN total_amount ELSE 0 END) as actual_spend,

        -- 2. ยอดรอรับของ (สั่งไปแล้ว = ภาระผูกพันล่วงหน้า)
        SUM(CASE WHEN status IN ('Pending', 'Partially Received') THEN total_amount ELSE 0 END) as pending_spend,

        -- 3. จำนวนใบ PO และ รายการค้าง
        COUNT(*) as total_po,
        SUM(CASE WHEN status NOT IN ('Received', 'Cancelled') THEN 1 ELSE 0 END) as pending_count
      FROM purchase_orders
    `;
    const [statsRows] = await pool.query(sqlStats);
    const stats = statsRows[0];

    // 2. ข้อมูลกราฟ (เหมือนเดิม)
    const sqlChart = `
      SELECT status, COUNT(*) as count 
      FROM purchase_orders 
      GROUP BY status
    `;
    const [chartData] = await pool.query(sqlChart);

    // 3. รายการล่าสุด (เหมือนเดิม)
    const sqlRecent = `
      SELECT po.id, po.po_number, po.order_date, s.name as supplier_name, po.total_amount, po.status
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      ORDER BY po.id DESC
      LIMIT 5
    `;
    const [recentPOs] = await pool.query(sqlRecent);

    return NextResponse.json({
      summary: {
        actual_spend: stats.actual_spend || 0,   // ✅ ยอดจริง
        pending_spend: stats.pending_spend || 0, // ✅ ยอดรอ
        total_po: stats.total_po || 0,
        pending_count: stats.pending_count || 0
      },
      chart: chartData,
      recent: recentPOs
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}