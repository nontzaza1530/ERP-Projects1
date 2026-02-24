'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../../components/Sidebar';
import { 
    Save, Plus, Trash2, User, ShoppingCart, Loader2, X, Box, Menu, Calendar, Truck, ArrowLeft, MapPin, RefreshCw 
} from 'lucide-react'; // ✅ เพิ่มไอคอน RefreshCw
import Swal from 'sweetalert2';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditPOPage() {
    const router = useRouter();
    const params = useParams();

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
    const [shippingAddress, setShippingAddress] = useState('สำนักงานใหญ่ (HQ)');
    
    // ✅ 1. ปรับโครงสร้าง Items ให้รองรับทั้งโหมด 'inventory' และ 'custom'
    const [items, setItems] = useState([]);

    useEffect(() => {
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

    async function fetchPOData() {
        try {
            const res = await fetch(`/api/purchasing/po/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setPoNumber(data.po_number);
                setSelectedSupplier(data.supplier_id);
                setRemarks(data.remarks || '');
                setShippingAddress(data.shipping_address || 'สำนักงานใหญ่ (HQ)');

                if (data.order_date) setPoDate(new Date(data.order_date).toISOString().split('T')[0]);
                if (data.expected_date) setDeliveryDate(new Date(data.expected_date).toISOString().split('T')[0]);

                // ✅ 2. อัปเดตการดึงข้อมูลสินค้า ให้รองรับ custom_item_name และแก้ปัญหา value เป็น null
                if (data.items && data.items.length > 0) {
                    const mappedItems = data.items.map(item => ({
                        type: item.product_id ? 'inventory' : 'custom', // ตรวจสอบว่าเป็นสินค้าแบบไหน
                        product_id: item.product_id || '', // ป้องกัน Error null ใน select
                        custom_name: item.custom_item_name || '', // ดึงชื่อพิมพ์เองมาโชว์
                        qty: item.quantity,
                        price: item.unit_price
                    }));
                    setItems(mappedItems);
                } else {
                    setItems([{ type: 'inventory', product_id: '', custom_name: '', qty: 1, price: 0 }]);
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
        
        // ถ้าเปลี่ยนชื่อสินค้าในคลัง ให้ดึงราคาใหม่มาใส่
        if (field === 'product_id' && value !== '') {
            const product = productsList.find(p => p.id == value);
            newItems[index].price = product ? parseFloat(product.cost_price) || 0 : 0;
            newItems[index].custom_name = ''; // เคลียร์ชื่อพิมพ์เองทิ้ง
        }
        setItems(newItems);
    };

    // ✅ 3. ฟังก์ชันสลับโหมด "เลือกจากคลัง" กับ "พิมพ์ชื่อเอง"
    const toggleRowType = (index) => {
        const newItems = [...items];
        newItems[index].type = newItems[index].type === 'inventory' ? 'custom' : 'inventory';
        newItems[index].product_id = '';
        newItems[index].custom_name = '';
        newItems[index].price = 0;
        setItems(newItems);
    };

    const calculateTotal = () => items.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0);

    const handleSubmit = async () => {
        if (!selectedSupplier) return Swal.fire('แจ้งเตือน', 'กรุณาเลือกผู้ขาย', 'warning');
        
        // ✅ 4. เช็คความถูกต้องให้รองรับทั้ง 2 โหมด
        const isInvalid = items.some(item => (item.qty <= 0) || (item.type === 'inventory' && !item.product_id) || (item.type === 'custom' && item.custom_name.trim() === ''));
        if (isInvalid) return Swal.fire('แจ้งเตือน', 'กรุณาระบุสินค้าและจำนวนให้ครบถ้วนทุกรายการ', 'warning');

        setIsLoading(true);
        try {
            // ✅ 5. แปลงข้อมูลก่อนส่ง API
            const payloadItems = items.map(item => ({
                product_id: item.type === 'custom' ? null : item.product_id,
                custom_name: item.type === 'custom' ? item.custom_name : null,
                qty: item.qty,
                price: item.price
            }));

            const payload = {
                supplier_id: selectedSupplier,
                order_date: poDate,
                expected_date: deliveryDate,
                items: payloadItems,
                total_amount: calculateTotal(),
                remarks: remarks,
                shipping_address: shippingAddress 
            };

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

    const inputClass = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition";

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
                                <ShoppingCart className="text-blue-600" size={32} /> แก้ไขใบสั่งซื้อ <span className="text-blue-600 ml-2">{poNumber}</span>
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">แก้ไขข้อมูลผู้ขาย, สินค้า หรือหมายเหตุของเอกสาร</p>
                        </div>
                    </div>
                    <Link href="/purchasing/po-list" className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition">
                        <ArrowLeft size={20} /> ยกเลิกและกลับ
                    </Link>
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
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><User size={14} className="text-blue-500" /> ผู้ขาย (Supplier) *</label>
                                        <select className={`${inputClass} font-bold`} value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)}>
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
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-2">
                                        <MapPin size={14} className="text-blue-500" /> สถานที่จัดส่ง (Shipping Address)
                                    </label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="เช่น สำนักงานใหญ่ (HQ) หรือ ระบุที่อยู่ไซต์งาน..."
                                        value={shippingAddress}
                                        onChange={e => setShippingAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* ตารางสินค้า */}
                            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                                    <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">รายการสินค้า (แก้ไขได้)</h2>
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
                                                    
                                                    {/* ✅ 6. ปรับ UI ช่องสินค้า ให้เปลี่ยนโหมดได้ */}
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

                                                    <td className="py-4 px-2 align-top"><input type="number" step="0.01" className={`${inputClass} text-right font-bold`} value={item.price} onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)} /></td>
                                                    <td className="py-4 px-2 align-top"><input type="number" min="1" className={`${inputClass} text-center font-bold`} value={item.qty} onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)} /></td>
                                                    <td className="py-4 px-2 text-right font-black text-slate-800 align-top pt-6">{((item.qty || 0) * (item.price || 0)).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                                    <td className="py-4 px-4 text-center align-top pt-4">
                                                        {items.length > 1 && <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50/20 border-t border-slate-100 flex gap-3">
                                    <button onClick={() => setItems([...items, { type: 'inventory', product_id: '', custom_name: '', qty: 1, price: 0 }])} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:bg-blue-50 px-4 py-2 rounded-lg transition"><Plus size={18} /> เพิ่มบรรทัดใหม่</button>
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
                                <div className="text-right space-y-1">
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">ยอดรวม (Sub Total): ฿{calculateTotal().toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ภาษี 7% (VAT): ฿{(calculateTotal() * 0.07).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">ยอดรวมสุทธิ (Grand Total)</p>
                                    <p className="text-3xl md:text-5xl font-black text-blue-600">฿{(calculateTotal() * 1.07).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                </div>
                                <button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition transform active:scale-95 disabled:opacity-50">
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />} บันทึกการแก้ไข
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}