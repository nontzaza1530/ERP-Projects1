'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import { Save, Plus, Trash2, Loader2, FileSignature, ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditQuotationPage() {
    const router = useRouter();
    const params = useParams();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [formData, setFormData] = useState(null);

    useEffect(() => {
        fetchQuotation();
    }, []);

    const fetchQuotation = async () => {
        try {
            const res = await fetch(`/api/accounting/project-quotations/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                
                // ปรับแต่งข้อมูลให้เข้ากับ Form State
                setFormData({
                    ...data,
                    issue_date: data.issue_date ? new Date(data.issue_date).toISOString().split('T')[0] : '',
                    valid_until: data.valid_until ? new Date(data.valid_until).toISOString().split('T')[0] : '',
                    billing_date: data.billing_date ? new Date(data.billing_date).toISOString().split('T')[0] : '',
                    items: data.items.map(item => ({
                        description: item.description,
                        qty: item.quantity,
                        unit: item.unit,
                        price: item.unit_price
                    }))
                });
            } else {
                Swal.fire('Error', 'ไม่พบข้อมูลใบเสนอราคา', 'error');
                router.push('/accounting/project-quotations');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDataLoading(false);
        }
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => formData.items.reduce((sum, item) => sum + ((item.qty || 0) * (item.price || 0)), 0);

    const handleSubmit = async () => {
        if (!formData.customer_name || !formData.project_name) return Swal.fire('แจ้งเตือน', 'กรุณากรอกชื่อลูกค้าและชื่องาน', 'warning');
        const isInvalid = formData.items.some(item => !item.description.trim() || item.qty <= 0);
        if (isInvalid) return Swal.fire('แจ้งเตือน', 'กรุณากรอกรายละเอียดและจำนวนให้ครบถ้วน', 'warning');

        setIsLoading(true);
        try {
            const payload = { ...formData, total_amount: calculateTotal() };
            const res = await fetch(`/api/accounting/project-quotations/${params.id}`, { 
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) 
            });
            
            if (res.ok) {
                await Swal.fire({ icon: 'success', title: 'อัปเดตข้อมูลสำเร็จ', text: `แก้ไขเลขที่: ${formData.quotation_number} เรียบร้อยแล้ว` });
                router.push('/accounting/project-quotations');
            } else {
                Swal.fire('Error', 'เกิดข้อผิดพลาดในการบันทึก', 'error');
            }
        } catch (err) { Swal.fire('Error', 'ไม่สามารถเชื่อมต่อระบบได้', 'error'); } 
        finally { setIsLoading(false); }
    };

    const inputClass = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-200 outline-none transition";

    if (isDataLoading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold"><Loader2 className="animate-spin mr-2" /> กำลังโหลดข้อมูล...</div>;

    if (!formData) return null;

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 hidden lg:block"><Sidebar /></aside>
            <main className="flex-1 w-full lg:ml-64 p-4 md:p-8 flex flex-col min-w-0">
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <FileSignature className="text-amber-500" size={32} />
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">แก้ไขใบเสนอราคา <span className="text-amber-500">{formData?.quotation_number}</span></h1>
                        </div>
                    </div>
                    <Link href="/accounting/project-quotations" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"><ArrowLeft size={16}/> ยกเลิก</Link>
                </div>

                {/* --- นำโค้ดหน้าฟอร์ม (Form) จากหน้า Create มาใส่เหมือนเดิมเป๊ะๆ --- */}
                <div className="max-w-6xl w-full mx-auto space-y-6">
                    {/* 1. ประเภทและข้อมูลงาน */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['Project', 'Service', 'Custom', 'General'].map(type => (
                                <button key={type} onClick={() => setFormData({...formData, quotation_type: type})} 
                                    className={`px-5 py-2 rounded-xl text-xs font-bold transition border ${formData.quotation_type === type ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                                    {type === 'Project' ? '🏢 งานโปรเจกต์' : type === 'Service' ? '🛠️ งานบริการ' : type === 'Custom' ? '📦 สั่งทำพิเศษ' : '📄 ทั่วไป'}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1 md:col-span-2">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">หัวข้อ / ชื่องาน <span className="text-red-500">*</span></label>
                                <input type="text" className={`${inputClass} text-lg font-bold text-blue-700`} value={formData.project_name} onChange={e => setFormData({...formData, project_name: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">วันที่เสนอราคา</label>
                                <input type="date" className={inputClass} value={formData.issue_date} onChange={e => setFormData({...formData, issue_date: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ยืนยันราคาถึงวันที่</label>
                                <input type="date" className={inputClass} value={formData.valid_until} onChange={e => setFormData({...formData, valid_until: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    {/* 2. ข้อมูลลูกค้า */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ชื่อลูกค้า / บริษัท <span className="text-red-500">*</span></label>
                            <input type="text" className={inputClass} value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ที่อยู่ลูกค้า</label>
                            <input type="text" className={inputClass} value={formData.customer_address} onChange={e => setFormData({...formData, customer_address: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">ชื่อผู้ติดต่อ</label>
                            <input type="text" className={inputClass} value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">เบอร์โทรศัพท์</label>
                            <input type="text" className={inputClass} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>

                    {/* 3. ตารางรายการงาน */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100"><h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">รายละเอียดงาน / บริการ</h2></div>
                        <div className="overflow-x-auto p-4">
                            <table className="w-full text-left">
                                <thead className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-3 px-2 w-12 text-center">#</th>
                                        <th className="pb-3 px-2 min-w-[300px]">รายละเอียด</th>
                                        <th className="pb-3 px-2 w-24 text-center">จำนวน</th>
                                        <th className="pb-3 px-2 w-24 text-center">หน่วย</th>
                                        <th className="pb-3 px-2 w-32 text-right">ราคา/หน่วย</th>
                                        <th className="pb-3 px-2 w-32 text-right">รวม (บาท)</th>
                                        <th className="pb-3 px-2 w-16 text-center">ลบ</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-2">
                                    {formData.items.map((item, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="py-2 text-center text-slate-300 font-mono text-xs">{idx + 1}</td>
                                            <td className="py-2 px-1"><input type="text" className={inputClass} value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} /></td>
                                            <td className="py-2 px-1"><input type="number" min="1" className={`${inputClass} text-center`} value={item.qty} onChange={e => handleItemChange(idx, 'qty', parseInt(e.target.value)||0)} /></td>
                                            <td className="py-2 px-1"><input type="text" className={`${inputClass} text-center`} value={item.unit} onChange={e => handleItemChange(idx, 'unit', e.target.value)} /></td>
                                            <td className="py-2 px-1"><input type="number" step="0.01" className={`${inputClass} text-right`} value={item.price} onChange={e => handleItemChange(idx, 'price', parseFloat(e.target.value)||0)} /></td>
                                            <td className="py-2 px-2 text-right font-black text-slate-700">{(item.qty * item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                            <td className="py-2 text-center"><button onClick={() => setFormData({...formData, items: formData.items.filter((_, i) => i !== idx)})} className="p-2 text-slate-300 hover:text-red-500 transition"><Trash2 size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setFormData({...formData, items: [...formData.items, { description: '', qty: 1, unit: 'งาน', price: 0 }]})} className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline px-2"><Plus size={16} /> เพิ่มรายการ</button>
                            </div>
                        </div>
                    </div>

                    {/* 4. กำหนดวางบิล และ หมายเหตุ */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                            <label className="text-xs font-bold text-orange-700 uppercase mb-2 flex items-center gap-2">กำหนดวันที่ต้องวางบิล / ออก Invoice</label>
                            <input type="date" className="w-full p-2.5 bg-white border border-orange-200 rounded-xl text-sm font-bold text-orange-700 outline-none" value={formData.billing_date} onChange={e => setFormData({...formData, billing_date: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">เงื่อนไข / หมายเหตุ</label>
                            <textarea className={`${inputClass} resize-y`} rows="3" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})}></textarea>
                        </div>
                    </div>

                    {/* 5. สรุปยอดและบันทึก */}
                    <div className="flex flex-col md:flex-row justify-end items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 pb-10">
                        <div className="text-right">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">ยอดรวมสุทธิ</p>
                            <p className="text-3xl font-black text-blue-600">฿{calculateTotal().toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        </div>
                        <button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition">
                            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />} บันทึกการแก้ไข
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}