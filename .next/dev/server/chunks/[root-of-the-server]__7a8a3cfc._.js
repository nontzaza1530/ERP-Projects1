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
"[project]/src/app/api/inventory/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.js [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        // ✅ แก้ไข: เริ่มต้นด้วยการกรองเฉพาะ is_deleted = 0
        let sql = 'SELECT * FROM products WHERE is_deleted = 0';
        const values = [];
        const conditions = [];
        // กรองตามหมวดหมู่
        if (category) {
            conditions.push('category = ?');
            values.push(category);
        }
        // ค้นหา (ชื่อ หรือ รหัส)
        if (search) {
            conditions.push('(name LIKE ? OR product_code LIKE ?)');
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern);
        }
        // ถ้ามีการส่ง filter มา ให้ใช้ AND ต่อจาก WHERE is_deleted = 0
        if (conditions.length > 0) {
            sql += ' AND ' + conditions.join(' AND ');
        }
        sql += ' ORDER BY id DESC';
        const [rows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, values);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows);
    } catch (error) {
        console.error("Fetch Inventory Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const product_code = body.product_code || body.code;
        const name = body.name;
        const category = body.category || 'General';
        const quantity = body.quantity || body.stock_quantity || 0;
        const unit = body.unit || 'ชิ้น';
        const price = body.price || body.cost_price || 0;
        const location = body.location || '-';
        const min_level = body.min_level || 5;
        // 1. Validation
        if (!product_code || !name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'กรุณากรอกรหัสและชื่อสินค้า'
            }, {
                status: 400
            });
        }
        // 2. เช็คสินค้าซ้ำ (เช็คเฉพาะสินค้าที่ยังไม่ถูกลบ เพื่อให้สามารถนำรหัสสินค้าเก่าที่ลบไปแล้วกลับมาใช้ใหม่ได้ ถ้าต้องการ)
        const [existing] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query('SELECT id FROM products WHERE product_code = ? AND is_deleted = 0', [
            product_code
        ]);
        if (existing.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'รหัสสินค้านี้มีอยู่ในคลังแล้ว'
            }, {
                status: 400
            });
        }
        // 3. บันทึก (Insert) พร้อมกำหนด is_deleted = 0
        const sql = `
      INSERT INTO products (product_code, name, category, quantity, unit, price, location, min_level, is_deleted)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;
        const values = [
            product_code,
            name,
            category,
            quantity,
            unit,
            price,
            location,
            min_level
        ];
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, values);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'เพิ่มสินค้าเรียบร้อยแล้ว'
        });
    } catch (error) {
        console.error("Inventory Database Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7a8a3cfc._.js.map