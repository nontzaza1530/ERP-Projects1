'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Hammer, Plus, Calendar, Clock,
  MoreVertical, Archive, RefreshCcw, Trash2, FileBox, Menu
} from 'lucide-react'; 
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ProductionPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null);
  
  // ✅ เพิ่ม State สำหรับเปิด/ปิด Sidebar ในมือถือ
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/production/projects');
      const data = await res.json();
      
      // ✅ แก้ไขจุดที่ 1: ตรวจสอบและดึง array ออกมาจาก object
      // API ใหม่อาจส่งมาเป็น { projects: [...] } หรือ [...]
      const projectList = Array.isArray(data) ? data : (data.projects || []);
      
      setProjects(projectList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // กันเหนียวไว้ก่อน ถ้า error ให้เป็น array ว่าง
    } finally {
      setLoading(false);
    }
  };

  // --- 🛠️ Action Handlers ---

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
        const res = await fetch('/api/production/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'archive_project', project_id: id })
        });

        if (res.ok) {
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
        const res = await fetch('/api/production/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'restore_project', project_id: id })
        });

        if (res.ok) {
          fetchProjects(); // โหลดข้อมูลใหม่เพื่อให้ได้สถานะล่าสุด
          Swal.fire('สำเร็จ', 'กู้คืนโปรเจกต์แล้ว', 'success');
        } else {
          throw new Error('Restore failed');
        }
      } catch (error) {
        Swal.fire('Error', 'ไม่สามารถกู้คืนได้', 'error');
      }
    }
  };

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
        const res = await fetch(`/api/production/projects/${id}`, { method: 'DELETE' });

        if (res.ok) {
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
      done: 'bg-green-100 text-green-600', // ปรับ completed เป็น done ให้ตรงกับ API ใหม่
      completed: 'bg-green-100 text-green-600', // เผื่อไว้
      canceled: 'bg-red-100 text-red-600',
      archived: 'bg-gray-200 text-gray-500 line-through'
    };
    const labels = {
      pending: 'รอเริ่มงาน',
      in_progress: 'กำลังผลิต',
      doing: 'กำลังผลิต', // เพิ่ม doing
      qc: 'ตรวจสอบ (QC)',
      done: 'เสร็จสิ้น', // ปรับ completed เป็น done
      completed: 'เสร็จสิ้น',
      canceled: 'ยกเลิก',
      archived: 'เก็บถาวร'
    };
    // ใช้ status ตัวเล็กเสมอเพื่อความชัวร์
    const normalizedStatus = status?.toLowerCase() || 'pending';
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${styles[normalizedStatus] || styles.pending}`}>
        {labels[normalizedStatus] || status}
      </span>
    );
  };

  // กรอง projects อย่างปลอดภัย (เช็คว่าเป็น array ก่อน)
  const filteredProjects = Array.isArray(projects) ? projects.filter(p => {
    if (filterStatus === 'archived') return p.status === 'archived';
    if (filterStatus === 'all') return p.status !== 'archived';
    
    // แปลง status ให้ตรงกัน (เช่น API ส่ง 'done' แต่ filter เราใช้ 'completed')
    if (filterStatus === 'completed' && p.status === 'done') return true;
    if (filterStatus === 'in_progress' && p.status === 'doing') return true;
    
    return p.status === filterStatus;
  }) : [];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* ✅ 1. Mobile Overlay: ฉากหลังมืดเวลาเปิด Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* ✅ 2. Sidebar Container: กล่อง Sidebar ที่เลื่อนได้ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto">
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
      </aside>

      {/* ✅ 3. Main Content: ปรับ Margin ให้ถูกต้อง */}
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 min-h-screen flex flex-col">
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              {/* ✅ ปุ่มเปิดเมนูในมือถือ */}
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <Menu size={24} />
              </button>
              
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Hammer className="text-orange-600" /> ฝ่ายผลิต (Production)
                </h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">ติดตามสถานะและควบคุมต้นทุนการผลิต</p>
              </div>
            </div>

            <Link href="/production/create">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition text-sm md:text-base">
                <Plus size={20} /> <span className="hidden sm:inline">เปิดใบสั่งผลิตใหม่</span><span className="sm:hidden">สร้างใหม่</span>
              </button>
            </Link>
          </div>

          {/* Filters Tabs (เลื่อนแนวนอนได้ในมือถือ) */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-200 custom-scrollbar">
            {['all', 'pending', 'in_progress', 'qc', 'completed', 'archived'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-t-lg text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2
                  ${filterStatus === status
                  ? 'border-orange-600 text-orange-600 bg-orange-50'
                  : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
              >
                {status === 'archived' && <FileBox size={16} />}
                {status === 'all' ? 'ทั้งหมด' : status === 'in_progress' ? 'กำลังผลิต' : status === 'qc' ? 'รอ QC' : status === 'completed' ? 'เสร็จแล้ว' : status === 'archived' ? 'ที่เก็บถาวร' : 'รอเริ่ม'}
              </button>
            ))}
          </div>

          {/* Project Cards Grid (ปรับ Grid ตามขนาดจอ) */}
          {loading ? (
            <div className="text-center py-20 text-slate-400">กำลังโหลดข้อมูล...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <FileBox size={48} className="mx-auto text-slate-300 mb-3" />
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
                        <Clock size={12} /> {new Date(project.created_at).toLocaleDateString('th-TH')}
                      </span>

                      {/* --- 🔘 Dropdown Menu --- */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveMenu(activeMenu === project.id ? null : project.id);
                          }}
                          className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenu === project.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                              {project.status !== 'archived' ? (
                                <button
                                  onClick={() => handleArchive(project.id, project.project_name)}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Archive size={14} /> เก็บเข้ากรุ
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRestore(project.id, project.project_name)}
                                  className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <RefreshCcw size={14} /> กู้คืน
                                </button>
                              )}
                              <div className="border-t border-slate-100 my-1"></div>
                              <button
                                onClick={() => handleDelete(project.id, project.project_name)}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                              >
                                <Trash2 size={14} /> ลบถาวร
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <Link href={`/production/project/${project.id}`} className="flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-orange-600 transition line-clamp-1" title={project.project_name}>
                      {project.project_name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 truncate">{project.customer_name || 'ไม่ระบุลูกค้า'}</p>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <Calendar size={14} className="text-slate-400" />
                        <span>ส่งมอบ: {project.due_date ? new Date(project.due_date).toLocaleDateString('th-TH') : '-'}</span>
                      </div>

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

        </div>
      </main>
    </div>
  );
}