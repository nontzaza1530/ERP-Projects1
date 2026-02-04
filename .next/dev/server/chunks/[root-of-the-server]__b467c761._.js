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
"[project]/src/app/api/employees/[id]/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
// ตรวจสอบ path ให้ถูกต้อง (ถอยหลัง 4 ขั้น: api -> employees -> [id] -> app -> src -> lib)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lib/db.js [app-route] (ecmascript)");
;
;
async function GET(request, { params }) {
    try {
        const { id } = params; // id ในที่นี้คือ emp_code (จาก URL)
        if (!id) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'ไม่พบ ID'
        }, {
            status: 400
        });
        const sql = 'SELECT * FROM employees WHERE emp_code = ?';
        const [rows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, [
            id
        ]);
        if (rows.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'ไม่พบข้อมูลพนักงาน'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(rows[0]);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    }
}
async function PUT(request, { params }) {
    const connection = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getConnection(); // ✅ ใช้ connection เพื่อทำ Transaction
    try {
        const { id } = params; // id = emp_code ตัวเก่า (จาก URL)
        const body = await request.json();
        const { emp_code, first_name, last_name, email, phone, birth_date, address, position, role_id, role_name, departments_id, departments_name, salary, status } = body;
        await connection.beginTransaction(); // 🏁 เริ่มต้น Transaction
        // ⚠️ 1. เช็คก่อนว่า "รหัสพนักงานใหม่" ซ้ำกับคนอื่นไหม? (ถ้ามีการเปลี่ยนรหัส)
        if (emp_code && emp_code !== id) {
            const [duplicateCheck] = await connection.query(`SELECT emp_code FROM employees WHERE emp_code = ?`, [
                emp_code
            ]);
            if (duplicateCheck.length > 0) {
                throw new Error(`รหัสพนักงาน ${emp_code} มีอยู่ในระบบแล้ว กรุณาใช้รหัสอื่น`);
            }
        }
        // 2. อัปเดตข้อมูลลงตาราง employees
        // หมายเหตุ: การแก้ emp_code ตรงนี้ ถ้า DB ตั้ง ON UPDATE CASCADE ไว้ ตารางอื่นจะเปลี่ยนตามเอง
        const sqlUpdateEmp = `
      UPDATE employees 
      SET 
        emp_code = ?, 
        first_name = ?, last_name = ?, email = ?, 
        phone = ?, birth_date = ?, address = ?, 
        position = ?, role_id = ?, role_name = ?, 
        departments_id = ?, departments_name = ?, 
        salary = ?, status = ?
      WHERE emp_code = ?
    `;
        const values = [
            emp_code || id,
            first_name,
            last_name,
            email,
            phone || null,
            birth_date || null,
            address || null,
            position,
            role_id,
            role_name,
            departments_id,
            departments_name,
            salary || 0,
            status,
            id // WHERE emp_code = ตัวเก่า
        ];
        await connection.query(sqlUpdateEmp, values);
        // 3. Logic จัดการสถานะ User (อัปเดต user ให้เชื่อมกับรหัสพนักงานใหม่ด้วย)
        if (email) {
            // เตรียม Role สำหรับ Table Users
            const userRole = (role_name || '').toLowerCase().replace(/ /g, '_') || 'employee';
            if (status === 'resigned') {
                await connection.query("UPDATE users SET role = 'resigned' WHERE email = ?", [
                    email
                ]);
            } else {
                // อัปเดตข้อมูลในตาราง users ให้ตรงกัน (สำคัญมากถ้ารหัสพนักงานเปลี่ยน)
                await connection.query("UPDATE users SET role = ?, role_id = ?, department_id = ?, employee_id = ? WHERE email = ?", [
                    userRole,
                    role_id,
                    departments_id,
                    emp_code || id,
                    email
                ]);
            }
        }
        await connection.commit(); // ✅ ยืนยันการบันทึก
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'อัปเดตข้อมูลเรียบร้อยแล้ว'
        });
    } catch (error) {
        await connection.rollback(); // ❌ ยกเลิกทั้งหมดถ้ามี Error
        console.error("Update Error:", error);
        // ส่ง status 400 ถ้าเป็น User Error (เช่น รหัสซ้ำ) หรือ 500 ถ้าเป็น Server Error
        const status = error.message.includes('มีอยู่ในระบบแล้ว') ? 400 : 500;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: status
        });
    } finally{
        connection.release(); // คืน connection
    }
}
async function DELETE(request, { params }) {
    const { id } = params;
    const connection = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getConnection();
    try {
        await connection.beginTransaction();
        // ลบ User ที่ผูกกับพนักงานคนนี้
        await connection.query("DELETE FROM users WHERE employee_id = ?", [
            id
        ]);
        // ลบประวัติการเข้างาน (ถ้าต้องการลบ)
        await connection.query("DELETE FROM attendance WHERE emp_code = ?", [
            id
        ]);
        // ลบพนักงาน
        const [result] = await connection.query("DELETE FROM employees WHERE emp_code = ?", [
            id
        ]);
        await connection.commit();
        if (result.affectedRows === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'ไม่พบข้อมูลพนักงาน'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'ลบข้อมูลสำเร็จ'
        });
    } catch (error) {
        await connection.rollback();
        console.error("Delete Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message
        }, {
            status: 500
        });
    } finally{
        connection.release();
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b467c761._.js.map