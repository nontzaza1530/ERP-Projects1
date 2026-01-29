'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, CheckCircle, User, LogOut, Loader2, X, AlertTriangle, Wifi } from 'lucide-react'; 
import Sidebar from '../../components/Sidebar'; 
import Swal from 'sweetalert2';

/* ================= CONFIG ================= */
// ✅ ใช้ Node-RED ของคุณเป็น Backend หลัก
const API_BASE = 'http://smartg.trueddns.com:37552'; 
/* ========================================= */

export default function AttendancePage() {
  // --- State: Clock & Date ---
  const [currentTime, setCurrentTime] = useState(null);
  const [todayDate, setTodayDate] = useState(null);
  
  // --- State: Data & UI ---
  const [empCode, setEmpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentLog, setRecentLog] = useState(null); // เก็บข้อมูลเพื่อโชว์ Card Animation
  const [present, setPresent] = useState(false);    // สถานะ WiFi (True = อยู่ในวงแลน)
  const [presenceInfo, setPresenceInfo] = useState(null); // ข้อมูล Debug จาก Node-RED

  const inputRef = useRef(null);

  // ✅ 1. Real-time Clock Effect
  useEffect(() => {
    setCurrentTime(new Date());
    setTodayDate(new Date());
    const timer = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        setTodayDate(now);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 2. Auto Reset Recent Log (เคลียร์การ์ดแสดงผลหลัง 5 วิ)
  useEffect(() => {
    let resetTimer;
    if (recentLog) {
        resetTimer = setTimeout(() => {
            setRecentLog(null);
            if(inputRef.current) inputRef.current.focus(); 
        }, 5000);
    }
    return () => clearTimeout(resetTimer); 
  }, [recentLog]);

  // ✅ 3. ฟังก์ชันเช็ค WiFi (ดึง Logic จาก Code 2 มาใช้)
  const checkPresence = async (manual = false) => {
    if (!empCode) {
      if(manual) Swal.fire({ title: 'กรุณากรอกรหัสพนักงาน', icon: 'warning', timer: 1500, showConfirmButton: false });
      setPresent(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/presence/${empCode}`);
      const data = await res.json();

      setPresent(Boolean(data.present)); // แปลงเป็น Boolean
      setPresenceInfo(data);

      if (manual) {
        if (data.present) {
            Swal.fire({ 
                title: 'พบสัญญาณ WiFi', 
                text: `คุณ ${data.name || empCode} อยู่ในพื้นที่บริษัท`, 
                icon: 'success', 
                confirmButtonColor: '#22c55e' 
            });
        } else {
            Swal.fire({ 
                title: 'ไม่พบสัญญาณ WiFi', 
                text: 'กรุณาเชื่อมต่อ WiFi บริษัทก่อนลงเวลา', 
                icon: 'error', 
                confirmButtonColor: '#ef4444' 
            });
        }
      }
    } catch (e) {
      console.error(e);
      setPresent(false);
      if(manual) Swal.fire('Error', 'ไม่สามารถเชื่อมต่อระบบเช็คชื่อได้', 'error');
    }
  };

  // ✅ 4. ฟังก์ชันลงเวลา (ยิงไป Node-RED)
  const submitAttendance = async (actionType) => {
    // actionType: 'check_in' หรือ 'check_out'
    
    if (!empCode.trim()) { 
      return Swal.fire({ title: 'ระบุรหัสพนักงาน', icon: 'warning', confirmButtonColor: '#f59e0b' }); 
    }

    if (!present) {
        return Swal.fire({ 
            title: 'ไม่อยู่ในพื้นที่', 
            text: 'ระบบไม่พบคุณใน WiFi บริษัท กรุณาตรวจสอบการเชื่อมต่อ', 
            icon: 'error', 
            confirmButtonColor: '#ef4444' 
        });
    }
    
    setLoading(true);

    try {
      // เรียก Node-RED API
      const res = await fetch(`${API_BASE}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            emp_id: Number(empCode), // Node-RED อาจต้องการ Number
            action: actionType 
        }),
      });

      const data = await res.json();

      if (data.ok || data.success) { // เช็คทั้ง ok และ success เผื่อ Node-RED ตอบกลับมาต่างกัน
        
        // จำลองข้อมูลเพื่อแสดงผล UI (เพราะ Node-RED อาจส่งกลับมาแค่ success)
        const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        
        setRecentLog({
            name: presenceInfo?.name || empCode, // ใช้ชื่อจาก Presence ถ้ามี
            inTime: actionType === 'check_in' ? nowStr : null,
            outTime: actionType === 'check_out' ? nowStr : null,
            type: actionType === 'check_in' ? 'IN' : 'OUT',
            status: 'On Time', // เบื้องต้นให้ปกติไปก่อน
            lateMinutes: 0
        });
        
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        
        Toast.fire({
          icon: 'success',
          title: actionType === 'check_in' ? 'ลงเวลาเข้างานสำเร็จ' : 'ลงเวลาออกงานสำเร็จ'
        });

        setEmpCode(''); // เคลียร์ช่อง
        setPresent(false); // รีเซ็ตสถานะ WiFi เพื่อให้เช็คใหม่ครั้งหน้า (Optional)
      } else {
        Swal.fire({
          title: 'บันทึกไม่สำเร็จ',
          text: data.message || 'เงื่อนไขไม่ถูกต้อง (เช่น ลงซ้ำ)',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Server Error',
        text: 'ไม่สามารถติดต่อ Node-RED ได้',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
      setTimeout(() => { if(inputRef.current) inputRef.current.focus(); }, 100);
    }
  };

  // Wrapper สำหรับปุ่มกด
  const handleCheckIn = () => submitAttendance('check_in');
  
  const handleCheckOut = () => {
    Swal.fire({
      title: 'ยืนยันออกงาน?',
      text: `รหัส: ${empCode}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ออกงาน',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444', 
    }).then((result) => {
      if (result.isConfirmed) submitAttendance('check_out');
    });
  };

  if (!currentTime) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 w-full font-sans">
      <div className="fixed inset-y-0 left-0 z-50 w-64 hidden lg:block">
        <Sidebar />
      </div>
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 w-full flex flex-col relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-48 bg-linear-to-r from-blue-600 to-indigo-600 z-0"></div>

        {/* Back Button */}
        <div className="mb-8 z-10">
            <Link href="/Dashboard" className="inline-flex items-center text-white/90 hover:text-white transition font-medium">
                <ArrowLeft size={20} className="mr-2" /> กลับหน้าหลัก
            </Link>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center z-10 -mt-10">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl text-center w-full max-w-lg border border-slate-100 relative">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Time Attendance System</h1>
                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-6 border border-blue-100">
                        {todayDate.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
                    </div>
                    
                    {/* Clock */}
                    <div className="relative">
                        <div className="text-7xl md:text-8xl font-bold text-slate-800 font-mono tracking-tight leading-none">
                            {currentTime.toLocaleTimeString('th-TH', { hour12: false })}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-500 mt-4 text-sm font-medium">
                        <MapPin size={16} className="text-red-500" />
                        <span>สำนักงานใหญ่ (Head Office) {API_BASE.includes('trueddns') && '• Online'}</span>
                    </div>
                </div>

                {/* Input Section */}
                <div className="mb-4">
                    <div className="relative max-w-xs mx-auto group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="text-slate-400 group-focus-within:text-blue-500 transition" size={20}/>
                        </div>
                        <input 
                          ref={inputRef} 
                          type="text" 
                          inputMode="numeric"
                          value={empCode} 
                          onChange={(e) => {
                              setEmpCode(e.target.value);
                              // ถ้าอยากให้เช็ค Real-time ให้เปิดบรรทัดล่าง (แต่อาจจะยิง API ถี่เกินไป)
                              // checkPresence(false); 
                          }} 
                          onBlur={() => checkPresence(false)} // เช็คเมื่อพิมพ์เสร็จแล้วกดออก
                          placeholder="ระบุรหัสพนักงาน"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition text-lg font-bold text-slate-800 text-center placeholder:font-normal placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                          maxLength={15}
                          autoFocus 
                      />
                    </div>
                </div>

                {/* WiFi Status Indicator */}
                <button
                  onClick={() => checkPresence(true)}
                  className={`w-full py-2 mb-6 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      present 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600'
                  }`}
                >
                  {present ? <Wifi size={18}/> : <Loader2 size={18} className={loading ? "animate-spin" : ""}/>}
                  {present ? 'เชื่อมต่อ WiFi แล้ว (พร้อมลงเวลา)' : 'ตรวจสอบสถานะ WiFi'}
                </button>

                {/* Buttons Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={handleCheckIn} 
                        disabled={loading || !present} // 🔒 ล็อคปุ่มถ้าไม่อยู่ WiFi
                        className={`group py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                            ${present 
                                ? 'bg-linear-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200' 
                                : 'bg-slate-200 text-slate-400 shadow-none'
                            }
                        `}
                    >
                        {loading ? <Loader2 className="animate-spin" size={28}/> : <Clock size={32} className="group-hover:rotate-12 transition-transform"/>}
                        <span className="text-lg font-bold">เข้างาน</span>
                        <span className="text-xs font-medium opacity-80">Check In</span>
                    </button>
                    
                    <button 
                        onClick={handleCheckOut} 
                        disabled={loading || !present} // 🔒 ล็อคปุ่มถ้าไม่อยู่ WiFi
                        className={`group py-4 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400
                            ${present
                                ? 'bg-white border-red-100 hover:border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-slate-200 bg-slate-50 text-slate-400'
                            }
                        `}
                    >
                        {loading ? <Loader2 className="animate-spin" size={28}/> : <LogOut size={32} className="group-hover:-translate-x-1 transition-transform"/>}
                        <span className="text-lg font-bold">ออกงาน</span>
                        <span className="text-xs font-medium opacity-80">Check Out</span>
                    </button>
                </div>

                {/* Recent Log Section (With Animation & Progress Bar) */}
                <div className="border-t border-dashed border-slate-200 pt-6 min-h-[140px]">
                    {!recentLog ? (
                        <p className="text-slate-400 text-xs font-medium animate-pulse mt-4">
                            {present ? '🟢 ระบบพร้อมใช้งาน' : '🔴 กรุณากรอกรหัสและเชื่อมต่อ WiFi'}
                        </p>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
                          
                          <button onClick={() => setRecentLog(null)} className="absolute -top-2 -right-2 p-1 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-400">
                             <X size={14}/>
                          </button>

                          <div className="flex items-center justify-center gap-2 mb-3">
                              <span className={`w-2 h-2 rounded-full animate-pulse ${recentLog.status === 'Late' ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                              <span className="text-slate-800 font-bold text-lg">คุณ {recentLog.name}</span>
                          </div>
                          
                          <div className="flex justify-center gap-3 text-sm">
                              {recentLog.type === 'IN' ? (
                                  <div className={`flex flex-col items-center px-4 py-2 rounded-lg border w-full ${recentLog.status === 'Late' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
                                      <span className="text-[10px] font-bold uppercase opacity-70 mb-0.5">เวลาเข้างาน</span>
                                      <span className="font-mono font-bold text-2xl">{recentLog.inTime || '--:--'}</span>
                                      
                                      {recentLog.status === 'Late' ? (
                                          <div className="flex items-center gap-1 mt-1 text-xs font-bold bg-white/50 px-2 py-0.5 rounded-full">
                                              <AlertTriangle size={12}/> สาย {recentLog.lateMinutes} นาที
                                          </div>
                                      ) : (
                                          <div className="flex items-center gap-1 mt-1 text-xs font-bold bg-white/50 px-2 py-0.5 rounded-full">
                                              <CheckCircle size={12}/> ปกติ
                                          </div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="flex flex-col items-center px-4 py-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 w-full">
                                      <span className="text-[10px] font-bold uppercase opacity-70 mb-0.5">เวลาออกงาน</span>
                                      <span className="font-mono font-bold text-2xl">{recentLog.outTime}</span>
                                      <div className="flex items-center gap-1 mt-1 text-xs font-bold bg-white/50 px-2 py-0.5 rounded-full">
                                          <CheckCircle size={12}/> สำเร็จ
                                      </div>
                                  </div>
                              )}
                          </div>
                          
                          <div className="w-full h-1 bg-slate-100 rounded-full mt-4 overflow-hidden">
                             <div className={`h-full animate-[width_5s_linear_forwards] ${recentLog.status === 'Late' ? 'bg-orange-500' : 'bg-blue-500'}`} style={{width: '100%'}}></div>
                          </div>
                        </div>
                    )}
                </div>

            </div>
            
            <p className="text-slate-400 text-xs mt-6 font-medium">
                ระบบลงเวลาพนักงานออนไลน์ (เชื่อมต่อ Node-RED)
            </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes width {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}