'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import {
    FileSignature, Plus, Search, Loader2, Calendar, Edit, Printer, Briefcase, Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function ProjectQuotationsHub() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/accounting/project-quotations');
            if (res.ok) {
                const data = await res.json();
                setQuotations(data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold border border-orange-200">รออนุมัติ</span>;
            case 'Approved': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-200">อนุมัติแล้ว</span>;
            case 'Invoiced': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold border border-green-200">ออกใบแจ้งหนี้แล้ว</span>;
            case 'Cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold border border-red-200">ยกเลิก</span>;
            default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[11px] font-bold">{status}</span>;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Project': return '🏢';
            case 'Service': return '🛠️';
            case 'Custom': return '📦';
            default: return '📄';
        }
    };

    const filteredList = quotations.filter(q =>
        (q.quotation_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.project_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
            {/* พื้นหลังสีดำตอนเปิดเมนูมือถือ */}
            <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full relative flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            </aside>

            <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                            <Menu size={24} />
                        </button>
                        <FileSignature className="text-blue-600 hidden sm:block" size={32} />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                <FileSignature className="text-blue-600 sm:hidden" size={28} />
                                ใบเสนอราคา (Quotations)
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">จัดการใบเสนอราคา งานโปรเจกต์ และงานบริการ</p>
                        </div>
                    </div>

                    <button onClick={() => router.push('/accounting/project-quotations/create')} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition active:scale-95 text-sm">
                        <Plus size={20} strokeWidth={3} /> สร้างใบเสนอราคา
                    </button>
                </div>

                {/* ค้นหา */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="ค้นหาเลขที่เอกสาร, ชื่อลูกค้า หรือ ชื่องาน..."
                        className="flex-1 outline-none text-slate-700 placeholder:text-slate-400 font-medium bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* ตาราง */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex-1">
                    <div className="overflow-x-auto custom-scrollbar h-full">
                        <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="p-4 pl-6 w-[15%]">เลขที่เอกสาร</th>
                                    <th className="p-4 w-[15%]">วันที่เสนอราคา</th>
                                    <th className="p-4 w-[25%]">ลูกค้า / ชื่องาน</th>
                                    <th className="p-4 text-right w-[15%]">ยอดรวมสุทธิ</th>
                                    <th className="p-4 text-center w-[15%]">สถานะ</th>
                                    <th className="p-4 text-center w-[15%]">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr><td colSpan="6" className="p-10 text-center text-slate-400"><Loader2 className="animate-spin inline mr-2" /> กำลังโหลดข้อมูล...</td></tr>
                                ) : filteredList.length > 0 ? (
                                    filteredList.map((qt) => (
                                        <tr key={qt.id} className="bg-white hover:bg-blue-50/30 transition-colors duration-150">
                                            <td className="p-4 pl-6 font-mono font-bold text-blue-600 flex items-center gap-2">
                                                {qt.quotation_number}
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> {new Date(qt.issue_date).toLocaleDateString('th-TH')}</div>
                                                {qt.billing_date && <div className="text-[10px] text-orange-500 mt-1 font-bold flex items-center gap-1">⏱️ กำหนดบิล: {new Date(qt.billing_date).toLocaleDateString('th-TH')}</div>}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800">{qt.customer_name}</div>
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    {getTypeIcon(qt.quotation_type)} {qt.project_name}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right font-black text-slate-800">฿{parseFloat(qt.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-center">{getStatusBadge(qt.status)}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center items-center gap-1.5">
                                                    {/* เปลี่ยนจาก <button> ธรรมดา ให้มี onClick */}
                                                    <button
                                                        onClick={() => router.push(`/accounting/project-quotations/edit/${qt.id}`)}
                                                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded-lg transition"
                                                        title="แก้ไขเอกสาร"
                                                    >
                                                        <Edit size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => window.open(`/accounting/project-quotations/print/${qt.id}`, '_blank')}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg transition"
                                                        title="พิมพ์ใบเสนอราคา / โหลด PDF"
                                                    >
                                                        <Printer size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="p-20 text-center text-slate-400 flex flex-col items-center gap-2"><Briefcase size={48} className="text-slate-200 mb-2" /> <span className="text-lg font-bold text-slate-300">ไม่พบใบเสนอราคา</span></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}