'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Plus, Upload, X, Image as ImageIcon, CheckCircle, 
  Clock, ShieldCheck, Loader2, FileText, ChevronLeft, ChevronRight, AlertCircle, Trash2, Eye 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function ReimbursementPage() {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State สำหรับ Pagination และ Loading
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [formData, setFormData] = useState({ title: '', amount: '', date: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]); 

  // ✅ เพิ่ม State สำหรับดูรูปภาพ (Gallery)
  const [viewingImages, setViewingImages] = useState(null); 

  useEffect(() => {
      fetchRequests(currentPage);
      fetchCurrentUser();
  }, [currentPage]);

  const fetchRequests = async (page) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/accounting/reimbursement?page=${page}&limit=10`); 
        if(res.ok) {
            const data = await res.json();
            setRequests(data.data || []); 
            setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const fetchCurrentUser = async () => {
      try {
          const res = await fetch('/api/me');
          if (res.ok) {
              const data = await res.json();
              setCurrentUser(data.user);
          }
      } catch (err) { console.error(err); }
  };

  const getDisplayName = (user) => {
    if (!user) return 'Guest';
    if (user.first_name) return `${user.first_name} ${user.last_name || ''}`.trim();
    return user.username || 'Unknown';
  };

  // ✅ Helper: แสดงปุ่มดูรูป (กดแล้วเปิด Modal Grid)
  const renderSlipButton = (slipImages) => {
    if (!slipImages || slipImages === 'null') return <span className="text-slate-300">-</span>;
    try {
        let images = [];
        if (typeof slipImages === 'object') {
            images = Array.isArray(slipImages) ? slipImages : [slipImages];
        } else if (typeof slipImages === 'string') {
            try {
                const parsed = JSON.parse(slipImages);
                images = Array.isArray(parsed) ? parsed : [parsed];
            } catch { images = [slipImages]; }
        }
        if (images.length === 0) return <span className="text-slate-300">-</span>;

        return (
            <button 
               type="button"
               onClick={() => setViewingImages(images)} // <-- กดแล้วส่งรูปไปเก็บใน State เพื่อโชว์ Modal
               className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-2 border border-blue-200 transition shadow-sm active:scale-95"
            >
                <ImageIcon size={14}/> 
                {images.length > 1 ? `ดูหลักฐาน (${images.length})` : 'ดูหลักฐาน'}
            </button>
        );
    } catch (e) { return <span className="text-red-400 text-xs">Error</span>; }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
          file,
          preview: URL.createObjectURL(file)
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
      setSelectedFiles(prev => {
          const newFiles = [...prev];
          URL.revokeObjectURL(newFiles[index].preview);
          newFiles.splice(index, 1);
          return newFiles;
      });
  };

  const clearForm = () => {
    selectedFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setFormData({ title: '', amount: '', date: '', description: '' });
    setSelectedFiles([]);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
        Swal.fire('แจ้งเตือน', 'กรุณาแนบรูปสลิป/หลักฐาน อย่างน้อย 1 รูป', 'warning');
        return;
    }
    if (!currentUser?.id) {
         Swal.fire('ข้อผิดพลาด', 'ไม่พบข้อมูลผู้ใช้งาน กรุณาล็อกอินใหม่', 'error');
         return;
    }

    setIsSubmitting(true); 
    try {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('amount', formData.amount);
        data.append('date', formData.date); 
        data.append('description', formData.description);
        data.append('userId', currentUser.id);
        selectedFiles.forEach((item) => data.append('files', item.file));

        const res = await fetch('/api/accounting/reimbursement', {
            method: 'POST',
            body: data 
        });

        const result = await res.json();
        if (res.ok) {
            Swal.fire('สำเร็จ', 'ส่งเรื่องเบิกเรียบร้อย', 'success');
            clearForm();
            fetchRequests(1); 
            setCurrentPage(1);
        } else { throw new Error(result.error || 'Failed'); }
    } catch (err) { Swal.fire('Error', err.message, 'error'); } 
    finally { setIsSubmitting(false); }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)] flex flex-col h-screen overflow-hidden">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ระบบเบิกเงิน</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">จัดการและติดตามสถานะการเบิกจ่ายค่าใช้จ่าย</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95">
            <Plus size={20} strokeWidth={3}/> สร้างรายการใหม่
          </button>
        </div>

        {/* Table Card (ปรับดีไซน์ใหม่: มีเส้นแบ่ง + สีสลับบรรทัด) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left border-collapse">
                    
                    {/* ✅ Header: ปรับสีพื้นหลังให้เข้มขึ้น และมีเส้นขอบหนาขึ้น */}
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b-2 border-slate-200 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 pl-8 w-[15%]">วันที่</th>
                            <th className="p-4 w-[25%]">ผู้ขอเบิก</th>
                            <th className="p-4 w-[25%]">รายการ</th>
                            <th className="p-4 text-center w-[12%]">หลักฐาน</th>
                            <th className="p-4 w-[13%]">สถานะ</th>
                            <th className="p-4 text-right pr-8 w-[10%]">จำนวนเงิน</th>
                        </tr>
                    </thead>

                    {/* ✅ Body: เพิ่มเส้นแบ่ง (divide) และสีสลับบรรทัด (even:bg) */}
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                           [...Array(5)].map((_, i) => (
                               <tr key={i} className="animate-pulse bg-white">
                                   <td className="p-4 pl-8"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                                   <td className="p-4"><div className="h-10 w-10 bg-slate-100 rounded-full inline-block mr-3"></div><div className="h-4 bg-slate-100 rounded w-24 inline-block"></div></td>
                                   <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                   <td className="p-4"><div className="h-6 w-16 bg-slate-100 rounded-lg mx-auto"></div></td>
                                   <td className="p-4"><div className="h-6 w-20 bg-slate-100 rounded-full"></div></td>
                                   <td className="p-4 text-right pr-8"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                               </tr>
                           ))
                        ) : requests.length > 0 ? (
                            requests.map((req) => (
                                <tr 
                                    key={req.id} 
                                    // ✅ Hilight: สีพื้นหลังขาว, แถวคู่เป็นสีเทาอ่อน, เอาเมาส์ชี้เป็นสีฟ้า
                                    className="bg-white even:bg-slate-50 hover:bg-blue-50/60 transition-colors duration-150"
                                >
                                    <td className="p-4 pl-8 align-top border-r border-transparent"> {/* เพิ่ม border-r transparent เพื่อให้ spacing สวย */}
                                        <div className="font-bold text-slate-700">{new Date(req.expense_date || req.created_at).toLocaleDateString('th-TH', {day: 'numeric', month: 'short', year: '2-digit'})}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{new Date(req.created_at).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.</div>
                                    </td>
                                    
                                    <td className="p-4 align-top">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center shadow-sm">
                                                {(req.requester_name || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">
                                                    {req.requester_name || 'ไม่ระบุชื่อ'}
                                                    {req.emp_code && <span className="text-slate-400 font-normal ml-1 text-xs">#{req.emp_code}</span>}
                                                </p>
                                                <p className="text-[11px] text-slate-500 bg-slate-200/50 px-1.5 py-0.5 rounded-md inline-block mt-1 border border-slate-200/50">{req.position || req.role || 'Employee'}</p>
                                            </div>
                                         </div>
                                    </td>

                                    <td className="p-4 align-top">
                                        <p className="font-bold text-slate-800 text-base">{req.title}</p>
                                        {req.description && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{req.description}</p>}
                                    </td>

                                    <td className="p-4 text-center align-top">
                                        {renderSlipButton(req.slip_images)}
                                    </td>

                                    <td className="p-4 align-top">
                                        {req.status === 'pending' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock size={12}/> รอตรวจสอบ</span> : 
                                        req.status === 'approved' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200"><CheckCircle size={12}/> อนุมัติแล้ว</span> : 
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200"><X size={12}/> ไม่อนุมัติ</span>}
                                    </td>

                                    <td className="p-4 text-right pr-8 align-top">
                                        <span className="font-bold text-slate-900 text-lg tracking-tight">฿{parseFloat(req.amount).toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-20 text-center text-slate-400 bg-white"><div className="flex flex-col items-center gap-3"><div className="p-4 bg-slate-50 rounded-full"><FileText size={40} className="text-slate-300"/></div><p>ยังไม่มีรายการขอเบิก</p></div></td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 relative">
                <span className="text-xs text-slate-500 font-medium ml-4">หน้า {currentPage} จาก {totalPages}</span>
                <div className="flex gap-2 mr-4">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || isLoading} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition"><ChevronLeft size={16}/> ก่อนหน้า</button>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || isLoading} className="flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition">ถัดไป <ChevronRight size={16}/></button>
                </div>
            </div>
        </div>
      </main>

      {/* --- 🖼️ NEW: Image Gallery Modal (แบบ Grid สวยงาม) --- */}
      {viewingImages && (
        <div 
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200" 
            onClick={() => setViewingImages(null)}
        >
            
            {/* Toolbar ด้านบน */}
            <div className="flex justify-between items-center px-6 py-4 text-white bg-black/40 border-b border-white/10 shrink-0">
                <h3 className="font-bold text-lg flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <ImageIcon size={20}/> 
                    </div>
                    หลักฐานแนบ ({viewingImages.length} รูป)
                </h3>
                <button 
                    onClick={() => setViewingImages(null)}
                    className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition text-white/70 hover:text-white"
                >
                    <X size={24}/>
                </button>
            </div>

            {/* Area แสดงรูปภาพแบบ Grid */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10" onClick={(e) => e.stopPropagation()}> {/* คลิกพื้นหลังว่างๆ เพื่อปิดได้ */}
                
                {/* ✅ Grid Layout: ปรับให้เรียงสวยงามตามขนาดจอ */}
                <div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto"
                    onClick={(e) => e.stopPropagation()} // ป้องกันคลิกช่องว่างระหว่างรูปแล้วปิด
                >
                    {viewingImages.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="group relative aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                        >
                            {/* รูปภาพ (Object Cover ให้เต็มช่องสวยๆ) */}
                            <img 
                                src={img} 
                                alt={`evidence-${idx}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Badge บอกลำดับรูป */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                                {idx + 1}
                            </div>

                            {/* Overlay ตอนเอาเมาส์ชี้ */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <a 
                                    href={img} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-slate-900 hover:bg-blue-50 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Eye size={16}/> ดูภาพต้นฉบับ
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Request Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-white/20">
                
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><FileText size={24}/></div>
                        สร้างรายการขอเบิก
                    </h2>
                    <button onClick={clearForm} className="bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full transition-all duration-200">
                        <X size={24} strokeWidth={2.5}/>
                    </button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User Card */}
                        <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                                {getDisplayName(currentUser).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ผู้ขอเบิก (Requester)</p>
                                <p className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                                    {getDisplayName(currentUser)} <ShieldCheck size={16} className="text-green-500"/>
                                </p>
                                {currentUser?.emp_code && <p className="text-xs text-slate-500 mt-0.5">รหัส: {currentUser.emp_code}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>หัวข้อรายการ <span className="text-red-500">*</span></label>
                            <input type="text" placeholder="ระบุชื่อรายการ..." className={inputClass} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required disabled={isSubmitting}/>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>จำนวนเงิน (บาท) <span className="text-red-500">*</span></label>
                                <input type="number" placeholder="0.00" className={inputClass} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required disabled={isSubmitting}/>
                            </div>
                            <div>
                                <label className={labelClass}>วันที่ตามใบเสร็จ <span className="text-red-500">*</span></label>
                                <input type="date" className={inputClass} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required disabled={isSubmitting}/>
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>รายละเอียดเพิ่มเติม</label>
                            <textarea placeholder="ระบุรายละเอียด..." className={inputClass} rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} disabled={isSubmitting}></textarea>
                        </div>
                        
                        <div>
                            <label className={labelClass}>หลักฐาน / สลิป (แนบได้หลายรูป) <span className="text-red-500">*</span></label>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer relative hover:bg-slate-50 hover:border-blue-400 transition-all group mb-4">
                                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" disabled={isSubmitting}/>
                                <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-blue-600 transition">
                                    <div className="bg-slate-50 p-4 rounded-full group-hover:bg-blue-50 transition shadow-sm"><Upload size={24}/></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-600 group-hover:text-blue-600">คลิกเพื่ออัปโหลดรูปภาพ</p>
                                        <p className="text-xs text-slate-400 mt-1">รองรับ JPG, PNG (สูงสุด 10 รูป)</p>
                                    </div>
                                </div>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                                            <img src={file.preview} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"/>
                                            <button type="button" onClick={() => removeFile(index)} className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-500 hover:text-white" disabled={isSubmitting}>
                                                <Trash2 size={12}/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white shrink-0">
                    <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2">
                        {isSubmitting ? <><Loader2 size={24} className="animate-spin"/> กำลังบันทึก...</> : 'ยืนยันส่งเรื่องเบิก'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}