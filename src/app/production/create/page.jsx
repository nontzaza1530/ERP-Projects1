'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Save, ArrowLeft, Loader2, Calendar, DollarSign, 
  FileText, User, Users, Menu 
} from 'lucide-react'; // ✅ เพิ่ม Menu Icon
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ เพิ่ม State สำหรับ Sidebar มือถือ

  const [formData, setFormData] = useState({
    project_name: '',
    customer_name: '',
    start_date: new Date().toISOString().split('T')[0],
    due_date: '',
    budget: '',
    sale_price: '',
    description: '',
    selected_employees: []
  });

  // 1. ดึงรายชื่อพนักงาน
  useEffect(() => {
      const fetchEmployees = async () => {
          try {
              const res = await fetch('/api/employees'); 
              if (res.ok) {
                  const json = await res.json();
                  if (Array.isArray(json)) setEmployees(json);
              }
          } catch (err) { 
              console.error("Error fetching employees:", err);
          }
      };
      fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 2. จัดการการติ๊กเลือกพนักงาน
  const handleEmployeeToggle = (empCode) => {
      setFormData(prev => {
          const isSelected = prev.selected_employees.includes(empCode);
          if (isSelected) {
              return { ...prev, selected_employees: prev.selected_employees.filter(id => id !== empCode) };
          } else {
              return { ...prev, selected_employees: [...prev.selected_employees, empCode] };
          }
      });
  };

  // คำนวณกำไรคาดการณ์
  const estimatedProfit = (parseFloat(formData.sale_price) || 0) - (parseFloat(formData.budget) || 0);
  const profitMargin = parseFloat(formData.sale_price) > 0 
    ? ((estimatedProfit / parseFloat(formData.sale_price)) * 100).toFixed(1) 
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.project_name) {
        return Swal.fire('ข้อมูลไม่ครบ', 'กรุณาระบุชื่อโปรเจค/สินค้า', 'warning');
    }

    setIsSubmitting(true);

    try {
        const res = await fetch('/api/production/projects/create', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || 'Failed to create project');
        }

        Swal.fire({
            title: 'สำเร็จ!',
            text: 'เปิดใบสั่งผลิตและบันทึกทีมงานเรียบร้อยแล้ว',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            router.push('/production'); 
        });

    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Styles
  const labelStyle = "block text-xs font-bold text-slate-500 uppercase mb-1.5";
  const inputStyle = "w-full p-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition bg-white text-slate-800";

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* ✅ 1. Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* ✅ 2. Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
      </aside>

      {/* ✅ 3. Main Content */}
      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">
        
        <div className="max-w-4xl mx-auto w-full">
            
            {/* Header Navigation */}
            <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                    <Menu size={24} />
                </button>
                <div>
                    <Link href="/production" className="text-slate-500 hover:text-orange-600 flex items-center gap-1 text-sm font-bold mb-1 transition w-fit">
                        <ArrowLeft size={16}/> กลับหน้าฝ่ายผลิต
                    </Link>
                    <h1 className="text-2xl font-extrabold text-slate-800">เปิดใบสั่งผลิตใหม่ (New Job Order)</h1>
                    <p className="text-slate-500 text-sm mt-1">สร้างโปรเจคเพื่อเริ่มติดตามสถานะและต้นทุน</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. ข้อมูลทั่วไป */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <FileText size={18} className="text-orange-500"/> ข้อมูลงาน
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className={labelStyle}>ชื่อโปรเจค / สินค้า <span className="text-red-500">*</span></label>
                            <input 
                                type="text" name="project_name" 
                                className={inputStyle} 
                                placeholder="เช่น งานผลิตโต๊ะประชุม ล็อต A"
                                value={formData.project_name} onChange={handleChange} required
                            />
                        </div>
                        <div>
                            <label className={labelStyle}>ชื่อลูกค้า</label>
                            <div className="relative">
                                <User size={18} className="absolute top-3.5 left-3 text-slate-400"/>
                                <input 
                                    type="text" name="customer_name" 
                                    className={`${inputStyle} pl-10`} 
                                    placeholder="ระบุชื่อลูกค้า (ถ้ามี)"
                                    value={formData.customer_name} onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelStyle}>รายละเอียดเพิ่มเติม</label>
                            <input 
                                type="text" name="description" 
                                className={inputStyle} 
                                placeholder="หมายเหตุ..."
                                value={formData.description} onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. ทีมงานรับผิดชอบ */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Users size={18} className="text-purple-500"/> ทีมงานรับผิดชอบ (Project Team)
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-[250px] overflow-y-auto custom-scrollbar">
                        {employees.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {employees.map(emp => (
                                    <label key={emp.emp_code} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all bg-white select-none
                                        ${formData.selected_employees.includes(emp.emp_code) 
                                            ? 'border-orange-500 shadow-md ring-1 ring-orange-200' 
                                            : 'border-slate-200 hover:border-orange-300'}`}>
                                        <input 
                                            type="checkbox" 
                                            value={emp.emp_code}
                                            checked={formData.selected_employees.includes(emp.emp_code)}
                                            onChange={() => handleEmployeeToggle(emp.emp_code)}
                                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 shrink-0"
                                        />
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{emp.first_name} {emp.last_name}</p>
                                            <p className="text-xs text-slate-400">{emp.position || 'พนักงาน'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <Loader2 className="animate-spin mb-2"/>
                                <p className="text-sm">กำลังโหลดรายชื่อพนักงาน...</p>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 text-right mt-2">* เลือกพนักงานที่เกี่ยวข้องเพื่อความสะดวกในการบันทึกค่าแรง</p>
                </div>

                {/* 3. กำหนดการ & งบประมาณ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Time */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Calendar size={18} className="text-blue-500"/> กำหนดการ
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className={labelStyle}>วันที่เริ่ม (Start Date)</label>
                                <input 
                                    type="date" name="start_date" 
                                    className={inputStyle}
                                    value={formData.start_date} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>กำหนดส่งมอบ (Due Date)</label>
                                <input 
                                    type="date" name="due_date" 
                                    className={inputStyle}
                                    value={formData.due_date} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Money */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                        <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <DollarSign size={18} className="text-green-500"/> งบประมาณ & ราคา
                        </h3>
                        <div className="space-y-4 flex-1">
                            <div>
                                <label className={labelStyle}>ราคาขาย (Sale Price)</label>
                                <input 
                                    type="number" name="sale_price" 
                                    className={`${inputStyle} text-right font-mono text-blue-600 font-bold`} 
                                    placeholder="0.00"
                                    value={formData.sale_price} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className={labelStyle}>งบต้นทุน (Budget Cost)</label>
                                <input 
                                    type="number" name="budget" 
                                    className={`${inputStyle} text-right font-mono text-red-500`} 
                                    placeholder="0.00"
                                    value={formData.budget} onChange={handleChange}
                                />
                            </div>
                            
                            <div className={`mt-auto p-3 rounded-xl border flex justify-between items-center text-sm transition-colors
                                ${estimatedProfit >= 0 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                <span className="font-bold">กำไรคาดการณ์:</span>
                                <span className="font-mono font-bold text-lg">
                                    {estimatedProfit.toLocaleString()} <span className="text-xs font-normal opacity-80">({profitMargin}%)</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 pb-20 sm:pb-0">
                    <Link href="/production" className="w-full sm:w-auto">
                        <button type="button" className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition">
                            ยกเลิก
                        </button>
                    </Link>
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin"/> : <Save size={20}/>}
                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                    </button>
                </div>

            </form>
        </div>
      </main>
    </div>
  );
}