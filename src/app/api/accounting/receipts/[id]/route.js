import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = params;

    // --- จำลองข้อมูล (Mock Data) ---
    // ในอนาคตคุณค่อยเปลี่ยนตรงนี้เป็นการดึงจาก Database จริง (เช่น Prisma, MySQL)
    
    // 1. จำลองหัวบิล (Receipt Info)
    const receipt = {
        id: id,
        doc_number: `RC-202402-${id.padStart(3, '0')}`, // รันเลขตาม ID
        ref_doc_number: `INV-202402-${id.padStart(3, '0')}`, // อ้างอิงใบแจ้งหนี้
        doc_date: new Date().toISOString(),
        due_date: new Date().toISOString(),
        customer_name: "บริษัท ลูกค้าตัวอย่าง จำกัด (มหาชน)",
        customer_address: "99/9 ชั้น 30 อาคารตัวอย่าง ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
        customer_tax_id: "0105551234567",
        subtotal: 0, // เดี๋ยวคำนวณใหม่ข้างล่าง
        vat_amount: 0,
        grand_total: 0,
    };

    // 2. จำลองรายการสินค้า (Items) - สร้างมา 15 รายการ เพื่อเทสแบ่งหน้า
    const items = Array.from({ length: 15 }, (_, i) => ({
        description: `ค่าบริการทำระบบ งวดที่ ${i + 1} (Service Fee)`,
        quantity: 1,
        unit_price: 5000.00,
        total: 5000.00
    }));

    // 3. คำนวณยอดเงินรวม (ให้สมจริง)
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * 0.07;
    const grandTotal = subtotal + vat;

    // อัปเดตยอดเงินกลับเข้าไปใน object
    receipt.subtotal = subtotal;
    receipt.vat_amount = vat;
    receipt.grand_total = grandTotal;

    // --- ส่งข้อมูลกลับไปที่ Frontend ---
    return NextResponse.json({
        receipt: receipt,
        items: items
    });
}