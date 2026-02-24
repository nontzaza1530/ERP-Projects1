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
"[project]/src/app/api/accounting/project-quotations/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@lib/db'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const dynamic = 'force-dynamic';
async function GET(request, { params }) {
    try {
        const { id } = params;
        // ดึงหัวเอกสาร
        const [headers] = await pool.query(`SELECT * FROM project_quotations WHERE id = ?`, [
            id
        ]);
        if (headers.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'ไม่พบเอกสาร'
        }, {
            status: 404
        });
        // ดึงรายการงาน
        const [items] = await pool.query(`SELECT * FROM project_quotation_items WHERE project_quotation_id = ?`, [
            id
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...headers[0],
            items
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(request, { params }) {
    let connection;
    try {
        const { id } = params;
        const body = await request.json();
        const { quotation_type, customer_name, customer_address, contact_person, phone, project_name, issue_date, valid_until, billing_date, total_amount, remarks, items } = body;
        connection = await pool.getConnection();
        await connection.beginTransaction();
        // 1. อัปเดตข้อมูลส่วนหัว
        await connection.query(`UPDATE project_quotations 
             SET quotation_type=?, customer_name=?, customer_address=?, contact_person=?, phone=?, 
                 project_name=?, issue_date=?, valid_until=?, billing_date=?, total_amount=?, remarks=?
             WHERE id=?`, [
            quotation_type,
            customer_name,
            customer_address,
            contact_person,
            phone,
            project_name,
            issue_date,
            valid_until,
            billing_date || null,
            total_amount,
            remarks,
            id
        ]);
        // 2. ลบรายการงานเดิมทิ้งทั้งหมด (ป้องกันข้อมูลซ้ำซ้อน)
        await connection.query(`DELETE FROM project_quotation_items WHERE project_quotation_id = ?`, [
            id
        ]);
        // 3. Insert รายการงานที่แก้ไขใหม่เข้าไป
        for (const item of items){
            await connection.query(`INSERT INTO project_quotation_items (project_quotation_id, description, quantity, unit, unit_price, total_price) 
                 VALUES (?, ?, ?, ?, ?, ?)`, [
                id,
                item.description,
                item.qty || item.quantity,
                item.unit,
                item.price || item.unit_price,
                (item.qty || item.quantity) * (item.price || item.unit_price)
            ]);
        }
        await connection.commit();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'อัปเดตข้อมูลสำเร็จ'
        });
    } catch (error) {
        if (connection) await connection.rollback();
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

//# sourceMappingURL=%5Broot-of-the-server%5D__9c36a2ae._.js.map