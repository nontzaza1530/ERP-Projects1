'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar'; // ถอย 4 ชั้น
import { 
  ArrowLeft, Receipt, Calendar, FileText, 
  TrendingUp, AlertCircle, DollarSign, CheckCircle 
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProjectCostDetail() {
  const { id } = useParams(); // รับ ID โปรเจกต์จาก URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลโปรเจกต์และค่าใช้จ่าย
  useEffect(() => {
    // Re-use API ของฝ่ายผลิตได้เลย เพราะข้อมูลชุดเดียวกัน (ประหยัดเวลาทำ API ใหม่)
    fetch(`/api/production/projects/${id}`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="p-10 text-center text-slate-500">กำลังโหลดข้อมูลบัญชี...</div>;
  if (!data || !data.project) return <div className="p-10 text-center text-red-500">ไม่พบข้อมูลโปรเจกต์</div>;

  const { project, costs } = data;
  
  // คำนวณตัวเลขบัญชี
  const totalCost = costs.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const revenue = parseFloat(project.sale_price || 0);
  const profit = revenue - totalCost;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const isLoss = profit < 0;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
        
        {/* Header ย้อนกลับ */}
        <Link href="/accounting/project-costs" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition w-fit group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition"/> กลับหน้ารวมโครงการ
        </Link>

        {/* 1. Project Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-slate-800">{project.project_name}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${project.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                        {project.status}
                    </span>
                </div>
                <p className="text-slate-500 flex items-center gap-2 text-sm">
                    <FileText size={14}/> ลูกค้า: {project.customer_name || '-'} 
                    <span className="text-slate-300">|</span>
                    <Calendar size={14}/> ส่งมอบ: {project.due_date ? new Date(project.due_date).toLocaleDateString('th-TH') : '-'}
                </p>
            </div>
            
            {/* Financial Summary Box */}
            <div className="flex gap-4">
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">ยอดขาย (Revenue)</p>
                    <p className="text-xl font-bold text-blue-600">{revenue.toLocaleString()} ฿</p>
                </div>
                <div className="w-px bg-slate-200 h-10"></div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase">กำไรสุทธิ (Net Profit)</p>
                    <p className={`text-xl font-bold ${isLoss ? 'text-red-500' : 'text-green-600'}`}>
                        {profit.toLocaleString()} ฿
                    </p>
                    <p className={`text-[10px] ${isLoss ? 'text-red-400' : 'text-green-500'}`}>
                        {isLoss ? 'ขาดทุน' : 'กำไร'} {profitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>

        {/* 2. Expense Table (Statement) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Receipt className="text-red-500"/> รายการค่าใช้จ่ายจริง (Expenses)
                </h3>
                <div className="text-sm font-bold text-slate-600">
                    รวมทั้งสิ้น: <span className="text-red-600 text-lg ml-2">-{totalCost.toLocaleString()} ฿</span>
                </div>
            </div>

            {costs && costs.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-500 font-bold border-b border-slate-100 text-xs uppercase">
                            <tr>
                                <th className="p-4 pl-6">วันที่ / เวลา</th>
                                <th className="p-4">รายการ (Description)</th>
                                <th className="p-4">หมวดหมู่</th>
                                <th className="p-4 text-right">จำนวนเงิน</th>
                                <th className="p-4 text-center">หลักฐาน</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {costs.map((c, index) => (
                                <tr key={c.id || index} className="hover:bg-slate-50 transition">
                                    <td className="p-4 pl-6 text-slate-500 font-medium">
                                        {new Date(c.recorded_date).toLocaleDateString('th-TH', { year: '2-digit', month: 'short', day: 'numeric' })}
                                        <div className="text-[10px] text-slate-400">
                                            {new Date(c.created_at || c.recorded_date).toLocaleTimeString('th-TH', { hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-700">{c.title}</div>
                                        {c.description && <div className="text-xs text-slate-400 mt-0.5">{c.description}</div>}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 border border-slate-200 font-medium">
                                            {c.category === 'material' ? 'วัสดุ/อุปกรณ์' 
                                             : c.category === 'labor' ? 'ค่าแรง' 
                                             : c.category === 'subcontractor' ? 'ผู้รับเหมา'
                                             : 'อื่นๆ'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-red-600 tabular-nums">
                                        -{parseFloat(c.amount).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        {c.slip_image ? (
                                            <button 
                                                // ตรงนี้เดี๋ยวค่อยทำ Modal ดูรูป ถ้าต้องการ
                                                onClick={() => window.open(c.slip_image, '_blank')}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto"
                                            >
                                                <FileText size={14}/> ดูสลิป
                                            </button>
                                        ) : (
                                            <span className="text-slate-300 text-xs italic">ไม่มีรูป</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="bg-slate-100 p-4 rounded-full mb-3">
                        <Receipt size={32} className="opacity-50"/>
                    </div>
                    <p>ยังไม่มีรายการค่าใช้จ่ายในโปรเจกต์นี้</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}