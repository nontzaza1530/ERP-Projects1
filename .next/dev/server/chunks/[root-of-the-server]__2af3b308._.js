module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/accounting/receipts/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request, { params }) {
    const { id } = params;
    // --- จำลองข้อมูล (Mock Data) ---
    // ในอนาคตคุณค่อยเปลี่ยนตรงนี้เป็นการดึงจาก Database จริง (เช่น Prisma, MySQL)
    // 1. จำลองหัวบิล (Receipt Info)
    const receipt = {
        id: id,
        doc_number: `RC-202402-${id.padStart(3, '0')}`,
        ref_doc_number: `INV-202402-${id.padStart(3, '0')}`,
        doc_date: new Date().toISOString(),
        due_date: new Date().toISOString(),
        customer_name: "บริษัท ลูกค้าตัวอย่าง จำกัด (มหาชน)",
        customer_address: "99/9 ชั้น 30 อาคารตัวอย่าง ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
        customer_tax_id: "0105551234567",
        subtotal: 0,
        vat_amount: 0,
        grand_total: 0
    };
    // 2. จำลองรายการสินค้า (Items) - สร้างมา 15 รายการ เพื่อเทสแบ่งหน้า
    const items = Array.from({
        length: 15
    }, (_, i)=>({
            description: `ค่าบริการทำระบบ งวดที่ ${i + 1} (Service Fee)`,
            quantity: 1,
            unit_price: 5000.00,
            total: 5000.00
        }));
    // 3. คำนวณยอดเงินรวม (ให้สมจริง)
    const subtotal = items.reduce((sum, item)=>sum + item.total, 0);
    const vat = subtotal * 0.07;
    const grandTotal = subtotal + vat;
    // อัปเดตยอดเงินกลับเข้าไปใน object
    receipt.subtotal = subtotal;
    receipt.vat_amount = vat;
    receipt.grand_total = grandTotal;
    // --- ส่งข้อมูลกลับไปที่ Frontend ---
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        receipt: receipt,
        items: items
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2af3b308._.js.map