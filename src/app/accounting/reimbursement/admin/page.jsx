'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import { 
  CheckCircle, XCircle, Clock, Filter, 
  User, Calendar, FileText, X, Eye, ImageIcon,
  ChevronLeft, ChevronRight, Search, AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminReimbursementPage() {
  const [items, setItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Pagination (ถ้าข้อมูลเยอะในอนาคต)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const res = await fetch('/api/accounting/reimbursement/manage');
        if (res.ok) setItems(await res.json());
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    let reason = '';
    
    if (newStatus === 'rejected') {
        const { value: text } = await Swal.fire({
            title: 'ระบุเหตุผลที่ไม่อนุมัติ',
            input: 'textarea',
            inputPlaceholder: 'เช่น เอกสารไม่ชัดเจน, ยอดเงินไม่ตรง...',
            inputAttributes: { 'aria-label': 'Type your message here' },
            showCancelButton: true,
            confirmButtonText: 'ยืนยันปฏิเสธ',
            confirmButtonColor: '#ef4444',
            cancelButtonText: 'ยกเลิก',
            focusConfirm: false,
        });
        if (!text) return; 
        reason = text;
    } else {
        const confirm = await Swal.fire({
            title: 'ยืนยันการอนุมัติ?',
            text: 'ตรวจสอบเอกสารและความถูกต้องครบถ้วนแล้ว',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'อนุมัติจ่ายเงิน',
            confirmButtonColor: '#2563eb',
            cancelButtonText: 'ยกเลิก'
        });
        if (!confirm.isConfirmed) return;
    }

    try {
        const res = await fetch('/api/accounting/reimbursement/manage', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus, reject_reason: reason }) 
        });

        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: newStatus === 'approved' ? 'อนุมัติรายการเรียบร้อยแล้ว' : 'ปฏิเสธรายการเรียบร้อยแล้ว',
                timer: 1500,
                showConfirmButton: false
            });
            setSelectedItem(null); 
            fetchData(); 
        }
    } catch (err) { Swal.fire('Error', 'เกิดข้อผิดพลาด', 'error'); }
  };

  // Helper: แปลง JSON รูปภาพ
  const getImages = (slipImages) => {
      if (!slipImages) return [];
      try {
          if (Array.isArray(slipImages)) return slipImages;
          if (typeof slipImages === 'string') {
               if (slipImages.startsWith('[')) return JSON.parse(slipImages);
               return [slipImages];
          }
          return [];
      } catch (e) { return []; }
  };

  // Filter & Pagination Logic
  const filteredItems = items.filter(item => filterStatus === 'all' ? true : item.status === filterStatus);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const pendingAmount = items.filter(i => i.status === 'pending').reduce((sum, i) => sum + parseFloat(i.amount), 0);

  // Styles
  const thClass = "p-4 font-bold text-slate-600 uppercase text-[11px] tracking-wider border-b border-slate-200";
  const tdClass = "p-4 text-sm text-slate-700 border-b border-slate-100 align-top";

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ตรวจสอบการเบิกจ่าย</h1>
                <p className="text-slate-500 text-sm mt-1">Admin Approval Dashboard</p>
            </div>
            
            {/* Stats Card */}
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 text-right min-w-[200px]">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">ยอดรออนุมัติรวม</p>
                <p className="text-3xl font-bold text-blue-600">฿{pendingAmount.toLocaleString()}</p>
            </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-fit flex gap-1 mb-6">
            {[
                { id: 'pending', label: 'รอตรวจสอบ', icon: Clock, activeClass: 'bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-200' },
                { id: 'approved', label: 'อนุมัติแล้ว', icon: CheckCircle, activeClass: 'bg-green-50 text-green-700 shadow-sm ring-1 ring-green-200' },
                { id: 'rejected', label: 'ถูกปฏิเสธ', icon: XCircle, activeClass: 'bg-red-50 text-red-700 shadow-sm ring-1 ring-red-200' },
                { id: 'all', label: 'ทั้งหมด', icon: Filter, activeClass: 'bg-slate-100 text-slate-800 shadow-sm ring-1 ring-slate-200' },
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => { setFilterStatus(tab.id); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-200 ${filterStatus === tab.id ? tab.activeClass : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <tab.icon size={16}/> {tab.label}
                </button>
            ))}
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 backdrop-blur sticky top-0 z-10">
                        <tr>
                            <th className={`${thClass} pl-8 w-[15%]`}>วันที่</th>
                            <th className={`${thClass} w-[20%]`}>ผู้ขอเบิก</th>
                            <th className={`${thClass} w-[30%]`}>รายการ</th>
                            <th className={`${thClass} text-center w-[15%]`}>หลักฐาน</th>
                            <th className={`${thClass} w-[10%]`}>สถานะ</th>
                            <th className={`${thClass} text-right pr-8 w-[10%]`}>จำนวนเงิน</th>
                            <th className={`${thClass} text-center w-[5%]`}></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                             [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-4 pl-8"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                                    <td className="p-4"><div className="h-6 w-16 bg-slate-100 rounded-full mx-auto"></div></td>
                                    <td className="p-4"><div className="h-6 w-20 bg-slate-100 rounded-full"></div></td>
                                    <td className="p-4 text-right pr-8"><div className="h-4 bg-slate-100 rounded w-16 ml-auto"></div></td>
                                    <td className="p-4"></td>
                                </tr>
                            ))
                        ) : paginatedItems.length === 0 ? (
                            <tr><td colSpan="7" className="p-20 text-center text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <Search size={32} className="text-slate-200"/> 
                                    <span>ไม่พบรายการในสถานะนี้</span>
                                </div>
                            </td></tr>
                        ) : (
                            paginatedItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className={`${tdClass} pl-8`}>
                                        <div className="font-bold text-slate-700">{new Date(item.expense_date).toLocaleDateString('th-TH', {day: 'numeric', month: 'short', year: '2-digit'})}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{new Date(item.created_at).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.</div>
                                    </td>
                                    <td className={tdClass}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                                                {(item.first_name || item.username || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-xs">{item.first_name || item.username} {item.last_name}</p>
                                                <p className="text-[10px] text-slate-400">{item.position || 'Employee'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={tdClass}>
                                        <p className="font-bold text-slate-800">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description || '-'}</p>
                                    </td>
                                    <td className={`${tdClass} text-center`}>
                                        {getImages(item.slip_images).length > 0 ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600 border border-slate-200">
                                                <ImageIcon size={12}/> {getImages(item.slip_images).length} รูป
                                            </span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className={tdClass}>
                                        {item.status === 'pending' ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200"><Clock size={10}/> รอตรวจสอบ</span> : 
                                         item.status === 'approved' ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle size={10}/> อนุมัติแล้ว</span> : 
                                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"><XCircle size={10}/> ปฏิเสธ</span>}
                                    </td>
                                    <td className={`${tdClass} text-right pr-8`}>
                                        <span className="font-bold text-slate-900 text-base">฿{parseFloat(item.amount).toLocaleString()}</span>
                                    </td>
                                    <td className={`${tdClass} text-center`}>
                                        <button onClick={() => setSelectedItem(item)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition shadow-sm">
                                            <Eye size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination Controls */}
            {filteredItems.length > 0 && (
                <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <span className="text-xs text-slate-500 font-medium ml-4">หน้า {currentPage} จาก {totalPages} ({filteredItems.length} รายการ)</span>
                    <div className="flex gap-2 mr-4">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition flex items-center gap-1"><ChevronLeft size={14}/> ก่อนหน้า</button>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-50 transition flex items-center gap-1">ถัดไป <ChevronRight size={14}/></button>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* ✨ Modern Approval Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200 ring-1 ring-white/20">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        ตรวจสอบใบเบิก
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">#{selectedItem.id}</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                            {(selectedItem.first_name || selectedItem.username || 'U').charAt(0)}
                        </div>
                        <p className="text-sm text-slate-500">
                            ขอเบิกโดย: <span className="font-bold text-slate-800">{selectedItem.first_name || selectedItem.username} {selectedItem.last_name}</span>
                        </p>
                    </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2.5 rounded-full transition-all duration-200 border border-transparent hover:border-red-100">
                    <X size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                {/* Highlight Card */}
                <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 mb-8 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium mb-1">ยอดเงินที่ขอเบิก</p>
                        <p className="text-4xl font-bold tracking-tight">฿{parseFloat(selectedItem.amount).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center">
                            <p className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">วันที่ใบเสร็จ</p>
                            <p className="text-lg font-bold">{new Date(selectedItem.expense_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit'})}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1"><FileText size={12}/> รายละเอียด</h3>
                        <h4 className="font-bold text-lg text-slate-800 mb-1">{selectedItem.title}</h4>
                        <p className="text-slate-500 text-sm">{selectedItem.description || '- ไม่มีรายละเอียดเพิ่มเติม -'}</p>
                        
                        {/* ถ้าถูกปฏิเสธ ให้โชว์เหตุผล */}
                        {selectedItem.status === 'rejected' && (
                            <div className="mt-4 bg-red-50 p-3 rounded-lg border border-red-100">
                                <p className="text-xs font-bold text-red-700 uppercase mb-1">สาเหตุที่ไม่อนุมัติ</p>
                                <p className="text-sm text-red-600">{selectedItem.reject_reason}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <ImageIcon size={14}/> หลักฐาน ({getImages(selectedItem.slip_images).length})
                        </h3>
                        {getImages(selectedItem.slip_images).length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {getImages(selectedItem.slip_images).map((url, index) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-zoom-in">
                                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                <Eye size={16} className="text-slate-800"/>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">ไม่พบรูปภาพหลักฐาน</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Footer Actions */}
            {selectedItem.status === 'pending' && (
                <div className="p-6 border-t border-slate-100 bg-white shrink-0 flex gap-3 justify-end">
                    <button onClick={() => handleUpdateStatus(selectedItem.id, 'rejected')} className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2">
                        <XCircle size={20}/> ไม่อนุมัติ
                    </button>
                    <button onClick={() => handleUpdateStatus(selectedItem.id, 'approved')} className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                        <CheckCircle size={20}/> อนุมัติจ่ายเงิน
                    </button>
                </div>
            )}
            </div>
        </div>
      )}

    </div>
  );
}