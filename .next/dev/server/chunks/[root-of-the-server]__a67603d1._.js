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
"[project]/src/app/api/accounting/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
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
async function GET() {
    try {
        // ------------------------------------------------------------------
        // 1. คำนวณรายรับ (Income)
        // ------------------------------------------------------------------
        // 1.1 ยอดขายจาก Orders
        let totalSales = 0;
        try {
            const [salesResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query("SELECT SUM(total_amount) as total FROM orders");
            totalSales = Number(salesResult[0].total || 0);
        } catch (e) {
            console.log("⚠️ ยังไม่มีตาราง Orders ข้ามการคำนวณส่วนนี้");
        }
        // 1.2 รายรับอื่นๆ จาก Transactions (Manual Input)
        const [otherIncomeResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query("SELECT SUM(amount) as total FROM transactions WHERE type = 'Income'");
        const totalOtherIncome = Number(otherIncomeResult[0].total || 0);
        // ✨ [เพิ่มใหม่] 1.3 รายรับจาก ใบเสร็จรับเงิน (Receipts) ที่เก็บเงินลูกค้าได้แล้ว
        let totalReceiptIncome = 0;
        try {
            const [receiptResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query("SELECT SUM(net_amount) as total FROM receipts");
            totalReceiptIncome = Number(receiptResult[0].total || 0);
        } catch (e) {
            console.log("⚠️ ยังไม่มีตาราง Receipts ข้ามการคำนวณส่วนนี้");
        }
        // ✅ รวมรายรับทั้งหมด (ขายหน้าร้าน + กรอกมือ + ใบเสร็จรับเงิน)
        const totalIncome = totalSales + totalOtherIncome + totalReceiptIncome;
        // ------------------------------------------------------------------
        // 2. คำนวณรายจ่าย (Expenses) (คงเดิม 100%)
        // ------------------------------------------------------------------
        const [poExpenseResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query("SELECT SUM(total_amount) as total FROM purchase_orders WHERE status != 'Cancelled'");
        const totalPOExpense = Number(poExpenseResult[0].total || 0);
        const [manualExpenseResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query("SELECT SUM(amount) as total FROM transactions WHERE type = 'Expense'");
        const totalManualExpense = Number(manualExpenseResult[0].total || 0);
        const totalExpenses = totalPOExpense + totalManualExpense;
        // ------------------------------------------------------------------
        // 3. กำไรสุทธิ และ ยอดรอเก็บเงิน
        // ------------------------------------------------------------------
        const netProfit = totalIncome - totalExpenses;
        // ✨ [เพิ่มใหม่] 3.1 ยอดลูกหนี้รอเก็บเงิน (Pending Invoices)
        let totalPendingIncome = 0;
        try {
            const [pendingResult] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query("SELECT SUM(grand_total) as total FROM invoices WHERE status IN ('sent', 'pending')");
            totalPendingIncome = Number(pendingResult[0].total || 0);
        } catch (e) {
            console.log("⚠️ ยังไม่มีตาราง Invoices ข้ามการคำนวณส่วนนี้");
        }
        // ------------------------------------------------------------------
        // 4. ดึงรายการเคลื่อนไหวล่าสุด (รวมของเดิม: Orders + PO + Manual)
        // ------------------------------------------------------------------
        const sqlRecent = `
      SELECT CONCAT('PO-', id) as id, po_number as ref_number, 'Expense' as type, 'จัดซื้อสินค้า' as category, total_amount as amount, CONCAT('สั่งซื้อจาก ', (SELECT name FROM suppliers WHERE id = purchase_orders.supplier_id)) as description, order_date as date FROM purchase_orders WHERE status != 'Cancelled'
      UNION ALL
      SELECT CONCAT('TX-', id) as id, '-' as ref_number, type, category, amount, description, transaction_date as date FROM transactions
      UNION ALL
      SELECT CONCAT('ORD-', id) as id, CAST(id AS CHAR) as ref_number, 'Income' as type, 'ยอดขายสินค้า' as category, total_amount as amount, CONCAT('Order ขายสินค้าให้ ', customer_name) as description, sale_date as date FROM orders
      ORDER BY date DESC LIMIT 100
    `;
        let recentTransactions = [];
        try {
            const [result] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sqlRecent);
            recentTransactions = result;
        } catch (e) {
            console.log("⚠️ Query รวมมีปัญหา -> ใช้โหมดสำรอง");
            const sqlBackup = `
            SELECT CONCAT('PO-', id) as id, po_number as ref_number, 'Expense' as type, 'จัดซื้อสินค้า' as category, total_amount as amount, CONCAT('สั่งซื้อจาก Supplier ID:', supplier_id) as description, order_date as date FROM purchase_orders WHERE status != 'Cancelled'
            UNION ALL
            SELECT CONCAT('TX-', id) as id, '-' as ref_number, type, category, amount, description, transaction_date as date FROM transactions
            ORDER BY date DESC LIMIT 100
        `;
            const [resultBackup] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sqlBackup);
            recentTransactions = resultBackup;
        }
        // ------------------------------------------------------------------
        // ✨ 5. [เพิ่มใหม่] นำรายการ ใบเสร็จ & ใบแจ้งหนี้ มาผสมกับประวัติเดิม
        // ------------------------------------------------------------------
        let newTransactions = [];
        try {
            // ดึงประวัติใบเสร็จ (รายรับ)
            const [receiptRows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(`
            SELECT r.id, r.doc_number as ref_number, 'Income' as type, 'รับชำระจากใบแจ้งหนี้' as category, r.net_amount as amount, CONCAT('รับชำระจาก: ', COALESCE(i.customer_name, 'ลูกค้า')) as description, COALESCE(r.doc_date, r.created_at) as date 
            FROM receipts r LEFT JOIN invoices i ON r.invoice_id = i.id
        `);
            newTransactions.push(...receiptRows.map((r)=>({
                    ...r,
                    id: `RC-${r.id}`
                })));
            // ดึงประวัติใบแจ้งหนี้ที่รอชำระ (Pending)
            const [invoiceRows] = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(`
            SELECT id, doc_number as ref_number, 'Pending' as type, 'ลูกหนี้รอเรียกเก็บ' as category, grand_total as amount, CONCAT('รอชำระจาก: ', customer_name) as description, COALESCE(doc_date, created_at) as date 
            FROM invoices WHERE status IN ('sent', 'pending')
        `);
            newTransactions.push(...invoiceRows.map((inv)=>({
                    ...inv,
                    id: `INV-${inv.id}`
                })));
        } catch (e) {
            console.log("⚠️ ไม่สามารถดึงประวัติ Invoices/Receipts ได้");
        }
        // นำ Array เดิม มาต่อกับ Array ใหม่ แล้วเรียงวันที่ใหม่ทั้งหมด
        let combinedTransactions = [
            ...recentTransactions,
            ...newTransactions
        ];
        combinedTransactions.sort((a, b)=>new Date(b.date) - new Date(a.date));
        combinedTransactions = combinedTransactions.slice(0, 100); // ตัดเอาแค่ 100 รายการล่าสุด เพื่อไม่ให้เว็บค้าง
        // ------------------------------------------------------------------
        // 6. ส่งข้อมูลกลับไปให้หน้า Frontend
        // ------------------------------------------------------------------
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            summary: {
                income: totalIncome,
                expenses: totalExpenses,
                profit: netProfit,
                pendingIncome: totalPendingIncome // ✅ แนบยอดรอเก็บเงินส่งไปด้วย
            },
            transactions: combinedTransactions // ✅ ใช้ชื่อ transactions เหมือนเดิม หน้าบ้านจะได้ไม่ต้องแก้เยอะ
        });
    } catch (error) {
        console.error("Accounting API Error:", error);
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
        const { type, category, amount, description } = body;
        if (!amount || !category) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'กรุณากรอกข้อมูลหมวดหมู่และจำนวนเงิน'
            }, {
                status: 400
            });
        }
        const sql = `INSERT INTO transactions (type, category, amount, description, transaction_date) VALUES (?, ?, ?, ?, NOW())`;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lib$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].query(sql, [
            type,
            category,
            amount,
            description
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'บันทึกรายการสำเร็จ'
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

//# sourceMappingURL=%5Broot-of-the-server%5D__a67603d1._.js.map