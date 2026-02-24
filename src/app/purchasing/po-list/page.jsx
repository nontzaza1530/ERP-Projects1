'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar'; 
import { 
  Search, Plus, Eye, FileText, Printer, Ban, Loader2, Calendar, ShoppingBag, 
  Filter, CheckCircle, Clock, XCircle, Menu, Edit, ShoppingCart, ArrowRight, CalendarDays, X
} from 'lucide-react'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import Swal from 'sweetalert2'; 

export default function PurchasingHubPage() {
  const router = useRouter(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 🔍 State สำหรับการค้นหาและกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(''); // ✅ เพิ่มเก็บวันที่เริ่มต้น
  const [endDate, setEndDate] = useState('');     // ✅ เพิ่มเก็บวันที่สิ้นสุด
  
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 1. ระบบ Master Tabs
  const [activeMainTab, setActiveMainTab] = useState('PR'); 

  // 🟡 2. State ฝั่ง PO
  const [poList, setPoList] = useState([]);
  const [activePoTab, setActivePoTab] = useState('active'); 

  // 🔵 3. State ฝั่ง PR
  const [prList, setPrList] = useState([]);
  const [activePrTab, setActivePrTab] = useState('all'); 

  useEffect(() => {
    if (activeMainTab === 'PO') fetchPO();
    else fetchPR();
  }, [activeMainTab]);

  const fetchPO = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/purchasing/po/list'); 
      if (res.ok) setPoList(await res.json());
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const fetchPR = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/purchasing/pr');
      if (res.ok) setPrList(await res.json());
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  // ==========================================
  // ⚡ ACTION HANDLERS (PR)
  // ==========================================
  const handleCancelPR = async (prId, prNumber) => {
      const result = await Swal.fire({ 
          title: 'ยืนยันการยกเลิก?', 
          html: `ต้องการยกเลิกใบขอซื้อ <b>${prNumber}</b> ใช่หรือไม่?<br/><span style="font-size:12px; color:red;">*เอกสารนี้จะถูกย้ายไปหมวด 'รายการที่ยกเลิก'</span>`, 
          icon: 'warning', 
          showCancelButton: true, 
          confirmButtonColor: '#ef4444', 
          confirmButtonText: 'ใช่, ยกเลิก', 
          cancelButtonText: 'ไม่' 
      });

      if (result.isConfirmed) {
          try {
              const res = await fetch('/api/purchasing/pr/cancel', { 
                  method: 'POST', 
                  headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify({ id: prId }) 
              });
              if (res.ok) { 
                  await Swal.fire('สำเร็จ!', 'ยกเลิกใบขอซื้อเรียบร้อยแล้ว', 'success'); 
                  fetchPR(); 
              } else { Swal.fire('ผิดพลาด', 'ไม่สามารถยกเลิกได้', 'error'); }
          } catch (error) { Swal.fire('ผิดพลาด', 'การเชื่อมต่อมีปัญหา', 'error'); }
      }
  };

  const getPRStatusBadge = (status) => {
      if (status === 'Pending') return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold border border-orange-200 flex items-center gap-1 w-fit"><Clock size={12}/> รอสั่งซื้อ</span>;
      if (status === 'PO_Created') return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold border border-green-200 flex items-center gap-1 w-fit"><CheckCircle size={12}/> ออก PO แล้ว</span>;
      if (status === 'Cancelled') return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold border border-red-200 flex items-center gap-1 w-fit"><XCircle size={12}/> ยกเลิก</span>;
      return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
  };

  // ==========================================
  // ⚡ ACTION HANDLERS (PO)
  // ==========================================
  const handlePrintPO = (po) => window.open(`/purchasing/print/${po.id}`, '_blank');
  
  const handleViewPO = async (po) => {
    Swal.fire({ title: 'กำลังโหลดข้อมูล...', didOpen: () => Swal.showLoading() });
    try {
        const res = await fetch(`/api/purchasing/po/${po.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const itemsHtml = data.items.map((item, index) => `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px; text-align: left; color: #334155;">
                    <div style="font-weight: bold;">${index + 1}. ${item.product_name || item.custom_item_name || '-'}</div>
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
    } catch (error) { Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลได้', 'error'); }
  };

  const handleCancelPO = async (po) => {
      if (po.status === 'Cancelled') return;
      const result = await Swal.fire({ title: 'ยืนยันการยกเลิก?', html: `คุณต้องการยกเลิกใบสั่งซื้อ <b>${po.po_number}</b> ใช่หรือไม่?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'ใช่, ยกเลิก', cancelButtonText: 'ไม่' });
      if (result.isConfirmed) {
          try {
              const res = await fetch('/api/purchasing/po/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: po.id }) });
              if (res.ok) { await Swal.fire('สำเร็จ', 'ใบสั่งซื้อถูกยกเลิกแล้ว', 'success'); fetchPO(); } 
              else { const data = await res.json(); Swal.fire('แจ้งเตือน', data.error, 'error'); }
          } catch (err) { Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error'); }
      }
  };

  const getPOStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit border border-yellow-200"><Clock size={12}/> รอรับของ</span>;
      case 'partially received': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit border border-orange-200"><ShoppingBag size={12}/> รับบางส่วน</span>;
      case 'received': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit border border-green-200"><CheckCircle size={12}/> รับครบแล้ว</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit border border-red-200"><XCircle size={12}/> ยกเลิก</span>;
      default: return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[11px] font-bold">{status}</span>;
    }
  };

  // ==========================================
  // 🔍 FILTERS (ระบบค้นหา + กรองวันที่)
  // ==========================================
  const checkDateMatch = (docDateStr) => {
      if (!startDate && !endDate) return true; // ถ้าไม่ได้ระบุวันที่ ให้ผ่านหมด
      
      // แปลงวันที่จาก DB ให้เป็น Format 'YYYY-MM-DD' เพื่อเทียบ
      const docDate = new Date(docDateStr).toISOString().split('T')[0];
      
      if (startDate && endDate) return docDate >= startDate && docDate <= endDate;
      if (startDate) return docDate >= startDate;
      if (endDate) return docDate <= endDate;
      return true;
  };

  const filteredPRList = prList.filter(pr => {
    // 1. กรองข้อความค้นหา
    const matchesSearch = pr.pr_number.toLowerCase().includes(searchTerm.toLowerCase()) || (pr.project_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. กรอง Tab สถานะ
    let matchesTab = true;
    if (activePrTab === 'pending') matchesTab = pr.status === 'Pending';
    else if (activePrTab === 'po_created') matchesTab = pr.status === 'PO_Created';
    else if (activePrTab === 'cancelled') matchesTab = pr.status === 'Cancelled'; 
    
    // 3. กรองวันที่
    const matchesDate = checkDateMatch(pr.request_date);

    return matchesSearch && matchesTab && matchesDate;
  });

  const filteredPOList = poList.filter(po => {
    const status = po.status.toLowerCase();
    
    // 1. กรองข้อความค้นหา
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) || (po.supplier_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. กรอง Tab สถานะ
    let matchesTab = true;
    if (activePoTab === 'active') matchesTab = status === 'pending' || status === 'partially received';
    else if (activePoTab === 'history') matchesTab = status === 'received';
    else if (activePoTab === 'cancelled') matchesTab = status === 'cancelled';
    
    // 3. กรองวันที่
    const matchesDate = checkDateMatch(po.order_date);

    return matchesSearch && matchesTab && matchesDate;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
      </aside>

      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">

        {/* 🌟 Header & Master Tabs */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <Menu size={24} />
            </button>
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <ShoppingCart className="text-blue-600" size={28}/> ศูนย์เอกสารจัดซื้อ
                </h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">ติดตามสถานะและจัดการเอกสารขอซื้อ / สั่งซื้อ</p>
            </div>
          </div>
          
          <div className="flex space-x-2 bg-slate-200/60 p-1.5 rounded-2xl w-fit border border-slate-200 self-start xl:self-end">
              <button onClick={() => { setActiveMainTab('PR'); setSearchTerm(''); setStartDate(''); setEndDate(''); }} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeMainTab === 'PR' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                  <FileText size={18} /> ใบขอซื้อ (PR)
              </button>
              <button onClick={() => { setActiveMainTab('PO'); setSearchTerm(''); setStartDate(''); setEndDate(''); }} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeMainTab === 'PO' ? 'bg-blue-700 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                  <ShoppingCart size={18} /> ใบสั่งซื้อ (PO)
              </button>
          </div>

          {activeMainTab === 'PR' ? (
              <button onClick={() => router.push('/purchasing/pr')} className="w-full xl:w-auto bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 px-5 py-2.5 md:py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 transition active:scale-95 text-sm md:text-base whitespace-nowrap">
                <Plus size={20} strokeWidth={3} /> สร้างใบ PR
              </button>
          ) : (
              <button onClick={() => router.push('/purchasing/create-po')} className="w-full xl:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 md:py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition active:scale-95 text-sm md:text-base whitespace-nowrap">
                <Plus size={20} strokeWidth={3} /> เปิดบิล PO ใหม่
              </button>
          )}
        </div>

        {/* 🔍 กล่องค้นหาและกรองวันที่ */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col xl:flex-row gap-4">
          
          {/* พิมพ์ค้นหา */}
          <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-100 transition">
            <Search className="text-slate-400 mr-3" size={20} />
            <input
              type="text"
              placeholder={`ค้นหาเลขที่ ${activeMainTab}...`}
              className="w-full outline-none text-slate-700 placeholder:text-slate-400 font-medium bg-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 📅 เลือกช่วงวันที่ */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition w-full sm:w-auto">
                <CalendarDays className="text-slate-400 mr-2" size={18} />
                <span className="text-xs font-bold text-slate-500 mr-2 whitespace-nowrap">จาก:</span>
                <input type="date" className="bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer w-full sm:w-auto" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            
            <span className="text-slate-400 font-bold hidden sm:block">-</span>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-100 transition w-full sm:w-auto">
                <CalendarDays className="text-slate-400 mr-2" size={18} />
                <span className="text-xs font-bold text-slate-500 mr-2 whitespace-nowrap">ถึง:</span>
                <input type="date" className="bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer w-full sm:w-auto" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>

            {/* ปุ่มเคลียร์วันที่ (จะโชว์ก็ต่อเมื่อมีการเลือกวันที่แล้ว) */}
            {(startDate || endDate) && (
                <button 
                    onClick={() => { setStartDate(''); setEndDate(''); }} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="ล้างตัวกรองวันที่"
                >
                    <X size={20} />
                </button>
            )}
          </div>

        </div>

        {/* Sub-Tabs (เปลี่ยนตามแท็บหลัก) */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
            {activeMainTab === 'PR' ? (
                [
                    { id: 'all', label: 'ทั้งหมด', icon: <Filter size={16}/>, activeClass: 'bg-slate-800 text-white' },
                    { id: 'pending', label: 'รอสั่งซื้อ', icon: <Clock size={16}/>, activeClass: 'bg-orange-500 text-white' },
                    { id: 'po_created', label: 'ออก PO แล้ว / สำเร็จ', icon: <CheckCircle size={16}/>, activeClass: 'bg-green-600 text-white' },
                    { id: 'cancelled', label: 'รายการที่ยกเลิก', icon: <XCircle size={16}/>, activeClass: 'bg-red-500 text-white' }
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActivePrTab(tab.id)} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition whitespace-nowrap shadow-sm ${activePrTab === tab.id ? tab.activeClass : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))
            ) : (
                [
                    { id: 'all', label: 'ทั้งหมด', icon: <Filter size={16}/>, activeClass: 'bg-slate-800 text-white' },
                    { id: 'active', label: 'รอรับของ', icon: <Clock size={16}/>, activeClass: 'bg-blue-600 text-white' },
                    { id: 'history', label: 'ประวัติ/สำเร็จ', icon: <CheckCircle size={16}/>, activeClass: 'bg-green-600 text-white' },
                    { id: 'cancelled', label: 'รายการที่ยกเลิก', icon: <XCircle size={16}/>, activeClass: 'bg-red-500 text-white' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActivePoTab(tab.id)} className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition whitespace-nowrap shadow-sm ${activePoTab === tab.id ? tab.activeClass : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))
            )}
        </div>

        {/* ตารางข้อมูล */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex-1">
          <div className="overflow-x-auto custom-scrollbar h-full">
            <table className="w-full text-sm text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                {activeMainTab === 'PR' ? (
                    <tr>
                        <th className="p-4 pl-6 w-[15%]">เลขที่ PR</th>
                        <th className="p-4 w-[15%]">วันที่ขอ</th>
                        <th className="p-4 w-[25%]">โครงการ / สาขา</th>
                        <th className="p-4 text-center w-[10%]">รายการ</th>
                        <th className="p-4 w-[15%]">สถานะ</th>
                        <th className="p-4 text-center w-[20%]">จัดการ</th>
                    </tr>
                ) : (
                    <tr>
                        <th className="p-4 pl-6 w-[15%]">เลขที่ PO</th>
                        <th className="p-4 w-[15%]">วันที่สั่ง</th>
                        <th className="p-4 w-[25%]">ผู้ขาย (Supplier)</th>
                        <th className="p-4 text-center w-[10%]">รายการ</th>
                        <th className="p-4 text-right w-[15%]">ยอดรวม</th>
                        <th className="p-4 w-[10%]">สถานะ</th>
                        <th className="p-4 text-center w-[10%]">จัดการ</th>
                    </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="7" className="p-10 text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> กำลังโหลดข้อมูล...</td></tr>
                ) : activeMainTab === 'PR' ? (
                    filteredPRList.length > 0 ? (
                        filteredPRList.map((pr) => (
                            <tr key={pr.id} className="bg-white hover:bg-orange-50/30 transition-colors duration-150">
                                <td className="p-4 pl-6 font-mono font-bold text-orange-600 flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" /> {pr.pr_number}
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> {new Date(pr.request_date).toLocaleDateString('th-TH')}</div>
                                </td>
                                <td className="p-4 font-bold text-slate-700">{pr.project_name || '-'}</td>
                                <td className="p-4 text-center text-slate-500 text-xs"><span className="bg-slate-100 px-2 py-1 rounded-md">{pr.item_count} รายการ</span></td>
                                <td className="p-4">{getPRStatusBadge(pr.status)}</td>
                                <td className="p-4 text-center">
                                    <div className="flex justify-center items-center gap-1.5">
                                        <button onClick={() => router.push(`/purchasing/pr/print/${pr.id}`)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition" title="พิมพ์ใบ PR"><Printer size={16} /></button>
                                        
                                        {pr.status === 'Pending' ? (
                                            <>
                                                <button onClick={() => router.push(`/purchasing/pr?edit=${pr.id}`)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded-lg transition" title="แก้ไข"><Edit size={16} /></button>
                                                
                                                <button onClick={() => handleCancelPR(pr.id, pr.pr_number)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition" title="ยกเลิกเอกสาร">
                                                    <Ban size={16} />
                                                </button>
                                                
                                                <button onClick={() => router.push(`/purchasing/create-po?pr_id=${pr.id}`)} className="ml-1 px-3 py-1.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center gap-1" title="นำไปสร้างใบสั่งซื้อ (PO)">
                                                    ออก PO <ArrowRight size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic px-2 py-1 bg-gray-50 rounded-md ml-2 border border-dashed border-gray-200">ล็อกเอกสาร</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="p-20 text-center text-slate-400 flex flex-col items-center gap-2"><FileText size={48} className="text-slate-200 mb-2" /> <span className="text-lg font-bold text-slate-300">ไม่พบใบขอซื้อตามเงื่อนไข</span></td></tr>
                    )
                ) : (
                    filteredPOList.length > 0 ? (
                        filteredPOList.map((po) => (
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
                            <td className="p-4">{getPOStatusBadge(po.status)}</td>
                            <td className="p-4 text-center">
                                <div className="flex justify-center gap-2">
                                
                                <button onClick={() => handleViewPO(po)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="ดูรายละเอียด">
                                    <Eye size={18} />
                                </button>

                                <button 
                                    onClick={() => router.push(`/purchasing/edit-po/${po.id}`)}
                                    disabled={po.status !== 'Pending'} 
                                    className={`p-2 rounded-lg transition ${po.status === 'Pending' ? 'text-slate-400 hover:text-green-600 hover:bg-green-50' : 'text-slate-200 cursor-not-allowed'}`} 
                                    title={po.status === 'Pending' ? "แก้ไขใบสั่งซื้อ" : "ไม่สามารถแก้ไขได้"}
                                >
                                    <Edit size={18} />
                                </button>

                                <button onClick={() => handlePrintPO(po)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="พิมพ์ใบสั่งซื้อ">
                                    <Printer size={18} />
                                </button>

                                <button 
                                        onClick={() => handleCancelPO(po)}
                                        disabled={po.status !== 'Pending'} 
                                        className={`p-2 rounded-lg transition ${po.status === 'Pending' ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-200 cursor-not-allowed'}`} 
                                        title={po.status === 'Pending' ? "ยกเลิกใบสั่งซื้อ" : "ไม่สามารถยกเลิกได้"}
                                    >
                                    <Ban size={18} />
                                </button>
                                </div>
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="7" className="p-20 text-center text-slate-400 flex flex-col items-center gap-2"><ShoppingBag size={48} className="text-slate-200 mb-2" /> <span className="text-lg font-bold text-slate-300">ไม่พบใบสั่งซื้อตามเงื่อนไข</span></td></tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}