'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { QrCode, Search, Save, PackageCheck, Clock, CheckCircle, ChevronRight, Menu } from 'lucide-react'; // ✅ เพิ่ม Menu icon
import Swal from 'sweetalert2';

export default function GoodsReceiptPage() {
  const [poNumber, setPoNumber] = useState('');
  const [poData, setPoData] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State สำหรับเก็บรายการที่รอรับของ (ทางลัด)
  const [pendingPOs, setPendingPOs] = useState([]);

  // State สำหรับ Barcode
  const [barcodeInput, setBarcodeInput] = useState('');
  const barcodeRef = useRef(null);

  // ✅ State สำหรับเปิด/ปิด Sidebar ในมือถือ
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. โหลดรายการที่ "รอรับของ" ตอนเข้าหน้าเว็บ
  useEffect(() => {
    const fetchPending = async () => {
        try {
            const res = await fetch('/api/purchasing/po/list'); // ใช้ API เดิมที่มีอยู่แล้ว
            if (res.ok) {
                const data = await res.json();
                // กรองเอาเฉพาะสถานะ Pending หรือ Partially Received
                const pending = data.filter(p => {
                    const s = p.status?.toLowerCase();
                    return s === 'pending' || s === 'partially received';
                });
                setPendingPOs(pending);
            }
        } catch (error) {
            console.error("Failed to load pending POs", error);
        }
    };
    fetchPending();
  }, []);

  // 2. ฟังก์ชันค้นหาหลัก (แยกออกมาเพื่อให้เรียกใช้ได้หลายที่)
  const performSearch = async (numberToSearch) => {
    if (!numberToSearch) return;

    setIsLoading(true);
    setPoData(null);
    setItems([]);
    setPoNumber(numberToSearch); // อัปเดตช่องกรอกให้ตรงกัน

    try {
        const res = await fetch(`/api/purchasing/grn?po_number=${numberToSearch}`);
        const data = await res.json();
        
        if (res.ok) {
            setPoData(data.po);
            // Map ข้อมูล
            setItems(data.items.map(item => ({
                ...item,
                receive_now_qty: 0 
            })));
            
            // Focus ช่องบาร์โค้ดทันที
            setTimeout(() => barcodeRef.current?.focus(), 500);
        } else {
            Swal.fire('ไม่พบข้อมูล', data.error, 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
        setIsLoading(false);
    }
  };

  // Handler สำหรับฟอร์มค้นหาปกติ (กด Enter)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(poNumber);
  };

  // 3. ฟังก์ชันยิงบาร์โค้ด
  const handleScan = (e) => {
    if (e.key === 'Enter') {
        const code = barcodeInput.trim();
        if (!code) return;

        const index = items.findIndex(i => i.product_code === code);

        if (index !== -1) {
            const item = items[index];
            if (item.receive_now_qty + item.received_qty >= item.order_qty) {
                 Swal.fire({
                    toast: true, position: 'top-end', icon: 'warning',
                    title: 'สินค้านี้รับครบแล้ว', showConfirmButton: false, timer: 1500
                 });
                 setBarcodeInput('');
                 return;
            }
            const newItems = [...items];
            newItems[index].receive_now_qty += 1;
            setItems(newItems);
            setBarcodeInput('');
        } else {
            Swal.fire({
                toast: true, position: 'top-end', icon: 'error',
                title: `ไม่พบรหัส: ${code}`, showConfirmButton: false, timer: 2000
            });
            setBarcodeInput('');
        }
    }
  };

  const handleQtyChange = (index, value) => {
      const newItems = [...items];
      let val = parseInt(value) || 0;
      if (val > newItems[index].remaining_qty) val = newItems[index].remaining_qty;
      newItems[index].receive_now_qty = val;
      setItems(newItems);
  };

  const handleSubmit = async () => {
      const itemsToReceive = items.filter(i => i.receive_now_qty > 0).map(i => ({
          item_id: i.id, product_id: i.product_id, receive_now_qty: i.receive_now_qty
      }));

      if (itemsToReceive.length === 0) return Swal.fire('แจ้งเตือน', 'ระบุจำนวนสินค้าที่รับ', 'warning');

      const result = await Swal.fire({
          title: 'ยืนยันการรับสินค้า',
          text: `รับเข้าคลัง ${itemsToReceive.length} รายการ?`,
          icon: 'question', showCancelButton: true, confirmButtonText: 'ยืนยัน', confirmButtonColor: '#10B981'
      });

      if (!result.isConfirmed) return;

      try {
          const res = await fetch('/api/purchasing/grn', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ po_id: poData.id, items: itemsToReceive })
          });
          const resData = await res.json();
          if (res.ok) {
              await Swal.fire('สำเร็จ', resData.message, 'success');
              setPoNumber(''); setPoData(null); setItems([]); 
              // รีโหลดรายการรอรับของใหม่ด้วย (เผื่อรายการนั้นรับครบแล้วจะได้หายไป)
              window.location.reload(); 
          } else {
              throw new Error(resData.error);
          }
      } catch (error) {
          Swal.fire('Error', error.message, 'error');
      }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      {/* ✅ 1. Mobile Overlay: ฉากหลังมืดเวลาเปิด Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      {/* ✅ 2. Sidebar Container: กล่อง Sidebar ที่เลื่อนได้ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none lg:border-r lg:border-slate-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full relative flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>
          </div>
      </aside>

      {/* ✅ 3. Main Content: ปรับ Margin ให้ถูกต้อง */}
      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
            {/* ✅ ปุ่มเมนูมือถือ */}
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <Menu size={24} />
            </button>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                <PackageCheck className="text-blue-600" size={32}/> รับสินค้าเข้า (Goods Receipt)
            </h1>
        </div>

        {/* --- Search Box --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-slate-700 mb-2">สแกน/ค้นหา เลขที่ใบสั่งซื้อ (PO)</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full p-3 pl-10 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition font-mono uppercase"
                            placeholder="PO-2026..."
                            value={poNumber}
                            onChange={e => setPoNumber(e.target.value)}
                            autoFocus
                        />
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={20}/>
                    </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition active:scale-95 disabled:opacity-50">
                    {isLoading ? '...' : 'ค้นหา PO'}
                </button>
            </form>
            
            {/* รายการรอรับของ (Quick Select) */}
            {!poData && pendingPOs.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
                        <Clock size={16}/> รายการที่รอรับของ (เลือกได้เลย)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {pendingPOs.map(po => (
                            <div 
                                key={po.id} 
                                onClick={() => performSearch(po.po_number)} 
                                className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 p-4 rounded-xl cursor-pointer transition-all hover:shadow-md relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
                                    <ChevronRight size={20}/>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-mono font-bold text-blue-600 text-lg group-hover:underline">{po.po_number}</span>
                                    {po.status === 'Partially Received' ? (
                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">รับบางส่วน</span>
                                    ) : (
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">รอรับของ</span>
                                    )}
                                </div>
                                <div className="text-sm text-slate-700 font-medium truncate">{po.supplier_name || 'ไม่ระบุผู้ขาย'}</div>
                                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <Clock size={12}/> สั่งเมื่อ {new Date(po.order_date).toLocaleDateString('th-TH')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* --- Workspace (Barcode & Table) --- */}
        {poData && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pb-20"> {/* pb-20 เผื่อปุ่มด้านล่างในมือถือ */}
                {/* Header Info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-t-2xl border-b border-slate-200 gap-4">
                      <div>
                        <h2 className="font-bold text-xl md:text-2xl text-slate-800 flex flex-wrap items-center gap-2">
                            {poData.po_number}
                            <span className="text-sm bg-slate-100 text-slate-500 px-2 py-1 rounded font-normal truncate max-w-[200px]">Supplier: {poData.supplier_id}</span>
                        </h2>
                      </div>
                      <button onClick={() => { setPoData(null); setPoNumber(''); }} className="text-sm text-red-500 hover:underline self-end md:self-auto">
                        ยกเลิก / เปลี่ยน PO
                      </button>
                </div>

                {/* Scanner */}
                <div className="bg-slate-800 p-6 shadow-inner text-white flex flex-col md:flex-row items-center gap-4">
                    <div className="p-3 bg-slate-700 rounded-full hidden md:block">
                        <QrCode size={32} className="text-green-400"/>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold mb-2 text-slate-300">สแกนบาร์โค้ดสินค้า (รับ +1)</label>
                        <input 
                            ref={barcodeRef}
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-lg md:text-xl font-mono tracking-widest transition"
                            placeholder="ยิงบาร์โค้ดที่นี่..."
                            value={barcodeInput}
                            onChange={(e) => setBarcodeInput(e.target.value)}
                            onKeyDown={handleScan}
                        />
                    </div>
                </div>
                
                {/* Table */}
                <div className="bg-white rounded-b-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto"> {/* ✅ Scrollbar สำหรับตาราง */}
                        <table className="w-full text-sm text-left min-w-[800px]">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-xs border-b border-slate-200">
                                <tr>
                                    <th className="p-4">สินค้า</th>
                                    <th className="p-4 text-center w-20">สั่ง</th>
                                    <th className="p-4 text-center w-20">รับแล้ว</th>
                                    <th className="p-4 text-center w-20">ค้างรับ</th>
                                    <th className="p-4 w-32 text-center bg-blue-50 text-blue-700 border-l border-blue-100">รับครั้งนี้</th>
                                    <th className="p-4 text-center w-20">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item, idx) => {
                                    const isComplete = (item.received_qty + item.receive_now_qty) >= item.order_qty;
                                    return (
                                        <tr key={item.id} className={item.receive_now_qty > 0 ? 'bg-blue-50/20 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-800 text-base">{item.product_name}</div>
                                                <div className="text-xs text-slate-400 font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded mt-1 border border-slate-200">{item.product_code}</div>
                                            </td>
                                            <td className="p-4 text-center text-slate-500">{item.order_qty}</td>
                                            <td className="p-4 text-center text-slate-500">{item.received_qty}</td>
                                            <td className="p-4 text-center text-red-500 font-bold">{item.remaining_qty}</td>
                                            <td className="p-4 bg-blue-50/30 border-l border-blue-50">
                                                {item.remaining_qty > 0 ? (
                                                    <input 
                                                        type="number" 
                                                        className="w-full p-2 border border-blue-200 rounded-lg text-center font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500 bg-white text-lg"
                                                        value={item.receive_now_qty}
                                                        onChange={(e) => handleQtyChange(idx, e.target.value)}
                                                        min="0"
                                                        onFocus={(e) => e.target.select()}
                                                    />
                                                ) : (
                                                    <div className="text-center text-xs font-bold text-green-600 bg-green-100 py-1 rounded">ครบแล้ว</div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {isComplete ? <CheckCircle className="text-green-500 mx-auto" size={24} strokeWidth={3}/> : <span className="text-slate-200">-</span>}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-slate-200 flex justify-end bg-slate-50">
                        <button 
                            onClick={handleSubmit}
                            className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-3 transition transform active:scale-95 text-lg"
                        >
                            <Save size={24}/> ยืนยันรับสินค้าเข้าคลัง
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}