import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export const dynamic = 'force-dynamic';

// 🟢 ดึงข้อมูลใบเสนอราคา 1 ใบ
export async function GET(request, context) {
    try {
        // 🌟 อัปเกรด: ใส่ await รองรับ Next.js เวอร์ชั่นใหม่
        const params = await context.params;
        const id = params.id;

        console.log("===================================");
        console.log("👉 1. มีคนกดแก้ไข เข้ามาขอข้อมูล ID:", id); 

        const [headers] = await pool.query(`SELECT * FROM project_quotations WHERE id = ?`, [id]);
        
        console.log("👉 2. เจอข้อมูลใน DB ไหม?:", headers.length > 0 ? "✅ เจอ!" : "❌ ไม่เจอ!");
        console.log("===================================");

        if (headers.length === 0) {
            return NextResponse.json({ error: 'ไม่พบเอกสาร' }, { status: 404 });
        }

        const [items] = await pool.query(`SELECT * FROM project_quotation_items WHERE project_quotation_id = ?`, [id]);

        return NextResponse.json({ ...headers[0], items });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 🔵 อัปเดตข้อมูลใบเสนอราคา
export async function PUT(request, context) {
    let connection;
    try {
        const params = await context.params;
        const id = params.id;
        
        const body = await request.json();
        const { 
            quotation_type, customer_name, customer_address, contact_person, phone, 
            project_name, issue_date, valid_until, billing_date, total_amount, remarks, items 
        } = body;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query(
            `UPDATE project_quotations 
             SET quotation_type=?, customer_name=?, customer_address=?, contact_person=?, phone=?, 
                 project_name=?, issue_date=?, valid_until=?, billing_date=?, total_amount=?, remarks=?
             WHERE id=?`,
            [quotation_type, customer_name, customer_address, contact_person, phone, project_name, issue_date, valid_until, billing_date || null, total_amount, remarks, id]
        );

        await connection.query(`DELETE FROM project_quotation_items WHERE project_quotation_id = ?`, [id]);

        for (const item of items) {
            await connection.query(
                `INSERT INTO project_quotation_items (project_quotation_id, description, quantity, unit, unit_price, total_price) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [id, item.description, item.qty || item.quantity, item.unit, item.price || item.unit_price, ((item.qty || item.quantity) * (item.price || item.unit_price))]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });

    } catch (error) {
        if (connection) await connection.rollback();
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}