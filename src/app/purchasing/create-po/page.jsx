'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Save, Plus, Trash2, User, ShoppingCart, Loader2, X, Box, Menu, Calendar, Truck } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function CreatePOPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
      code: '', name: '', unit: 'ชิ้น', cost_price: 0, category: 'Raw Material'
  });

  // Form State
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState([{ product_id: '', qty: 1, price: 0 }]);
  
  // ✅ เพิ่ม State สำหรับเก็บหมายเหตุ
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchMaster();
  }, []);

  async function fetchMaster() {
    try {
      const res = await fetch('/api/purchasing/master-data');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers || []);
        setProductsList(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching master data:", error);
    } finally {
      setIsDataLoading(false);
    }
  }

  const handleQuickAddSubmit = async (e) => {
      e.preventDefault();
      try {
          const payload = {
              product_code: newProduct.code,
              name: newProduct.name,
              price: newProduct.cost_price,
              unit: newProduct.unit,
              category: newProduct.category,
              quantity: 0,
              min_level: 5
          };
          const res = await fetch('/api/inventory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (res.ok) {
              await Swal.fire({ icon: 'success', title: 'เพิ่มสินค้าเรียบร้อย', timer: 1000, showConfirmButton: false });
              setShowQuickAdd(false);
              setNewProduct({ code: '', name: '', unit: 'ชิ้น', cost_price: 0, category: 'Raw Material' }); 
              fetchMaster();
          }
      } catch (error) { Swal.fire('Error', error.message, 'error'); }
  };

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
    setIsLoading(true);
    try {
      // ✅ ส่ง remarks เข้าไปใน payload ด้วย
      const payload = { 
          supplier_id: selectedSupplier, 
          order_date: poDate, 
          expected_date: deliveryDate, 
          items, 
          total_amount: calculateTotal(), 
          user_id: 34,
          remarks: remarks 
      };
      const res = await fetch('/api/purchasing/po/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json(); 
      if (res.ok) {
          await Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: `เลขที่ PO: ${result.poNumber}` });
          router.push('/purchasing/po-list');
      } else {
          Swal.fire('Error', result.error || 'เกิดข้อผิดพลาด', 'error');
      }
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
      
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      <main className="flex-1 w-full lg:ml-64 transition-all duration-300 min-h-screen flex flex-col min-w-0">
        
        <div className="p-4 md:p-8 flex items-center gap-4">
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600"
            >
                <Menu size={24} />
            </button>
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <ShoppingCart className="text-blue-600" size={32}/> สร้างใบสั่งซื้อ (PO)
                </h1>
                <p className="text-slate-500 text-xs md:text-sm mt-1">กรอกข้อมูลเพื่อออกใบสั่งซื้อสินค้าใหม่</p>
            </div>
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
                                <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition" value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
                                    <option value="">-- เลือกคู่ค้า --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> วันที่สั่งซื้อ</label>
                                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl" value={poDate} onChange={e => setPoDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Truck size={14} className="text-blue-500"/> กำหนดรับของ</label>
                                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* ตารางสินค้า */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">รายการสินค้า</h2>
                            <button onClick={() => setShowQuickAdd(true)} className="text-xs bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-100 border border-green-200 flex items-center gap-1.5 shadow-sm transition">
                                <Plus size={14}/> สร้างสินค้าใหม่
                            </button>
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
                            <button onClick={() => setItems([...items, { product_id: '', qty: 1, price: 0 }])} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline px-4 transition"><Plus size={18}/> เพิ่มแถวใหม่</button>
                        </div>
                    </div>

                    {/* ✅ ส่วนของหมายเหตุ (เพิ่มใหม่) */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                            หมายเหตุ (Remarks)
                        </label>
                        <textarea
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition resize-y text-sm"
                            rows="3"
                            placeholder="ระบุเงื่อนไขการสั่งซื้อ หรือข้อความที่ต้องการแสดงในหน้าพิมพ์ใบสั่งซื้อ... (ข้อความนี้จะแสดงในหน้า PDF)"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>

                    {/* สรุปยอดและบันทึก */}
                    <div className="flex flex-col md:flex-row justify-end items-center gap-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-6">
                        <div className="text-center md:text-right">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">ยอดรวมสุทธิ (Grand Total)</p>
                            <p className="text-3xl md:text-5xl font-black text-blue-600">฿{calculateTotal().toLocaleString()}</p>
                        </div>
                        <button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition transform active:scale-95 disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" size={24}/> : <Save size={24}/>} บันทึกใบสั่งซื้อ
                        </button>
                    </div>
                </>
            )}
        </div>

        {showQuickAdd && (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Box className="text-green-600" size={20}/> เพิ่มสินค้าใหม่ (ด่วน)</h3>
                        <button onClick={() => setShowQuickAdd(false)} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleQuickAddSubmit} className="p-6 space-y-4">
                        <input required placeholder="รหัสสินค้า *" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" value={newProduct.code} onChange={e => setNewProduct({...newProduct, code: e.target.value})} />
                        <input required placeholder="ชื่อสินค้า *" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" required placeholder="ราคาทุน *" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" value={newProduct.cost_price} onChange={e => setNewProduct({...newProduct, cost_price: parseFloat(e.target.value) || 0})} />
                            <input placeholder="หน่วยนับ" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} />
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-500/10 mt-4 transition active:scale-95">บันทึกสินค้า</button>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}