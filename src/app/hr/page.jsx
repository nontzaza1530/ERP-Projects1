'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';
import {
  Users, Plus, Edit, Trash2, X, Briefcase, Menu, Save, Loader2,
  Shield, Mail, Key, User, UserX, CheckCircle, Eye, DollarSign,
  Phone, Calendar, MapPin, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import Swal from 'sweetalert2';

// --- Components ย่อย ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="animate-spin text-blue-600" size={48} />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
    <Users size={64} className="mb-4 opacity-50" />
    <p>ยังไม่มีข้อมูลพนักงาน</p>
  </div>
);

export default function HRPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masterData, setMasterData] = useState({ roles: [], departments: [] });
  const [currentUser, setCurrentUser] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State สำหรับ Sidebar มือถือ
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, isEdit: false });

  // Pagination Settings
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const initialFormState = {
    id: null, emp_code: '', first_name: '', last_name: '', email: '',
    phone: '', birth_date: '', address: '',
    username: '', password: '', position: '', departments_id: '',
    role_id: 3, salary: '', status: 'active'
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = useCallback(async (user) => {
    setLoading(true);
    try {
      const query = user ? `?user_role=${user.role}&user_id=${user.id}` : '';
      const [empRes, deptRes, roleRes] = await Promise.all([
        fetch(`/api/employees${query}`),
        fetch('/api/departments'),
        fetch('/api/roles')
      ]);

      if (empRes.ok) {
        const data = await empRes.json();
        setEmployees(data);
        setCurrentPage(1); 
      }
      const roles = roleRes.ok ? await roleRes.json() : [];
      const departments = deptRes.ok ? await deptRes.json() : [];
      setMasterData({ roles, departments });

    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchData(user);
    } else {
        fetchData(null);
    }
  }, [fetchData]);

  // Logic การตัดหน้า
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const openModal = (emp = null) => {
    if (emp) {
      setFormData({
        id: emp.id,
        emp_code: emp.emp_code || '',
        first_name: emp.first_name || '',
        last_name: emp.last_name || '',
        email: emp.email || '',
        phone: emp.phone || '',
        birth_date: formatDateForInput(emp.birth_date),
        address: emp.address || '',
        username: '', 
        password: '',
        position: emp.position || emp.role_name || '',
        departments_id: emp.departments_id || '',
        role_id: emp.role_id || 3,
        salary: emp.salary || '',
        status: emp.status || 'active'
      });
      setModalState({ isOpen: true, isEdit: true });
    } else {
      setFormData(initialFormState);
      setModalState({ isOpen: true, isEdit: false });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.emp_code || !formData.first_name) {
      return Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกรหัสและชื่อพนักงาน', 'warning');
    }
    if (!modalState.isEdit && (!formData.username || !formData.password)) {
      return Swal.fire('ข้อมูลไม่ครบ', 'กรุณาสร้าง User Account สำหรับพนักงานใหม่', 'warning');
    }

    setIsSubmitting(true);
    try {
      const selectedDept = masterData.departments.find(d => d.id == formData.departments_id);
      const selectedRole = masterData.roles.find(r => r.id == formData.role_id);
      
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary) || 0,
        departments_id: formData.departments_id || null,
        departments_name: selectedDept ? selectedDept.name : '',
        role_name: selectedRole ? selectedRole.name : 'Employee'
      };

      const url = modalState.isEdit ? `/api/employees/${formData.emp_code}` : '/api/employees';
      const method = modalState.isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Operation failed');

      Swal.fire('สำเร็จ', modalState.isEdit ? 'แก้ไขข้อมูลเรียบร้อย' : 'เพิ่มพนักงานเรียบร้อย', 'success');
      setModalState({ ...modalState, isOpen: false });
      
      fetchData(currentUser); 

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (emp_code) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "การลบข้อมูลจะไม่สามารถกู้คืนได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/employees/${emp_code}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        
        Swal.fire('ลบสำเร็จ', 'ข้อมูลพนักงานถูกลบเรียบร้อยแล้ว', 'success');
        fetchData(currentUser);
      } catch (error) {
        Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้', 'error');
      }
    }
  };

  const inputStyle = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-slate-800 placeholder:text-slate-400 text-sm";
  const labelStyle = "text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block";

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
        
        {/* Header */}
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu for Mobile */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                        <Menu size={24} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Users className="text-blue-600" /> Employee Management
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">จัดการข้อมูลพนักงานในระบบ (ทั้งหมด {employees.length} คน)</p>
                    </div>
                </div>
                
                <div className="w-full sm:w-auto">
                    {currentUser?.role !== 'employee' && (
                        <button onClick={() => openModal()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition active:scale-95 font-medium text-sm">
                            <Plus size={18} /> เพิ่มพนักงาน
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase border-b border-slate-200 font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Code</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Department</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                            {loading ? (
                                <tr><td colSpan="7"><LoadingSpinner /></td></tr>
                            ) : employees.length === 0 ? (
                                <tr><td colSpan="7"><EmptyState /></td></tr>
                            ) : (
                                currentEmployees.map((emp) => (
                                    <tr key={emp.emp_code} className={`transition duration-150 hover:bg-blue-50/30 ${emp.status === 'resigned' ? 'bg-slate-50/50 grayscale opacity-75' : ''}`}>
                                        <td className="p-4 font-mono text-blue-600 font-bold">{emp.emp_code}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{emp.first_name} {emp.last_name}</div>
                                            {emp.birth_date && (
                                                <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                    <Calendar size={10}/> {new Date(emp.birth_date).toLocaleDateString('th-TH')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="text-xs font-medium text-slate-600">{emp.email || '-'}</div>
                                            {emp.phone && <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Phone size={10}/> {emp.phone}</div>}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                                                {emp.role_name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {emp.status === 'resigned' ? 
                                                <span className="inline-flex items-center gap-1.5 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-md border border-red-100 whitespace-nowrap"><UserX size={12}/> ลาออก</span> : 
                                                <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md border border-green-100 whitespace-nowrap"><CheckCircle size={12}/> ปกติ</span>
                                            }
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-600 border border-slate-200 whitespace-nowrap">
                                                {emp.departments_name || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <Link href={`/hr/employee/${emp.emp_code}`}>
                                                <button className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition" title="ดูรายละเอียดเต็ม">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>

                                            {currentUser?.role !== 'employee' && (
                                                <>
                                                    <button onClick={() => openModal(emp)} className="text-orange-400 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 p-2 rounded-lg transition" title="แก้ไข"><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(emp.emp_code)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition" title="ลบ"><Trash2 size={18} /></button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && employees.length > 0 && (
                    <div className="bg-slate-50 px-4 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-slate-600 font-medium hidden sm:block">
                            แสดง {indexOfFirstItem + 1} ถึง {Math.min(indexOfLastItem, employees.length)} จาก {employees.length} รายการ
                        </div>
                        
                        <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                            <button onClick={() => paginate(1)} disabled={currentPage === 1} className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 disabled:opacity-50 transition"><ChevronsLeft size={18} /></button>
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 disabled:opacity-50 transition"><ChevronLeft size={18} /></button>
                            
                            <div className="hidden sm:flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(num => num === 1 || num === totalPages || (num >= currentPage - 1 && num <= currentPage + 1))
                                    .map((number, index, array) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`w-10 h-10 rounded-lg text-sm font-bold border transition ${currentPage === number ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50'}`}
                                        >
                                            {number}
                                        </button>
                                    ))
                                }
                            </div>
                            <span className="sm:hidden text-sm font-bold text-slate-600 px-2">หน้าที่ {currentPage} / {totalPages}</span>

                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 disabled:opacity-50 transition"><ChevronRight size={18} /></button>
                            <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-blue-50 disabled:opacity-50 transition"><ChevronsRight size={18} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Modal Logic (Responsive) */}
        {modalState.isOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setModalState({ ...modalState, isOpen: false })}></div>
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg sm:max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-5 flex justify-between items-start text-white shrink-0">
                    <div>
                    <h3 className="font-bold text-xl flex items-center gap-3">
                        {modalState.isEdit ? <Edit size={24} className="text-white/80"/> : <Plus size={24} className="text-white/80"/>}
                        {modalState.isEdit ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1 opacity-90">กรอกข้อมูลให้ครบถ้วนเพื่อความถูกต้องของระบบ</p>
                    </div>
                    <button onClick={() => setModalState({ ...modalState, isOpen: false })} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto bg-white custom-scrollbar">
                    
                    {!modalState.isEdit && (
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-4 text-blue-700 font-bold text-sm uppercase tracking-wider">
                        <Key size={16}/> บัญชีผู้ใช้ (สำหรับ Login)
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyle}>Username <span className="text-red-500">*</span></label>
                            <div className="relative">
                            <User size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input type="text" placeholder="ตั้งชื่อผู้ใช้" required className={inputStyle} value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className={labelStyle}>Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                            <Key size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input type="text" placeholder="รหัสผ่านเริ่มต้น" required className={inputStyle} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                        </div>
                        </div>
                    </div>
                    )}

                    <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Briefcase size={16}/> ข้อมูลพนักงาน</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                        <label className={labelStyle}>รหัสพนักงาน <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Shield size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input
                            type="text" inputMode="numeric" maxLength={10} required disabled={modalState.isEdit}
                            placeholder="รหัสไม่เกิน 10 หลัก"
                            className={`${inputStyle} font-mono ${modalState.isEdit ? 'bg-slate-100 cursor-not-allowed text-slate-500' : ''}`}
                            value={formData.emp_code}
                            onChange={(e) => {
                                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) setFormData({...formData, emp_code: e.target.value});
                            }}
                            />
                        </div>
                        </div>
                        <div>
                        <label className={labelStyle}>ตำแหน่ง (Role) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Shield size={18} className="absolute top-3 left-3 text-slate-400" />
                            <select className={`${inputStyle} appearance-none cursor-pointer`} value={formData.role_id} onChange={e => setFormData({...formData, role_id: Number(e.target.value)})}>
                            {masterData.roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                        <label className={labelStyle}>ชื่อจริง <span className="text-red-500">*</span></label>
                        <input type="text" className={inputStyle} placeholder="ชื่อจริง" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} required />
                        </div>
                        <div>
                        <label className={labelStyle}>นามสกุล <span className="text-red-500">*</span></label>
                        <input type="text" className={inputStyle} placeholder="นามสกุล" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                        <label className={labelStyle}>อีเมลติดต่อ</label>
                        <div className="relative">
                            <Mail size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input type="email" placeholder="email@company.com" className={`${inputStyle} ${modalState.isEdit ? 'bg-slate-50 text-slate-500' : ''}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}/>
                        </div>
                        </div>
                        <div>
                        <label className={labelStyle}>เบอร์โทรศัพท์</label>
                        <div className="relative">
                            <Phone size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input type="tel" placeholder="08X-XXX-XXXX" className={inputStyle} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}/>
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                        <label className={labelStyle}>วันเกิด</label>
                        <div className="relative">
                            <Calendar size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input type="date" className={inputStyle} value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})}/>
                        </div>
                        </div>
                        <div>
                        <label className={labelStyle}>เงินเดือน (บาท)</label>
                        <div className="relative">
                            <DollarSign size={18} className="absolute top-3 left-3 text-slate-400" />
                            <input type="number" className={inputStyle} placeholder="0.00" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                        </div>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className={labelStyle}>ที่อยู่</label>
                        <div className="relative">
                            <MapPin size={18} className="absolute top-3 left-3 text-slate-400" />
                            <textarea 
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white text-slate-800 placeholder:text-slate-400 min-h-20"
                                placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด..."
                                value={formData.address}
                                onChange={e => setFormData({...formData, address: e.target.value})}
                            ></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                        <div>
                        <label className={labelStyle}>แผนก</label>
                        <select className={`${inputStyle} cursor-pointer`} value={formData.departments_id} onChange={e => setFormData({...formData, departments_id: e.target.value})}>
                            <option value="">-- เลือกแผนก --</option>
                            {masterData.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        </div>
                        <div>
                        <label className={labelStyle}>ตำแหน่งงาน</label>
                        <input type="text" className={inputStyle} placeholder="เช่น Programmer" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
                        </div>
                    </div>

                    {modalState.isEdit && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <span className="font-bold text-slate-700 text-sm block">สถานะพนักงาน</span>
                            <span className="text-xs text-slate-400">กำหนดสิทธิ์การเข้าใช้งานระบบ</span>
                        </div>
                        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm w-full sm:w-auto">
                            <button type="button" onClick={() => setFormData({...formData, status: 'active'})} 
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all flex justify-center items-center gap-1 ${formData.status === 'active' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
                            <CheckCircle size={14}/> Active
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, status: 'resigned'})} 
                            className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all flex justify-center items-center gap-1 ${formData.status === 'resigned' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-slate-400 hover:bg-slate-50'}`}>
                            <UserX size={14}/> Resigned
                            </button>
                        </div>
                        </div>
                    )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={() => setModalState({ ...modalState, isOpen: false })} className="w-full py-3 border border-slate-300 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition">ยกเลิก</button>
                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-bold transition flex justify-center items-center gap-2">
                        {isSubmitting ? <><Loader2 className="animate-spin" size={20}/> บันทึก...</> : <><Save size={20}/> บันทึกข้อมูล</>}
                    </button>
                    </div>

                </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}