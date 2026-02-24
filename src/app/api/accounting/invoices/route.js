import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Config ฐานข้อมูล
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_project',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    connectTimeout: 10000
};

// 🟢 1. ดึงข้อมูลใบแจ้งหนี้ทั้งหมด (GET)
export async function GET(request) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT invoices.*, projects.project_name 
            FROM invoices 
            LEFT JOIN projects ON invoices.project_id = projects.id 
            ORDER BY invoices.id DESC
        `);
        await connection.end();
        return NextResponse.json({ invoices: rows });
    } catch (error) {
        console.error("GET INVOICES ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 🔵 2. สร้างใบแจ้งหนี้ใหม่ (POST) - ✅ แก้ไข Logic การคำนวณแบบโปรเจกต์
// 🔵 2. สร้างใบแจ้งหนี้ใหม่ (POST)
export async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { 
            project_id, 
            customer_name, 
            customer_address, 
            customer_tax_id, 
            items, 
            due_date,
            doc_date,
            // ✅ รับค่าภาษีที่ส่งมาจากหน้าบ้าน
            subtotal,
            vat_rate,
            vat_amount,
            grand_total,
            wht_rate,
            wht_amount
        } = body;

        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const prefix = `INV-${year}${month}-`;

        const [lastInvoice] = await connection.execute(
            `SELECT doc_number FROM invoices WHERE doc_number LIKE ? ORDER BY id DESC LIMIT 1`,
            [`${prefix}%`]
        );

        let newDocNumber = lastInvoice.length > 0 
            ? `${prefix}${String(parseInt(lastInvoice[0].doc_number.split('-')[2]) + 1).padStart(3, '0')}`
            : `${prefix}001`;

        const projectQuantity = items.length > 0 ? items[0].quantity : 1;

        // --- C. บันทึกหัวบิล (invoices) ---
        // ✅ เพิ่มการบันทึก vat_rate, wht_rate, wht_amount ลงตาราง
        const [result] = await connection.execute(
            `INSERT INTO invoices 
            (project_id, doc_number, doc_date, due_date, customer_name, customer_address, customer_tax_id, quantity, subtotal, vat_rate, vat_amount, grand_total, wht_rate, wht_amount, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent')`,
            [
                project_id || null, 
                newDocNumber, 
                doc_date, 
                due_date, 
                customer_name, 
                customer_address, 
                customer_tax_id, 
                projectQuantity, 
                subtotal, 
                vat_rate || 0,     // บันทึกเรท VAT
                vat_amount, 
                grand_total,
                wht_rate || 0,     // บันทึกเรท WHT
                wht_amount || 0    // บันทึกยอด WHT
            ]
        );

        const invoiceId = result.insertId;

        // --- D. บันทึกรายการสินค้า (invoice_items) ---
        for (const item of items) {
            await connection.execute(
                `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) 
                 VALUES (?, ?, ?, ?, ?)`,
                [invoiceId, item.description, item.quantity, item.unit_price, (item.quantity * item.unit_price)]
            );
        }

        await connection.commit();
        await connection.end();

        return NextResponse.json({ success: true, doc_number: newDocNumber });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("CREATE INVOICE ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}