'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { 
    Plus, Search, FileText, CheckCircle, XCircle, Printer 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/accounting/invoices');
            const data = await res.json();
            if (data.invoices) {
                setInvoices(data.invoices);
            }
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ ปรับปรุงฟังก์ชันอัปเดตสถานะให้รองรับการกรอกภาษีหัก ณ ที่จ่าย (WHT)
    const handleUpdateStatus = async (id, currentStatus, newStatus) => {
        if (newStatus === 'paid') {
            const inv = invoices.find(i => i.id === id);
            const totalAmount = parseFloat(inv.grand_total) || 0;

            const { value: formValues } = await Swal.fire({
                title: 'บันทึกการรับชำระเงิน',
                html: `
                    <div class="text-left p-2">
                        <div class="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">ยอดเงินตามใบแจ้งหนี้</p>
                            <p class="text-xl font-bold text-slate-800">฿${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">ภาษีหัก ณ ที่จ่าย (WHT)</label>
                        <input id="swal-wht" class="swal2-input !m-0 !w-full" placeholder="0.00" type="number" step="0.01">
                        <p class="mt-2 text-[11px] text-slate-400 italic">* ยอดนี้จะถูกนำไปลบออกจากยอดรับสุทธิในใบเสร็จ</p>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'ยืนยันรับชำระเงิน',
                confirmButtonColor: '#10b981',
                cancelButtonText: 'ยกเลิก',
                preConfirm: () => {
                    const wht = document.getElementById('swal-wht').value || 0;
                    return { wht_amount: parseFloat(wht) };
                }
            });

            if (formValues) {
                await executeUpdate(id, newStatus, formValues.wht_amount);
            }
        } else {
            // กรณีอื่นๆ (เช่น ยกเลิกเอกสาร)
            const result = await Swal.fire({
                title: 'ต้องการยกเลิกเอกสาร?',
                text: "เอกสารจะถูกยกเลิกและไม่สามารถแก้ไขได้",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'ใช่, ยกเลิกเลย',
                cancelButtonText: 'ปิด'
            });

            if (result.isConfirmed) {
                await executeUpdate(id, newStatus, 0);
            }
        }
    };

    // ฟังก์ชันแยกสำหรับยิง API
    const executeUpdate = async (id, status, wht_amount) => {
        try {
            const res = await fetch(`/api/accounting/invoices/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: status,
                    wht_amount: wht_amount // ✅ ส่งยอดภาษีไปให้หลังบ้านคำนวณ
                })
            });

            if (!res.ok) throw new Error('Update failed');

            setInvoices(prev => prev.map(inv => 
                inv.id === id ? { ...inv, status: status } : inv
            ));

            Swal.fire({
                title: 'สำเร็จ!',
                text: status === 'paid' ? 'บันทึกรับเงินและสร้างใบเสร็จแล้ว' : 'ยกเลิกเอกสารแล้ว',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire('เกิดข้อผิดพลาด', error.message, 'error');
        }
    };

    const summary = {
        pending: invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + (parseFloat(i.grand_total) || 0), 0),
        paid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (parseFloat(i.grand_total) || 0), 0),
        pendingCount: invoices.filter(i => i.status === 'sent').length
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[11px] font-bold flex w-fit items-center gap-1 mx-auto"><CheckCircle size={12}/> ชำระแล้ว</span>;
            case 'sent': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[11px] font-bold flex w-fit items-center gap-1 mx-auto"><FileText size={12}/> รอชำระ</span>;
            case 'cancelled': return <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[11px] font-bold flex w-fit items-center gap-1 mx-auto"><XCircle size={12}/> ยกเลิก</span>;
            default: return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[11px] font-bold mx-auto">{status}</span>;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            <div className="hidden lg:block w-64 shrink-0 h-full bg-slate-900 text-white">
                <Sidebar />
            </div>

            <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-blue-600" /> ใบแจ้งหนี้ (Invoices)
                        </h1>
                        <p className="text-slate-500 text-sm">จัดการเอกสารวางบิลและติดตามสถานะ</p>
                    </div>
                    <Link href="/accounting/invoices/create">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition active:scale-95">
                            <Plus size={20} /> ออกใบแจ้งหนี้ใหม่
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">รอชำระเงิน ({summary.pendingCount} ใบ)</p>
                            <h3 className="text-3xl font-bold text-orange-500">฿{summary.pending.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-2xl text-orange-500"><FileText size={28} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">ชำระแล้ว (ทั้งหมด)</p>
                            <h3 className="text-3xl font-bold text-green-600">฿{summary.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
                        </div>
                        <div className="p-4 bg-green-50 rounded-2xl text-green-600"><CheckCircle size={28} /></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="ค้นหาเลขที่เอกสาร, ชื่อลูกค้า..." 
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                                <tr>
                                    <th className="p-4 border-b">เลขที่เอกสาร</th>
                                    <th className="p-4 border-b">วันที่</th>
                                    <th className="p-4 border-b">ลูกค้า</th>
                                    <th className="p-4 border-b text-right">ยอดสุทธิ (บาท)</th>
                                    <th className="p-4 border-b text-center">สถานะ</th>
                                    <th className="p-4 border-b text-center w-40">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700 divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-12 text-center text-slate-400 animate-pulse font-medium">กำลังโหลดข้อมูลเอกสาร...</td></tr>
                                ) : invoices.length === 0 ? (
                                    <tr><td colSpan="6" className="p-12 text-center text-slate-400 font-medium">ไม่พบข้อมูลใบแจ้งหนี้</td></tr>
                                ) : (
                                    invoices
                                    .filter(inv => 
                                        inv.doc_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                        inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/80 transition group">
                                            <td className="p-4 font-bold text-blue-600 tracking-tight">{inv.doc_number}</td>
                                            <td className="p-4 text-slate-500">{new Date(inv.doc_date).toLocaleDateString('th-TH')}</td>
                                            <td className="p-4 font-medium text-slate-800">{inv.customer_name}</td>
                                            <td className="p-4 text-right font-bold text-slate-900">
                                                {parseFloat(inv.grand_total).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </td>
                                            <td className="p-4">{getStatusBadge(inv.status)}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-1.5 opacity-90 group-hover:opacity-100">
                                                    <Link href={`/accounting/invoices/${inv.id}`}>
                                                        <button title="พิมพ์เอกสาร" className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                                            <Printer size={16} />
                                                        </button>
                                                    </Link>

                                                    {inv.status === 'sent' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(inv.id, inv.status, 'paid')}
                                                            title="รับชำระเงิน"
                                                            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}

                                                    {inv.status !== 'cancelled' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(inv.id, inv.status, 'cancelled')}
                                                            title="ยกเลิก"
                                                            className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}