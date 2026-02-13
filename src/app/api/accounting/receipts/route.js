import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
    try {
        // ✅ ดึงใบเสร็จ + ชื่อลูกค้า (โดยเชื่อมกับตาราง invoices)
        const sql = `
            SELECT 
                r.id, 
                r.doc_number, 
                r.doc_date, 
                r.amount as grand_total, 
                'completed' as status,
                i.customer_name 
            FROM receipts r
            JOIN invoices i ON r.invoice_id = i.id
            ORDER BY r.id DESC
        `;
        
        const [rows] = await pool.query(sql);
        
        return NextResponse.json({ receipts: rows });
    } catch (error) {
        console.error("DB Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}