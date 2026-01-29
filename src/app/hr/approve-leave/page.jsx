'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { CheckCircle, XCircle, User, History, ListFilter, Menu } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ApproveLeavePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State สำหรับ Sidebar มือถือ
  const [currentUser, setCurrentUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchRequests();
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const fetchRequests = async () => {
    try {
      const timestamp = new Date().getTime(); 
      const res = await fetch(`/api/employees/leave?all=true&t=${timestamp}`, {
        cache: 'no-store', 
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });

      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const actionText = status === 'approved' ? 'อนุมัติ' : 'ไม่อนุมัติ';
    const confirmColor = status === 'approved' ? '#22c55e' : '#ef4444';

    Swal.fire({
      title: `ยืนยันการ${actionText}?`,
      text: "รายการจะถูกย้ายไปที่แท็บ 'ประวัติการอนุมัติ'",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      confirmButtonText: `ใช่, ${actionText}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/employees/leave/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                status, 
                approver_id: currentUser?.id || 0 
            })
          });

          if (res.ok) {
            Swal.fire('สำเร็จ', `ดำเนินการเรียบร้อยแล้ว`, 'success');
            fetchRequests();
          }
        } catch (error) {
          Swal.fire('Error', 'เกิดข้อผิดพลาด', 'error');
        }
      }
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'history') return req.status !== 'pending';
    return true;
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Sidebar Component (จัดการ Overlay และ Aside ในตัวแล้ว) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col min-h-screen lg:ml-64 transition-all duration-300">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-slate-100 rounded-lg text-slate-600">
                    <Menu size={24} />
                </button>
                <h1 className="text-lg font-bold text-slate-800">อนุมัติการลา</h1>
            </div>
            {requests.filter(r => r.status === 'pending').length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {requests.filter(r => r.status === 'pending').length} รออนุมัติ
                </span>
            )}
        </div>

        <div className="p-4 md:p-8">
            
            {/* Title & Tabs (Desktop Layout) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="hidden lg:flex text-2xl font-bold text-slate-800 items-center gap-2">
                    <CheckCircle className="text-green-600" /> อนุมัติการลา (Approval)
                </h1>

                {/* ปุ่มสลับ Tab */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'pending' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <ListFilter size={16} /> รออนุมัติ
                        {requests.filter(r => r.status === 'pending').length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {requests.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'history' ? 'bg-slate-100 text-slate-700' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <History size={16} /> ประวัติ
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">กำลังโหลด...</div>
                ) : filteredRequests.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3">
                        {activeTab === 'pending' ? <CheckCircle size={48} className="text-slate-200" /> : <History size={48} className="text-slate-200" />}
                        <p>{activeTab === 'pending' ? 'ไม่มีรายการรออนุมัติ' : 'ยังไม่มีประวัติการทำรายการ'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                                <tr>
                                    <th className="p-4 whitespace-nowrap">พนักงาน</th>
                                    <th className="p-4 whitespace-nowrap">ประเภท/เหตุผล</th>
                                    <th className="p-4 whitespace-nowrap">วันที่ลา</th>
                                    <th className="p-4 whitespace-nowrap">จำนวนวัน</th>
                                    <th className="p-4 text-center whitespace-nowrap">สถานะ/จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRequests.map((req) => {
                                    const days = Math.round((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1;
                                    
                                    return (
                                        <tr key={req.id} className="hover:bg-slate-50 transition">
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800 whitespace-nowrap">{req.first_name} {req.last_name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">
                                                    <User size={12}/> {req.position} | {req.departments_name}
                                                </div>
                                            </td>
                                            <td className="p-4 min-w-[200px]">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-md mb-1 inline-block whitespace-nowrap
                                                    ${req.leave_type === 'sick' ? 'bg-red-100 text-red-700' : 
                                                      req.leave_type === 'vacation' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-orange-100 text-orange-700'}`}>
                                                    {req.leave_type === 'sick' ? 'ลาป่วย' : req.leave_type === 'vacation' ? 'พักร้อน' : req.leave_type}
                                                </span>
                                                <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-1" title={req.reason}>"{req.reason}"</p>
                                            </td>
                                            <td className="p-4 text-sm text-slate-700 whitespace-nowrap">
                                                {formatDate(req.start_date)} - {formatDate(req.end_date)}
                                            </td>
                                            <td className="p-4 text-sm font-bold text-slate-800 whitespace-nowrap">
                                                {days} วัน
                                            </td>
                                            <td className="p-4 text-center whitespace-nowrap">
                                                {activeTab === 'pending' ? (
                                                    <div className="flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                            className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition" 
                                                            title="อนุมัติ">
                                                            <CheckCircle size={20} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                            className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition" 
                                                            title="ไม่อนุมัติ">
                                                            <XCircle size={20} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold
                                                        ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {req.status === 'approved' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                                                        {req.status === 'approved' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
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