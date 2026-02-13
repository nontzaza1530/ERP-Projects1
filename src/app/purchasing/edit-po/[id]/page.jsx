'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import { Save, Plus, Trash2, User, ShoppingCart, Loader2, X, Box, Menu, Calendar, Truck, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPOPage() {
  const router = useRouter();
  const params = useParams(); // ✅ ใช้ดึง ID จาก URL
  
  const [suppliers, setSuppliers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [poNumber, setPoNumber] = useState('');
  const [poDate, setPoDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    // โหลดข้อมูล Master Data (คู่ค้า, สินค้า) และ ข้อมูล PO เก่า พร้อมกัน
    Promise.all([fetchMaster(), fetchPOData()])
        .finally(() => setIsDataLoading(false));
  }, []);

  async function fetchMaster() {
    try {
      const res = await fetch('/api/purchasing/master-data');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers || []);
        setProductsList(data.products || []);
      }
    } catch (error) { console.error("Error fetching master data:", error); }
  }

  // ✅ ดึงข้อมูล PO เดิมมาใส่ใน State
  async function fetchPOData() {
      try {
          const res = await fetch(`/api/purchasing/po/${params.id}`);
          if (res.ok) {
              const data = await res.json();
              setPoNumber(data.po_number);
              setSelectedSupplier(data.supplier_id);
              setRemarks(data.remarks || '');
              
              // แปลง format วันที่ให้อยู่ในรูป YYYY-MM-DD สำหรับ input type="date"
              if (data.order_date) setPoDate(new Date(data.order_date).toISOString().split('T')[0]);
              if (data.expected_date) setDeliveryDate(new Date(data.expected_date).toISOString().split('T')[0]);
              
              // แปลง format สินค้า ให้ตรงกับ State ที่เราใช้
              if (data.items && data.items.length > 0) {
                  const mappedItems = data.items.map(item => ({
                      product_id: item.product_id,
                      qty: item.quantity,
                      price: item.unit_price
                  }));
                  setItems(mappedItems);
              } else {
                  setItems([{ product_id: '', qty: 1, price: 0 }]);
              }
          }
      } catch (error) {
          Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลใบสั่งซื้อได้', 'error');
          router.push('/purchasing/po-list');
      }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product_id') {
      const product = productsList.find(p => p.id == value);
      newItems[index].price = product ? parseFloat(product.cost_price) || 0 : 0;
    }
    setItems(newItems);
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const handleSubmit = async () => {
    if (!selectedSupplier) return Swal.fire('แจ้งเตือน', 'กรุณาเลือกผู้ขาย', 'warning');
    if (items.length === 0 || !items[0].product_id) return Swal.fire('แจ้งเตือน', 'กรุณาเลือกสินค้าอย่างน้อย 1 รายการ', 'warning');
    
    setIsLoading(true);
    try {
      const payload = { 
          supplier_id: selectedSupplier, 
          order_date: poDate, 
          expected_date: deliveryDate, 
          items, 
          total_amount: calculateTotal(), 
          remarks: remarks 
      };
      
      // ✅ ส่ง PUT Request ไปอัปเดตข้อมูล
      const res = await fetch(`/api/purchasing/po/${params.id}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
      });
      
      const result = await res.json(); 
      if (res.ok) {
          await Swal.fire({ icon: 'success', title: 'บันทึกการแก้ไขสำเร็จ', text: `อัปเดตเลขที่ PO: ${poNumber} เรียบร้อยแล้ว` });
          router.push('/purchasing/po-list');
      } else {
          Swal.fire('Error', result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 min-h-screen flex flex-col min-w-0">
        
        <div className="p-4 md:p-8 flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600">
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        <ShoppingCart className="text-blue-600" size={32}/> แก้ไขใบสั่งซื้อ <span className="text-blue-600 ml-2">{poNumber}</span>
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">แก้ไขข้อมูลผู้ขาย, สินค้า หรือหมายเหตุของเอกสาร</p>
                </div>
            </div>
            <Link href="/purchasing/po-list" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition">
                <ArrowLeft size={20}/> ยกเลิกและกลับ
            </Link>
        </div>

        <div className="flex-1 p-4 md:p-8 pt-0 max-w-[1400px] w-full mx-auto space-y-6">
            {isDataLoading ? (
                <div className="flex justify-center items-center h-64 text-slate-400 gap-2 italic font-bold"><Loader2 className="animate-spin"/> กำลังโหลดข้อมูล...</div>
            ) : (
                <>
                    {/* ข้อมูลคู่ค้า */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><User size={14} className="text-blue-500"/> ผู้ขาย (Supplier) *</label>
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition font-bold" value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
                                    <option value="">-- เลือกคู่ค้า --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> วันที่สั่งซื้อ</label>
                                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium" value={poDate} onChange={e => setPoDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Truck size={14} className="text-blue-500"/> กำหนดรับของ</label>
                                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* ตารางสินค้า */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">รายการสินค้า (แก้ไขได้)</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="bg-slate-50/30 text-slate-400 text-[11px] font-bold uppercase border-b border-slate-100 tracking-widest">
                                    <tr>
                                        <th className="py-4 px-6 w-16 text-center">#</th>
                                        <th className="py-4 px-2">สินค้า</th>
                                        <th className="py-4 px-2 w-32 text-right">ราคา/หน่วย</th>
                                        <th className="py-4 px-2 w-28 text-center">จำนวน</th>
                                        <th className="py-4 px-2 w-40 text-right">รวม (บาท)</th>
                                        <th className="py-4 px-4 w-16 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition duration-150">
                                            <td className="py-4 px-6 text-center text-slate-300 font-mono text-xs">{idx + 1}</td>
                                            <td className="py-4 px-2">
                                                <select className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition" value={item.product_id} onChange={e => handleItemChange(idx, 'product_id', e.target.value)}>
                                                    <option value="">-- เลือกสินค้า --</option>
                                                    {productsList.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                                                </select>
                                            </td>
                                            <td className="py-4 px-2"><input type="number" className="w-full p-2.5 border border-slate-200 rounded-xl text-right font-bold text-sm" value={item.price} onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)} /></td>
                                            <td className="py-4 px-2"><input type="number" className="w-full p-2.5 border border-slate-200 rounded-xl text-center font-bold text-sm" value={item.qty} onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)} /></td>
                                            <td className="py-4 px-2 text-right font-black text-slate-800">{(item.qty * item.price).toLocaleString()}</td>
                                            <td className="py-4 px-4 text-center">
                                                {items.length > 1 && <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18}/></button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-slate-50/20 border-t border-slate-100">
                            <button onClick={() => setItems([...items, { product_id: '', qty: 1, price: 0 }])} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline px-4 transition"><Plus size={18}/> เพิ่มบรรทัดใหม่</button>
                        </div>
                    </div>

                    {/* หมายเหตุ */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">หมายเหตุ (Remarks)</label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition resize-y text-sm"
                            rows="3"
                            placeholder="ระบุเงื่อนไขการสั่งซื้อ หรือข้อความที่ต้องการแสดงในหน้าพิมพ์ใบสั่งซื้อ..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>

                    {/* สรุปยอดและบันทึก */}
                    <div className="flex flex-col md:flex-row justify-end items-center gap-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-6">
                        <div className="text-center md:text-right">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">ยอดรวมสุทธิใหม่ (New Grand Total)</p>
                            <p className="text-3xl md:text-5xl font-black text-blue-600">฿{calculateTotal().toLocaleString()}</p>
                        </div>
                        <button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition transform active:scale-95 disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>} บันทึกการแก้ไข
                        </button>
                    </div>
                </>
            )}
        </div>
      </main>
    </div>
  );
}