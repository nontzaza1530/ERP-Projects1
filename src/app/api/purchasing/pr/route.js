import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
    try {
        const sql = `
            SELECT pr.*, (SELECT COUNT(*) FROM purchase_request_items WHERE pr_id = pr.id) as item_count
            FROM purchase_requests pr ORDER BY pr.created_at DESC
        `;
        const [rows] = await pool.query(sql);
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        // ✅ รับค่าใหม่ 4 ตัว
        const { request_date, remarks, items, user_id, project_name, suggested_vendor, vendor_contact, required_date } = body;

        const datePart = new Date(request_date).toISOString().slice(0, 7).replace('-', '');
        const [lastPr] = await pool.query(`SELECT pr_number FROM purchase_requests WHERE pr_number LIKE 'PR-${datePart}-%' ORDER BY id DESC LIMIT 1`);
        
        let runNumber = 1;
        if (lastPr.length > 0) runNumber = parseInt(lastPr[0].pr_number.split('-')[2]) + 1;
        const prNumber = `PR-${datePart}-${String(runNumber).padStart(4, '0')}`;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // ✅ บันทึกค่าใหม่ลง Database
        const [resHeader] = await connection.query(
            `INSERT INTO purchase_requests (pr_number, request_date, requester_id, remarks, status, project_name, suggested_vendor, vendor_contact, required_date) 
             VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`,
            [prNumber, request_date, user_id || 1, remarks || null, project_name || null, suggested_vendor || null, vendor_contact || null, required_date || null]
        );
        const prId = resHeader.insertId;

        for (const item of items) {
            const pId = item.product_id === 'custom' ? null : item.product_id;
            const customName = item.product_id === 'custom' ? item.custom_name : null;
            await connection.query(
                `INSERT INTO purchase_request_items (pr_id, product_id, custom_item_name, quantity) VALUES (?, ?, ?, ?)`,
                [prId, pId, customName, item.qty]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true, prNumber, message: 'บันทึกสำเร็จ' });
    } catch (error) {
        if (connection) await connection.rollback();
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}