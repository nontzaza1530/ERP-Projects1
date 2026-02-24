import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; 

export async function POST(request) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: "ไม่พบรหัสเอกสาร" }, { status: 400 });
        }

        // อัปเดตสถานะเป็น Cancelled แทนการลบทิ้ง
        await pool.query(
            `UPDATE purchase_requests SET status = 'Cancelled' WHERE id = ?`,
            [id]
        );

        return NextResponse.json({ success: true, message: 'ยกเลิกใบขอซื้อสำเร็จ' });

    } catch (error) {
        console.error("Cancel PR Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}