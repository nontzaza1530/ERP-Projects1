import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function GET(request, { params }) {
  try {
    const { id } = await params; 

    // -------------------------------------------------------------------
    // ส่วนที่ 1: ดึงหัวบิล (PO Header) + รายละเอียด Supplier
    // -------------------------------------------------------------------
    const sqlPO = `
      SELECT 
        po.*, 
        s.name as supplier_name, 
        s.phone as supplier_phone, 
        s.email as supplier_email,
        s.contact_name as contact_person,
        s.tax_id as supplier_tax_id,
        s.address as s_addr,
        s.sub_district as s_sub_district,
        s.district as s_district,
        s.province as s_province,
        s.zipcode as s_zipcode
      FROM purchase_orders po
      LEFT JOIN suppliers s ON po.supplier_id = s.id
      WHERE po.id = ?
    `;
    const [poRows] = await pool.query(sqlPO, [id]);

    if (poRows.length === 0) return NextResponse.json({ error: 'ไม่พบ PO' }, { status: 404 });
    
    const poData = poRows[0];

    // สร้าง "ที่อยู่เต็ม"
    const fullAddress = [
        poData.s_addr, 
        (poData.s_sub_district ? `ต.${poData.s_sub_district}` : null),
        (poData.s_district ? `อ.${poData.s_district}` : null),
        (poData.s_province ? `จ.${poData.s_province}` : null),
        poData.s_zipcode
    ].filter(Boolean).join(' ');

    poData.supplier_full_address = fullAddress || poData.s_addr || '-'; 

    // -------------------------------------------------------------------
    // ส่วนที่ 2: ดึงรายการสินค้า (Items)
    // -------------------------------------------------------------------
    const sqlItems = `
        SELECT 
            poi.*, 
            COALESCE(p.name, 'สินค้า (ไม่ระบุชื่อ)') as product_name,
            
            -- ✅ แก้ไขให้ตรงกับตาราง Products ของคุณ
            COALESCE(p.product_code, '-') as product_code, 
            
            COALESCE(p.unit, 'หน่วย') as unit
        FROM purchase_order_items poi
        LEFT JOIN products p ON poi.product_id = p.id
        WHERE poi.po_id = ?
    `;
    const [items] = await pool.query(sqlItems, [id]);

    return NextResponse.json({ 
        ...poData, 
        items: items 
    });

  } catch (error) {
    console.error("🔥 API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}