'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  PieChart, DollarSign, TrendingUp, TrendingDown, Plus, FileText, ArrowUpRight, ArrowDownRight, Wallet, Menu, ChevronLeft, ChevronRight, X 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function AccountingPage() {
  // --- 1. State Management ---
  const [summary, setSummary] = useState({ income: 0, expenses: 0, profit: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Expense',
    category: '',
    amount: '',
    description: ''
  });

  // --- Helper: จัดรูปแบบเงิน ---
  const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('th-TH', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // --- 2. Fetch Data ---
  useEffect(() => {
    fetchAccountingData();
  }, []);

  const fetchAccountingData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accounting');
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
          setTransactions(data.transactions || []);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: 'ไม่สามารถเชื่อมต่อข้อมูลได้' });
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(curr => curr + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(curr => curr - 1);

  // --- 4. Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
        Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกหมวดหมู่และจำนวนเงิน', 'warning');
        return;
    }

    try {
      const res = await fetch('/api/accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        setIsModalOpen(false);
        setFormData({ type: 'Expense', category: '', amount: '', description: '' });
        fetchAccountingData();
        setCurrentPage(1);
      } else {
        throw new Error(result.error || 'เกิดข้อผิดพลาด');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- Sidebar (Mobile Compatible) --- */}
      {/* Overlay สำหรับมือถือ */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ตัว Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </aside>
      
      {/* --- Main Content --- */}
      {/* ใช้ flex-1 และ min-w-0 เพื่อป้องกัน layout พังในจอเล็ก */}
      <main className="flex-1 min-w-0 p-4 md:p-8 h-screen overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white rounded-lg border border-slate-200 lg:hidden text-slate-600 hover:text-blue-600"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                <Wallet className="text-blue-600" /> ระบบบัญชี
              </h1>
              <p className="text-slate-500 text-sm mt-1">ภาพรวมสถานะทางการเงินขององค์กร</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Plus size={20} /> บันทึกรายการ
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Income */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">รายรับรวม</p>
              <h3 className="text-3xl font-black text-green-600">฿{formatCurrency(summary.income)}</h3>
              <div className="flex items-center gap-1 text-green-500 text-xs mt-2 font-bold bg-green-50 px-2 py-1 rounded-lg w-fit">
                <ArrowUpRight size={14} /> รายรับทั้งหมด
              </div>
            </div>
            <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
              <TrendingUp size={32} />
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">รายจ่ายรวม</p>
              <h3 className="text-3xl font-black text-red-600">฿{formatCurrency(summary.expenses)}</h3>
              <div className="flex items-center gap-1 text-red-500 text-xs mt-2 font-bold bg-red-50 px-2 py-1 rounded-lg w-fit">
                <ArrowDownRight size={14} /> รายจ่ายทั้งหมด
              </div>
            </div>
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
              <TrendingDown size={32} />
            </div>
          </div>

          {/* Profit */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group hover:shadow-md transition">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">กำไรสุทธิ</p>
              <h3 className={`text-3xl font-black ${summary.profit >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                ฿{formatCurrency(summary.profit)}
              </h3>
              <div className="flex items-center gap-1 text-slate-400 text-xs mt-2 font-medium">
                (รายรับ - รายจ่าย)
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${summary.profit >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-500'}`}>
              <PieChart size={32} />
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <FileText className="text-slate-400"/> รายการเคลื่อนไหวล่าสุด
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                ทั้งหมด {transactions.length} รายการ
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-white text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                    <th className="p-4 pl-6">วันที่/เวลา</th>
                    <th className="p-4">รายการ</th>
                    <th className="p-4">หมวดหมู่</th>
                    <th className="p-4 text-center">ประเภท</th>
                    <th className="p-4 text-right pr-6">จำนวนเงิน</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                {loading ? (
                    <tr><td colSpan="5" className="p-12 text-center text-slate-400">กำลังโหลดข้อมูล...</td></tr>
                ) : currentTransactions.length === 0 ? (
                    <tr><td colSpan="5" className="p-12 text-center text-slate-400">ยังไม่มีรายการบัญชี</td></tr>
                ) : (
                    currentTransactions.map((tx, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="p-4 pl-6 text-slate-500 font-mono text-xs">
                        {new Date(tx.date).toLocaleString('th-TH', { 
                            year: '2-digit', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                        </td>
                        <td className="p-4 font-bold text-slate-800">{tx.description || '-'}</td>
                        <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold border border-slate-200">
                                {tx.category}
                            </span>
                        </td>
                        <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            tx.type === 'Income' 
                            ? 'bg-green-50 text-green-700 border-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                            {tx.type === 'Income' ? 'รายรับ' : 'รายจ่าย'}
                        </span>
                        </td>
                        <td className={`p-4 text-right pr-6 font-bold text-base font-mono ${
                            tx.type === 'Income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {tx.type === 'Income' ? '+' : '-'} {formatCurrency(tx.amount)}
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-slate-50/50">
                <span className="text-xs text-slate-500 font-medium ml-2">
                    หน้า {currentPage} จาก {totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        onClick={prevPage} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-slate-600"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={nextPage} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-slate-600"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
          )}
        </div>

        {/* --- MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600"/> บันทึกรายการ
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-red-500 transition">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Type Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-xl">
                    {['Income', 'Expense'].map((type) => (
                        <button 
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, type})}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                                formData.type === type 
                                ? 'bg-white shadow-sm scale-100 ' + (type === 'Income' ? 'text-green-600' : 'text-red-600')
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {type === 'Income' ? 'รายรับ (Income)' : 'รายจ่าย (Expense)'}
                        </button>
                    ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">หมวดหมู่</label>
                  <input 
                    type="text" required
                    placeholder="เช่น ค่าไฟ, ค่าเช่า, เงินเดือน"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800 bg-slate-50 focus:bg-white"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">จำนวนเงิน (บาท)</label>
                  <input 
                    type="number" required
                    placeholder="0.00"
                    step="0.01"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-right font-mono font-bold text-xl text-slate-800 bg-slate-50 focus:bg-white"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">รายละเอียดเพิ่มเติม</label>
                  <textarea 
                    rows="3"
                    placeholder="ระบุรายละเอียด..."
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-800 bg-slate-50 focus:bg-white"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <button 
                    type="submit" 
                    className={`w-full py-3.5 text-white rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2 mt-2 ${
                        formData.type === 'Income' 
                        ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                        : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                    }`}
                >
                    {formData.type === 'Income' ? <Plus size={20}/> : <TrendingDown size={20}/>}
                    ยืนยันการบันทึก
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}