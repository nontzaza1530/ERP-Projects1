'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Wallet, ArrowRight, TrendingUp, AlertCircle, Menu } from 'lucide-react'; // ✅ เพิ่ม Menu icon
import Link from 'next/link';

export default function ProjectCostPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ✅ State สำหรับเปิด/ปิด Sidebar ในมือถือ
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetch('/api/accounting/project-costs')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            'completed': 'bg-green-100 text-green-700 border-green-200',
            'archived': 'bg-gray-100 text-gray-500 border-gray-200',
            'in_progress': 'bg-blue-100 text-blue-700 border-blue-200',
            'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200'
        };
        const label = status ? status.toUpperCase().replace('_', ' ') : 'UNKNOWN';
        return (
            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
                {label}
            </span>
        );
    };

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
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       <Sidebar onClose={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            </aside>

            {/* ✅ 3. Main Content: ปรับ Margin ให้ถูกต้อง */}
            <main className="flex-1 w-full lg:ml-64 transition-all duration-300 min-h-screen flex flex-col">
                <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            {/* ✅ ปุ่มเมนูสำหรับมือถือ */}
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                <Menu size={24} />
                            </button>
                            
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <Wallet className="text-blue-600" /> ติดตามต้นทุนโครงการ (Project Costing)
                                </h1>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">ดูรายการเบิกจ่ายแยกตามโครงการ และวิเคราะห์กำไร/ขาดทุน</p>
                            </div>
                        </div>

                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-bold text-slate-600 w-full md:w-auto text-center md:text-left">
                            โครงการทั้งหมด: <span className="text-blue-600">{projects.length}</span>
                        </div>
                    </div>

                    {/* Project List */}
                    {loading ? (
                        <div className="p-12 text-center text-slate-400">กำลังโหลดข้อมูล...</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            
                            {/* --- 🖥️ Desktop View (Table) --- */}
                            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="p-4 pl-6">ชื่อโครงการ / ลูกค้า</th>
                                            <th className="p-4 text-center">สถานะ</th>
                                            <th className="p-4 text-right">ราคาขาย (Revenue)</th>
                                            <th className="p-4 text-right">ใช้จริง (Actual Cost)</th>
                                            <th className="p-4 text-right">กำไรเบื้องต้น (Profit)</th>
                                            <th className="p-4 text-center">ตรวจสอบ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {projects.map((p) => {
                                            const profit = parseFloat(p.sale_price || 0) - parseFloat(p.total_used || 0);
                                            const percentUsed = p.sale_price > 0 ? (p.total_used / p.sale_price) * 100 : 0;
                                            const isLoss = profit < 0;
                                            const isWarning = percentUsed > 80 && !isLoss;

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50 transition group">
                                                    <td className="p-4 pl-6">
                                                        <div className="font-bold text-slate-800 text-base">{p.project_name}</div>
                                                        <div className="text-xs text-slate-500">{p.customer_name || 'ไม่ระบุลูกค้า'}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {getStatusBadge(p.status)}
                                                    </td>
                                                    <td className="p-4 text-right font-medium text-slate-600">
                                                        {parseFloat(p.sale_price || 0).toLocaleString()}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="font-bold text-red-600">
                                                            {parseFloat(p.total_used || 0).toLocaleString()}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">
                                                            {p.txn_count || 0} รายการ
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className={`font-bold flex items-center justify-end gap-1 ${isLoss ? 'text-red-500' : 'text-green-600'}`}>
                                                            {isLoss && <AlertCircle size={12} />}
                                                            {profit.toLocaleString()}
                                                        </div>
                                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                                                            <div className={`h-full ${isLoss ? 'bg-red-500' : isWarning ? 'bg-orange-400' : 'bg-green-500'}`} style={{ width: `${percentUsed > 100 ? 100 : percentUsed}%` }}></div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <Link href={`/accounting/project-costs/${p.id}`}>
                                                            <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition text-slate-400 shadow-sm">
                                                                <ArrowRight size={18} />
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- 📱 Mobile View (Cards) --- */}
                            <div className="md:hidden space-y-4">
                                {projects.map((p) => {
                                    const profit = parseFloat(p.sale_price || 0) - parseFloat(p.total_used || 0);
                                    const isLoss = profit < 0;

                                    return (
                                        <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{p.project_name}</h3>
                                                    <p className="text-xs text-slate-500">{p.customer_name || 'ไม่ระบุลูกค้า'}</p>
                                                </div>
                                                {getStatusBadge(p.status)}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mb-4">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">ราคาขาย</p>
                                                    <p className="font-bold text-slate-800">฿{parseFloat(p.sale_price || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold">ใช้จริง</p>
                                                    <p className="font-bold text-red-600">฿{parseFloat(p.total_used || 0).toLocaleString()}</p>
                                                    <p className="text-[10px] text-slate-400">{p.txn_count || 0} รายการ</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl mb-3">
                                                <span className="text-sm font-bold text-slate-600">กำไรสุทธิ</span>
                                                <span className={`text-lg font-bold flex items-center gap-1 ${isLoss ? 'text-red-600' : 'text-green-600'}`}>
                                                    {isLoss && <AlertCircle size={14} />}
                                                    {profit >= 0 ? '+' : ''}{profit.toLocaleString()}
                                                </span>
                                            </div>

                                            <Link href={`/accounting/project-costs/${p.id}`} className="block w-full">
                                                <button className="w-full py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition flex justify-center items-center gap-2">
                                                    ตรวจสอบรายละเอียด <ArrowRight size={16}/>
                                                </button>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}