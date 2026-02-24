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
        s.branch as supplier_branch, 
        s.fax as supplier_fax,      
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
            -- ✅ แก้ไข: ให้เช็คชื่อจากคลังก่อน ถ้าไม่มีให้เอา custom_item_name มาโชว์
            COALESCE(p.name, poi.custom_item_name, 'สินค้า (ไม่ระบุชื่อ)') as product_name,
            COALESCE(p.product_code, '-') as product_code, 
            COALESCE(p.unit, 'ชิ้น') as unit
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

export async function PUT(request, { params }) {
    let connection;
    try {
        const { id } = await params;
        const body = await request.json();
        
        const { supplier_id, order_date, expected_date, items, total_amount, remarks, shipping_address } = body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // อัปเดตข้อมูลหัวบิล PO
        const updateHeaderSql = `
            UPDATE purchase_orders 
            SET supplier_id = ?, order_date = ?, expected_date = ?, total_amount = ?, remarks = ?, shipping_address = ?
            WHERE id = ?
        `;
        await connection.query(updateHeaderSql, [
            supplier_id, 
            order_date, 
            expected_date, 
            total_amount, 
            remarks || null, 
            shipping_address || 'สำนักงานใหญ่ (HQ)', 
            id
        ]);

        // ลบรายการสินค้าของเก่าทิ้งทั้งหมด
        await connection.query(`DELETE FROM purchase_order_items WHERE po_id = ?`, [id]);

        // ✅ Insert รายการสินค้าชุดใหม่เข้าไป (เพิ่มการรองรับ custom_item_name)
        for (const item of items) {
            // เช็คว่าถ้าไม่ได้เลือกของจากคลัง (เป็นพิมพ์เอง) ให้ส่ง product_id เป็น null
            const pId = item.product_id || null;
            // ดักรับค่าชื่อสินค้าพิมพ์เอง (รองรับทั้ง key: custom_item_name และ custom_name)
            const customName = item.custom_item_name || item.custom_name || null;

            await connection.query(
                `INSERT INTO purchase_order_items (po_id, product_id, custom_item_name, quantity, unit_price, total_price) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [id, pId, customName, item.qty, item.price, (item.qty * item.price)]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true, message: 'อัปเดตสำเร็จ' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Update PO Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}