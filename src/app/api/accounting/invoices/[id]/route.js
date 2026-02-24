import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// 🟠 PUT: อัปเดตข้อมูล (รองรับทั้งการ 'เปลี่ยนสถานะ' และ 'แก้ไขข้อมูลทั้งบิล')
export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json(); 

    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();

        // ==========================================
        // 1️⃣ กรณี: อัปเดตสถานะเป็น "ชำระเงินแล้ว (paid)"
        // ==========================================
        if (body.status === 'paid') {
            console.log("Updating Invoice ID:", id, "Action: paid");
            
            const [updateResult] = await connection.execute(
                'UPDATE invoices SET status = ? WHERE id = ?',
                ['paid', id]
            );

            if (updateResult.affectedRows === 0) throw new Error(`Invoice ID ${id} not found`);

            // ดึงข้อมูลมาเพื่อสร้างใบเสร็จรับเงิน
            const [rows] = await connection.execute('SELECT * FROM invoices WHERE id = ?', [id]);
            const invoice = rows[0];

            if (invoice) {
                const newDocNumber = invoice.doc_number.replace('INV', 'RC');
                const totalAmount = parseFloat(invoice.grand_total);
                const whtAmount = parseFloat(body.wht_amount || invoice.wht_amount || 0); // ดึงจากหน้าจอหรือจากบิลเดิม
                const netAmount = totalAmount - whtAmount;

                await connection.execute(
                    `INSERT INTO receipts 
                    (invoice_id, doc_number, doc_date, amount, wht_amount, net_amount, payment_method, created_at) 
                    VALUES (?, ?, NOW(), ?, ?, ?, 'Transfer', NOW())`,
                    [invoice.id, newDocNumber, totalAmount, whtAmount, netAmount]
                );
                console.log(`Receipt created: ${newDocNumber} | Net: ${netAmount}`);
            }
        } 
        // ==========================================
        // 2️⃣ กรณี: อัปเดตสถานะเป็น "ยกเลิกเอกสาร (cancelled)"
        // ==========================================
        else if (body.status === 'cancelled') {
            console.log("Updating Invoice ID:", id, "Action: cancelled");
            await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', ['cancelled', id]);
        } 
        // ==========================================
        // 3️⃣ กรณี: แก้ไขข้อมูลใบแจ้งหนี้แบบเต็ม (จากหน้า Edit Invoice)
        // ==========================================
        else if (body.items && Array.isArray(body.items)) {
            console.log("Updating Full Invoice ID:", id);
            
            const { 
                project_id, customer_name, customer_address, customer_tax_id, 
                due_date, doc_date, subtotal, vat_rate, vat_amount, 
                grand_total, wht_rate, wht_amount, items 
            } = body;

            const projectQuantity = items.length > 0 ? items[0].quantity : 1;

            // 3.1 อัปเดตข้อมูลหัวบิล (invoices)
            await connection.execute(
                `UPDATE invoices SET 
                    project_id = ?, customer_name = ?, customer_address = ?, customer_tax_id = ?, 
                    doc_date = ?, due_date = ?, quantity = ?, 
                    subtotal = ?, vat_rate = ?, vat_amount = ?, grand_total = ?, 
                    wht_rate = ?, wht_amount = ?
                WHERE id = ?`,
                [
                    project_id || null, customer_name, customer_address, customer_tax_id,
                    doc_date, due_date, projectQuantity,
                    subtotal, vat_rate || 0, vat_amount || 0, grand_total,
                    wht_rate || 0, wht_amount || 0,
                    id
                ]
            );

            // 3.2 อัปเดตรายการสินค้า: ลบของเก่าทิ้งทั้งหมด แล้ว Insert ของใหม่เข้าไป (ปลอดภัยที่สุด)
            await connection.execute(`DELETE FROM invoice_items WHERE invoice_id = ?`, [id]);

            for (const item of items) {
                await connection.execute(
                    `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [id, item.description, item.quantity, item.unit_price, (item.quantity * item.unit_price)]
                );
            }
        } 
        else {
            throw new Error("Invalid Update Request (No status or items provided)");
        }

        // ถ้าผ่านทั้งหมดโดยไม่ Error ค่อย Commit ลง Database
        await connection.commit();
        return NextResponse.json({ success: true, message: "อัปเดตข้อมูลเรียบร้อย" });

    } catch (error) {
        // ถ้าเกิด Error ให้ Rollback ย้อนข้อมูลกลับเหมือนไม่มีอะไรเกิดขึ้น
        await connection.rollback();
        console.error("PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        connection.release();
    }
}

// 🟢 GET: ดึงข้อมูลรายละเอียดเอกสาร (โค้ดเดิมของคุณ ถูกต้อง 100% แล้วครับ)
export async function GET(request, { params }) {
    const { id } = await params; 

    try {
        const sql = `
            SELECT 
                i.*, 
                p.project_name 
            FROM invoices i
            LEFT JOIN projects p ON i.project_id = p.id
            WHERE i.id = ?
        `;
        const [rows] = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "ไม่พบข้อมูลใบแจ้งหนี้" }, { status: 404 });
        }

        const inv = rows[0];

        const [itemRows] = await pool.query('SELECT * FROM invoice_items WHERE invoice_id = ?', [id]);

        let items = [];
        if (itemRows.length > 0) {
            items = itemRows.map(row => ({
                description: row.description,
                quantity: row.quantity,
                unit_price: row.unit_price,
                total: row.total
            }));
        } else {
            // Fallback (เผื่อบิลเก่าที่สร้างก่อนแก้โค้ด)
            items = [
                {
                    description: inv.project_name ? `โครงการ : ${inv.project_name}` : 'ค่าบริการ/สินค้าทั่วไป',
                    quantity: inv.quantity || 1,
                    unit_price: (parseFloat(inv.subtotal) / (inv.quantity || 1)),
                    total: inv.subtotal
                }
            ];
        }

        return NextResponse.json({ invoice: inv, items });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}