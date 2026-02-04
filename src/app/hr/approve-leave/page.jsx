'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar'; // ตรวจสอบ path ให้ถูกต้อง
import { CheckCircle, XCircle, User, History, ListFilter, Menu, Search, Calendar, FileText } from 'lucide-react'; // ✅ เพิ่ม Icon
import Swal from 'sweetalert2';

export default function ApproveLeavePage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ State สำหรับ Sidebar มือถือ
  const [currentUser, setCurrentUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
    const userStr = localStorage.getItem('user');
    if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const fetchRequests = async () => {
    try {
      const timestamp = new Date().getTime(); 
      // ใช้ API ดึงข้อมูล (จำลอง query string)
      const res = await fetch(`/api/employees/leave?all=true&t=${timestamp}`, {
        cache: 'no-store', 
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });

      if (res.ok) {
          const data = await res.json();
          setRequests(data);
      } else {
          // Mock Data กรณี API ยังไม่พร้อม
          setRequests([
              { id: 1, first_name: 'สมชาย', last_name: 'ใจดี', position: 'Developer', departments_name: 'IT', leave_type: 'sick', start_date: '2024-02-10', end_date: '2024-02-11', reason: 'ป่วยเป็นไข้หวัด', status: 'pending' },
              { id: 2, first_name: 'วิภาดา', last_name: 'รักงาน', position: 'Accountant', departments_name: 'Finance', leave_type: 'vacation', start_date: '2024-02-15', end_date: '2024-02-18', reason: 'ไปเที่ยวต่างจังหวัด', status: 'approved' },
          ]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    const actionText = status === 'approved' ? 'อนุมัติ' : 'ไม่อนุมัติ';
    const confirmColor = status === 'approved' ? '#10b981' : '#ef4444';

    Swal.fire({
      title: `ยืนยันการ${actionText}?`,
      text: "รายการจะถูกบันทึกและแจ้งเตือนพนักงาน",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      confirmButtonText: `ใช่, ${actionText}`,
      cancelButtonText: 'ยกเลิก'
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
            Swal.fire('สำเร็จ', `ดำเนินการ${actionText}เรียบร้อยแล้ว`, 'success');
            fetchRequests(); // โหลดข้อมูลใหม่
          } else {
            throw new Error('Update failed');
          }
        } catch (error) {
          Swal.fire('Error', 'เกิดข้อผิดพลาดในการบันทึก', 'error');
        }
      }
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // แปลงประเภทการลาเป็นไทย
  const getLeaveTypeName = (type) => {
      const types = { sick: '🤒 ลาป่วย', business: '💼 ลากิจ', vacation: '🏖️ พักร้อน', other: '📝 อื่นๆ' };
      return types[type] || type;
  };

  // Filter Logic
  const filteredRequests = requests.filter(req => {
    // 1. กรองตาม Tab
    if (activeTab === 'pending' && req.status !== 'pending') return false;
    if (activeTab === 'history' && req.status === 'pending') return false;

    // 2. กรองตาม Search Term
    const fullName = `${req.first_name} ${req.last_name}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || (req.reason && req.reason.toLowerCase().includes(searchLower));
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      
      {/* ✅ 1. Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* ✅ 2. Sidebar Container */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
      </aside>

      {/* ✅ 3. Main Content */}
      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div className="flex items-center gap-3">
                {/* ✅ ปุ่มเมนูมือถือ */}
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                    <Menu size={24} />
                </button>
                
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle className="text-green-600" /> อนุมัติการลา (Approval)
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">จัดการคำขอลางานของพนักงานในสังกัด</p>
                </div>
            </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Tabs */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex w-full md:w-auto">
                <button 
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 md:flex-none justify-center px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'pending' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <ListFilter size={16} /> รออนุมัติ
                    {requests.filter(r => r.status === 'pending').length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                            {requests.filter(r => r.status === 'pending').length}
                        </span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 md:flex-none justify-center px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${activeTab === 'history' ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <History size={16} /> ประวัติการอนุมัติ
                </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full md:w-80 ml-auto">
                <Search size={18} className="absolute left-3 top-3 text-slate-400"/>
                <input 
                    type="text" 
                    placeholder="ค้นหาชื่อ หรือ เหตุผล..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 transition shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Table Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
            {loading ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3 m-auto">
                    <div className="w-8 h-8 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
                    <span className="text-sm">กำลังโหลดข้อมูล...</span>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-3 m-auto">
                    {activeTab === 'pending' ? <CheckCircle size={48} className="text-slate-200" /> : <History size={48} className="text-slate-200" />}
                    <p>{activeTab === 'pending' ? 'ไม่มีรายการรออนุมัติ' : 'ไม่พบประวัติการทำรายการ'}</p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                            <tr>
                                <th className="p-4 pl-6 whitespace-nowrap w-[25%]">พนักงาน</th>
                                <th className="p-4 whitespace-nowrap w-[15%]">ประเภท</th>
                                <th className="p-4 whitespace-nowrap w-[20%]">ช่วงเวลา / เหตุผล</th>
                                <th className="p-4 whitespace-nowrap w-[10%] text-center">จำนวนวัน</th>
                                <th className="p-4 text-center whitespace-nowrap w-[20%]">สถานะ / จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRequests.map((req) => {
                                const days = Math.round((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1;
                                
                                return (
                                    <tr key={req.id} className="hover:bg-slate-50 transition group">
                                        <td className="p-4 pl-6 align-top">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">
                                                    {req.first_name ? req.first_name.charAt(0) : '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{req.first_name} {req.last_name}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <User size={10}/> {req.position} | {req.departments_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold mb-1
                                                ${req.leave_type === 'sick' ? 'bg-red-50 text-red-700' : 
                                                  req.leave_type === 'vacation' ? 'bg-blue-50 text-blue-700' : 
                                                  'bg-orange-50 text-orange-700'}`}>
                                                {getLeaveTypeName(req.leave_type)}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col text-sm">
                                                <span className="font-bold text-slate-700 flex items-center gap-1">
                                                    <Calendar size={12} className="text-slate-400"/> {formatDate(req.start_date)} - {formatDate(req.end_date)}
                                                </span>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-1 flex items-center gap-1" title={req.reason}>
                                                    <FileText size={10}/> {req.reason || '-'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center font-bold text-slate-800 align-top">
                                            {days} วัน
                                        </td>
                                        <td className="p-4 text-center align-top">
                                            {activeTab === 'pending' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition shadow-sm border border-green-200" 
                                                        title="อนุมัติ">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                        className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm border border-red-200" 
                                                        title="ไม่อนุมัติ">
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border
                                                    ${req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
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
      </main>
    </div>
  );
}