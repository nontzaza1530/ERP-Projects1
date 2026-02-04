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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs) <export promises as fsp>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fsp",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["promises"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
}),
"[project]/src/lib/minio.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BUCKET_NAME",
    ()=>BUCKET_NAME,
    "minioClient",
    ()=>minioClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$minio$2f$dist$2f$esm$2f$minio$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/minio/dist/esm/minio.mjs [app-route] (ecmascript) <locals>");
;
const minioClient = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$minio$2f$dist$2f$esm$2f$minio$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Client"]({
    endPoint: '192.168.1.76',
    port: 9000,
    useSSL: false,
    accessKey: 'smartg',
    secretKey: 'StrongPass123!' // ⚠️ เช็ค Password ที่คุณใช้ login
});
const BUCKET_NAME = 'erp'; // ชื่อ Bucket ตามรูปของคุณ
}),
"[project]/src/app/api/accounting/reimbursement/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$minio$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/minio.js [app-route] (ecmascript)");
;
;
;
// ⚙️ ตั้งค่า MinIO (เช็ค IP และ Port ให้ตรงกับเครื่องคุณ)
const MINIO_SERVER_IP = 'smartg.trueddns.com';
const MINIO_API_PORT = '29454';
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;
        // ✅ SQL ขั้นเทพ: ดึงใบเบิก + ชื่อ User + ข้อมูลพนักงาน (รหัส, ชื่อจริง, ตำแหน่ง)
        const sqlData = `
            SELECT r.*, 
                -- ดึงรหัสพนักงาน (emp_code) มาด้วย
                e.emp_code,
                -- สร้างชื่อผู้เบิก: ถ้ามีชื่อจริงให้ใช้ชื่อจริง ถ้าไม่มีให้ใช้ username
                COALESCE(CONCAT(e.first_name, ' ', e.last_name), u.username) as requester_name,
                -- ดึงตำแหน่ง
                e.position,
                -- ดึง Role จาก User
                u.role
            FROM reimbursements r
            LEFT JOIN users u ON r.user_id = u.id              -- 1. เชื่อมไปหา Users (เพื่อเอา employee_id)
            LEFT JOIN employees e ON u.employee_id = e.emp_code -- 2. เชื่อมไปหา Employees (เพื่อเอาชื่อจริง)
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const sqlCount = `SELECT COUNT(*) as total FROM reimbursements`;
        const [rows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sqlData, [
            limit,
            offset
        ]);
        const [countResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sqlCount);
        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: rows,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error("GET Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const amount = formData.get('amount');
        const expense_date = formData.get('date');
        const description = formData.get('description') || '';
        // ✅ รับไฟล์ทั้งหมดมาเป็น Array
        const files = formData.getAll('files');
        const userId = formData.get('userId') || '34';
        const fileUrls = [];
        // ✅ วนลูปอัปโหลดทีละไฟล์
        if (files && files.length > 0) {
            for (const file of files){
                if (file.size > 0) {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    // ตั้งชื่อไฟล์ (เติมเลขสุ่มนิดหน่อยกันชื่อซ้ำในเสี้ยววินาที)
                    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.name}`;
                    const metaData = {
                        'Content-Type': file.type
                    };
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$minio$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["minioClient"].putObject(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$minio$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BUCKET_NAME"], fileName, buffer, file.size, metaData);
                    const url = `http://${MINIO_SERVER_IP}:${MINIO_API_PORT}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$minio$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BUCKET_NAME"]}/${fileName}`;
                    fileUrls.push(url);
                }
            }
        }
        const sql = `
            INSERT INTO reimbursements 
            (user_id, title, amount, expense_date, description, slip_images, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
        `;
        // ✅ แปลง Array ของ URL เป็น JSON String (เช่น '["url1", "url2"]')
        const slipImagesJson = JSON.stringify(fileUrls);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, [
            userId,
            title,
            amount,
            expense_date,
            description,
            slipImagesJson
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'บันทึกสำเร็จ'
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { id, status, reject_reason } = body;
        if (!id || !status) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Data missing'
        }, {
            status: 400
        });
        const sql = `UPDATE reimbursements SET status = ?, reject_reason = ?, approved_at = NOW() WHERE id = ?`;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, [
            status,
            reject_reason || null,
            id
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'Updated successfully'
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c30dcc50._.js.map