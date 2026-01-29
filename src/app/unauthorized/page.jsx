'use client';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-200">
        <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full animate-pulse">
                <ShieldAlert size={64} className="text-red-500" />
            </div>
        </div>
        <h1 className="text-2xl font-black mb-2 text-slate-900">ไม่มีสิทธิ์เข้าถึง (Access Denied)</h1>
        <p className="text-slate-500 mb-8 font-medium">
          ขออภัย คุณไม่มีสิทธิ์ใช้งานในส่วนนี้ <br/>
          (ระบบตรวจสอบสิทธิ์ของคุณแล้วไม่ผ่าน )
        </p>
        
        <Link 
          href="/Dashboard" 
          className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition active:scale-95"
        >
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
}