'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar'; 
import { DollarSign, FileText, Calculator, Save, Loader2, History, Clock, CheckCircle, Download } from 'lucide-react';
import Swal from 'sweetalert2';

// ✅ Import Library สำหรับสร้าง PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [payrolls, setPayrolls] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  // ✅ State สำหรับเก็บข้อมูลที่จะพิมพ์ลงสลิป
  const [printData, setPrintData] = useState(null);

  useEffect(() => {
    fetchPayrollData();
  }, [selectedMonth, selectedYear]);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payroll?month=${selectedMonth}&year=${selectedYear}`);
      if (res.ok) {
        const data = await res.json();
        setPayrolls(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const res = await fetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month: selectedMonth, year: selectedYear })
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchPayrollData(); 
        Swal.fire('สำเร็จ', data.message, 'success');
      } else {
        Swal.fire('เกิดข้อผิดพลาด', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'ไม่สามารถเชื่อมต่อ Server ได้', 'error');
    } finally {
      setCalculating(false);
    }
  };

  const handlePay = async (id, name) => {
    const result = await Swal.fire({
        title: `ยืนยันการจ่ายเงิน?`,
        text: `คุณต้องการบันทึกว่าจ่ายเงินให้ "${name}" แล้วใช่ไหม?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่, จ่ายแล้ว',
        confirmButtonColor: '#22c55e',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        try {
            const res = await fetch('/api/payroll', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }) 
            });
            const data = await res.json();
            
            if (data.success) {
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: 'ย้ายรายการไปที่ "ประวัติการจ่าย" เรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchPayrollData(); 
            } else {
                Swal.fire('Error', data.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'เชื่อมต่อ Server ไม่ได้', 'error');
        }
    }
  };

  // ✅ ฟังก์ชันสร้าง PDF
  const generatePayslip = async (data) => {
    // 1. ตั้งค่าข้อมูลที่จะพิมพ์
    setPrintData(data);

    // รอให้ React render ข้อมูลลงใน Hidden Div แป๊บนึง
    setTimeout(async () => {
        const input = document.getElementById('payslip-template'); // ดึง element ที่ซ่อนไว้
        
        if (input) {
            Swal.fire({
                title: 'กำลังสร้างไฟล์ PDF...',
                didOpen: () => Swal.showLoading(),
                allowOutsideClick: false
            });

            try {
                // แปลง HTML เป็นรูปภาพ (Canvas)
                const canvas = await html2canvas(input, { scale: 2 }); // scale 2 เพื่อความชัด
                const imgData = canvas.toDataURL('image/png');
                
                // สร้าง PDF ขนาด A4
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Payslip_${data.emp_code}_${selectedMonth}-${selectedYear}.pdf`); // ชื่อไฟล์

                Swal.close();
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'ไม่สามารถสร้าง PDF ได้', 'error');
            }
        }
    }, 500);
  };

  const pendingList = payrolls.filter(p => p.status === 'Draft'); 
  const historyList = payrolls.filter(p => p.status === 'Paid');  

  const displayList = activeTab === 'pending' ? pendingList : historyList;
  const totalAmount = displayList.reduce((sum, item) => sum + Number(item.net_total), 0);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="fixed inset-y-0 left-0 z-50 w-64 hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 w-full relative">
        {/* ... (Header, Tabs, Stats เหมือนเดิม) ... */}
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <DollarSign className="text-blue-600" /> ระบบคำนวณเงินเดือน
                </h1>
                <p className="text-slate-500 text-sm mt-1">จัดการงวดประจำเดือน</p>
            </div>
            <div className="flex gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer">
                    {Array.from({length: 12}, (_, i) => (
                        <option key={i+1} value={i+1}>{new Date(0, i).toLocaleDateString('th-TH', { month: 'long' })}</option>
                    ))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer">
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
            </div>
        </div>

        <div className="flex gap-4 border-b border-slate-200 mb-6">
            <button onClick={() => setActiveTab('pending')} className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 transition relative ${activeTab === 'pending' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <Clock size={18}/> รายการรอจ่าย ({pendingList.length})
                {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
            </button>
            <button onClick={() => setActiveTab('history')} className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 transition relative ${activeTab === 'history' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <History size={18}/> ประวัติการจ่าย ({historyList.length})
                {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full"></div>}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`rounded-2xl p-6 text-white shadow-lg ${activeTab === 'pending' ? 'bg-linear-to-br from-blue-600 to-indigo-700 shadow-blue-200' : 'bg-linear-to-br from-green-600 to-emerald-700 shadow-green-200'}`}>
                <p className="text-white/80 text-sm font-medium mb-1">{activeTab === 'pending' ? 'ยอดที่ต้องจ่ายทั้งหมด' : 'ยอดที่จ่ายไปแล้ว'}</p>
                <h2 className="text-4xl font-bold">฿{totalAmount.toLocaleString()}</h2>
                <p className="text-white/60 text-xs mt-2 opacity-80">{activeTab === 'pending' ? 'รออนุมัติจ่าย' : 'โอนจ่ายเรียบร้อย'} {displayList.length} รายการ</p>
            </div>
            {activeTab === 'pending' && (
                <button onClick={handleCalculate} disabled={calculating} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-400 hover:shadow-md transition group text-left col-span-2 md:col-span-1">
                    <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition">คำนวณอัตโนมัติ (Calculate)</h3>
                        <p className="text-xs text-slate-400">ดึงข้อมูลล่าสุด คำนวณยอดเงินเดือนใหม่</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 ${calculating ? 'animate-spin' : ''}`}>
                        {calculating ? <Loader2 size={24}/> : <Calculator size={24}/>}
                    </div>
                </button>
            )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
                <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2"><Loader2 className="animate-spin"/> กำลังโหลดข้อมูล...</div>
            ) : displayList.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                    <div className="flex justify-center mb-4">{activeTab === 'pending' ? <CheckCircle size={48} className="text-slate-200"/> : <History size={48} className="text-slate-200"/>}</div>
                    {activeTab === 'pending' ? <p>ไม่มีรายการค้างจ่าย</p> : <p>ยังไม่มีประวัติการจ่ายเงินของเดือนนี้</p>}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="p-4">พนักงาน</th>
                                <th className="p-4 text-right">เงินเดือน</th>
                                <th className="p-4 text-right text-red-500">หัก (สาย/ขาด)</th>
                                <th className="p-4 text-right text-orange-500">ประกันสังคม</th>
                                <th className="p-4 text-right text-green-600 font-bold">สุทธิ (Net)</th>
                                <th className="p-4 text-center">สถานะ</th>
                                <th className="p-4 text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {displayList.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-700">{item.first_name} {item.last_name}</div>
                                        <div className="text-xs text-slate-400">{item.position}</div>
                                    </td>
                                    <td className="p-4 text-right font-mono">{Number(item.base_salary).toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono text-red-500">
                                        -{ (Number(item.late_deduction) + Number(item.absent_deduction)).toLocaleString() }
                                        <div className="text-[10px] text-slate-400">(สาย {item.late_count}, ขาด {item.absent_count})</div>
                                    </td>
                                    <td className="p-4 text-right font-mono text-orange-500">-{Number(item.social_security).toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono font-bold text-green-600 text-lg">{Number(item.net_total).toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{item.status}</span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        {/* ✅ ปุ่มดาวน์โหลด PDF */}
                                        <button 
                                            onClick={() => generatePayslip(item)} // เรียกใช้ฟังก์ชันสร้าง PDF
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                                            title="ดาวน์โหลดสลิป PDF"
                                        >
                                            <FileText size={18}/>
                                        </button>
                                        
                                        {activeTab === 'pending' && (
                                            <button onClick={() => handlePay(item.id, item.first_name)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="ยืนยันการจ่ายเงิน">
                                                <Save size={18}/>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* -------------------------------------------------- */}
        {/* ✅ ส่วนที่ซ่อนอยู่ (Hidden Payslip Template) - แก้ไขสีเป็น Hex Code */}
        {/* -------------------------------------------------- */}
        <div className="fixed top-0 left-0 w-full h-0 overflow-hidden">
            {printData && (
               <div id="payslip-template" 
                    style={{ width: '800px', backgroundColor: '#ffffff', padding: '40px', fontFamily: 'sans-serif', color: '#1e293b' }}
               >
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #1e293b', paddingBottom: '24px', marginBottom: '24px' }}>
                      <div>
                          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#0f172a', letterSpacing: '1px', margin: 0 }}>PAYSLIP</h1>
                          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>ใบแจ้งเงินเดือน</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>ERP SYSTEM CO., LTD.</h2>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0' }}>99/99 Nonthaburi, Thailand</p>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Tax ID: 0105551234567</p>
                      </div>
                  </div>

                  {/* Employee Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div>
                          <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Employee Name</p>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '4px 0' }}>{printData.first_name} {printData.last_name}</p>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Position: {printData.position}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Pay Period</p>
                          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '4px 0' }}>{new Date(0, selectedMonth - 1).toLocaleString('en-US', { month: 'long' })} {selectedYear}</p>
                          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>ID: {printData.emp_code}</p>
                      </div>
                  </div>

                  {/* Earnings & Deductions Table */}
                  <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
                      {/* รายรับ */}
                      <div style={{ flex: 1 }}>
                          <h3 style={{ fontWeight: 'bold', color: '#15803d', borderBottom: '1px solid #bbf7d0', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', fontSize: '14px' }}>Earnings (รายได้)</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                  <span>Salary (เงินเดือน)</span>
                                  <span style={{ fontFamily: 'monospace' }}>{Number(printData.base_salary).toLocaleString()}</span>
                              </div>
                              {Number(printData.bonus) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#15803d', fontWeight: 'bold' }}>
                                    <span>Performance Bonus (โบนัส)</span>
                                    <span style={{ fontFamily: 'monospace' }}>+{Number(printData.bonus).toLocaleString()}</span>
                                </div>
                            )}
                          </div>
                      </div>

                      {/* รายจ่าย */}
                      <div style={{ flex: 1 }}>
                          <h3 style={{ fontWeight: 'bold', color: '#dc2626', borderBottom: '1px solid #fecaca', paddingBottom: '8px', marginBottom: '16px', textTransform: 'uppercase', fontSize: '14px' }}>Deductions (รายการหัก)</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                  <span>Late Deduction (มาสาย {printData.late_count} ครั้ง)</span>
                                  <span style={{ fontFamily: 'monospace', color: '#ef4444' }}>-{Number(printData.late_deduction).toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                  <span>Absent (ขาดงาน {printData.absent_count} วัน)</span>
                                  <span style={{ fontFamily: 'monospace', color: '#ef4444' }}>-{Number(printData.absent_deduction).toLocaleString()}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                  <span>Social Security (ประกันสังคม)</span>
                                  <span style={{ fontFamily: 'monospace', color: '#ef4444' }}>-{Number(printData.social_security).toLocaleString()}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Net Total */}
                  <div style={{ borderTop: '2px solid #1e293b', paddingTop: '24px', marginBottom: '48px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#475569' }}>Net Salary (เงินเดือนสุทธิ)</span>
                          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a', backgroundColor: '#f0fdf4', padding: '8px 16px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                              ฿{Number(printData.net_total).toLocaleString()}
                          </span>
                      </div>
                      <p style={{ textAlign: 'right', fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>Paid Date: {new Date().toLocaleDateString('th-TH')}</p>
                  </div>

                  {/* Signature */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px', textAlign: 'center' }}>
                      <div style={{ width: '160px' }}>
                          <div style={{ borderBottom: '1px solid #cbd5e1', height: '40px', marginBottom: '8px' }}></div>
                          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Employer Signature</p>
                      </div>
                      <div style={{ width: '160px' }}>
                          <div style={{ borderBottom: '1px solid #cbd5e1', height: '40px', marginBottom: '8px' }}></div>
                          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Employee Signature</p>
                      </div>
                  </div>
               </div>
            )}
        </div>

      </main>
    </div>
  );
}