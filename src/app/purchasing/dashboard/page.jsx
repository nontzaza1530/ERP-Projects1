'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Clock, TrendingUp, DollarSign, FileText, ArrowRight, Wallet, CheckCircle2 
} from 'lucide-react'; // ✅ เพิ่ม icon ใหม่
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import Link from 'next/link';

export default function PurchasingDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = {
    'Pending': '#f59e0b',
    'Partially Received': '#f97316',
    'Received': '#10b981',
    'Cancelled': '#ef4444'
  };

  const DEFAULT_COLOR = '#64748b';

  useEffect(() => {
    fetch('/api/purchasing/dashboard')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 flex justify-center items-center">
                <p className="text-slate-400 animate-pulse">กำลังโหลดข้อมูลแดชบอร์ด...</p>
            </main>
        </div>
    );
  }

  const { summary, chart, recent } = data;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ภาพรวมการจัดซื้อ (Dashboard)</h1>
          <p className="text-slate-500 text-sm mt-1">สรุปสถานะการสั่งซื้อและการเงิน</p>
        </div>

        {/* --- 1. Stats Cards (ปรับเป็น 4 ช่อง) --- */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: ยอดซื้อสำเร็จ (Actual Spend) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="absolute -right-2.5 -top-2.5 bg-green-50 w-24 h-24 rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition"></div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 size={20}/></div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ยอดซื้อสำเร็จ (จ่ายจริง)</p>
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                    ฿{parseFloat(summary.actual_spend).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                </h3>
            </div>
            <p className="text-[10px] text-green-600 font-medium">ได้รับสินค้าแล้ว</p>
          </div>

          {/* Card 2: ยอดรอรับของ (Pending Spend) */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
             <div className="absolute -right-2.5 -top-2.5 bg-yellow-50 w-24 h-24 rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition"></div>
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Wallet size={20}/></div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ยอดรอรับของ (ประมาณการ)</p>
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                    ฿{parseFloat(summary.pending_spend).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                </h3>
             </div>
             <p className="text-[10px] text-yellow-600 font-medium">ภาระผูกพันที่ต้องจ่าย</p>
          </div>

          {/* Card 3: จำนวนใบ PO */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
             <div className="absolute -right-2.5 -top-2.5 bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition"></div>
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><FileText size={20}/></div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">เอกสารสั่งซื้อ (PO)</p>
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                    {summary.total_po} <span className="text-sm text-slate-400 font-normal">ใบ</span>
                </h3>
             </div>
             <p className="text-[10px] text-slate-400">ทั้งหมดในระบบ</p>
          </div>

          {/* Card 4: รอรับสินค้า */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group">
             <div className="absolute -right-2.5 -top-2.5 bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center opacity-50 group-hover:scale-110 transition"></div>
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Clock size={20}/></div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">รอรับสินค้า</p>
                </div>
                <h3 className="text-2xl font-black text-slate-800">
                    {summary.pending_count} <span className="text-sm text-slate-400 font-normal">รายการ</span>
                </h3>
             </div>
             <p className="text-[10px] text-orange-600 font-medium">ต้องติดตามสถานะ</p>
          </div>

        </div>

        {/* --- Charts & List (ส่วนล่างเหมือนเดิม) --- */}
        <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <TrendingUp size={20} className="text-slate-400"/> สถานะเอกสาร
                    </h3>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chart} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                            <XAxis type="number" hide />
                            <YAxis dataKey="status" type="category" width={120} tick={{fontSize: 12, fontWeight: 'bold', fill: '#64748b'}} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={30}>
                                {chart.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.status] || DEFAULT_COLOR} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-slate-400"/> ล่าสุด
                </h3>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {recent.map((po) => (
                        <div key={po.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition cursor-pointer group">
                            <div>
                                <div className="font-bold text-sm text-blue-600 group-hover:underline">{po.po_number}</div>
                                <div className="text-xs text-slate-500">{po.supplier_name}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-xs text-slate-700">฿{parseFloat(po.total_amount).toLocaleString()}</div>
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 
                                    ${po.status === 'Received' ? 'bg-green-100 text-green-700' : 
                                      po.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                                      'bg-yellow-100 text-yellow-700'}`}>
                                    {po.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                    <Link href="/purchasing/po-list" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 transition">
                        ดูทั้งหมด <ArrowRight size={16}/>
                    </Link>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}