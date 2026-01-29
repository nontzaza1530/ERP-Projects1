'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { FileText, Clock, CheckCircle, XCircle, Menu } from 'lucide-react';

export default function LeaveHistoryPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State สำหรับ Sidebar มือถือ

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/leave/history');
        if (res.ok) {
            const data = await res.json();
            setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // ฟังก์ชันแปลงสถานะเป็น Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14}/> อนุมัติแล้ว</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14}/> ถูกปฏิเสธ</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14}/> รออนุมัติ</span>;
    }
  };

  const getLeaveTypeName = (type) => {
      const types = { sick: '🤒 ลาป่วย', business: '💼 ลากิจ', vacation: '🏖️ พักร้อน', other: '📝 อื่นๆ' };
      return types[type] || type;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Sidebar: ส่ง props ไปควบคุมการเปิดปิด */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        
        <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                {/* ปุ่มเปิดเมนูสำหรับมือถือ */}
                <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                    <Menu size={24} />
                </button>

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-blue-600"/> รายการคำขอลาของฉัน
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">ติดตามสถานะและประวัติการลางานทั้งหมด</p>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-sm">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
                        <FileText size={48} className="opacity-20 mb-2"/>
                        <span>ยังไม่มีประวัติการขอลา</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">ประเภท</th>
                                    <th className="px-6 py-4">วันที่ลา</th>
                                    <th className="px-6 py-4">เหตุผล</th>
                                    <th className="px-6 py-4">วันที่ยื่นเรื่อง</th>
                                    <th className="px-6 py-4 text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50 transition group">
                                        <td className="px-6 py-4 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                            {getLeaveTypeName(req.leave_type)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-700">{new Date(req.start_date).toLocaleDateString('th-TH')}</span>
                                                <span className="text-xs text-slate-400">ถึง {new Date(req.end_date).toLocaleDateString('th-TH')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={req.reason}>
                                            {req.reason || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-xs">
                                            {new Date(req.created_at).toLocaleString('th-TH')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(req.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
}