'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '../../components/Sidebar';
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, 
  Briefcase, Edit2, Save, X, Loader2, ArrowLeft, Star, Menu 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State สำหรับเปิด/ปิด Sidebar บนมือถือ

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setFormData(data.user); 
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    Swal.fire({
        title: 'บันทึกสำเร็จ',
        text: 'ข้อมูลของคุณถูกอัปเดตแล้ว',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
    });
    setUser(formData);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getWorkDuration = (dateString) => {
    if (!dateString) return '-';
    const start = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} วัน`;
    if (diffDays < 365) return `${Math.floor(diffDays/30)} เดือน`;
    return `${(diffDays/365).toFixed(1)} ปี`;
  };

  // Styles
  const inputClassName = (editable = false) => `
    w-full px-3 py-2.5 rounded-lg border outline-none transition text-sm
    text-slate-900 font-medium disabled:opacity-100 
    ${editable && isEditing 
      ? 'border-blue-300 focus:border-blue-500 bg-white ring-2 ring-blue-50' 
      : 'border-transparent bg-slate-100/50' 
    }
  `;

  const labelClassName = "block text-[10px] sm:text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider";

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar (Responsive) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         {/* ปุ่มปิดบนมือถือ */}
         <div className="absolute top-4 right-4 lg:hidden">
             <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                 <X size={24} />
             </button>
         </div>
         <Sidebar />
      </aside>

      {/* 3. Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {/* ปุ่มเมนูสำหรับมือถือ */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <Menu size={24} />
                    </button>

                    <div>
                        <Link href="/Dashboard" className="inline-flex items-center text-slate-400 hover:text-blue-600 transition text-xs font-bold mb-1">
                            <ArrowLeft size={14} className="mr-1" /> ย้อนกลับ
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">โปรไฟล์ส่วนตัว</h1>
                    </div>
                </div>
                
                <div className="w-full sm:w-auto">
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition shadow-sm text-sm font-bold">
                            <Edit2 size={16}/> แก้ไขข้อมูล
                        </button>
                    ) : (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition text-sm font-bold">
                                ยกเลิก
                            </button>
                            <button onClick={handleSave} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm text-sm font-bold flex justify-center items-center gap-2">
                                <Save size={16}/> บันทึก
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* --- LEFT COLUMN: Profile Card (Full width on mobile, 4 cols on large) --- */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                
                <div className="relative mt-8 mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-md mx-auto">
                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-4xl sm:text-5xl font-bold text-blue-600 border-2 border-slate-100 uppercase">
                            {user?.first_name ? user.first_name.charAt(0) : '?'}
                        </div>
                    </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                    {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-sm text-slate-500 mb-4">{user?.position || 'ตำแหน่ง: ไม่ระบุ'}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wide">
                        {user?.role?.replace('_', ' ') || 'User'}
                    </span>
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 flex items-center gap-1 uppercase tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Active
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 w-full mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold text-slate-800">6</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">วันลาคงเหลือ</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold text-slate-800">{getWorkDuration(user?.created_at)}</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase">อายุงาน</span>
                    </div>
                    <div className="col-span-2 bg-blue-50/50 p-3 rounded-lg border border-blue-50 flex items-center justify-between px-4">
                        <span className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
                            <Star size={14} className="fill-blue-400"/> เกรดประเมินล่าสุด
                        </span>
                        <span className="text-base font-bold text-blue-700">A</span>
                    </div>
                </div>

                {/* Contact */}
                <div className="w-full space-y-4 text-left border-t border-slate-100 pt-5 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                            <Mail size={18}/>
                        </div>
                        <div className="overflow-hidden min-w-0">
                            <span className="text-[10px] text-slate-400 block font-bold">อีเมล</span>
                            <span className="truncate font-medium block">{user?.email || '-'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                            <Phone size={18}/>
                        </div>
                        <div>
                            <span className="text-[10px] text-slate-400 block font-bold">โทรศัพท์</span>
                            <span className="font-medium block">{user?.phone || '-'}</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* --- RIGHT COLUMN: Details (Full on mobile, 8 cols on large) --- */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                
                {/* General Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
                    <h3 className="font-bold text-base text-slate-800 flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                        <User size={20} className="text-blue-600"/> ข้อมูลส่วนตัว
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        <div className="md:col-span-2">
                            <label className={labelClassName}>ชื่อจริง</label>
                            <input 
                                type="text" disabled={!isEditing}
                                value={formData.first_name || ''}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                className={inputClassName(true)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClassName}>นามสกุล</label>
                            <input 
                                type="text" disabled={!isEditing}
                                value={formData.last_name || ''}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                className={inputClassName(true)}
                            />
                        </div>
                        <div>
                            <label className={labelClassName}>รหัสพนักงาน</label>
                            <div className="relative">
                                <Shield size={14} className="absolute left-3 top-3 text-slate-400"/>
                                <input 
                                    type="text" value={user?.emp_code || '-'} disabled 
                                    className={`${inputClassName(false)} pl-9 font-mono text-slate-500`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClassName}>เบอร์โทรศัพท์</label>
                            <input 
                                type="text" disabled={!isEditing}
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder="-"
                                className={inputClassName(true)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClassName}>ที่อยู่ปัจจุบัน</label>
                            <input 
                                type="text" disabled={!isEditing}
                                value={formData.address || ''}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="-"
                                className={inputClassName(true)}
                            />
                        </div>
                    </div>
                </div>

                {/* Work Info Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
                    <h3 className="font-bold text-base text-slate-800 flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
                        <Briefcase size={20} className="text-orange-500"/> ข้อมูลการทำงาน
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        <div>
                            <label className={labelClassName}>แผนก (Department)</label>
                            <input type="text" value={user?.department_name || '-'} disabled className={inputClassName(false)}/>
                        </div>
                        <div>
                            <label className={labelClassName}>ตำแหน่ง (Position)</label>
                            <input type="text" value={user?.position || '-'} disabled className={inputClassName(false)}/>
                        </div>
                        <div>
                            <label className={labelClassName}>วันที่เริ่มงาน</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-3 text-slate-400"/>
                                <input type="text" value={formatDate(user?.created_at)} disabled className={`${inputClassName(false)} pl-9`}/>
                            </div>
                        </div>
                        <div>
                            <label className={labelClassName}>Username</label>
                            <input type="text" value={user?.username || user?.email || '-'} disabled className={inputClassName(false)}/>
                        </div>
                    </div>
                </div>

            </div>
            </div>
        </div>
      </main>
    </div>
  );
}