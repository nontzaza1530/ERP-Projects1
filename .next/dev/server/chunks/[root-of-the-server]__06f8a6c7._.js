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
"[project]/src/app/api/sales/history/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'quotation';
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const showArchived = searchParams.get('archived') === 'true';
    try {
        // 1. เลือกตาราง
        let table = type === 'order' ? 'orders' : 'quotations';
        // ✅ แก้จุดนี้: เลือกชื่อคอลัมน์วันที่ให้ถูกตามตาราง
        // ถ้าเป็น orders ใช้ 'sale_date' (หรือชื่อที่คุณตั้งไว้), ถ้าเป็น quotations ใช้ 'created_at'
        let dateField = type === 'order' ? 'sale_date' : 'created_at';
        // ตรวจสอบนิดนึงว่าใน DB orders ของคุณใช้ชื่ออะไรแน่ ถ้าไม่ใช่ sale_date ให้แก้ตรงนี้ครับ
        let sql = `SELECT * FROM ${table} WHERE 1=1`;
        const params = [];
        // 2. กรองวันที่
        if (start) {
            sql += ` AND DATE(${dateField}) >= ?`;
            params.push(start);
        }
        if (end) {
            sql += ` AND DATE(${dateField}) <= ?`;
            params.push(end);
        }
        // 3. กรองสถานะ
        if (showArchived) {
            sql += ` AND status = 'archived'`;
        } else {
            sql += ` AND (status != 'archived' OR status IS NULL)`;
        }
        // เรียงจากใหม่ไปเก่า
        sql += ` ORDER BY ${dateField} DESC LIMIT 100`;
        const [rows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, params);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, type, action } = body;
        // action จะมี 3 แบบ: 'archive' | 'restore' | 'ordered'
        const table = type === 'order' ? 'orders' : 'quotations';
        let newStatus = 'active';
        // ✅ กำหนดสถานะตาม Action ที่ส่งมา
        if (action === 'archive') {
            newStatus = 'archived'; // ลงถังขยะ
        } else if (action === 'restore') {
            newStatus = 'active'; // กู้คืน
        } else if (action === 'ordered') {
            newStatus = 'ordered'; // ✅ ขายแล้ว (เปลี่ยนจากใบเสนอราคาเป็นบิล)
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(`UPDATE ${table} SET status = ? WHERE id = ?`, [
            newStatus,
            id
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error("Update Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Update Failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06f8a6c7._.js.map