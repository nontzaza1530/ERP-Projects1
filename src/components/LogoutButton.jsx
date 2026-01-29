'use client';

import { LogOut } from 'lucide-react'; 

export default function LogoutButton() {
  
  const handleLogout = async () => {
    try {
      // 1. ส่งคำขอไปที่ Server ให้ช่วยลบ Cookie หน่อย
      await fetch('/api/logout', {
        method: 'POST',
      });

      // 2. เมื่อ Server ลบเสร็จแล้ว ค่อยย้ายหน้า
      // ใช้ window.location.href เพื่อบังคับโหลดใหม่ให้สะอาดหมดจด
      window.location.href = '/login';
      
    } catch (error) {
      console.error("Logout failed", error);
      // ถ้า Error ก็บังคับย้ายอยู่ดี
      window.location.href = '/login';
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition group mt-2"
    >
      <LogOut size={20} className="group-hover:text-red-400" />
      <span className="font-medium">ออกจากระบบ</span>
    </button>
  );
}