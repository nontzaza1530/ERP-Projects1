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
"[project]/src/app/api/purchasing/pr/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../../lib/db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
async function GET() {
    try {
        // ดึงรายการ PR พร้อมนับจำนวนรายการสินค้าในบิลนั้นๆ
        const sql = `
            SELECT 
                pr.*,
                (SELECT COUNT(*) FROM purchase_request_items WHERE pr_id = pr.id) as item_count
            FROM purchase_requests pr
            ORDER BY pr.created_at DESC
        `;
        const [rows] = await pool.query(sql);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows);
    } catch (error) {
        console.error("Fetch PR Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const { request_date, remarks, items, user_id } = body;
        // 1. เจนเลขที่เอกสาร PR-yyyyMM-xxxx
        const datePart = new Date(request_date).toISOString().slice(0, 7).replace('-', '');
        const [lastPr] = await pool.query(`SELECT pr_number FROM purchase_requests WHERE pr_number LIKE 'PR-${datePart}-%' ORDER BY id DESC LIMIT 1`);
        let runNumber = 1;
        if (lastPr.length > 0) {
            const lastRun = parseInt(lastPr[0].pr_number.split('-')[2]);
            runNumber = lastRun + 1;
        }
        const prNumber = `PR-${datePart}-${String(runNumber).padStart(4, '0')}`;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        // 2. บันทึกหัวเอกสาร
        const [resHeader] = await connection.query(`INSERT INTO purchase_requests (pr_number, request_date, requester_id, remarks, status) 
             VALUES (?, ?, ?, ?, 'Pending')`, [
            prNumber,
            request_date,
            user_id || 1,
            remarks || null
        ]);
        const prId = resHeader.insertId;
        // 3. บันทึกรายการสินค้า (บันทึกแค่ ID สินค้า และ จำนวน)
        for (const item of items){
            await connection.query(`INSERT INTO purchase_request_items (pr_id, product_id, quantity) 
                 VALUES (?, ?, ?)`, [
                prId,
                item.product_id,
                item.qty
            ]);
        }
        await connection.commit();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            prNumber,
            message: 'บันทึกใบขอซื้อสำเร็จ'
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Create PR Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    } finally{
        if (connection) connection.release();
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__070a8561._.js.map