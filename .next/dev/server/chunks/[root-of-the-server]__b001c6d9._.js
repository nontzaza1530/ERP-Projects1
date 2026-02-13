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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/src/app/api/accounting/invoices/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
;
// Config ฐานข้อมูล
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'erp_project',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    connectTimeout: 10000
};
async function GET(request) {
    let connection;
    try {
        connection = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createConnection(dbConfig);
        // ดึงข้อมูล invoices และ join กับ projects เพื่อเอาชื่อโปรเจกต์ (ถ้ามี)
        // เรียงจากใบใหม่สุดไปเก่าสุด
        const [rows] = await connection.execute(`
            SELECT invoices.*, projects.project_name 
            FROM invoices 
            LEFT JOIN projects ON invoices.project_id = projects.id 
            ORDER BY invoices.id DESC
        `);
        await connection.end();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            invoices: rows
        });
    } catch (error) {
        console.error("GET INVOICES ERROR:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    let connection;
    try {
        const body = await req.json();
        const { project_id, customer_name, customer_address, customer_tax_id, items, due_date, doc_date } = body;
        connection = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createConnection(dbConfig);
        await connection.beginTransaction(); // เริ่ม Transaction (ต้องสำเร็จทุกขั้นตอน ไม่งั้นยกเลิกหมด)
        // --- A. ระบบรันเลขเอกสารอัตโนมัติ (INV-YYYYMM-XXX) ---
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const prefix = `INV-${year}${month}-`;
        // หาเลขล่าสุดของเดือนนี้
        const [lastInvoice] = await connection.execute(`SELECT doc_number FROM invoices WHERE doc_number LIKE ? ORDER BY id DESC LIMIT 1`, [
            `${prefix}%`
        ]);
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
        items.forEach((item)=>{
            subtotal += parseFloat(item.quantity) * parseFloat(item.unit_price);
        });
        const vatRate = 7;
        const vatAmount = subtotal * (vatRate / 100);
        const grandTotal = subtotal + vatAmount;
        // --- C. บันทึกหัวบิล (invoices) ---
        const [result] = await connection.execute(`INSERT INTO invoices 
            (project_id, doc_number, doc_date, due_date, customer_name, customer_address, customer_tax_id, subtotal, vat_amount, grand_total, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent')`, [
            project_id || null,
            newDocNumber,
            doc_date,
            due_date,
            customer_name,
            customer_address,
            customer_tax_id,
            subtotal,
            vatAmount,
            grandTotal
        ]);
        const invoiceId = result.insertId;
        // --- D. บันทึกรายการสินค้า (invoice_items) ---
        for (const item of items){
            await connection.execute(`INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) 
                 VALUES (?, ?, ?, ?, ?)`, [
                invoiceId,
                item.description,
                item.quantity,
                item.unit_price,
                item.quantity * item.unit_price
            ]);
        }
        await connection.commit(); // ✅ บันทึกสำเร็จ
        await connection.end();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            doc_number: newDocNumber
        });
    } catch (error) {
        if (connection) await connection.rollback(); // ❌ ย้อนกลับถ้าพัง
        console.error("CREATE INVOICE ERROR:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b001c6d9._.js.map