'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar'; // ✅ Import Sidebar
import { Plus, Search, FileText, Printer, CheckCircle, XCircle } from 'lucide-react';

export default function ReceiptListPage() {
    // ✅ 1. ตั้งค่าเริ่มต้นเป็นอาเรย์ว่าง (ไม่มีข้อมูลจำลองแล้ว)
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ 2. สั่งดึงข้อมูลเมื่อเข้าหน้าเว็บ
    useEffect(() => {
        fetchReceipts();
    }, []);

    const fetchReceipts = async () => {
        try {
            const res = await fetch('/api/accounting/receipts'); 
            
            // เช็คว่ายิง API เจอไหม
            if (!res.ok) {
                console.error("API not found or error");
                setReceipts([]); 
                return;
            }

            const data = await res.json();
            if (data.receipts) {
                setReceipts(data.receipts);
            }
        } catch (error) {
            console.error("Failed to fetch receipts:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper: แสดงสถานะ
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 mx-auto"><CheckCircle size={12}/> สำเร็จ</span>;
            case 'cancelled': return <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 mx-auto"><XCircle size={12}/> ยกเลิก</span>;
            default: return <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            
            {/* Sidebar */}
            <div className="hidden lg:block w-64 shrink-0 h-full bg-slate-900 text-white">
                <Sidebar />
            </div>

            {/* เนื้อหาหลัก */}
            <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="text-green-600" /> ใบเสร็จรับเงิน (Receipts)
                        </h1>
                        <p className="text-slate-500 text-sm">จัดการเอกสารการรับเงินและประวัติการชำระเงิน</p>
                    </div>
                    {/* ปุ่มนี้เดี๋ยวค่อยทำฟังก์ชันสร้างใหม่ หรือสร้างจาก Invoice */}
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-200 transition">
                        <Plus size={20} /> ออกใบเสร็จรับเงินใหม่
                    </button>
                </div>

                {/* Stats Cards (คำนวณยอดจริง) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">เก็บเงินแล้ว (ทั้งหมด)</p>
                            <h3 className="text-3xl font-bold text-green-600">
                                ฿{receipts
                                    .filter(r => r.status === 'completed')
                                    .reduce((sum, r) => sum + (parseFloat(r.grand_total) || 0), 0)
                                    .toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-xl text-green-600"><CheckCircle size={24} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium mb-1">จำนวนเอกสาร</p>
                            <h3 className="text-3xl font-bold text-slate-800">{receipts.length} ใบ</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><FileText size={24} /></div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="ค้นหาเลขที่, ลูกค้า..." 
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-b-2xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50 text-slate-600 text-sm">
                            <tr>
                                <th className="p-4 py-3 font-semibold">เลขที่เอกสาร</th>
                                <th className="p-4 py-3 font-semibold">วันที่</th>
                                <th className="p-4 py-3 font-semibold">ลูกค้า</th>
                                <th className="p-4 py-3 font-semibold text-right">ยอดสุทธิ (บาท)</th>
                                <th className="p-4 py-3 font-semibold text-center">สถานะ</th>
                                <th className="p-4 py-3 font-semibold text-center w-24">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
                            ) : receipts.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">ยังไม่มีข้อมูลใบเสร็จรับเงิน</td></tr>
                            ) : (
                                receipts
                                .filter(rc => 
                                    rc.doc_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    (rc.customer_name && rc.customer_name.toLowerCase().includes(searchTerm.toLowerCase()))
                                )
                                .map((rc) => (
                                <tr key={rc.id} className="hover:bg-slate-50 transition group">
                                    <td className="p-4 font-bold text-green-700">
                                        <Link href={`/accounting/receipts/${rc.id}`} className="hover:underline">
                                            {rc.doc_number}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {new Date(rc.doc_date).toLocaleDateString('th-TH')}
                                    </td>
                                    <td className="p-4 font-medium">{rc.customer_name}</td>
                                    <td className="p-4 text-right font-bold">
                                        {parseFloat(rc.grand_total).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(rc.status || 'completed')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <Link href={`/accounting/receipts/${rc.id}`}>
                                            <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition" title="ดูรายละเอียด / พิมพ์">
                                                <Printer size={18} />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}