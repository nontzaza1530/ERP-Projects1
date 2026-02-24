'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { 
    Plus, Search, FileText, CheckCircle, Clock, 
    Ban, Eye, Edit, Trash2, Menu, X, FileSpreadsheet,
    ChevronLeft, ChevronRight, Calendar, AlertTriangle // ✅ Import AlertTriangle เพิ่ม
} from 'lucide-react';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States สำหรับการค้นหาและกรอง
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); 
    const [filterDate, setFilterDate] = useState(''); 

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // ✅ State สำหรับระบบ Pop-up ยืนยันการกระทำ
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        invoiceId: null,
        actionType: null // 'paid' หรือ 'cancelled'
    });
    const [isProcessing, setIsProcessing] = useState(false); // สถานะตอนกำลังโหลด API

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/accounting/invoices');
            if (res.ok) {
                const data = await res.json();
                setInvoices(data.invoices || []);
            }
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, filterDate]);

    // ✅ ฟังก์ชันเปิด Pop-up แทนการใช้ window.confirm
    const openConfirmModal = (id, type) => {
        setConfirmModal({
            isOpen: true,
            invoiceId: id,
            actionType: type
        });
    };

    // ✅ ฟังก์ชันปิด Pop-up
    const closeConfirmModal = () => {
        if (!isProcessing) {
            setConfirmModal({ isOpen: false, invoiceId: null, actionType: null });
        }
    };

    // ✅ ฟังก์ชันกดยืนยันใน Pop-up แล้วยิง API
    const executeUpdateStatus = async () => {
        setIsProcessing(true);
        const { invoiceId, actionType } = confirmModal;

        try {
            const res = await fetch(`/api/accounting/invoices/${invoiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: actionType })
            });

            if (res.ok) {
                await fetchInvoices(); // โหลดข้อมูลตารางใหม่
                closeConfirmModal();   // ปิด Pop-up
            } else {
                const errorData = await res.json();
                alert(`❌ เกิดข้อผิดพลาด: ${errorData.error || 'ไม่สามารถอัปเดตได้'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server");
        } finally {
            setIsProcessing(false);
        }
    };

    // 🧮 สรุปยอด
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'pending');
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');

    const totalPendingAmount = pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.grand_total || 0), 0);
    const totalPaidAmount = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.grand_total || 0), 0);

    // 🔍 กรองข้อมูล
    const filteredInvoices = invoices.filter(inv => {
        const matchSearch = 
            (inv.doc_number && inv.doc_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (inv.customer_name && inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchTab = activeTab === 'all' || inv.status === activeTab;

        let matchDate = true;
        if (filterDate) {
            const d = new Date(inv.doc_date);
            const invDateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            matchDate = invDateString === filterDate;
        }

        return matchSearch && matchTab && matchDate;
    });

    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> ชำระแล้ว</span>;
            case 'cancelled':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Ban size={14}/> ยกเลิก</span>;
            case 'sent':
            case 'pending':
            default:
                return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> รอชำระเงิน</span>;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
            <div className="hidden lg:block w-64 shrink-0 h-full bg-slate-900 text-white z-20"><Sidebar /></div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-64 h-full bg-slate-900 shadow-xl">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* --- ✨ ส่วนของ Modal Pop-up สวยๆ --- */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    {/* Backdrop เบลอๆ */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeConfirmModal}></div>
                    
                    {/* กล่องข้อความ */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
                        {/* ไอคอนตามประเภท */}
                        <div className="flex justify-center mb-4">
                            {confirmModal.actionType === 'paid' ? (
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                    <CheckCircle size={32} />
                                </div>
                            ) : (
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                                    <AlertTriangle size={32} />
                                </div>
                            )}
                        </div>

                        {/* ข้อความอธิบาย */}
                        <h2 className="text-xl font-bold text-slate-800 mb-2">
                            {confirmModal.actionType === 'paid' ? 'ยืนยันรับชำระเงิน?' : 'ยืนยันยกเลิกเอกสาร?'}
                        </h2>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            {confirmModal.actionType === 'paid' 
                                ? 'ระบบจะเปลี่ยนสถานะเป็น "ชำระแล้ว" และสร้างใบเสร็จรับเงินให้อัตโนมัติ' 
                                : 'เอกสารใบนี้จะถูกเปลี่ยนสถานะเป็น "ยกเลิก" และไม่นำมาคำนวณในยอดรวม'}
                        </p>

                        {/* ปุ่มกด */}
                        <div className="flex gap-3">
                            <button 
                                onClick={closeConfirmModal}
                                disabled={isProcessing}
                                className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={executeUpdateStatus}
                                disabled={isProcessing}
                                className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 ${
                                    confirmModal.actionType === 'paid' 
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        กำลังบันทึก...
                                    </span>
                                ) : (
                                    confirmModal.actionType === 'paid' ? 'ยืนยันชำระเงิน' : 'ยืนยันยกเลิก'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- จบส่วน Modal --- */}

            <main className="flex-1 h-full overflow-y-auto w-full">
                <div className="lg:hidden bg-white p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu size={24} /></button>
                        <span className="font-bold text-slate-800">ระบบบัญชี</span>
                    </div>
                </div>

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="text-blue-600" size={28} /> ใบแจ้งหนี้ (Invoices)
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">จัดการเอกสารวางบิลและติดตามสถานะ</p>
                        </div>
                        <Link href="/accounting/invoices/create">
                            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition">
                                <Plus size={20} /> ออกใบแจ้งหนี้ใหม่
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm flex justify-between items-center relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 bg-orange-50 w-24 h-24 rounded-full opacity-50"></div>
                            <div className="relative z-10">
                                <p className="text-slate-500 font-bold mb-1 text-sm">รอชำระเงิน ({pendingInvoices.length} ใบ)</p>
                                <h2 className="text-3xl font-black text-orange-600">฿{totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center relative z-10">
                                <FileSpreadsheet size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm flex justify-between items-center relative overflow-hidden">
                            <div className="absolute -right-4 -bottom-4 bg-green-50 w-24 h-24 rounded-full opacity-50"></div>
                            <div className="relative z-10">
                                <p className="text-slate-500 font-bold mb-1 text-sm">ชำระแล้ว (ทั้งหมด)</p>
                                <h2 className="text-3xl font-black text-green-600">฿{totalPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                            </div>
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center relative z-10">
                                <CheckCircle size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        
                        <div className="p-4 border-b border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-50/50">
                            <div className="flex bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto custom-scrollbar">
                                {[
                                    { id: 'all', label: 'ภาพรวมทั้งหมด' },
                                    { id: 'sent', label: 'รอชำระเงิน', count: pendingInvoices.length },
                                    { id: 'paid', label: 'ชำระแล้ว' },
                                    { id: 'cancelled', label: 'ยกเลิก' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 xl:flex-none px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                                            activeTab === tab.id 
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50' 
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                    >
                                        {tab.label}
                                        {tab.count > 0 && (
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500'}`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
                                <div className="relative w-full sm:w-auto flex items-center">
                                    <input 
                                        type="date" 
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className={`w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium ${filterDate ? 'text-blue-600 border-blue-300' : 'text-slate-800'}`}
                                    />
                                    {filterDate && (
                                        <button 
                                            onClick={() => setFilterDate('')}
                                            className="absolute right-3 p-1 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-full transition"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="relative w-full sm:w-72 shrink-0">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="ค้นหาเลขที่เอกสาร, ชื่อลูกค้า..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-sm font-medium text-slate-800 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-bold">เลขที่เอกสาร</th>
                                        <th className="p-4 font-bold">วันที่</th>
                                        <th className="p-4 font-bold">ลูกค้า / โครงการ</th>
                                        <th className="p-4 font-bold text-right">ยอดสุทธิ (บาท)</th>
                                        <th className="p-4 font-bold text-center">สถานะ</th>
                                        <th className="p-4 font-bold text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-slate-400">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    กำลังโหลดข้อมูล...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedInvoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-12 text-center text-slate-400">
                                                <FileText size={40} className="mx-auto mb-3 opacity-20" />
                                                <p className="text-lg font-bold text-slate-600">ไม่พบข้อมูลใบแจ้งหนี้</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedInvoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50 transition group">
                                                <td className="p-4">
                                                    <span className="font-bold text-slate-800">{inv.doc_number}</span>
                                                </td>
                                                <td className="p-4 text-slate-600 font-medium">
                                                    {new Date(inv.doc_date).toLocaleDateString('th-TH')}
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-slate-800">{inv.customer_name}</p>
                                                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{inv.project_name || 'ทั่วไป'}</p>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="font-bold text-slate-800">
                                                        {parseFloat(inv.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                                <td className="p-4 flex justify-center">
                                                    {getStatusBadge(inv.status)}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        
                                                        <Link href={`/accounting/invoices/${inv.id}`}>
                                                            <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition" title="ดู/พิมพ์ PDF">
                                                                <Eye size={16} />
                                                            </button>
                                                        </Link>

                                                        {/* ✅ เปลี่ยนเป็นเรียกเปิด Pop-up แทน */}
                                                        {(inv.status === 'sent' || inv.status === 'pending') && (
                                                            <>
                                                                <Link href={`/accounting/invoices/edit/${inv.id}`}>
                                                                    <button className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white rounded-lg transition" title="แก้ไขเอกสาร">
                                                                        <Edit size={16} />
                                                                    </button>
                                                                </Link>
                                                                
                                                                <button 
                                                                    onClick={() => openConfirmModal(inv.id, 'paid')}
                                                                    className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition" 
                                                                    title="บันทึกรับชำระเงิน"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                </button>
                                                                
                                                                <button 
                                                                    onClick={() => openConfirmModal(inv.id, 'cancelled')}
                                                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition" 
                                                                    title="ยกเลิกเอกสาร"
                                                                >
                                                                    <Ban size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {!loading && filteredInvoices.length > 0 && (
                            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
                                <div>
                                    แสดง <span className="font-bold text-slate-800">{startIndex + 1}</span> ถึง <span className="font-bold text-slate-800">{Math.min(startIndex + ITEMS_PER_PAGE, filteredInvoices.length)}</span> จากทั้งหมด <span className="font-bold text-slate-800">{filteredInvoices.length}</span> รายการ
                                </div>
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"><ChevronLeft size={18} /></button>
                                        <div className="flex items-center gap-1 px-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-md font-bold text-xs transition ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}`}>{i + 1}</button>
                                            ))}
                                        </div>
                                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition"><ChevronRight size={18} /></button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}