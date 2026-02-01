(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__bd1f2d1c._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/middleware.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/webapi/jwt/verify.js [middleware-edge] (ecmascript)");
;
;
async function middleware(request) {
    const token = request.cookies.get('token')?.value;
    const path = request.nextUrl.pathname;
    // --- 1. เช็คพื้นฐาน: มี Token หรือไม่? ---
    // กรณี A: ไม่มี Token และพยายามเข้าหน้าข้างใน -> ดีดไป Login
    if (!token && path !== '/login') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
    }
    // กรณี B: มี Token แล้ว แต่พยายามเข้าหน้า Login -> ดีดไป Dashboard
    if (token && path === '/login') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/Dashboard', request.url));
    }
    // กรณี C: เข้าหน้าแรกสุด (/) -> ดีดไป Dashboard
    if (path === '/') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/Dashboard', request.url));
    }
    // --- 2. เช็คขั้นสูง: ตรวจสอบสิทธิ์ (Role) ---
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$webapi$2f$jwt$2f$verify$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["jwtVerify"])(token, secret);
            const role = payload.role?.toLowerCase(); // แปลงเป็นตัวเล็กกันเหนียว
            // ==========================================
            // 🚫 โซนกำหนดกฎเหล็ก (Access Rules)
            // ==========================================
            // กฎที่ 1: หน้าบัญชี (Accounting)
            if (path.startsWith('/accounting')) {
                // ✅ ข้อยกเว้น: ถ้าจะไปหน้า "ขอเบิกเงิน" (/accounting/reimbursement) -> ให้ผ่านได้ทุกคน!
                const isReimbursement = path.startsWith('/accounting/reimbursement');
                if (!isReimbursement) {
                    // ถ้าไม่ใช่หน้าเบิกเงิน (เช่นจะไปดูงบการเงิน) -> ต้องเป็น Admin เท่านั้น
                    if (role !== 'super_admin' && role !== 'admin') {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].rewrite(new URL('/unauthorized', request.url));
                    }
                }
            }
            // กฎที่ 3: หน้าคลังสินค้า (Inventory) -> ห้าม Employee
            if (path.startsWith('/inventory') && role === 'employee') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/Dashboard', request.url));
            }
            // กฎที่ 4: หน้าการขาย (Sales) -> ห้าม Employee (ถ้าต้องการ)
            if (path.startsWith('/sales') && role === 'employee') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/Dashboard', request.url));
            }
        } catch (error) {
            // ❌ Token มีปัญหา -> ให้ Login ใหม่
            const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }
    // ✅ ผ่านทุกด่าน -> ปล่อยผ่าน
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/',
        '/login',
        '/Dashboard/:path*',
        '/accounting/:path*',
        '/hr/:path*',
        '/inventory/:path*',
        '/sales/:path*',
        '/attendance/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__bd1f2d1c._.js.map