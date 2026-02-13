import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// PUT: อัปเดตสถานะ -> คำนวณภาษี -> สร้างใบเสร็จ
export async function PUT(request, { params }) {
    // รองรับ Next.js 15+
    const { id } = await params;
    const body = await request.json(); // รับค่า { status, wht_amount }

    console.log("Updating Invoice ID:", id, "Action:", body.status);

    if (body.status === 'paid') {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. ✅ อัปเดตสถานะในตาราง invoices เป็น 'paid'
            const [updateResult] = await connection.execute(
                'UPDATE invoices SET status = ? WHERE id = ?',
                ['paid', id]
            );

            if (updateResult.affectedRows === 0) {
                throw new Error(`Invoice ID ${id} not found`);
            }

            // 2. ✅ ดึงข้อมูล Invoice เพื่อนำไปคำนวณยอดในใบเสร็จ
            const [rows] = await connection.execute('SELECT * FROM invoices WHERE id = ?', [id]);
            const invoice = rows[0];

            if (invoice) {
                const newDocNumber = invoice.doc_number.replace('INV', 'RC');

                // คำนวณยอดเงิน (หลักบัญชี: ยอดเต็ม - หัก ณ ที่จ่าย = ยอดรับจริง)
                const totalAmount = parseFloat(invoice.grand_total);
                const whtAmount = parseFloat(body.wht_amount || 0);
                const netAmount = totalAmount - whtAmount;

                // 3. ✅ บันทึกลงตาราง receipts (เพิ่มคอลัมน์ wht_amount และ net_amount)
                await connection.execute(
                    `INSERT INTO receipts 
                    (invoice_id, doc_number, doc_date, amount, wht_amount, net_amount, payment_method, created_at) 
                    VALUES (?, ?, NOW(), ?, ?, ?, 'Transfer', NOW())`,
                    [invoice.id, newDocNumber, totalAmount, whtAmount, netAmount]
                );

                console.log(`Receipt created: ${newDocNumber} | Net: ${netAmount}`);
            }

            await connection.commit();
            return NextResponse.json({ success: true, message: "บันทึกการชำระเงินเรียบร้อย" });

        } catch (error) {
            await connection.rollback();
            console.error("Database Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } finally {
            connection.release();
        }
    }

    // กรณีสถานะอื่น เช่น ยกเลิกเอกสาร
    if (body.status === 'cancelled') {
        const connection = await pool.getConnection();
        try {
            await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', ['cancelled', id]);
            return NextResponse.json({ success: true, message: "ยกเลิกเอกสารเรียบร้อย" });
        } catch (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } finally {
            connection.release();
        }
    }

    return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
}

// GET: ดึงข้อมูลรายละเอียดเอกสาร
export async function GET(request, { params }) {
    const { id } = await params; // รองรับ Next.js 15+

    try {
        // ✅ SQL Join เพื่อดึงชื่อโครงการ p.project_name และค่า i.quantity
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

        // ✅ คำนวณหาค่าต่อหน่วยจริง (ยอดรวมหารด้วยจำนวน)
        const items = [
            {
                description: inv.project_name ? `โครงการ : ${inv.project_name}` : 'ค่าบริการ/สินค้าทั่วไป',
                quantity: inv.quantity || 1,
                // แก้ไขบรรทัดล่างนี้: เพื่อให้ราคาต่อหน่วยถูกต้อง
                unit_price: (parseFloat(inv.subtotal) / (inv.quantity || 1)),
                total: inv.subtotal
            }
        ];

        return NextResponse.json({ invoice: inv, items });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}