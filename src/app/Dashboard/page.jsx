'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar'; 
import UserProfile from '../../components/UserProfile'; 
import Link from 'next/link';
import { 
  Users, Package, DollarSign, Activity, FileText, Bell, 
  ArrowRight, TrendingUp, AlertCircle, CalendarDays,
  Clock, PlusCircle, Box, Menu, X, AlertTriangle, Info, CheckCircle,
  History, Wallet, TrendingDown, MoreHorizontal, PieChart, BarChart2,
  FileClock, User
} from 'lucide-react'; 

export default function DashboardPage() {
  
  // --- State User & Data ---
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    employeeCount: 0, stockAlert: 0, todaysSales: 0, pendingDocs: 0, recentActivities: []
  });
  const [leaveStats, setLeaveStats] = useState({ pendingLeaves: 0, whoIsAway: [] });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(null);
  const [activityTab, setActivityTab] = useState('all');
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ เก็บข้อมูล System Activity (ของทุกคน)
  const [systemActivities, setSystemActivities] = useState([]); 

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const userRes = await fetch('/api/me');
        if (userRes.ok) {
           const resJson = await userRes.json();
           setUser(resJson.user);
        }
        
        const [dashRes, leaveRes] = await Promise.all([
             fetch('/api/dashboard'),
             fetch('/api/dashboard/stats')
        ]);
        
        if (dashRes.ok) setDashboardData(await dashRes.json());
        if (leaveRes.ok) setLeaveStats(await leaveRes.json());
        await fetchNotifications();

        // ✅ ดึงข้อมูล Activity ของ "ทั้งระบบ" มาโชว์
        const timelineRes = await fetch('/api/system-activity');
        if (timelineRes.ok) {
            setSystemActivities(await timelineRes.json());
        }

      } catch (err) { 
        console.error("Error fetching data:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    initData();
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotifications = async () => {
    try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
    } catch (error) { console.error("Notif Error:", error); }
  };

  const markAsRead = async (id, link) => {
    try {
        await fetch('/api/notifications', { method: 'PUT', body: JSON.stringify({ id }) });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        setIsNotiOpen(false);
        if (link) window.location.href = link;
    } catch (err) { console.error(err); }
  };

  // Filter (ใช้กับ systemActivities)
  const filteredActivities = activityTab === 'all' ? systemActivities : systemActivities.filter(act => act.type === activityTab);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          <p className="text-slate-400 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // ฟังก์ชันเลือก Icon ตาม Type
  const getActivityIcon = (type) => {
      switch(type) {
          case 'attendance': return <Clock size={14} />;
          case 'document': return <FileText size={14} />;
          case 'hr': return <CalendarDays size={14} />;
          default: return <Activity size={14} />;
      }
  };

  // ฟังก์ชันเลือกสีตาม Type
  const getActivityColor = (type) => {
      switch(type) {
          case 'attendance': return 'bg-blue-100 text-blue-600';
          case 'document': return 'bg-orange-100 text-orange-600';
          case 'hr': return 'bg-purple-100 text-purple-600';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative">
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition z-50"><X size={24} /></button>
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 min-h-screen flex flex-col"> 
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
        
          {/* Header */}
          <header className="flex flex-col-reverse gap-4 md:flex-row md:justify-between md:items-center mb-8">
            <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"><Menu size={24} /></button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">ภาพรวมระบบ</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        ยินดีต้อนรับกลับ, <span className="text-blue-600 font-bold">{user?.first_name || 'Guest'}</span> ({user?.role})
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 md:gap-4">
              <span className="hidden md:inline-block text-sm text-slate-500 font-mono bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                {currentTime ? currentTime.toLocaleTimeString('th-TH') : '...'}
              </span>

              {/* ปุ่ม Check In (สำหรับทุกคน) */}
              <Link href="/attendance">
                <button className="hidden md:flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm font-bold">
                    <Clock size={18} />
                    <span>ลงเวลาเข้างาน</span>
                </button>
                <button className="md:hidden p-2 bg-blue-600 text-white rounded-full shadow-md"><Clock size={20} /></button>
              </Link>

              {/* Notifications */}
              <div className="relative">
                  <button onClick={() => setIsNotiOpen(!isNotiOpen)} className="p-2 bg-white rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm border border-slate-200 relative">
                      <Bell size={20} />
                      {unreadCount > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                  </button>
                  {isNotiOpen && (
                      <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsNotiOpen(false)}></div>
                          <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                              <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                  <span className="font-bold text-slate-700 text-sm">การแจ้งเตือน ({unreadCount})</span>
                                  <button onClick={() => setIsNotiOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                              </div>
                              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                  {notifications.length === 0 ? (
                                      <div className="p-8 text-center text-slate-400 text-sm">ไม่มีการแจ้งเตือนใหม่</div>
                                  ) : (
                                      notifications.map((noti) => (
                                          <div key={noti.id} onClick={() => markAsRead(noti.id, noti.link)} className={`px-4 py-3 border-b border-slate-50 last:border-0 cursor-pointer transition flex gap-3 items-start ${noti.is_read ? 'bg-white opacity-60' : 'bg-blue-50/40'}`}>
                                              <div className={`mt-1 min-w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${noti.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                  {noti.type === 'danger' ? <AlertTriangle size={14}/> : <Info size={14}/>}
                                              </div>
                                              <div>
                                                  <p className="text-sm font-bold text-slate-900">{noti.title}</p>
                                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{noti.message}</p>
                                              </div>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      </>
                  )}
              </div>
              <UserProfile user={user} />
            </div>
          </header>

          {/* ================= DASHBOARD CONTENT ================= */}
          
          {/* 1. Stats Cards (เฉพาะ Admin) */}
          {user?.role === 'super_admin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* 1. ชมพู/แดง (Employees) */}
                <Link href="/hr" className="block h-full group">
                    <div className="bg-linear-to-r from-pink-500 to-rose-500 p-6 rounded-2xl shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden text-white">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-pink-100 text-sm font-medium mb-1">พนักงานทั้งหมด</p>
                                <h3 className="text-3xl font-bold">{loading ? "..." : dashboardData.employeeCount} <span className="text-sm font-normal text-pink-100">คน</span></h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                </Link>
                
                {/* 2. ส้ม (Stock) */}
                <Link href="/inventory" className="block h-full group">
                    <div className="bg-linear-to-r from-orange-400 to-amber-500 p-6 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden text-white">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-orange-100 text-sm font-medium mb-1">สินค้าใกล้หมด</p>
                                <h3 className="text-3xl font-bold">{loading ? "..." : dashboardData.stockAlert} <span className="text-sm font-normal text-orange-100">รายการ</span></h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Package size={24} />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                </Link>

                {/* 3. ม่วง/น้ำเงิน (Sales) */}
                <Link href="/sales" className="block h-full group">
                    <div className="bg-linear-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden text-white">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-purple-100 text-sm font-medium mb-1">ยอดขายวันนี้</p>
                                <h3 className="text-3xl font-bold">฿{loading ? "..." : Number(dashboardData.todaysSales).toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <DollarSign size={24} />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                </Link>

                {/* 4. ฟ้า/เขียว (Leaves) */}
                <Link href="/hr/approve-leave" className="block h-full group">
                    <div className="bg-linear-to-r from-cyan-400 to-teal-500 p-6 rounded-2xl shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden text-white">
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-cyan-100 text-sm font-medium mb-1">คำขอลา (รออนุมัติ)</p>
                                <h3 className="text-3xl font-bold">{loading ? "..." : leaveStats.pendingLeaves}</h3>
                            </div>
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FileText size={24} />
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    </div>
                </Link>
            </div>
          )}

          {/* 2. Charts & Timeline Section */}
          <div className={`grid grid-cols-1 ${user?.role === 'super_admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6 mb-8`}>
              
              {user?.role === 'super_admin' ? (
                <>
                  {/* --- 📈 Financial Curve Chart --- */}
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                      {/* ... (Financial Chart Code เดิม ไม่ต้องแก้) ... */}
                      <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Wallet size={22} className="text-indigo-500"/>
                                ภาพรวมรายรับ (Revenue)
                            </h3>
                            <p className="text-xs text-slate-400">กราฟแสดงยอดขายเปรียบเทียบ 6 เดือนย้อนหลัง</p>
                          </div>
                          <button className="text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-lg"><MoreHorizontal size={20}/></button>
                      </div>
                      <div className="relative h-64 w-full bg-indigo-50/30 rounded-2xl overflow-hidden border border-indigo-100">
                           {/* ... (SVG Graph) ... */}
                           <svg viewBox="0 0 500 150" className="w-full h-full preserve-3d">
                             <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                   <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                                   <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                                </linearGradient>
                             </defs>
                             <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                             <line x1="0" y1="70" x2="500" y2="70" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                             <line x1="0" y1="110" x2="500" y2="110" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                             <path d="M0,150 L0,100 Q100,20 250,80 T500,40 L500,150 Z" fill="url(#gradient)" />
                             <path d="M0,100 Q100,20 250,80 T500,40" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                             <circle cx="0" cy="100" r="4" fill="#6366f1" />
                             <circle cx="250" cy="80" r="4" fill="#6366f1" />
                             <circle cx="500" cy="40" r="4" fill="#6366f1" />
                          </svg>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                             <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><TrendingUp size={20}/></div>
                             <div><p className="text-xs text-slate-500">รายรับรวม</p><p className="text-xl font-bold text-slate-800">฿425,000</p></div>
                          </div>
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><PieChart size={20}/></div>
                             <div><p className="text-xs text-slate-500">กำไรสุทธิ</p><p className="text-xl font-bold text-slate-800">฿120,500</p></div>
                          </div>
                      </div>
                  </div>

                  {/* --- ⏱️ Admin Timeline (ภาพรวมทั้งระบบ) --- */}
                  <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full min-h-[500px]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <History size={20} className="text-pink-500"/>
                                ภาพรวมระบบ
                            </h3>
                            <p className="text-[10px] text-slate-400">กิจกรรมล่าสุดจากพนักงานทุกคน</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setActivityTab('all')} className={`px-2 py-1 text-[10px] font-bold rounded ${activityTab === 'all' ? 'bg-white shadow' : 'text-slate-400'}`}>All</button>
                            <button onClick={() => setActivityTab('document')} className={`px-2 py-1 text-[10px] font-bold rounded ${activityTab === 'document' ? 'bg-white shadow text-orange-500' : 'text-slate-400'}`}>Doc</button>
                        </div>
                      </div>

                      {/* Timeline List (System Wide) */}
                      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                         {filteredActivities.length > 0 ? (
                             <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2 pt-2">
                                 {filteredActivities.map((act) => (
                                     <div key={act.id} className="ml-6 relative group">
                                         <div className={`absolute -left-[31px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 ${getActivityColor(act.type)}`}>
                                             {getActivityIcon(act.type)}
                                         </div>
                                         <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition cursor-default">
                                             <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-xs font-bold text-slate-800">{act.title}</h4>
                                                <span className={`text-[9px] font-bold px-1.5 rounded uppercase ${act.status==='success'?'bg-green-100 text-green-600':'bg-slate-200'}`}>{act.status}</span>
                                             </div>
                                             
                                             {/* ✅ เพิ่มชื่อคนทำตรงนี้ */}
                                             <div className="flex items-center gap-1.5 mt-1 mb-1">
                                                 <User size={10} className="text-slate-400"/>
                                                 <span className="text-[10px] font-semibold text-blue-600">{act.user}</span>
                                                 <span className="text-[9px] text-slate-400">({act.role})</span>
                                             </div>

                                             <p className="text-[10px] text-slate-500 flex items-center gap-2">
                                                 <span>{act.time}</span> • <span>{act.date}</span>
                                             </p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         ) : (
                             // Empty State
                             <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 min-h-[200px]">
                                 <div className="p-4 bg-slate-50 rounded-full animate-pulse">
                                     <FileClock size={32} className="opacity-50"/>
                                 </div>
                                 <p className="font-medium text-sm">ยังไม่มีกิจกรรมในระบบ</p>
                             </div>
                         )}
                      </div>
                      
                      {/* Widgets Bottom */}
                      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                         <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition border border-purple-100">
                            <PlusCircle size={18}/> 
                            <span className="text-[10px] font-bold">สร้าง PO</span>
                         </button>
                         <Link href="/inventory" className="block w-full">
                            <button className="w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100">
                                <Box size={18}/> 
                                <span className="text-[10px] font-bold">เพิ่มสินค้า</span>
                            </button>
                         </Link>
                      </div>
                  </div>
                </>
              ) : (
                 // 🔵 Employee View (อันเดิม ไม่ต้องแก้)
                 <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[500px] flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xl">
                                <History size={24} className="text-blue-600"/>
                                ไทม์ไลน์การทำงาน
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">ประวัติกิจกรรมล่าสุดของคุณ</p>
                        </div>
                        {/* ... (Tabs & Content ของ Employee) ... */}
                    </div>
                    {/* ... (Employee Timeline Logic) ... */}
                 </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}