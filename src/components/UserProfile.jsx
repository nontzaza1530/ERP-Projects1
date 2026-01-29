'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, ChevronDown, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function UserProfile({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    try {
      // 1. เรียก API เพื่อลบ Session (ถ้ามี)
      await fetch('/api/logout', { method: 'POST' }); 
      
      // 2. ลบข้อมูลใน LocalStorage (ถ้ามีเก็บไว้)
      localStorage.removeItem('user');

      // 3. แจ้งเตือนสวยๆ
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
      await Toast.fire({ icon: 'success', title: 'ออกจากระบบสำเร็จ' });

      // 4. ดีดกลับไปหน้า Login
      router.push('/login'); 
      router.refresh();      
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // ดึงตัวอักษรแรกของชื่อมาแสดง
  // รองรับทั้ง username และ first_name
  const displayName = user?.first_name || user?.username || 'Guest';
  const firstLetter = displayName.charAt(0).toUpperCase();
  const roleName = user?.role ? user.role.replace('_', ' ') : 'User';

  return (
    <div className="relative">
      
      {/* 1. ปุ่ม Avatar (กดเพื่อเปิด/ปิดเมนู) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all group"
      >
        {/* วงกลมรูปภาพ */}
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform ring-2 ring-white">
          {firstLetter}
        </div>
        
        {/* ชื่อย่อ (แสดงเฉพาะจอใหญ่) */}
        <div className="hidden md:block text-right">
            <span className="text-sm font-bold text-slate-700 block leading-tight">{displayName}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{roleName}</span>
        </div>

        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>

      {/* 2. Dropdown Menu */}
      {isOpen && (
        <>
            {/* ฉากหลังใสๆ เอาไว้ดักคลิกเพื่อปิดเมนู */}
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)}></div>

            {/* กล่องเมนู */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                
                {/* ส่วนหัว: ข้อมูลผู้ใช้ */}
                <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                        {firstLetter}
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-800 truncate text-sm">{displayName}</h3>
                        <p className="text-xs text-slate-500 truncate">{user?.email || 'No Email'}</p>
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                            <Shield size={10} /> {roleName}
                        </span>
                    </div>
                </div>

                {/* รายการเมนู */}
                <div className="p-2 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-left group">
                        <Link href="/profile" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-left group">
                            <User size={18} className="text-slate-400 group-hover:text-blue-500"/> 
                            โปรไฟล์ส่วนตัว
                        </Link>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors text-left group">
                        <Settings size={18} className="text-slate-400 group-hover:text-blue-500"/> 
                        ตั้งค่าบัญชี
                    </button>
                </div>

                <div className="h-px bg-slate-100 mx-2 my-1"></div>

                {/* ปุ่มออกจากระบบ */}
                <div className="p-2">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left group"
                    >
                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform"/> 
                        ออกจากระบบ
                    </button>
                </div>
            </div>
        </>
      )}
    </div>
  );
}