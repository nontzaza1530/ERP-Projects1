'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import {
    FileText, Save, Trash2, Calendar, Package, Type, Box, RefreshCw, Info, ArrowLeft, Menu, Loader2, Store
} from 'lucide-react';
import Swal from 'sweetalert2';

function PRFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Form State
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]); // ✅ เพิ่ม State สำหรับเก็บข้อมูลคู่ค้า
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!editId);

    const [formData, setFormData] = useState({
        request_date: new Date().toISOString().split('T')[0],
        project_name: '',
        suggested_vendor: '',
        vendor_contact: '',
        required_date: '',
        remarks: '',
        items: [{ type: 'inventory', product_id: '', custom_name: '', qty: 1 }]
    });

    useEffect(() => {
        fetchProducts();
        fetchSuppliers(); // ✅ เรียกฟังก์ชันดึงคู่ค้าตอนโหลดหน้าเว็บ
        if (editId) {
            fetchPRDataForEdit(editId);
        }
    }, [editId]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/inventory');
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data.filter(p => p.is_deleted === 0));
        } catch (error) { console.error(error); }
    };

    // 🟢 ฟังก์ชันดึงข้อมูลคู่ค้า (จาก Master Data ที่เรามีอยู่แล้ว)
    const fetchSuppliers = async () => {
        try {
            const res = await fetch('/api/purchasing/master-data');
            if (res.ok) {
                const data = await res.json();
                if (data.suppliers) {
                    setSuppliers(data.suppliers);
                }
            }
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const fetchPRDataForEdit = async (id) => {
        try {
            const res = await fetch(`/api/purchasing/pr/${id}`);
            if (res.ok) {
                const data = await res.json();

                const formattedItems = data.items.map(item => ({
                    type: item.product_id ? 'inventory' : 'custom',
                    product_id: item.product_id ? item.product_id : 'custom',
                    custom_name: item.custom_item_name || '',
                    qty: item.quantity
                }));

                setFormData({
                    request_date: new Date(data.header.request_date).toISOString().split('T')[0],
                    project_name: data.header.project_name || '',
                    suggested_vendor: data.header.suggested_vendor || '',
                    vendor_contact: data.header.vendor_contact || '',
                    required_date: data.header.required_date || '',
                    remarks: data.header.remarks || '',
                    items: formattedItems.length > 0 ? formattedItems : [{ type: 'inventory', product_id: '', custom_name: '', qty: 1 }]
                });
            }
        } catch (error) {
            Swal.fire('Error', 'ดึงข้อมูลไม่สำเร็จ', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addInventoryRow = () => { setFormData({ ...formData, items: [...formData.items, { type: 'inventory', product_id: '', custom_name: '', qty: 1 }] }); };
    const addCustomRow = () => { setFormData({ ...formData, items: [...formData.items, { type: 'custom', product_id: '', custom_name: '', qty: 1 }] }); };

    const toggleRowType = (index) => {
        const newItems = [...formData.items];
        newItems[index].type = newItems[index].type === 'inventory' ? 'custom' : 'inventory';
        newItems[index].product_id = '';
        newItems[index].custom_name = '';
        setFormData({ ...formData, items: newItems });
    };

    const removeItemRow = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async () => {
        if (formData.items.length === 0) return Swal.fire('แจ้งเตือน', 'กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ', 'warning');

        const isInvalid = formData.items.some(item => (item.qty <= 0) || (item.type === 'inventory' && !item.product_id) || (item.type === 'custom' && item.custom_name.trim() === ''));
        if (isInvalid) return Swal.fire('แจ้งเตือน', 'กรุณาระบุสินค้าและจำนวนให้ครบถ้วนทุกบรรทัด', 'warning');

        setIsSaving(true);
        try {
            const payloadItems = formData.items.map(item => ({
                product_id: item.type === 'custom' ? 'custom' : item.product_id,
                custom_name: item.custom_name,
                qty: item.qty
            }));

            const url = editId ? `/api/purchasing/pr/${editId}` : '/api/purchasing/pr';
            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, items: payloadItems })
            });
            const result = await res.json();

            if (res.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: editId ? 'อัปเดตใบขอซื้อสำเร็จ!' : 'สร้างใบขอซื้อสำเร็จ!',
                    text: editId ? '' : `เลขที่: ${result.prNumber}`,
                    timer: 1500
                });
                router.push('/purchasing/po-list');
            } else {
                Swal.fire('Error', result.error, 'error');
            }
        } catch (err) {
            Swal.fire('Error', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition text-slate-900";

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsSidebarOpen(false)} />
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </aside>

            <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 transition-all duration-300 min-h-screen flex flex-col">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                                <FileText className="text-blue-600" size={32} />
                                {editId ? 'แก้ไขใบขอซื้อ (Edit PR)' : 'สร้างใบขอซื้อ (New PR)'}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {editId ? 'แก้ไขรายละเอียดคำขอสั่งซื้อสินค้า' : 'สร้างรายการขอสั่งซื้อสินค้าภายในองค์กร'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => router.push('/purchasing/po-list')} className="w-full md:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-5 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm">
                        <ArrowLeft size={20} /> ยกเลิก / กลับหน้ารวม
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex justify-center items-center text-slate-400 gap-2">
                        <Loader2 className="animate-spin" size={28} /> <span className="font-bold">กำลังโหลดข้อมูล...</span>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto w-full space-y-6">

                        {/* 📋 โซนข้อมูลเอกสาร */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                                <Info size={18} className="text-blue-500" />
                                <h3 className="font-bold text-slate-700 text-sm tracking-wide">ข้อมูลการขอซื้อ</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">วันที่ขอซื้อ <span className="text-red-500">*</span></label>
                                    <input type="date" className={inputClass} value={formData.request_date} onChange={e => setFormData({ ...formData, request_date: e.target.value })} />
                                </div>
                                {/* ✅ โค้ดใหม่: Smart Priority Selector */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ระดับความด่วน / วันที่ต้องการใช้</label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* ปุ่ม: ทั่วไป */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, required_date: 'ทั่วไป' })}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border ${(!formData.required_date || formData.required_date === 'ทั่วไป') ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                                        >
                                            ทั่วไป (ปกติ)
                                        </button>

                                        {/* ปุ่ม: ด่วน */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, required_date: 'ด่วน' })}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 ${formData.required_date === 'ด่วน' ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/30' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}
                                        >
                                            🔥 ด่วน
                                        </button>

                                        {/* ปุ่ม: ด่วนมาก */}
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, required_date: 'ด่วนมาก' })}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 ${formData.required_date === 'ด่วนมาก' ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30' : 'bg-white text-red-600 border-red-200 hover:bg-red-50'}`}
                                        >
                                            🚨 ด่วนมาก (ASAP)
                                        </button>

                                        {/* ส่วนเลือกวันที่ (จะไฮไลท์เมื่อค่าข้างในเป็นรูปแบบวันที่ XXXXX-XX-XX) */}
                                        <div className="relative flex-1 min-w-[140px]">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar size={14} className={formData.required_date && formData.required_date.includes('-') ? 'text-blue-600' : 'text-slate-400'} />
                                            </div>
                                            <input
                                                type="date"
                                                className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold outline-none transition border cursor-pointer ${formData.required_date && formData.required_date.includes('-') ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-inner' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                                value={formData.required_date && formData.required_date.includes('-') ? formData.required_date : ''}
                                                onChange={e => setFormData({ ...formData, required_date: e.target.value })}
                                                title="ระบุวันที่ต้องการใช้ของ"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* ✅ โค้ดใหม่: ช่องกรอกพร้อมปุ่ม Smart Quick Tags */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">โครงการ / แผนกที่นำไปใช้</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="ระบุชื่อโครงการ หรือแผนกที่ใช้..."
                                            className={`${inputClass} font-bold text-blue-700`}
                                            value={formData.project_name}
                                            onChange={e => setFormData({ ...formData, project_name: e.target.value })}
                                        />
                                    </div>

                                    {/* 🌟 ปุ่ม Quick Tags แนะนำ */}
                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        <span className="text-[10px] text-slate-400 font-bold mr-1">แนะนำ:</span>
                                        {/* คุณสามารถแก้ชื่อแผนก/โปรเจกต์ ในวงเล็บด้านล่างนี้ให้ตรงกับบริษัทคุณได้เลยครับ */}
                                        {['ฝ่ายผลิต', 'ส่วนกลาง', 'ช่างซ่อมบำรุง', 'โปรเจกต์ติดตั้ง'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, project_name: tag })}
                                                className="px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md text-[11px] font-bold transition-colors border border-blue-100 shadow-sm active:scale-95"
                                            >
                                                + {tag}
                                            </button>
                                        ))}
                                        {/* ปุ่มล้างค่า */}
                                        {formData.project_name && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, project_name: '' })}
                                                className="px-2 py-1 text-[10px] text-red-400 hover:text-red-600 font-bold transition ml-auto underline"
                                            >
                                                ล้างข้อมูล
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ร้านค้าที่แนะนำ / ผู้ติดต่อ (ถ้ามี)</label>
                                    <div className="flex gap-2">

                                        {/* ✅ เปลี่ยนเป็น Dropdown เลือกจากข้อมูลคู่ค้า */}
                                        <div className="relative w-1/2">
                                            <select
                                                className={`${inputClass} appearance-none cursor-pointer`}
                                                value={formData.suggested_vendor}
                                                onChange={e => {
                                                    const selectedVendorName = e.target.value;
                                                    // ค้นหาข้อมูลร้านค้าที่เลือก เพื่อเอาเบอร์โทรมาเติมให้อัตโนมัติ
                                                    const matchedSupplier = suppliers.find(s => s.name === selectedVendorName);

                                                    setFormData({
                                                        ...formData,
                                                        suggested_vendor: selectedVendorName,
                                                        vendor_contact: matchedSupplier ? (matchedSupplier.phone || matchedSupplier.contact_name || '') : ''
                                                    });
                                                }}
                                            >
                                                <option value="">-- เลือกร้านค้า --</option>
                                                {suppliers.map(s => (
                                                    <option key={s.id} value={s.name}>{s.name}</option>
                                                ))}
                                            </select>
                                            <Store className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" size={16} />
                                        </div>

                                        {/* เบอร์โทร (จะถูกเติมให้อัตโนมัติ หรือจะแก้เองก็ได้) */}
                                        <input
                                            type="text"
                                            placeholder="เบอร์โทร..."
                                            className={`${inputClass} w-1/2`}
                                            value={formData.vendor_contact}
                                            onChange={e => setFormData({ ...formData, vendor_contact: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 📦 โซนตารางรายการสินค้า */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
                                <Package size={18} className="text-slate-500" />
                                <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">รายการที่ต้องการสั่งซื้อ</h2>
                            </div>
                            <div className="overflow-x-auto p-4">
                                <table className="w-full text-left">
                                    <thead className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="pb-3 w-12 text-center">#</th>
                                            <th className="pb-3 min-w-[300px]">สินค้า / วัตถุดิบ <span className="text-red-500">*</span></th>
                                            <th className="pb-3 w-32 text-center">จำนวน <span className="text-red-500">*</span></th>
                                            <th className="pb-3 w-16 text-center">ลบ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="space-y-4">
                                        {formData.items.length === 0 ? (
                                            <tr><td colSpan="4" className="py-12 text-center text-slate-400 italic bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200">ยังไม่มีรายการสั่งซื้อ กรุณากดปุ่มด้านล่างเพื่อเริ่มเพิ่มรายการ</td></tr>
                                        ) : (
                                            formData.items.map((item, idx) => (
                                                <tr key={idx} className="group">
                                                    <td className="py-2 text-center text-slate-300 font-mono text-sm align-top pt-4">{idx + 1}</td>
                                                    <td className="py-2 pr-2 align-top">
                                                        {item.type === 'inventory' ? (
                                                            <div>
                                                                <select className={`${inputClass} py-2.5 text-sm font-medium`} value={item.product_id} onChange={e => handleItemChange(idx, 'product_id', e.target.value)}>
                                                                    <option value="">-- เลือกสินค้าในคลัง --</option>
                                                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.product_code})</option>)}
                                                                </select>
                                                                <button onClick={() => toggleRowType(idx)} className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition"><RefreshCw size={12} /> เปลี่ยนเป็นพิมพ์ชื่อเอง</button>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <input type="text" maxLength={255} placeholder="ระบุชื่อสินค้าที่ต้องการซื้อ..." className={`${inputClass} py-2.5 text-sm font-bold text-blue-700 border-blue-300 focus:ring-blue-200 bg-blue-50/50`} value={item.custom_name} onChange={e => handleItemChange(idx, 'custom_name', e.target.value)} autoFocus={!editId} />
                                                                <button onClick={() => toggleRowType(idx)} className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-blue-500 transition"><RefreshCw size={12} /> เปลี่ยนเป็นเลือกจากคลัง</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-2 pr-2 align-top"><input type="number" min="1" className={`${inputClass} py-2.5 text-center font-bold text-indigo-600`} value={item.qty} onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value) || 0)} /></td>
                                                    <td className="py-2 text-center align-top pt-3"><button onClick={() => removeItemRow(idx)} className="p-2 text-slate-300 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition"><Trash2 size={18} /></button></td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                                    <button onClick={addInventoryRow} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold text-sm hover:bg-indigo-600 hover:text-white px-5 py-2.5 rounded-xl transition shadow-sm"><Box size={16} /> + เลือกสินค้าจากคลัง</button>
                                    <button onClick={addCustomRow} className="flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 font-bold text-sm hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl transition shadow-sm"><Type size={16} /> + พิมพ์ชื่อสินค้าเอง</button>
                                </div>
                            </div>
                        </div>

                        {/* 📝 โซนหมายเหตุ */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">หมายเหตุ / เหตุผลในการขอซื้อ</label>
                            <textarea className={`${inputClass} resize-y text-sm`} rows="3" placeholder="ระบุเหตุผลในการขอซื้อ หรือรายละเอียดเพิ่มเติม..." value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}></textarea>
                        </div>

                        {/* 💾 ปุ่มบันทึก */}
                        <div className="flex justify-end pt-4 pb-10">
                            <button onClick={handleSubmit} disabled={isSaving} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 transition transform active:scale-95 disabled:opacity-50">
                                {isSaving ? 'กำลังบันทึก...' : <><Save size={24} /> {editId ? 'อัปเดตใบขอซื้อ' : 'บันทึกใบขอซื้อ'}</>}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function PRPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400 bg-[#F8FAFC]"><Loader2 className="animate-spin mr-2" /> โหลดหน้ากระดาษ...</div>}>
            <PRFormContent />
        </Suspense>
    );
}