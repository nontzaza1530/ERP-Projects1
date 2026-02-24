import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function GET(request, { params }) {
    let connection;
    try {
        const { id } = await params;
        connection = await pool.getConnection();
        const [prHeaders] = await connection.query(`SELECT pr.*, e.first_name, e.last_name FROM purchase_requests pr LEFT JOIN employees e ON pr.requester_id = e.emp_code WHERE pr.id = ?`, [id]);
        if (prHeaders.length === 0) return NextResponse.json({ error: "ไม่พบข้อมูลใบขอซื้อ" }, { status: 404 });
        const [prItems] = await connection.query(`SELECT pri.*, p.name as product_name, p.product_code FROM purchase_request_items pri LEFT JOIN products p ON pri.product_id = p.id WHERE pri.pr_id = ?`, [id]);
        return NextResponse.json({ header: prHeaders[0], items: prItems });
    } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); } 
    finally { if (connection) connection.release(); }
}

export async function PUT(request, { params }) {
    let connection;
    try {
        const { id } = await params;
        const body = await request.json();
        // ✅ รับค่าใหม่ตอนอัปเดต
        const { request_date, remarks, items, project_name, suggested_vendor, vendor_contact, required_date } = body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // ✅ อัปเดตข้อมูลหัวเอกสารใหม่
        await connection.query(
            `UPDATE purchase_requests SET request_date=?, remarks=?, project_name=?, suggested_vendor=?, vendor_contact=?, required_date=? WHERE id=?`,
            [request_date, remarks || null, project_name || null, suggested_vendor || null, vendor_contact || null, required_date || null, id]
        );

        await connection.query(`DELETE FROM purchase_request_items WHERE pr_id = ?`, [id]);
        for (const item of items) {
            const pId = item.product_id === 'custom' ? null : item.product_id;
            const customName = item.product_id === 'custom' ? item.custom_name : null;
            await connection.query(
                `INSERT INTO purchase_request_items (pr_id, product_id, custom_item_name, quantity) VALUES (?, ?, ?, ?)`,
                [id, pId, customName, item.qty]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true, message: 'อัปเดตสำเร็จ' });
    } catch (error) {
        if (connection) await connection.rollback();
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally { if (connection) connection.release(); }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await pool.query(`DELETE FROM purchase_request_items WHERE pr_id = ?`, [id]);
        await pool.query(`DELETE FROM purchase_requests WHERE id = ?`, [id]);
        return NextResponse.json({ success: true, message: 'ลบสำเร็จ' });
    } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}