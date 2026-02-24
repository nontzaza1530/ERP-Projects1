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
"[project]/src/app/lib/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 30,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
};
// --- เทคนิค Singleton ---
// เช็คว่ามี pool อยู่ในตัวแปร Global หรือยัง? ถ้ามีแล้วให้ใช้ตัวเดิม
// ถ้าไม่มี ให้สร้างใหม่ (ป้องกันการสร้างซ้ำตอน Hot Reload)
let pool;
// 🔥 ทีเด็ด 2: Singleton Pattern
// เช็คก่อนว่า "เคยสร้างท่อเชื่อมต่อไว้หรือยัง?"
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    // ถ้าอยู่เครื่องเรา (Dev) ให้ฝากตัวแปรไว้ที่ Global
    // ต่อให้แก้โค้ดแล้ว Save ใหม่ Next.js รีโหลด ก็จะกลับมาใช้ท่อเดิม ไม่สร้างท่อใหม่ซ้อนทับกัน
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.mysqlPool) {
        /*TURBOPACK member replacement*/ __turbopack_context__.g.mysqlPool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool(dbConfig);
    }
    pool = /*TURBOPACK member replacement*/ __turbopack_context__.g.mysqlPool;
}
const __TURBOPACK__default__export__ = pool;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.js [app-route] (ecmascript)");
;
;
async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    const connection = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getConnection();
    try {
        await connection.beginTransaction();
        // ==========================================
        // 1️⃣ กรณี: อัปเดตสถานะเป็น "ชำระเงินแล้ว (paid)"
        // ==========================================
        if (body.status === 'paid') {
            console.log("Updating Invoice ID:", id, "Action: paid");
            const [updateResult] = await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', [
                'paid',
                id
            ]);
            if (updateResult.affectedRows === 0) throw new Error(`Invoice ID ${id} not found`);
            // ดึงข้อมูลมาเพื่อสร้างใบเสร็จรับเงิน
            const [rows] = await connection.execute('SELECT * FROM invoices WHERE id = ?', [
                id
            ]);
            const invoice = rows[0];
            if (invoice) {
                const newDocNumber = invoice.doc_number.replace('INV', 'RC');
                const totalAmount = parseFloat(invoice.grand_total);
                const whtAmount = parseFloat(body.wht_amount || invoice.wht_amount || 0); // ดึงจากหน้าจอหรือจากบิลเดิม
                const netAmount = totalAmount - whtAmount;
                await connection.execute(`INSERT INTO receipts 
                    (invoice_id, doc_number, doc_date, amount, wht_amount, net_amount, payment_method, created_at) 
                    VALUES (?, ?, NOW(), ?, ?, ?, 'Transfer', NOW())`, [
                    invoice.id,
                    newDocNumber,
                    totalAmount,
                    whtAmount,
                    netAmount
                ]);
                console.log(`Receipt created: ${newDocNumber} | Net: ${netAmount}`);
            }
        } else if (body.status === 'cancelled') {
            console.log("Updating Invoice ID:", id, "Action: cancelled");
            await connection.execute('UPDATE invoices SET status = ? WHERE id = ?', [
                'cancelled',
                id
            ]);
        } else if (body.items && Array.isArray(body.items)) {
            console.log("Updating Full Invoice ID:", id);
            const { project_id, customer_name, customer_address, customer_tax_id, due_date, doc_date, subtotal, vat_rate, vat_amount, grand_total, wht_rate, wht_amount, items } = body;
            const projectQuantity = items.length > 0 ? items[0].quantity : 1;
            // 3.1 อัปเดตข้อมูลหัวบิล (invoices)
            await connection.execute(`UPDATE invoices SET 
                    project_id = ?, customer_name = ?, customer_address = ?, customer_tax_id = ?, 
                    doc_date = ?, due_date = ?, quantity = ?, 
                    subtotal = ?, vat_rate = ?, vat_amount = ?, grand_total = ?, 
                    wht_rate = ?, wht_amount = ?
                WHERE id = ?`, [
                project_id || null,
                customer_name,
                customer_address,
                customer_tax_id,
                doc_date,
                due_date,
                projectQuantity,
                subtotal,
                vat_rate || 0,
                vat_amount || 0,
                grand_total,
                wht_rate || 0,
                wht_amount || 0,
                id
            ]);
            // 3.2 อัปเดตรายการสินค้า: ลบของเก่าทิ้งทั้งหมด แล้ว Insert ของใหม่เข้าไป (ปลอดภัยที่สุด)
            await connection.execute(`DELETE FROM invoice_items WHERE invoice_id = ?`, [
                id
            ]);
            for (const item of items){
                await connection.execute(`INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) 
                     VALUES (?, ?, ?, ?, ?)`, [
                    id,
                    item.description,
                    item.quantity,
                    item.unit_price,
                    item.quantity * item.unit_price
                ]);
            }
        } else {
            throw new Error("Invalid Update Request (No status or items provided)");
        }
        // ถ้าผ่านทั้งหมดโดยไม่ Error ค่อย Commit ลง Database
        await connection.commit();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "อัปเดตข้อมูลเรียบร้อย"
        });
    } catch (error) {
        // ถ้าเกิด Error ให้ Rollback ย้อนข้อมูลกลับเหมือนไม่มีอะไรเกิดขึ้น
        await connection.rollback();
        console.error("PUT Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    } finally{
        connection.release();
    }
}
async function GET(request, { params }) {
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
        const [rows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, [
            id
        ]);
        if (rows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "ไม่พบข้อมูลใบแจ้งหนี้"
            }, {
                status: 404
            });
        }
        const inv = rows[0];
        const [itemRows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query('SELECT * FROM invoice_items WHERE invoice_id = ?', [
            id
        ]);
        let items = [];
        if (itemRows.length > 0) {
            items = itemRows.map((row)=>({
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
                    unit_price: parseFloat(inv.subtotal) / (inv.quantity || 1),
                    total: inv.subtotal
                }
            ];
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            invoice: inv,
            items
        });
    } catch (error) {
        console.error("Database Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__27b93500._.js.map