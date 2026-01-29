'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { FileText, Calendar, Save, ArrowLeft, User, AlignLeft, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function LeaveRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'sick',
    start_date: '',
    end_date: '',
    reason: ''
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // ถ้ามีรหัสพนักงาน ให้ใส่เป็นค่าเริ่มต้นไว้ แต่ยังให้แก้ได้
        if (user.emp_code) {
            setFormData(prev => ({ ...prev, employee_id: user.emp_code }));
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
        Swal.fire('วันที่ไม่ถูกต้อง', 'วันสิ้นสุดต้องไม่มาก่อนวันเริ่มต้น', 'warning');
        setIsSubmitting(false);
        return;
    }

    try {
      // เรียก API จริงของคุณ (อย่าลืมเปลี่ยน URL ให้ตรงกับ Backend จริง)
      const res = await fetch('/api/employees/leave', { 
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if(!res.ok) throw new Error(result.error || 'Failed to submit');

      Swal.fire({
        title: 'สำเร็จ!',
        text: 'ส่งคำขอลาเรียบร้อยแล้ว กรุณารอหัวหน้าอนุมัติ',
        icon: 'success',
        confirmButtonColor: '#9333ea'
      }).then(() => {
        router.push('/Dashboard');
      });

    } catch (error) {
      Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Styles ---
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-2";
  const inputContainerStyle = "relative group";
  const inputStyle = `
    w-full p-3 pl-10 rounded-xl border border-slate-200 
    bg-white text-slate-700 text-base 
    placeholder:text-slate-400
    focus:ring-2 focus:ring-purple-100 focus:border-purple-500 
    outline-none transition-all duration-200
    disabled:bg-slate-50 disabled:text-slate-500
  `;
  const iconStyle = "absolute top-3.5 left-3 text-slate-400 group-focus-within:text-purple-600 transition-colors pointer-events-none";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* ---------------- Sidebar Section ---------------- */}
      
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 
          bg-slate-900 
          shadow-2xl 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-none 
          lg:border-r lg:border-slate-800
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
          <div className="h-full relative">
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition z-50"
            >
                <X size={24} />
            </button>
            
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
      </aside>

      {/* ---------------- Main Content ---------------- */}
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 h-full overflow-y-auto flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
        
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition active:scale-95"
                    >
                        <Menu size={24} />
                    </button>

                    <Link href="/Dashboard">
                        <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-purple-600 transition text-slate-500 shadow-sm active:scale-95">
                            <ArrowLeft size={20} />
                        </button>
                    </Link>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="p-1.5 bg-purple-100 rounded-lg">
                                <FileText className="text-purple-600" size={20} />
                            </span>
                            แบบฟอร์มขอวันลา
                        </h1>
                    </div>
                </div>
                
                <div className="hidden sm:block text-slate-500 text-sm">
                   หน้าหลัก &gt; แจ้งลาหยุด
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-linear-to-r from-purple-50 to-white px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <Calendar size={18} className="text-purple-600" /> 
                    <span className="text-purple-900 font-bold text-sm uppercase tracking-wide">รายละเอียดการลา</span>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>รหัสพนักงาน</label>
                            <div className={inputContainerStyle}>
                                <User className={iconStyle} size={18} />
                                {/* ✅ แก้ไข: เอา readOnly ออก และเปลี่ยนสีพื้นหลัง */}
                                <input 
                                    type="text" 
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    placeholder="กรอกรหัสพนักงาน"
                                    className={`${inputStyle}`} 
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelStyle}>ประเภทการลา <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <select 
                                    name="leave_type" 
                                    value={formData.leave_type} 
                                    onChange={handleChange}
                                    className={`${inputStyle} appearance-none cursor-pointer hover:bg-slate-50`}
                                >
                                    <option value="sick">🤒 ลาป่วย (Sick Leave)</option>
                                    <option value="business">💼 ลากิจ (Business Leave)</option>
                                    <option value="vacation">🏖️ ลาพักร้อน (Vacation Leave)</option>
                                    <option value="unpaid">💸 ลาไม่รับค่าจ้าง (Unpaid Leave)</option>
                                </select>
                                <div className="absolute top-4 right-4 text-slate-400 pointer-events-none">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelStyle}>เริ่มวันที่ <span className="text-red-500">*</span></label>
                            <input 
                                type="date" 
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className={`${inputStyle} pl-4`}
                            />
                        </div>
                        <div>
                            <label className={labelStyle}>ถึงวันที่ <span className="text-red-500">*</span></label>
                            <input 
                                type="date" 
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                required
                                className={`${inputStyle} pl-4`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelStyle}>เหตุผลการลา <span className="text-red-500">*</span></label>
                        <div className={inputContainerStyle}>
                            <AlignLeft className={`${iconStyle} top-4`} size={18} />
                            <textarea 
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                required
                                placeholder="เช่น ป่วยเป็นไข้หวัด, ติดต่อธุระที่อำเภอ..."
                                rows="4"
                                className={`${inputStyle} resize-none py-3.5`}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                        <Link href="/Dashboard" className="w-full sm:w-auto sm:flex-1">
                            <button type="button" className="w-full py-3.5 px-6 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition active:scale-[0.98]">
                                ยกเลิก
                            </button>
                        </Link>
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full sm:w-auto sm:flex-2 py-3.5 px-6 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-200 flex justify-center items-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    กำลังบันทึก...
                                </>
                            ) : (
                                <><Save size={20}/> ยืนยันการลา</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            <p className="text-center text-slate-400 text-xs mt-8 pb-4">
                &copy; 2024 HR Management System. All rights reserved.
            </p>
        </div>
      </main>
    </div>
  );
}