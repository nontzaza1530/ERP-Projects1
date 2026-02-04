'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar';
import Link from 'next/link';
import {
    User, Calendar, Clock, FileText, ArrowLeft,
    Mail, Phone, MapPin, Briefcase,
    CheckCircle, XCircle, AlertCircle, Loader2,
    Thermometer, Palmtree, PieChart, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

export default function EmployeeDetailPage() {
    const params = useParams();
    const { id } = params;

    const [activeTab, setActiveTab] = useState('overview');
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data State
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);

    // Filter & Pagination State
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (id) fetchEmployeeData();
    }, [id]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, selectedMonth, selectedYear]);

    const fetchEmployeeData = async () => {
        try {
            setLoading(true);

            // 🚀 Best Practice: พยายามดึงข้อมูลเฉพาะ ID นั้น (ถ้า API รองรับ)
            // แต่ถ้า API บังคับดึงทั้งหมด โค้ดเดิมก็ใช้ได้ครับ ผมใส่แบบดัก Error ไว้ให้
            const [resEmp, resTime, resLeave] = await Promise.all([
                fetch(`/api/employees`), // ถ้ามี endpoint /api/employees/${id} จะดีมาก
                fetch(`/api/time/${id}`),
                fetch(`/api/employees/leave?all=true`)
            ]);

            if (resEmp.ok) {
                const allEmployees = await resEmp.json();
                // แปลงเป็น String ทั้งคู่เพื่อความชัวร์ในการเปรียบเทียบ
                const foundEmployee = allEmployees.find(emp => String(emp.id) === String(id) || String(emp.emp_code) === String(id));
                if (foundEmployee) setEmployee(foundEmployee);
            }

            if (resTime.ok) {
                const dataTime = await resTime.json();
                setAttendanceHistory(dataTime.history || []);
            }

            if (resLeave.ok) {
                const allLeaves = await resLeave.json();
                // กรองเอาเฉพาะของพนักงานคนนี้
                setLeaveHistory(allLeaves.filter(l => String(l.employee_id) === String(id)));
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Helper Functions ---
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];

    const years = Array.from({ length: 6 }, (_, i) => currentDate.getFullYear() - i);

    const safeDate = (d) => d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
    const fullDate = (d) => d ? new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';
    const safeTime = (d) => d ? new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-';

    // --- Logic การกรองข้อมูล (Memoized) ---
    const filteredAttendance = useMemo(() => {
        return attendanceHistory.filter(row => {
            const d = new Date(row.work_date || row.date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
    }, [attendanceHistory, selectedMonth, selectedYear]);

    const filteredLeaves = useMemo(() => {
        return leaveHistory.filter(l => {
            const d = new Date(l.start_date);
            return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
        });
    }, [leaveHistory, selectedMonth, selectedYear]);

    // --- Logic คำนวณสถิติ (Memoized เพื่อประสิทธิภาพ) ---
    const stats = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        let totalWorkDays = 0;
        let workDaysPassed = 0;

        const isCurrentMonth = selectedMonth === currentDate.getMonth() && selectedYear === currentDate.getFullYear();
        const isPastMonth = new Date(selectedYear, selectedMonth, 1) < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(selectedYear, selectedMonth, i);
            const dayOfWeek = d.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // จันทร์-ศุกร์
                totalWorkDays++;
                if (isPastMonth || (isCurrentMonth && d.getDate() < currentDate.getDate())) {
                    workDaysPassed++;
                }
            }
        }

        const lateCount = filteredAttendance.filter(r => r.status === 'Late' || r.status === 'สาย').length;
        const presentCount = filteredAttendance.length;
        const onTimeCount = Math.max(0, presentCount - lateCount);

        let leaveDays = 0;
        filteredLeaves.filter(l => l.status === 'approved').forEach(l => {
            const start = new Date(l.start_date);
            const end = new Date(l.end_date);
            // คำนวณจำนวนวันลา (millisecond difference)
            leaveDays += Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
        });

        const absentCount = Math.max(0, workDaysPassed - (presentCount + leaveDays));

        return { totalWorkDays, onTimeCount, lateCount, absentCount };
    }, [selectedMonth, selectedYear, filteredAttendance, filteredLeaves]);

    // --- Leave Quota (Memoized) ---
    const yearlyLeave = useMemo(() => {
        // กรองเฉพาะการลาที่อนุมัติแล้ว และอยู่ในปีที่เลือก
        const approved = leaveHistory.filter(l => l.status === 'approved' && new Date(l.start_date).getFullYear() === selectedYear);

        const countDays = (type) => approved
            .filter(l => l.leave_type === type)
            .reduce((acc, l) => {
                const s = new Date(l.start_date), e = new Date(l.end_date);
                return acc + Math.ceil(Math.abs(e - s) / (86400000)) + 1;
            }, 0);

        const vacationUsed = countDays('vacation');

        return {
            sick: countDays('sick'), sickQuota: 30,
            business: countDays('business'), bizQuota: 7,
            vacation: vacationUsed, vacQuota: 6,
            vacRemaining: Math.max(0, 6 - vacationUsed)
        };
    }, [leaveHistory, selectedYear]);

    // Pagination Logic
    const paginate = (data) => {
        const start = (currentPage - 1) * itemsPerPage;
        return data.slice(start, start + itemsPerPage);
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50 gap-3"><Loader2 className="animate-spin text-blue-600" size={32} /><span className="text-slate-500 font-medium">กำลังโหลด...</span></div>;
    if (!employee) return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 p-8 lg:ml-64 flex flex-col items-center justify-center text-slate-400">
                <User size={48} className="mb-2 opacity-50" />
                <p>ไม่พบข้อมูลพนักงาน</p>
                <Link href="/hr" className="text-blue-600 hover:underline mt-2">กลับหน้าหลัก</Link>
            </main>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <div className="fixed inset-y-0 left-0 z-50 w-64 hidden lg:block">
                <Sidebar />
            </div>

            <main className="flex-1 p-4 md:p-8 lg:ml-64 w-full">
                {/* Navigation & Header */}
                <Link href="/hr" className="inline-flex items-center text-slate-500 hover:text-slate-800 mb-6 transition font-medium group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> กลับไปหน้ารายชื่อ
                </Link>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-r from-blue-600 to-indigo-600 opacity-10"></div>
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg z-10 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-blue-600 border-2 border-slate-50 overflow-hidden">
                            {/* ถ้ามีรูปภาพ ใช้รูปภาพ ถ้าไม่มีใช้ตัวอักษรแรก */}
                            {employee.image_url ? (
                                <img src={employee.image_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                employee.first_name ? employee.first_name.charAt(0) : '?'
                            )}
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left z-10 mt-2 md:mt-0">
                        <h1 className="text-2xl font-bold text-slate-800">{employee.first_name} {employee.last_name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><Briefcase size={15} /> {employee.position || 'ไม่ระบุตำแหน่ง'}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={15} /> {employee.departments_name || 'ไม่ระบุแผนก'}</span>
                        </div>
                        <div className="mt-4 flex gap-3 justify-center md:justify-start">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${employee.status === 'active' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                <div className={`w-2 h-2 rounded-full ${employee.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {employee.status === 'active' ? 'พนักงานปัจจุบัน' : 'ลาออกแล้ว'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs & Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center border-b border-slate-200 mb-6 gap-4">
                    <div className="flex gap-6 overflow-x-auto w-full sm:w-auto">
                        {['overview', 'attendance', 'leave'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-bold transition whitespace-nowrap flex items-center gap-2 capitalize ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'}`}>
                                {tab === 'overview' ? <User size={18} /> : tab === 'attendance' ? <Clock size={18} /> : <FileText size={18} />}
                                {tab === 'overview' ? 'ข้อมูลทั่วไป' : tab === 'attendance' ? 'ประวัติลงเวลา' : 'ประวัติการลา'}
                            </button>
                        ))}
                    </div>

                    {activeTab !== 'overview' && (
                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 mb-2 sm:mb-0">
                            <div className="flex items-center gap-1 px-2 text-slate-400"><Filter size={14} /></div>
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer hover:bg-white rounded px-2 py-1 transition">
                                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer hover:bg-white rounded px-2 py-1 transition">
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                    {/* 1. Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1: ข้อมูลส่วนตัว */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b flex items-center gap-2">
                                    <User size={18} className="text-blue-500" /> ข้อมูลส่วนตัว
                                </h3>
                                <div className="space-y-4">
                                    <InfoRow label="ชื่อ-สกุล" value={`${employee.first_name} ${employee.last_name}`} />
                                    <InfoRow label="วันเกิด" value={employee.birth_date ? fullDate(employee.birth_date) : '-'} />
                                    <InfoRow label="เบอร์โทรศัพท์" value={employee.phone} icon={<Phone size={14} className="text-slate-400" />} />
                                    <InfoRow label="อีเมล" value={employee.email} icon={<Mail size={14} className="text-slate-400" />} />
                                    <InfoRow label="ที่อยู่" value={employee.address} icon={<MapPin size={14} className="text-slate-400" />} />
                                </div>
                            </div>

                            {/* Card 2: ข้อมูลการทำงาน */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-slate-800 mb-4 pb-2 border-b flex items-center gap-2">
                                    <Briefcase size={18} className="text-orange-500" /> ข้อมูลการทำงาน
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-slate-500 col-span-1">แผนก</span>
                                        <span className="font-medium text-slate-800 col-span-2 px-2 py-0.5 bg-slate-100 rounded w-fit">{employee.departments_name || '-'}</span>
                                    </div>
                                    <InfoRow label="ตำแหน่ง" value={employee.position} />
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-slate-500 col-span-1">เงินเดือน</span>
                                        <span className="font-bold text-green-600 col-span-2">฿{Number(employee.salary || 0).toLocaleString()}</span>
                                    </div>
                                    <InfoRow label="วันที่เริ่มงาน" value={fullDate(employee.created_at)} />
                                    <div className="grid grid-cols-3 text-sm">
                                        <span className="text-slate-500 col-span-1">สถานะ</span>
                                        <span className="font-medium col-span-2 text-green-600 flex items-center gap-1">
                                            <CheckCircle size={14} /> {employee.status === 'active' ? 'ปกติ' : employee.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. Attendance Tab */}
                    {activeTab === 'attendance' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <StatCard icon={<Calendar size={16} />} color="blue" value={stats.totalWorkDays} label={`วันทำงาน (${months[selectedMonth]})`} />
                                <StatCard icon={<CheckCircle size={16} />} color="green" value={stats.onTimeCount} label="ตรงเวลา" />
                                <StatCard icon={<Clock size={16} />} color="orange" value={stats.lateCount} label="สาย" />
                                <StatCard icon={<XCircle size={16} />} color="red" value={stats.absentCount} label="ขาดงาน" />
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 font-bold border-b border-slate-200 text-slate-700">
                                            <tr><th className="p-4">วันที่</th><th className="p-4">เข้า</th><th className="p-4">ออก</th><th className="p-4 text-center">สถานะ</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAttendance.length === 0 ? (
                                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">ไม่พบข้อมูลในเดือนนี้</td></tr>
                                            ) : paginate(filteredAttendance).map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition">
                                                    <td className="p-4 font-bold text-slate-800">{safeDate(row.work_date || row.date)}</td>
                                                    <td className="p-4 text-emerald-600 font-mono font-bold">{safeTime(row.check_in)}</td>
                                                    <td className="p-4 text-rose-500 font-mono font-bold">{safeTime(row.check_out)}</td>
                                                    <td className="p-4 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${['Late', 'สาย'].includes(row.status) ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                                ['Absent', 'ขาด'].includes(row.status) ? 'bg-red-100 text-red-700 border-red-200' :
                                                                    'bg-green-100 text-green-700 border-green-200'
                                                            }`}>{row.status || 'Completed'}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalItems={filteredAttendance.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </div>
                    )}

                    {/* 3. Leave Tab */}
                    {activeTab === 'leave' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <StatCard icon={<Thermometer size={16} />} color="pink" value={`${yearlyLeave.sick} / ${yearlyLeave.sickQuota}`} label="ลาป่วย (ปีนี้)" />
                                <StatCard icon={<Briefcase size={16} />} color="indigo" value={`${yearlyLeave.business} / ${yearlyLeave.bizQuota}`} label="ลากิจ (ปีนี้)" />
                                <StatCard icon={<Palmtree size={16} />} color="amber" value={`${yearlyLeave.vacation} / ${yearlyLeave.vacQuota}`} label="พักร้อน (ใช้ไป)" />
                                <StatCard icon={<PieChart size={16} />} color="emerald" value={yearlyLeave.vacRemaining} label="พักร้อนคงเหลือ" textColor="text-emerald-700" />
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 font-bold border-b text-slate-500"><tr><th className="p-4">ประเภท</th><th className="p-4">ช่วงวันที่ลา</th><th className="p-4">เหตุผล</th><th className="p-4 text-center">สถานะ</th></tr></thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredLeaves.length === 0 ? (
                                            <tr><td colSpan="4" className="p-8 text-center text-slate-400">ไม่พบข้อมูลในเดือนนี้</td></tr>
                                        ) : paginate(filteredLeaves).map((leave, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50 transition">
                                                <td className="p-4 font-bold text-slate-700">
                                                    {leave.leave_type === 'sick' ? <span className="text-red-600">🤒 ลาป่วย</span> :
                                                        leave.leave_type === 'business' ? <span className="text-blue-600">💼 ลากิจ</span> :
                                                            leave.leave_type === 'vacation' ? <span className="text-orange-600">🏖️ พักร้อน</span> :
                                                                leave.leave_type}
                                                </td>
                                                <td className="p-4 text-slate-600">{safeDate(leave.start_date)} - {safeDate(leave.end_date)}</td>
                                                <td className="p-4 text-slate-500 truncate max-w-[150px]" title={leave.reason}>{leave.reason}</td>
                                                <td className="p-4 text-center">
                                                    {leave.status === 'approved' && <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-bold border border-green-200"><CheckCircle size={12} /> อนุมัติ</span>}
                                                    {leave.status === 'rejected' && <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-bold border border-red-200"><XCircle size={12} /> ไม่อนุมัติ</span>}
                                                    {leave.status === 'pending' && <span className="inline-flex items-center gap-1 text-orange-700 bg-orange-100 px-2 py-1 rounded text-xs font-bold border border-orange-200"><AlertCircle size={12} /> รออนุมัติ</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalItems={filteredLeaves.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- Sub Components เพื่อลดความซับซ้อนของ JSX ---

function InfoRow({ label, value, icon }) {
    return (
        <div className="grid grid-cols-3 text-sm">
            <span className="text-slate-500 col-span-1">{label}</span>
            <span className="font-medium text-slate-800 col-span-2 flex items-center gap-2">
                {icon} {value || '-'}
            </span>
        </div>
    );
}

function StatCard({ icon, color, value, label, textColor = "text-slate-800" }) {
    const colorClasses = {
        blue: "bg-blue-50 border-blue-100 text-blue-600 bg-blue-100",
        green: "bg-green-50 border-green-100 text-green-600 bg-green-100",
        orange: "bg-orange-50 border-orange-100 text-orange-600 bg-orange-100",
        red: "bg-red-50 border-red-100 text-red-600 bg-red-100",
        pink: "bg-pink-50 border-pink-100 text-pink-600 bg-pink-100",
        indigo: "bg-indigo-50 border-indigo-100 text-indigo-600 bg-indigo-100",
        amber: "bg-amber-50 border-amber-100 text-amber-600 bg-amber-100",
        emerald: "bg-emerald-50 border-emerald-100 text-emerald-600 bg-emerald-100",
    };

    // แยก class สำหรับ container และ icon circle
    const mainClass = colorClasses[color]?.split(' ').slice(0, 2).join(' ') || "bg-slate-50 border-slate-100";
    const iconClass = colorClasses[color]?.split(' ').slice(2).join(' ') || "text-slate-600 bg-slate-100";

    return (
        <div className={`${mainClass} p-3 rounded-xl border flex flex-col items-center justify-center text-center`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${iconClass}`}>
                {icon}
            </div>
            <span className={`text-xl font-bold ${textColor}`}>{value}</span>
            <span className="text-xs text-slate-500">{label}</span>
        </div>
    );
}

function PaginationControls({ currentPage, totalItems, itemsPerPage, onPageChange }) {
    if (totalItems <= itemsPerPage) return null;

    return (
        <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500">
                แสดง {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems}
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-white disabled:opacity-50 border border-transparent hover:border-slate-200"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => onPageChange(p => Math.min(Math.ceil(totalItems / itemsPerPage), p + 1))}
                    disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                    className="p-1 rounded hover:bg-white disabled:opacity-50 border border-transparent hover:border-slate-200"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}