'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Save, Plus, Trash2, User, ShoppingCart, Loader2, X, Box } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function CreatePOPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // --- State สำหรับ Modal เพิ่มสินค้าด่วน (Quick Add) ---
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({
      code: '',
      name: '',
      unit: 'ชิ้น',
      cost_price: 0,
      category: 'Raw Material' // ✅ Best Practice: ตั้งค่าเริ่มต้นให้เป็นค่าที่มีใน DB แน่ๆ
  });

  // Form State
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [items, setItems] = useState([
    { product_id: '', qty: 1, price: 0 }
  ]);

  // โหลดข้อมูล Master Data
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

  // --- ฟังก์ชันจัดการ Quick Add Product (อัปเกรดใหม่) ---
  const handleQuickAddSubmit = async (e) => {
      e.preventDefault();
      try {
          // ✅ Payload แบบ Best Practice: ส่งค่าให้ครบและตรงกับ Database
          const payload = {
              product_code: newProduct.code,
              name: newProduct.name,
              price: newProduct.cost_price,
              unit: newProduct.unit,
              category: newProduct.category, // ✅ ส่งหมวดหมู่ที่เลือกไปด้วย
              quantity: 0,                   // ของใหม่ สต็อกเริ่มที่ 0
              min_level: 5                   // ค่าแจ้งเตือนขั้นต่ำ default
          };

          const res = await fetch('/api/inventory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              await Swal.fire({ icon: 'success', title: 'เพิ่มสินค้าเรียบร้อย', timer: 1000, showConfirmButton: false });
              setShowQuickAdd(false);
              // Reset Form
              setNewProduct({ code: '', name: '', unit: 'ชิ้น', cost_price: 0, category: 'Raw Material' }); 
              fetchMaster(); // โหลดข้อมูลใหม่เพื่อให้สินค้าโผล่ใน Dropdown ทันที
          } else {
              const data = await res.json();
              throw new Error(data.error || 'เพิ่มสินค้าไม่สำเร็จ');
          }
      } catch (error) {
          Swal.fire('Error', error.message, 'error');
      }
  };

  // --- ฟังก์ชันจัดการตารางสินค้า ---
  const addNewRow = () => {
    setItems([...items, { product_id: '', qty: 1, price: 0 }]);
  };

  const removeRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'product_id') {
      const product = productsList.find(p => p.id == value);
      if (product) {
        newItems[index].price = parseFloat(product.cost_price) || 0;
      } else {
        newItems[index].price = 0;
      }
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  // 🔥 จุดที่แก้ไข: เปลี่ยนจาก Demo เป็นยิง API จริงๆ
  const handleSubmit = async () => {
    if (!selectedSupplier) return Swal.fire('แจ้งเตือน', 'กรุณาเลือกผู้ขาย (Supplier)', 'warning');
    if (items.some(i => !i.product_id)) return Swal.fire('แจ้งเตือน', 'กรุณาเลือกสินค้าให้ครบทุกรายการ', 'warning');

    setIsLoading(true);
    try {
      const payload = {
        supplier_id: selectedSupplier,
        order_date: poDate,
        expected_date: deliveryDate,
        items: items,
        total_amount: calculateTotal(),
        user_id: 34 // (เลขสมมติคนล็อกอิน)
      };

      // ✅ ยิงไปที่ API จริงๆ
      const res = await fetch('/api/purchasing/po/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json(); 

      if (res.ok) {
          // 🎉 บันทึกสำเร็จ: โชว์เลข PO และเด้งไปหน้ารายการ
          await Swal.fire({ 
              icon: 'success', 
              title: 'บันทึกสำเร็จ', 
              text: `สร้างใบสั่งซื้อ ${result.poNumber} เรียบร้อยแล้ว` 
          });
          
          router.push('/purchasing/po-list'); // 👉 เด้งไปหน้ารายการทันที
      } else {
          throw new Error(result.error || 'เกิดข้อผิดพลาดในการบันทึก');
      }
      
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
        
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">สร้างใบสั่งซื้อ</h1>
        </div>

        {isDataLoading ? (
             <div className="flex justify-center items-center h-64 text-slate-400 gap-2"><Loader2 className="animate-spin"/> กำลังโหลดข้อมูล...</div>
        ) : (
            <>
                {/* Header Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">ผู้ขาย (Supplier) *</label>
                            <div className="relative">
                                <select 
                                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                    value={selectedSupplier}
                                    onChange={e => setSelectedSupplier(e.target.value)}
                                >
                                    <option value="">-- เลือกคู่ค้า --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">วันที่สั่งซื้อ</label>
                            <input type="date" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium" value={poDate} onChange={e => setPoDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">กำหนดรับของ</label>
                            <input type="date" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2"><ShoppingCart size={16}/> รายการสินค้า</h2>
                        {/* ปุ่มเปิด Modal Quick Add */}
                        <button onClick={() => setShowQuickAdd(true)} className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-100 transition border border-green-200 flex items-center gap-1">
                            <Plus size={14}/> สร้างสินค้าใหม่ (Quick Add)
                        </button>
                    </div>
                    
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-100 text-slate-500 text-xs font-bold uppercase">
                                <th className="py-3 px-2 w-12 text-center">#</th>
                                <th className="py-3 px-2">สินค้า</th>
                                <th className="py-3 px-2 w-32 text-right">ราคา/หน่วย</th>
                                <th className="py-3 px-2 w-24 text-center">จำนวน</th>
                                <th className="py-3 px-2 w-40 text-right">รวม</th>
                                <th className="py-3 px-2 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {items.map((item, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50">
                                    <td className="py-3 px-2 text-center text-slate-400 font-mono text-sm">{idx + 1}</td>
                                    <td className="py-3 px-2">
                                        <select 
                                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none"
                                            value={item.product_id}
                                            onChange={e => handleItemChange(idx, 'product_id', e.target.value)}
                                        >
                                            <option value="">-- เลือกสินค้า --</option>
                                            {productsList.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                                        </select>
                                    </td>
                                    <td className="py-3 px-2"><input type="number" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-right font-bold text-sm" value={item.price} onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)} /></td>
                                    <td className="py-3 px-2"><input type="number" className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-center font-bold text-sm" value={item.qty} onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)} /></td>
                                    <td className="py-3 px-2 text-right font-black text-slate-800">{(item.qty * item.price).toLocaleString()}</td>
                                    <td className="py-3 px-2 text-center">
                                        {items.length > 1 && <button onClick={() => removeRow(idx)} className="p-2 text-slate-300 hover:text-red-500 rounded-lg"><Trash2 size={18}/></button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={addNewRow} className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition"><Plus size={18}/> เพิ่มรายการสินค้า</button>
                </div>

                {/* Total Section */}
                <div className="flex justify-end items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="text-right mr-4">
                        <p className="text-slate-500 text-sm font-medium mb-1">ยอดรวมทั้งสิ้น</p>
                        <p className="text-4xl font-black text-blue-600">฿{calculateTotal().toLocaleString()}</p>
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 flex items-center gap-3 transition transform active:scale-95 disabled:opacity-70">
                        {isLoading ? <Loader2 className="animate-spin"/> : <Save size={24}/>} {isLoading ? 'กำลังบันทึก...' : 'บันทึกใบสั่งซื้อ'}
                    </button>
                </div>
            </>
        )}

        {/* --- MODAL: QUICK ADD PRODUCT (BEST PRACTICE VERSION) --- */}
        {showQuickAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Box className="text-green-600" size={20}/> เพิ่มสินค้าใหม่ (ด่วน)</h3>
                        <button onClick={() => setShowQuickAdd(false)} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleQuickAddSubmit} className="p-6 space-y-4">
                        
                        {/* รหัสสินค้า + ตัวนับจำนวน */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-bold text-slate-500">รหัสสินค้า *</label>
                                <span className={`text-[10px] font-bold ${newProduct.code.length === 15 ? 'text-red-500' : 'text-slate-400'}`}>
                                    {newProduct.code.length}/15
                                </span>
                            </div>
                            <input 
                                required 
                                maxLength={15} 
                                value={newProduct.code} 
                                onChange={e => setNewProduct({...newProduct, code: e.target.value})} 
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition" 
                                placeholder="เช่น NEW-001"
                            />
                        </div>

                        {/* ชื่อสินค้า */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">ชื่อสินค้า *</label>
                            <input 
                                required 
                                value={newProduct.name} 
                                onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition" 
                                placeholder="เช่น สินค้าทดสอบ"
                            />
                        </div>

                        {/* ✅ เพิ่ม: หมวดหมู่ (เลือกได้จริง ไม่มั่วข้อมูล) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">หมวดหมู่ *</label>
                            <select 
                                value={newProduct.category}
                                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 bg-white"
                            >
                                <option value="Raw Material">วัตถุดิบ (Raw Material)</option>
                                <option value="Finished Goods">สินค้าพร้อมขาย (Finished Goods)</option>
                                <option value="General">ทั่วไป (General)</option>
                            </select>
                        </div>

                        {/* ราคาและหน่วย */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">ราคาทุน *</label>
                                <input 
                                    type="number" 
                                    required 
                                    value={newProduct.cost_price} 
                                    onChange={e => setNewProduct({...newProduct, cost_price: e.target.value})} 
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">หน่วยนับ</label>
                                <input 
                                    value={newProduct.unit} 
                                    onChange={e => setNewProduct({...newProduct, unit: e.target.value})} 
                                    className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-green-500 transition"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 mt-2 transition active:scale-95">
                            บันทึกสินค้าใหม่
                        </button>
                    </form>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}