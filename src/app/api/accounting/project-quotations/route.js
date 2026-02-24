import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// 🌟 เพิ่มบรรทัดนี้เข้าไป เพื่อปิดระบบ Cache ให้ดึงข้อมูลใหม่แบบ Real-time เสมอ
export const dynamic = 'force-dynamic'; 

// 🟢 ดึงข้อมูลรายการใบเสนอราคาทั้งหมด
export async function GET(request) {
    try {
        const [rows] = await pool.query(`
            SELECT * FROM project_quotations 
            ORDER BY created_at DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Fetch Quotations Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 🔵 สร้างใบเสนอราคาใหม่
export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const { 
            quotation_type, customer_name, customer_address, contact_person, phone, 
            project_name, issue_date, valid_until, billing_date, total_amount, remarks, items 
        } = body;

        // สร้างเลขที่เอกสาร รันนิ่งอัตโนมัติ (เช่น QT-202602-0001)
        const datePart = new Date(issue_date).toISOString().slice(0, 7).replace('-', ''); 
        const [lastQt] = await pool.query(`SELECT quotation_number FROM project_quotations WHERE quotation_number LIKE 'QT-${datePart}-%' ORDER BY id DESC LIMIT 1`);
        
        let runNumber = 1;
        if (lastQt.length > 0) {
            const lastRun = parseInt(lastQt[0].quotation_number.split('-')[2]);
            runNumber = lastRun + 1;
        }
        const qtNumber = `QT-${datePart}-${String(runNumber).padStart(4, '0')}`;

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // บันทึกข้อมูลส่วนหัว
        const [resHeader] = await connection.query(
            `INSERT INTO project_quotations 
            (quotation_number, quotation_type, customer_name, customer_address, contact_person, phone, project_name, issue_date, valid_until, billing_date, total_amount, remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [qtNumber, quotation_type, customer_name, customer_address, contact_person, phone, project_name, issue_date, valid_until, billing_date || null, total_amount, remarks]
        );
        const qtId = resHeader.insertId;

        // บันทึกรายการงาน
        for (const item of items) {
            await connection.query(
                `INSERT INTO project_quotation_items (project_quotation_id, description, quantity, unit, unit_price, total_price) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [qtId, item.description, item.qty, item.unit, item.price, (item.qty * item.price)]
            );
        }

        await connection.commit();
        return NextResponse.json({ success: true, qtNumber, message: 'บันทึกสำเร็จ' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Create Quotation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}