'use client';
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // ดึงข้อมูลแจ้งเตือนทุกๆ 10 วินาที (Polling) หรือดึงตอนโหลดหน้า
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // ตั้งเวลาให้เช็คใหม่ทุก 30 วินาที (Optional)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
        // ถ้ากดเปิด ให้มาร์คว่าอ่านแล้ว
        await fetch('/api/notifications', { method: 'PUT' });
        setUnreadCount(0); // เคลียร์ตัวเลข
    }
  };

  return (
    <div className="relative">
      {/* ปุ่มกระดิ่ง */}
      <button onClick={handleOpen} className="p-2 relative hover:bg-slate-100 rounded-full transition">
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* กล่องข้อความ (Dropdown) */}
      {isOpen && (
        <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-50 font-bold text-slate-700 text-sm">การแจ้งเตือน</div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">ไม่มีการแจ้งเตือนใหม่</div>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif.id} className={`p-3 border-b border-slate-50 text-sm hover:bg-slate-50 transition ${!notif.is_read ? 'bg-blue-50/50' : ''}`}>
                                <p className={`font-medium ${notif.type === 'success' ? 'text-green-600' : notif.type === 'error' ? 'text-red-600' : 'text-slate-800'}`}>
                                    {notif.message}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {new Date(notif.created_at).toLocaleString('th-TH')}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
      )}
    </div>
  );
}