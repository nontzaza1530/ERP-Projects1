'use client';

import { useState, useEffect, Suspense } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Save, Plus, Trash2, User, ShoppingCart, Loader2, X, Box, Menu, Calendar, Truck, MapPin, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ แยก Component ย่อยออกมาเพื่อรองรับ useSearchParams ของ Next.js
function CreatePOContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prId = searchParams.get('pr_id'); // ✅ จับค่า pr_id จาก URL

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
    const [remarks, setRemarks] = useState('');
    const [shippingAddress, setShippingAddress] = useState('สำนักงานใหญ่ (HQ)');
    
    // ✅ ปรับ items ให้รองรับ custom_name แบบใบ PR
    const [items, setItems] = useState([{ type: 'inventory', product_id: '', custom_name: '', qty: 1, price: 0 }]);

    useEffect(() => {
        const initData = async () => {
            await fetchMaster();
            // ✅ ถ้ามี prId ส่งมา ให้ดึงข้อมูล PR มาหยอดใส่ฟอร์มเลย
            if (prId) {
                await fetchPRDataForAutoFill(prId);
            }
        };
        initData();
    }, [prId]);

    // 🟢 ดึง Master Data (สินค้า, ผู้ขาย)
    async function fetchMaster() {
        try {
            const res = await fetch('/api/purchasing/master-data');
            if (res.ok) {
                const data = await res.json();
                setSuppliers(data.suppliers || []);
                setProductsList(data.products || []);
                return data.products; // ส่งกลับไปเผื่อใช้ต่อ
            }
        } catch (error) {
            console.error("Error fetching master data:", error);
        } finally {
            setIsDataLoading(false);
        }
    }

    // 🟢 ฟังก์ชันวิเศษ: ดึงข้อมูลจาก PR มา Auto-Fill
    async function fetchPRDataForAutoFill(id) {
        Swal.fire({ title: 'กำลังดึงข้อมูลใบขอซื้อ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const res = await fetch(`/api/purchasing/pr/${id}`);
            if (res.ok) {
                const prData = await res.json();
                
                // ดึงสินค้าจาก Master Data (ดึง state ปัจจุบันไม่ทัน เลยดึงใหม่ชั่วคราว)
                const masterRes = await fetch('/api/purchasing/master-data');
                const masterData = await masterRes.json();
                const allProds = masterData.products || [];

                // แมปรายการสินค้าจาก PR ใส่ PO
                const mappedItems = prData.items.map(item => {
                    const matchedProduct = item.product_id ? allProds.find(p => p.id === item.product_id) : null;
                    return {
                        type: item.product_id ? 'inventory' : 'custom',
                        product_id: item.product_id || '',
                        custom_name: item.custom_item_name || '',
                        qty: item.quantity,
                        price: matchedProduct ? parseFloat(matchedProduct.cost_price) || 0 : 0 // ดึงราคาต้นทุนมาให้ก่อน (แก้ได้ทีหลัง)
                    };
                });

                setItems(mappedItems);
                setRemarks(`อ้างอิงใบขอซื้อ (PR): ${prData.header.pr_number}\n${prData.header.remarks || ''}`);
                
                Swal.close();
            }
        } catch (error) {
            console.error("Error auto-filling PR:", error);
            Swal.fire('Error', 'ไม่สามารถดึงข้อมูลอ้างอิงได้', 'error');
        }
    }

    const handleQuickAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                product_code: newProduct.code, name: newProduct.name, price: newProduct.cost_price,
                unit: newProduct.unit, category: newProduct.category, quantity: 0, min_level: 5
            };
            const res = await fetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
        if (field === 'product_id' && value !== '') {
            const product = productsList.find(p => p.id == value);
            newItems[index].price = product ? parseFloat(product.cost_price) || 0 : 0;
            newItems[index].custom_name = ''; // เคลียร์ชื่อ custom ทิ้ง
        }
        setItems(newItems);
    };

    const toggleRowType = (index) => {
        const newItems = [...items];
        newItems[index].type = newItems[index].type === 'inventory' ? 'custom' : 'inventory';
        newItems[index].product_id = '';
        newItems[index].custom_name = '';
        newItems[index].price = 0; // รีเซ็ตราคา
        setItems(newItems);
    };

    const calculateTotal = () => items.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0);

    const handleSubmit = async () => {
        if (!selectedSupplier) return Swal.fire('แจ้งเตือน', 'กรุณาเลือกผู้ขาย', 'warning');
        
        // เช็คว่ากรอกครบไหม
        const isInvalid = items.some(item => (item.qty <= 0) || (item.type === 'inventory' && !item.product_id) || (item.type === 'custom' && item.custom_name.trim() === ''));
        if (isInvalid) return Swal.fire('แจ้งเตือน', 'กรุณาระบุสินค้าและจำนวนให้ครบถ้วน', 'warning');

        setIsLoading(true);
        try {
            const payloadItems = items.map(item => ({
                product_id: item.type === 'custom' ? null : item.product_id, // ถ้า custom ส่งเป็น null
                custom_item_name: item.type === 'custom' ? item.custom_name : null,
                quantity: item.qty,
                unit_price: item.price
            }));

            const payload = {
                supplier_id: selectedSupplier,
                order_date: poDate,
                expected_date: deliveryDate,
                items: payloadItems,
                total_amount: calculateTotal(),
                user_id: 34,
                remarks: remarks,
                shipping_address: shippingAddress,
                ref_pr_id: prId // ✅ ส่ง ID ของใบ PR แนบไปด้วย (เพื่อไปเปลี่ยนสถานะ)
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

    const inputClass = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition";

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-x-hidden">
            <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </aside>

            <main className="flex-1 w-full lg:ml-64 transition-all duration-300 min-h-screen flex flex-col min-w-0">
                <div className="p-4 md:p-8 flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600"><Menu size={24} /></button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <ShoppingCart className="text-blue-600" size={32} /> สร้างใบสั่งซื้อ (PO)
                        </h1>
                        <p className="text-slate-500 text-xs md:text-sm mt-1">{prId ? 'สร้างรายการอ้างอิงจากใบขอซื้อ (PR)' : 'กรอกข้อมูลเพื่อออกใบสั่งซื้อสินค้าใหม่'}</p>
                    </div>
                </div>

                <div className="flex-1 p-4 md:p-8 pt-0 max-w-[1400px] w-full mx-auto space-y-6">
                    {isDataLoading ? (
                        <div className="flex justify-center items-center h-64 text-slate-400 gap-2 italic font-bold"><Loader2 className="animate-spin" /> กำลังโหลดข้อมูล...</div>
                    ) : (
                        <>
                            {/* ข้อมูลคู่ค้าและสถานที่จัดส่ง */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><User size={14} className="text-blue-500" /> ผู้ขาย (Supplier) <span className="text-red-500">*</span></label>
                                        <select className={inputClass} value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
                                            <option value="">-- เลือกคู่ค้า --</option>
                                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Calendar size={14} className="text-blue-500" /> วันที่สั่งซื้อ</label>
                                        <input type="date" className={inputClass} value={poDate} onChange={e => setPoDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><Truck size={14} className="text-blue-500" /> กำหนดรับของ</label>
                                        <input type="date" className={inputClass} value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                                    </div>
                                </div>
                                <div className="pt-5 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2"><MapPin size={14} className="text-blue-500" /> สถานที่จัดส่ง (Shipping Address)</label>
                                    <input type="text" className={inputClass} placeholder="เช่น สำนักงานใหญ่ (HQ)..." value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
                                </div>
                            </div>

                            {/* ตารางสินค้า */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                                    <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">รายการสินค้า {prId && <span className="text-orange-500 text-xs ml-2">(อิงจากข้อมูล PR)</span>}</h2>
                                    <button onClick={() => setShowQuickAdd(true)} className="text-xs bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-100 border border-green-200 flex items-center gap-1.5 shadow-sm transition"><Plus size={14} /> สร้างสินค้าใหม่ในคลัง</button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[900px]">
                                        <thead className="bg-slate-50/30 text-slate-400 text-[11px] font-bold uppercase border-b border-slate-100 tracking-widest">
                                            <tr>
                                                <th className="py-4 px-6 w-16 text-center">#</th>
                                                <th className="py-4 px-2 min-w-[250px]">สินค้า</th>
                                                <th className="py-4 px-2 w-32 text-right">ราคา/หน่วย</th>
                                                <th className="py-4 px-2 w-28 text-center">จำนวน</th>
                                                <th className="py-4 px-2 w-32 text-right">รวม (บาท)</th>
                                                <th className="py-4 px-4 w-16 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {items.map((item, idx) => (
                                                <tr key={idx} className="group hover:bg-slate-50/50 transition duration-150">
                                                    <td className="py-4 px-6 text-center text-slate-300 font-mono text-xs align-top pt-6">{idx + 1}</td>
                                                    
                                                    {/* ✅ ปรับคอลัมน์สินค้า ให้รองรับทั้งแบบเลือกจากคลัง และพิมพ์เอง (เหมือนหน้า PR) */}
                                                    <td className="py-4 px-2 align-top">
                                                        {item.type === 'inventory' ? (
                                                            <div>
                                                                <select className={inputClass} value={item.product_id} onChange={e => handleItemChange(idx, 'product_id', e.target.value)}>
                                                                    <option value="">-- เลือกสินค้า --</option>
                                                                    {productsList.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                                                                </select>
                                                                <button onClick={() => toggleRowType(idx)} className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition"><RefreshCw size={12} /> เปลี่ยนเป็นพิมพ์ชื่อเอง</button>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <input type="text" maxLength={255} className={`${inputClass} border-blue-300 bg-blue-50/30 font-bold text-blue-700`} placeholder="ระบุชื่อสินค้า..." value={item.custom_name} onChange={e => handleItemChange(idx, 'custom_name', e.target.value)} />
                                                                <button onClick={() => toggleRowType(idx)} className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition"><RefreshCw size={12} /> เปลี่ยนเป็นเลือกจากคลัง</button>
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="py-4 px-2 align-top"><input type="number" step="0.01" className={`${inputClass} text-right font-bold text-green-700`} value={item.price} onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)} /></td>
                                                    <td className="py-4 px-2 align-top"><input type="number" min="1" className={`${inputClass} text-center font-bold`} value={item.qty} onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 0)} /></td>
                                                    <td className="py-4 px-2 text-right font-black text-slate-800 align-top pt-6">{((item.qty || 0) * (item.price || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    <td className="py-4 px-4 text-center align-top pt-4">
                                                        {items.length > 1 && <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50/20 border-t border-slate-100">
                                    <button onClick={() => setItems([...items, { type: 'inventory', product_id: '', custom_name: '', qty: 1, price: 0 }])} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline px-4 transition"><Plus size={18} /> เพิ่มแถวใหม่</button>
                                </div>
                            </div>

                            {/* หมายเหตุ */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-6">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">หมายเหตุ (Remarks)</label>
                                <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition resize-y text-sm" rows="3" placeholder="ระบุเงื่อนไขการสั่งซื้อ หรือข้อความที่ต้องการแสดงในหน้าพิมพ์ใบสั่งซื้อ..." value={remarks} onChange={(e) => setRemarks(e.target.value)}></textarea>
                            </div>

                            {/* สรุปยอดและบันทึก */}
                            <div className="flex flex-col md:flex-row justify-end items-center gap-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mt-6">
                                <div className="text-right space-y-1">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ยอดรวม (Sub Total): ฿{calculateTotal().toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ภาษี 7% (VAT): ฿{(calculateTotal() * 0.07).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">ยอดรวมสุทธิ (Grand Total)</p>
                                    <p className="text-3xl md:text-5xl font-black text-blue-600">฿{(calculateTotal() * 1.07).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                </div>
                                <button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition transform active:scale-95 disabled:opacity-50">
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />} บันทึกใบสั่งซื้อ
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Modal: Quick Add */}
                {showQuickAdd && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Box className="text-green-600" size={20} /> เพิ่มสินค้าใหม่ (ด่วน)</h3>
                                <button onClick={() => setShowQuickAdd(false)} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleQuickAddSubmit} className="p-6 space-y-4">
                                <input required placeholder="รหัสสินค้า *" className={inputClass} value={newProduct.code} onChange={e => setNewProduct({ ...newProduct, code: e.target.value })} />
                                <input required placeholder="ชื่อสินค้า *" className={inputClass} value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" required placeholder="ราคาทุน *" className={inputClass} value={newProduct.cost_price} onChange={e => setNewProduct({ ...newProduct, cost_price: parseFloat(e.target.value) || 0 })} />
                                    <input placeholder="หน่วยนับ" className={inputClass} value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })} />
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

// ✅ หุ้มด้วย Suspense ตามข้อกำหนดของ Next.js 13+ สำหรับ Client Component ที่ใช้ useSearchParams
export default function CreatePO() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2"/> โหลดข้อมูล...</div>}>
            <CreatePOContent />
        </Suspense>
    );
}