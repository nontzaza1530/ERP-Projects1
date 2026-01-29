'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Hammer, Plus, Calendar, Clock, 
  MoreVertical, Archive, RefreshCcw, Trash2, FileBox 
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ProductionPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null); // เก็บ ID ของการ์ดที่เปิดเมนูอยู่

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/production/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- 🛠️ Action Handlers (เชื่อมต่อ API แล้ว) ---

  // 1. เก็บเข้ากรุ (Soft Delete)
  const handleArchive = async (id, name) => {
    setActiveMenu(null);
    const result = await Swal.fire({
      title: 'เก็บเข้ากรุ?',
      text: `ต้องการย้าย "${name}" ไปเก็บถาวรใช่ไหม?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, เก็บเลย',
      confirmButtonColor: '#6366f1',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        // ยิง API ไปอัปเดตสถานะ
        const res = await fetch(`/api/production/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'archived' })
        });

        if (res.ok) {
            // อัปเดตหน้าจอทันที
            setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
            Swal.fire('เรียบร้อย!', 'ย้ายไปที่เก็บถาวรแล้ว', 'success');
        } else {
            throw new Error('Update failed');
        }
      } catch (error) {
        Swal.fire('Error', 'ไม่สามารถบันทึกข้อมูลได้', 'error');
      }
    }
  };

  // 2. กู้คืน (Restore)
  const handleRestore = async (id, name) => {
    setActiveMenu(null);
    const result = await Swal.fire({
      title: 'กู้คืนโครงการ?',
      text: `ดึง "${name}" กลับมาทำงานต่อใช่ไหม?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'กู้คืน',
      confirmButtonColor: '#10b981',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        // ยิง API ปรับสถานะกลับเป็น pending (รอเริ่มงาน)
        const res = await fetch(`/api/production/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'pending' })
        });

        if (res.ok) {
            setProjects(prev => prev.map(p => p.id === id ? { ...p, status: 'pending' } : p));
            Swal.fire('สำเร็จ', 'กู้คืนโปรเจกต์แล้ว', 'success');
        } else {
            throw new Error('Restore failed');
        }
      } catch (error) {
        Swal.fire('Error', 'ไม่สามารถกู้คืนได้', 'error');
      }
    }
  };

  // 3. ลบถาวร (Hard Delete)
  const handleDelete = async (id, name) => {
    setActiveMenu(null);
    const result = await Swal.fire({
      title: 'ลบโปรเจกต์ถาวร?',
      text: `คุณต้องการลบ "${name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบทิ้งถาวร',
      confirmButtonColor: '#d33',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        // ยิง API DELETE
        const res = await fetch(`/api/production/projects/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            // ลบออกจากหน้าจอ
            setProjects(prev => prev.filter(p => p.id !== id));
            Swal.fire('ลบแล้ว!', 'โปรเจกต์ถูกลบออกจากระบบ', 'success');
        } else {
             throw new Error('Delete failed');
        }
      } catch (error) {
         Swal.fire('Error', 'ไม่สามารถลบข้อมูลได้', 'error');
      }
    }
  };

  // --- 🎨 Helper Functions ---

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-slate-100 text-slate-600',
      in_progress: 'bg-blue-100 text-blue-600',
      qc: 'bg-orange-100 text-orange-600',
      completed: 'bg-green-100 text-green-600',
      canceled: 'bg-red-100 text-red-600',
      archived: 'bg-gray-200 text-gray-500 line-through'
    };
    const labels = {
      pending: 'รอเริ่มงาน',
      in_progress: 'กำลังผลิต',
      qc: 'ตรวจสอบ (QC)',
      completed: 'เสร็จสิ้น',
      canceled: 'ยกเลิก',
      archived: 'เก็บถาวร'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Logic การกรอง
  const filteredProjects = projects.filter(p => {
    if (filterStatus === 'archived') return p.status === 'archived';
    if (filterStatus === 'all') return p.status !== 'archived'; 
    return p.status === filterStatus;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Hammer className="text-orange-600"/> ฝ่ายผลิต (Production)
                </h1>
                <p className="text-slate-500 text-sm mt-1">ติดตามสถานะและควบคุมต้นทุนการผลิต</p>
            </div>
            <Link href="/production/create">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition">
                    <Plus size={20}/> เปิดใบสั่งผลิตใหม่
                </button>
            </Link>
        </div>

        {/* Filters Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-200">
            {['all', 'pending', 'in_progress', 'qc', 'completed', 'archived'].map(status => (
                <button 
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-t-lg text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2
                    ${filterStatus === status 
                        ? 'border-orange-600 text-orange-600 bg-orange-50' 
                        : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                >
                    {status === 'archived' && <FileBox size={16}/>}
                    {status === 'all' ? 'ทั้งหมด' : status === 'in_progress' ? 'กำลังผลิต' : status === 'qc' ? 'รอ QC' : status === 'completed' ? 'เสร็จแล้ว' : status === 'archived' ? 'ที่เก็บถาวร' : 'รอเริ่ม'}
                </button>
            ))}
        </div>

        {/* Project Cards Grid */}
        {loading ? (
            <div className="text-center py-20 text-slate-400">กำลังโหลดข้อมูล...</div>
        ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <FileBox size={48} className="mx-auto text-slate-300 mb-3"/>
                <p className="text-slate-400 mb-4">ยังไม่มีรายการในสถานะนี้</p>
                {filterStatus !== 'archived' && (
                    <Link href="/production/create" className="text-orange-600 font-bold hover:underline">สร้างใหม่เลย</Link>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div 
                        key={project.id} 
                        className={`bg-white p-5 rounded-2xl shadow-sm border transition relative flex flex-col
                        ${project.status === 'archived' ? 'border-slate-200 opacity-75 grayscale-[0.5]' : 'border-slate-200 hover:shadow-md hover:border-orange-200'}`}
                    >
                        
                        {/* Header Card */}
                        <div className="flex justify-between items-start mb-3">
                            {getStatusBadge(project.status)}
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={12}/> {new Date(project.created_at).toLocaleDateString('th-TH')}
                                </span>

                                {/* --- 🔘 เมนูจัดการ (Dropdown) --- */}
                                <div className="relative">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault(); // กันไม่ให้ Link ทำงาน
                                            setActiveMenu(activeMenu === project.id ? null : project.id);
                                        }}
                                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    {activeMenu === project.id && (
                                        <>
                                            {/* Overlay ปิดเมนูเมื่อคลิกที่อื่น */}
                                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                                            
                                            {/* เมนู */}
                                            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                                {/* ⚠️ ลบปุ่มแก้ไขออกตามที่ขอแล้วครับ */}
                                                
                                                {project.status !== 'archived' ? (
                                                    <button 
                                                        onClick={() => handleArchive(project.id, project.project_name)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                                    >
                                                        <Archive size={14}/> เก็บเข้ากรุ
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleRestore(project.id, project.project_name)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                                    >
                                                        <RefreshCcw size={14}/> กู้คืน
                                                    </button>
                                                )}
                                                
                                                <div className="border-t border-slate-100 my-1"></div>
                                                <button 
                                                    onClick={() => handleDelete(project.id, project.project_name)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                                >
                                                    <Trash2 size={14}/> ลบถาวร
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card Content */}
                        <Link href={`/production/project/${project.id}`} className="flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-orange-600 transition">
                                {project.project_name}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">{project.customer_name || 'ไม่ระบุลูกค้า'}</p>

                            <div className="mt-auto space-y-3">
                                {/* Due Date */}
                                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                                    <Calendar size={14} className="text-slate-400"/> 
                                    <span>ส่งมอบ: {project.due_date ? new Date(project.due_date).toLocaleDateString('th-TH') : '-'}</span>
                                </div>

                                {/* Cost Summary */}
                                <div className="flex justify-between items-end border-t border-slate-100 pt-3">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">ต้นทุนใช้ไป</p>
                                        <p className="text-sm font-bold text-slate-700">฿{parseFloat(project.total_cost || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">ราคาขาย</p>
                                        <p className="text-sm font-bold text-blue-600">฿{parseFloat(project.sale_price || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
}