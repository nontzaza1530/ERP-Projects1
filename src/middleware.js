import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // --- 1. เช็คพื้นฐาน: มี Token หรือไม่? ---

  // กรณี A: ไม่มี Token และพยายามเข้าหน้าข้างใน -> ดีดไป Login
  if (!token && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // กรณี B: มี Token แล้ว แต่พยายามเข้าหน้า Login -> ดีดไป Dashboard
  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/Dashboard', request.url));
  }

  // กรณี C: เข้าหน้าแรกสุด (/) -> ดีดไป Dashboard
  if (path === '/') {
    return NextResponse.redirect(new URL('/Dashboard', request.url));
  }

  // --- 2. เช็คขั้นสูง: ตรวจสอบสิทธิ์ (Role) ---
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
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
                return NextResponse.rewrite(new URL('/unauthorized', request.url));
             }
         }
      }

      // กฎที่ 3: หน้าคลังสินค้า (Inventory) -> ห้าม Employee
      if (path.startsWith('/inventory') && role === 'employee') {
         return NextResponse.redirect(new URL('/Dashboard', request.url));
      }
      
      // กฎที่ 4: หน้าการขาย (Sales) -> ห้าม Employee (ถ้าต้องการ)
      if (path.startsWith('/sales') && role === 'employee') {
         return NextResponse.redirect(new URL('/Dashboard', request.url));
      }

    } catch (error) {
      // ❌ Token มีปัญหา -> ให้ Login ใหม่
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // ✅ ผ่านทุกด่าน -> ปล่อยผ่าน
  return NextResponse.next();
}

// กำหนดว่า Middleware นี้จะทำงานที่หน้าไหนบ้าง
export const config = {
  matcher: [
    '/',                    
    '/login',               
    '/Dashboard/:path*',    
    '/accounting/:path*',   
    '/hr/:path*',           
    '/inventory/:path*',    
    '/sales/:path*',        
    '/attendance/:path*'    
  ],
};