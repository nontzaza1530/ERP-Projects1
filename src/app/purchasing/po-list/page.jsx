'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar'; 
import { 
  Search, Plus, Eye, FileText, Printer, Ban, Loader2, Calendar, ShoppingBag, Filter, CheckCircle, Clock, XCircle, Menu, Edit 
} from 'lucide-react'; // ✅ เพิ่มไอคอน Edit
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ✅ เพิ่ม useRouter สำหรับเปลี่ยนหน้า
import Swal from 'sweetalert2'; 

export default function POListPage() {
  const router = useRouter(); // ✅ เรียกใช้งาน router
  const [poList, setPoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [activeTab, setActiveTab] = useState('active'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPO();
  }, []);

  const fetchPO = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/purchasing/po/list'); 
      if (res.ok) {
        const data = await res.json();
        setPoList(data);
      }
    } catch (error) {
      console.error("Error loading PO:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = (po) => window.open(`/purchasing/print/${po.id}`, '_blank');

  const handleView = async (po) => {
    Swal.fire({ title: 'กำลังโหลดข้อมูล...', didOpen: () => Swal.showLoading() });
    try {
        const res = await fetch(`/api/purchasing/po/${po.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const itemsHtml = data.items.map((item, index) => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; text-align: left; color: #334155;">
                    <div style="font-weight: bold;">${index + 1}. ${item.product_name}</div>
                    <div style="font-size: 11px; color: #94a3b8;">Code: ${item.product_code || '-'}</div>
                </td>
                <td style="padding: 10px; text-align: right; color: #334155;">${item.quantity} ${item.unit}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #334155;">${parseFloat(item.total_price).toLocaleString()}</td>
            </tr>
        `).join('');

        Swal.fire({
            title: `<div style="text-align: left; font-size: 20px; color: #1e293b;">ใบสั่งซื้อ: <span style="color: #2563eb;">${data.po_number}</span></div>`,
            html: `
                <div style="text-align: left; font-size: 14px; margin-bottom: 20px; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; background: #f8fafc;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;">
                        <div style="flex: 1;">
                            <p style="font-size: 12px; color: #64748b; margin-bottom: 4px;">ผู้จำหน่าย (Supplier)</p>
                            <p style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">${data.supplier_name}</p>
                            
                            <p style="font-size: 13px; color: #475569; display: flex; align-items: flex-start; gap: 5px; margin-bottom: 4px;">
                                <span>📍</span> ${data.supplier_full_address || 'ไม่ระบุที่อยู่'}
                            </p>
                            <div style="font-size: 12px; color: #64748b; margin-top: 8px; display: flex; gap: 10px;">
                                <span>📞 ${data.supplier_phone || '-'}</span>
                                <span style="color: #cbd5e1;">|</span>
                                <span>🆔 Tax: ${data.supplier_tax_id || '-'}</span>
                            </div>
                        </div>

                        <div style="text-align: right; min-width: 120px; border-left: 1px solid #e2e8f0; padding-left: 15px;">
                             <p style="font-size: 12px; color: #64748b;">วันที่สั่งซื้อ</p>
                             <p style="font-weight: bold; color: #0f172a; margin-bottom: 10px;">${new Date(data.order_date).toLocaleDateString('th-TH')}</p>
                             
                             <p style="font-size: 12px; color: #64748b;">สถานะ</p>
                             <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; background: #dbeafe; color: #1e40af; font-weight: bold; font-size: 12px;">
                                ${data.status}
                             </span>
                        </div>
                    </div>
                </div>

                <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                    <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                        <thead style="background: #f1f5f9; color: #475569;">
                            <tr>
                                <th style="padding: 12px 10px; text-align: left; font-weight: 600;">รายการสินค้า</th>
                                <th style="padding: 12px 10px; text-align: right; font-weight: 600;">จำนวน</th>
                                <th style="padding: 12px 10px; text-align: right; font-weight: 600;">รวมเงิน</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHtml}</tbody>
                        <tfoot style="background: #f8fafc;">
                            <tr>
                                <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; color: #475569;">ยอดสุทธิ (Total):</td>
                                <td style="padding: 15px 10px; text-align: right; font-weight: 800; color: #2563eb; font-size: 18px;">
                                    ฿${parseFloat(data.total_amount).toLocaleString()}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `,
            width: '700px',
            padding: '20px',
            showCloseButton: true,
            confirmButtonText: 'ปิดหน้าต่าง',
            confirmButtonColor: '#334155',
            focusConfirm: false
        });
    } catch (error) {
        Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลได้', 'error');
    }
  };

  const handleCancel = async (po) => {
      if (po.status === 'Cancelled') return;
      const result = await Swal.fire({
          title: 'ยืนยันการยกเลิก?',
          html: `คุณต้องการยกเลิกใบสั่งซื้อ <b>${po.po_number}</b> ใช่หรือไม่?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          confirmButtonText: 'ใช่, ยกเลิก',
          cancelButtonText: 'ไม่'
      });

      if (result.isConfirmed) {
          try {
              const res = await fetch('/api/purchasing/po/cancel', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: po.id })
              });
              if (res.ok) {
                  await Swal.fire('สำเร็จ', 'ใบสั่งซื้อถูกยกเลิกแล้ว', 'success');
                  fetchPO();
              } else {
                  const data = await res.json();
                  Swal.fire('แจ้งเตือน', data.error, 'error');
              }
          } catch (err) {
              Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
          }
      }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">🕒 รอรับของ</span>;
      case 'partially received': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">📦 รับบางส่วน</span>;
      case 'received': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">✅ รับครบแล้ว</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">❌ ยกเลิก</span>;
      default: return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const filteredList = poList.filter(po => {
    const status = po.status.toLowerCase();
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (po.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'active') {
        matchesTab = status === 'pending' || status === 'partially received';
    } else if (activeTab === 'history') {
        matchesTab = status === 'received';
    } else if (activeTab === 'cancelled') {
        matchesTab = status === 'cancelled';
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
      </aside>

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <Menu size={24} />
            </button>
            
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">รายการใบสั่งซื้อ (PO List)</h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">ติดตามสถานะและจัดการเอกสารสั่งซื้อ</p>
            </div>
          </div>
          
          <Link href="/purchasing/create-po">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition active:scale-95 text-sm md:text-base whitespace-nowrap">
              <Plus size={20} strokeWidth={3} /> เปิดบิลใหม่
            </button>
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="ค้นหาเลขที่ PO หรือ ชื่อผู้ขาย..."
            className="flex-1 outline-none text-slate-700 placeholder:text-slate-400 font-medium bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
            {[
                { id: 'all', label: 'ทั้งหมด', icon: <Filter size={16}/>, activeClass: 'bg-slate-800 text-white' },
                { id: 'active', label: 'รอรับของ', icon: <Clock size={16}/>, activeClass: 'bg-blue-600 text-white' },
                { id: 'history', label: 'ประวัติ/สำเร็จ', icon: <CheckCircle size={16}/>, activeClass: 'bg-green-600 text-white' },
                { id: 'cancelled', label: 'รายการที่ยกเลิก', icon: <XCircle size={16}/>, activeClass: 'bg-red-500 text-white' },
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition whitespace-nowrap shadow-sm
                        ${activeTab === tab.id ? tab.activeClass : 'bg-white text-slate-500 hover:bg-slate-100'}
                    `}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse min-w-[800px]">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6 w-[15%]">เลขที่ PO</th>
                  <th className="p-4 w-[15%]">วันที่สั่ง</th>
                  <th className="p-4 w-[25%]">ผู้ขาย (Supplier)</th>
                  <th className="p-4 text-center w-[10%]">รายการ</th>
                  <th className="p-4 text-right w-[15%]">ยอดรวม</th>
                  <th className="p-4 w-[10%]">สถานะ</th>
                  <th className="p-4 text-center w-[10%]">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="7" className="p-10 text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> กำลังโหลดข้อมูล...</td></tr>
                ) : filteredList.length > 0 ? (
                  filteredList.map((po) => (
                    <tr key={po.id} className="bg-white hover:bg-blue-50/30 transition-colors duration-150">
                      <td className="p-4 pl-6 font-mono font-bold text-blue-600 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" /> {po.po_number}
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-400" />
                          {new Date(po.order_date).toLocaleDateString('th-TH')}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">{po.supplier_name || '-'}</td>
                      <td className="p-4 text-center text-slate-500 text-xs">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">{po.item_count} รายการ</span>
                      </td>
                      <td className="p-4 text-right font-black text-slate-800">฿{parseFloat(po.total_amount).toLocaleString()}</td>
                      <td className="p-4">{getStatusBadge(po.status)}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          
                          <button onClick={() => handleView(po)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="ดูรายละเอียด">
                            <Eye size={18} />
                          </button>

                          {/* ✅ เพิ่มปุ่มแก้ไข (Edit) ตรงนี้ */}
                          <button 
                              onClick={() => router.push(`/purchasing/edit-po/${po.id}`)}
                              disabled={po.status !== 'Pending'} 
                              className={`p-2 rounded-lg transition ${
                                  po.status === 'Pending' 
                                  ? 'text-slate-400 hover:text-green-600 hover:bg-green-50' 
                                  : 'text-slate-200 cursor-not-allowed'
                              }`} 
                              title={po.status === 'Pending' ? "แก้ไขใบสั่งซื้อ" : "ไม่สามารถแก้ไขได้"}
                          >
                              <Edit size={18} />
                          </button>

                          <button onClick={() => handlePrint(po)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="พิมพ์ใบสั่งซื้อ">
                            <Printer size={18} />
                          </button>

                          <button 
                                onClick={() => handleCancel(po)}
                                disabled={po.status !== 'Pending'} 
                                className={`p-2 rounded-lg transition ${
                                    po.status === 'Pending' 
                                    ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' 
                                    : 'text-slate-200 cursor-not-allowed'
                                }`} 
                                title={po.status === 'Pending' ? "ยกเลิกใบสั่งซื้อ" : "ไม่สามารถยกเลิกได้"}
                            >
                              <Ban size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="p-20 text-center text-slate-400 flex flex-col items-center gap-2">
                      <ShoppingBag size={48} className="text-slate-200 mb-2" /> 
                      <span className="text-lg font-bold text-slate-300">ไม่มีข้อมูลในหมวดนี้</span>
                      <span className="text-sm text-slate-400">ลองเปลี่ยน Tab หรือสร้างรายการใหม่</span>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}