'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Wallet, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProjectCostPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ดึงข้อมูลจาก API ที่เราเพิ่งสร้าง
        fetch('/api/accounting/project-costs')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Wallet className="text-blue-600" /> ติดตามต้นทุนโครงการ (Project Costing)
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">ดูรายการเบิกจ่ายแยกตามโครงการ และวิเคราะห์กำไร/ขาดทุน</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-bold text-slate-600">
                        โครงการทั้งหมด: <span className="text-blue-600">{projects.length}</span>
                    </div>
                </div>

                {/* ตารางแสดงข้อมูล */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                            {loading ? (
                                <tr><td colSpan="6" className="p-6 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
                            ) : projects.map((p) => {
                                const profit = parseFloat(p.sale_price) - parseFloat(p.total_used);
                                const percentUsed = p.sale_price > 0 ? (p.total_used / p.sale_price) * 100 : 0;

                                // แจ้งเตือนถ้างบใกล้หมด หรือขาดทุน
                                const isLoss = profit < 0;
                                const isWarning = percentUsed > 80 && !isLoss;

                                return (
                                    <tr key={p.id} className="hover:bg-slate-50 transition group">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-slate-800 text-base">{p.project_name}</div>
                                            <div className="text-xs text-slate-500">{p.customer_name || 'ไม่ระบุลูกค้า'}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border 
                            ${p.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200'
                                                    : p.status === 'archived' ? 'bg-gray-100 text-gray-500 border-gray-200'
                                                        : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                                {p.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium text-slate-600">
                                            {parseFloat(p.sale_price).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="font-bold text-red-600">
                                                {parseFloat(p.total_used).toLocaleString()}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {p.txn_count} รายการ
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
            </main>
        </div>
    );
}