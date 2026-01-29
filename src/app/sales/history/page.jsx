'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import Link from 'next/link';
import { 
    FileText, Printer, Search, ArrowLeft, Menu, Calendar, 
    Filter, Archive, RefreshCw, ChevronLeft, ChevronRight, ShoppingBag, 
    RotateCcw, ShoppingCart // ✅ เพิ่ม icon ShoppingCart
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function SalesHistoryPage() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('quotation'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [activeTab, startDate, endDate, showArchived]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: activeTab,
        start: startDate,
        end: endDate,
        archived: showArchived
      });
      const res = await fetch(`/api/sales/history?${params}`);
      if (res.ok) setData(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setQuickDate = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  };

  // ✅ ฟังก์ชันใหม่: แปลงใบเสนอราคา เป็น บิลขายจริง
  const handleConvertToOrder = async (quotationId, quotationNo) => {
    try {
        // 1. ถามยืนยัน + เลือกวิธีชำระเงิน
        const { value: paymentMethod } = await Swal.fire({
            title: `ยืนยันการขาย?`,
            text: `สร้างบิลขายจาก ${quotationNo} หรือไม่?`,
            icon: 'question',
            input: 'select',
            inputOptions: {
                'Cash': 'เงินสด (Cash)',
                'Transfer': 'โอนเงิน (Transfer)'
            },
            inputPlaceholder: 'เลือกวิธีชำระเงิน',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันการขาย',
            confirmButtonColor: '#10b981',
            cancelButtonText: 'ยกเลิก',
            inputValidator: (value) => {
                if (!value) return 'กรุณาเลือกวิธีชำระเงิน';
            }
        });

        if (paymentMethod) {
            Swal.fire({ title: 'กำลังดำเนินการ...', didOpen: () => Swal.showLoading() });

            // 2. ดึงข้อมูลรายละเอียดสินค้าของใบเสนอราคานั้นมาก่อน
            const resQuote = await fetch(`/api/sales/quotation/${quotationId}`);
            const quoteData = await resQuote.json();
            
            if (!quoteData || !quoteData.items) throw new Error('ไม่พบข้อมูลสินค้า');

            // 3. จัดเตรียมข้อมูลส่งเข้า API ขาย
            const payload = {
                customer_name: quoteData.quotation.customer_name,
                customer_phone: quoteData.quotation.customer_phone,
                customer_address: quoteData.quotation.customer_address,
                payment_method: paymentMethod,
                total_amount: quoteData.quotation.total_amount,
                cart: quoteData.items.map(item => ({
                    id: item.product_id,
                    name: item.product_name,
                    price: item.price,
                    qty: item.quantity,
                    unit: 'ชิ้น'
                }))
            };

            // 4. ยิง API สร้าง Order
            const resOrder = await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const orderData = await resOrder.json();

            if (resOrder.ok) {
                // ✅ เพิ่มตรงนี้: อัปเดตสถานะใบเสนอราคาเก่า ให้เป็น 'ordered' (ขายแล้ว)
                await fetch('/api/sales/history', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: quotationId, 
                        type: 'quotation', 
                        action: 'ordered' 
                    })
                });

                Swal.fire({
                    title: 'เปิดบิลสำเร็จ!',
                    text: `Order ID: ${orderData.orderId}`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'พิมพ์ใบเสร็จ',
                    cancelButtonText: 'ปิด'
                }).then((r) => {
                    if (r.isConfirmed) {
                        window.open(`/sales/receipt/print/${orderData.orderId}`, '_blank');
                    }
                    // รีโหลดข้อมูลเพื่ออัปเดตสถานะ
                    fetchData();
                    // เปลี่ยน Tab ไปหน้า Order เพื่อให้เห็นรายการใหม่
                    setActiveTab('order');
                });
            } else {
                throw new Error(orderData.error || 'เกิดข้อผิดพลาด');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message, 'error');
    }
  };

  const handleStatusChange = async (id, docNo, action) => {
    const isArchiving = action === 'archive';
    Swal.fire({
        title: isArchiving ? 'จัดเก็บเอกสาร?' : 'กู้คืนเอกสาร?',
        text: isArchiving ? `ย้าย ${docNo} ไปที่จัดเก็บ?` : `นำ ${docNo} กลับมา?`,
        icon: isArchiving ? 'warning' : 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่', cancelButtonText: 'ยกเลิก',
        confirmButtonColor: isArchiving ? '#d33' : '#3b82f6'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch('/api/sales/history', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type: activeTab, action })
            });
            fetchData(); 
            Swal.fire('เรียบร้อย', isArchiving ? 'จัดเก็บแล้ว' : 'กู้คืนแล้ว', 'success');
        }
    });
  };

  // Filtering Logic
  const filteredData = data.filter(item => {
    const no = item.quotation_no || item.id.toString(); 
    const name = item.customer_name || '';
    return no.toLowerCase().includes(searchTerm.toLowerCase()) || 
           name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <div className="hidden lg:block w-64 fixed inset-y-0"><Sidebar /></div>
      
      <main className="flex-1 lg:ml-64 p-6 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {activeTab === 'quotation' ? <FileText className="text-orange-500"/> : <ShoppingBag className="text-green-500"/>}
                    ประวัติ{activeTab === 'quotation' ? 'ใบเสนอราคา' : 'การขายจริง'}
                </h1>
                <p className="text-sm text-gray-500">จัดการเอกสารย้อนหลังทั้งหมด</p>
            </div>
            <Link href="/sales" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border shadow-sm transition">
                <ArrowLeft size={18} /> กลับหน้าขาย
            </Link>
        </div>

        {/* --- Controls Area --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4 space-y-4 shrink-0">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-end md:items-center">
                <div className="flex gap-4 items-center w-full md:w-auto">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setActiveTab('quotation')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'quotation' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            ใบเสนอราคา
                        </button>
                        <button 
                            onClick={() => setActiveTab('order')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'order' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            รายการขาย
                        </button>
                    </div>
                    {/* Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
                        <input type="checkbox" className="w-4 h-4 accent-red-500" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
                        <span className={`text-sm font-bold ${showArchived ? 'text-red-600' : 'text-gray-600'}`}>{showArchived ? 'กำลังดู: ถังขยะ' : 'ดูรายการที่จัดเก็บ'}</span>
                    </label>
                </div>
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <input type="text" placeholder={activeTab === 'quotation' ? "ค้นหาเลขที่ใบเสนอราคา..." : "ค้นหาเลขที่บิล..."} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 placeholder-gray-500 text-gray-700 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-700 font-bold"><Filter size={16} /> กรองวันที่:</div>
                <input type="date" className="border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 text-gray-700 font-medium" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span className="text-gray-400">-</span>
                <input type="date" className="border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 text-gray-700 font-medium" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button onClick={() => setQuickDate(0)} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-bold">วันนี้</button>
                <button onClick={() => {setStartDate(''); setEndDate('');}} className="text-xs text-red-500 hover:underline ml-auto flex items-center gap-1 font-bold"><RefreshCw size={12}/> ล้างตัวกรอง</button>
            </div>
        </div>

        {/* --- Table --- */}
        <div className={`bg-white rounded-xl shadow-sm border flex-1 overflow-hidden flex flex-col ${showArchived ? 'border-red-200' : 'border-gray-200'}`}>
            {showArchived && <div className="bg-red-50 text-red-600 text-xs font-bold text-center py-1 border-b border-red-100">⚠️ คุณกำลังดูรายการที่ถูกจัดเก็บ (Archived Items)</div>}
            
            <div className="overflow-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 font-bold">วันที่</th>
                            <th className="p-4 font-bold">เลขที่เอกสาร</th>
                            <th className="p-4 font-bold">ลูกค้า</th>
                            <th className="p-4 font-bold text-right">ยอดรวม</th>
                            <th className="p-4 font-bold text-center">สถานะ</th>
                            <th className="p-4 font-bold text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-400">กำลังโหลด...</td></tr>
                        ) : currentItems.length === 0 ? (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-400">{showArchived ? 'ไม่มีรายการที่ถูกจัดเก็บ' : 'ไม่พบข้อมูล'}</td></tr>
                        ) : (
                            currentItems.map((item) => {
                                const rawDate = item.created_at || item.sale_date; 
                                const displayDate = !isNaN(new Date(rawDate)) ? new Date(rawDate).toLocaleDateString('th-TH') : '-';
                                const docNo = activeTab === 'quotation' ? item.quotation_no : `INV-${String(item.id).padStart(6,'0')}`;
                                const printUrl = activeTab === 'quotation' ? `/sales/quotation/print/${item.id}` : `/sales/receipt/print/${item.id}`;
                                
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4">{displayDate}</td>
                                        <td className={`p-4 font-mono font-bold ${activeTab==='quotation'?'text-blue-600':'text-green-600'}`}>{docNo}</td>
                                        <td className="p-4">{item.customer_name || 'ลูกค้าทั่วไป'}</td>
                                        <td className="p-4 text-right font-bold">฿{Number(item.total_amount).toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            {item.status === 'archived' ? (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-gray-200 text-gray-500">Archived</span>
                                            ) : item.status === 'ordered' ? ( 
                                                // ✅ เพิ่มสถานะนี้: ขายแล้ว (สีฟ้า)
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">Sold / Ordered</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">Active</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                {/* ✅ ปุ่มใหม่: แปลงใบเสนอราคาเป็นบิลขาย (เฉพาะ Tab Quotation และยังไม่ถูกขาย) */}
                                                {activeTab === 'quotation' && !showArchived && item.status !== 'ordered' && (
                                                    <button 
                                                        onClick={() => handleConvertToOrder(item.id, item.quotation_no)}
                                                        className="p-1.5 border rounded hover:bg-green-50 text-green-600" 
                                                        title="ยืนยันการขาย (ออกบิล)"
                                                    >
                                                        <ShoppingCart size={16}/>
                                                    </button>
                                                )}

                                                {/* ปุ่มพิมพ์ใบเสนอราคา */}
                                                <Link href={printUrl} target="_blank" className="p-1.5 border rounded hover:bg-blue-50 text-blue-600" title="พิมพ์">
                                                    <Printer size={16}/>
                                                </Link>
                                                
                                                {/* ปุ่มพิมพ์ย้อนหลัง Order เป็น Quotation */}
                                                {activeTab === 'order' && (
                                                    <Link href={`/sales/history/print-as-quotation/${item.id}`} target="_blank" className="p-1.5 border rounded hover:bg-orange-50 text-orange-500" title="พิมพ์เป็นใบเสนอราคา">
                                                        <FileText size={16}/>
                                                    </Link>
                                                )}

                                                {/* ปุ่ม Archive */}
                                                {showArchived ? (
                                                    <button onClick={() => handleStatusChange(item.id, docNo, 'restore')} className="p-1.5 border rounded hover:bg-green-50 text-gray-400 hover:text-green-600 transition" title="กู้คืน"><RotateCcw size={16}/></button>
                                                ) : (
                                                    <button onClick={() => handleStatusChange(item.id, docNo, 'archive')} className="p-1.5 border rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition" title="จัดเก็บ"><Archive size={16}/></button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                 <span className="text-sm font-bold text-gray-700">หน้า {currentPage} จาก {totalPages}</span>
                 <div className="flex gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 disabled:opacity-50"><ChevronLeft size={20}/></button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 disabled:opacity-50"><ChevronRight size={20}/></button>
                 </div>
            </div>
        </div>

      </main>
    </div>
  );
}