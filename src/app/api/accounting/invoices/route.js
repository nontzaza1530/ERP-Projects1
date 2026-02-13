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

// 🟢 1. ดึงข้อมูลใบแจ้งหนี้ทั้งหมด (GET) - เอาไปโชว์ในหน้ารายการ
export async function GET(request) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // ดึงข้อมูล invoices และ join กับ projects เพื่อเอาชื่อโปรเจกต์ (ถ้ามี)
        // เรียงจากใบใหม่สุดไปเก่าสุด
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

// 🔵 2. สร้างใบแจ้งหนี้ใหม่ (POST) - รับค่าจากฟอร์มบันทึกลง DB
export async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { 
            project_id, 
            customer_name, 
            customer_address, 
            customer_tax_id, 
            items, // Array รายการสินค้า
            due_date,
            doc_date 
        } = body;

        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction(); // เริ่ม Transaction (ต้องสำเร็จทุกขั้นตอน ไม่งั้นยกเลิกหมด)

        // --- A. ระบบรันเลขเอกสารอัตโนมัติ (INV-YYYYMM-XXX) ---
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const prefix = `INV-${year}${month}-`;

        // หาเลขล่าสุดของเดือนนี้
        const [lastInvoice] = await connection.execute(
            `SELECT doc_number FROM invoices WHERE doc_number LIKE ? ORDER BY id DESC LIMIT 1`,
            [`${prefix}%`]
        );

        let newDocNumber;
        if (lastInvoice.length > 0) {
            const lastNo = lastInvoice[0].doc_number; 
            const runningNo = parseInt(lastNo.split('-')[2]) + 1; 
            newDocNumber = `${prefix}${String(runningNo).padStart(3, '0')}`;
        } else {
            newDocNumber = `${prefix}001`; // ใบแรกของเดือน
        }

        // --- B. คำนวณยอดเงิน ---
        let subtotal = 0;
        items.forEach(item => {
            subtotal += (parseFloat(item.quantity) * parseFloat(item.unit_price));
        });
        const vatRate = 7;
        const vatAmount = subtotal * (vatRate / 100);
        const grandTotal = subtotal + vatAmount;

        // --- C. บันทึกหัวบิล (invoices) ---
        const [result] = await connection.execute(
            `INSERT INTO invoices 
            (project_id, doc_number, doc_date, due_date, customer_name, customer_address, customer_tax_id, subtotal, vat_amount, grand_total, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent')`,
            [project_id || null, newDocNumber, doc_date, due_date, customer_name, customer_address, customer_tax_id, subtotal, vatAmount, grandTotal]
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

        await connection.commit(); // ✅ บันทึกสำเร็จ
        await connection.end();

        return NextResponse.json({ success: true, doc_number: newDocNumber });

    } catch (error) {
        if (connection) await connection.rollback(); // ❌ ย้อนกลับถ้าพัง
        console.error("CREATE INVOICE ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}