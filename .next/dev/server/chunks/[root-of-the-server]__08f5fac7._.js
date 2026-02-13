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
"[project]/src/app/api/accounting/invoices/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function PUT(request, { params }) {
    // ⚠️ แก้ไขจุดสำคัญ: ใส่ await params สำหรับ Next.js 15+
    const { id } = await params;
    const body = await request.json(); // รับค่า { status: 'paid' }
    console.log("Updating Invoice ID:", id, "Status:", body.status); // เช็ค Log ใน Terminal
    if (body.status === 'paid') {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // 1. ✅ อัปเดตสถานะในตาราง invoices
            const [updateResult] = await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', [
                'paid',
                id
            ]);
            // เช็คว่าอัปเดตเจอไหม
            if (updateResult.affectedRows === 0) {
                throw new Error(`Invoice ID ${id} not found`);
            }
            // 2. ✅ ดึงข้อมูล Invoice ใบนั้นออกมา
            const [rows] = await connection.execute('SELECT * FROM invoices WHERE id = ?', [
                id
            ]);
            const invoice = rows[0];
            if (invoice) {
                // สร้างเลขที่ใบเสร็จ (เปลี่ยน INV เป็น RC)
                const newDocNumber = invoice.doc_number.replace('INV', 'RC');
                // 3. ✅ สร้างใบเสร็จลงตาราง receipts
                await connection.execute(`INSERT INTO receipts 
                    (invoice_id, doc_number, doc_date, amount, payment_method, created_at) 
                    VALUES (?, ?, NOW(), ?, 'Transfer', NOW())`, [
                    invoice.id,
                    newDocNumber,
                    invoice.grand_total
                ]);
                console.log("Receipt created for Invoice:", invoice.doc_number);
            }
            await connection.commit();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "บันทึกการชำระเงินเรียบร้อย"
            });
        } catch (error) {
            await connection.rollback();
            console.error("Database Error:", error); // ดู Error ใน Terminal ถ้ามีปัญหา
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        } finally{
            connection.release();
        }
    }
    // กรณีสถานะอื่น (เช่น Cancelled)
    if (body.status === 'cancelled') {
        const connection = await pool.getConnection();
        try {
            await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', [
                'cancelled',
                id
            ]);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "ยกเลิกเอกสารเรียบร้อย"
            });
        } catch (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 500
            });
        } finally{
            connection.release();
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Invalid Action"
    }, {
        status: 400
    });
}
async function GET(request, { params }) {
    // ⚠️ แก้ไขจุดสำคัญ: ใส่ await params เช่นกัน
    const { id } = await params;
    try {
        const [rows] = await pool.query('SELECT * FROM invoices WHERE id = ?', [
            id
        ]);
        if (rows.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Not found"
        }, {
            status: 404
        });
        // จำลองรายการสินค้า
        const items = [
            {
                description: 'ค่าบริการ (Service)',
                quantity: 1,
                unit_price: rows[0].grand_total,
                total: rows[0].grand_total
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            invoice: rows[0],
            items
        });
    } catch (error) {
        console.error("GET Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08f5fac7._.js.map