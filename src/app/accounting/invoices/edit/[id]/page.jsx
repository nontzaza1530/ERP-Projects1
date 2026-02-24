'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Save, Plus, Trash2, ArrowLeft, Calculator, User, Menu, X, FileText, Percent, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditInvoicePage() {
    const router = useRouter();
    const { id } = useParams(); // ✅ รับ ID จาก URL เพื่อดึงข้อมูลเก่า

    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // สถานะตอนกำลังโหลดข้อมูลเก่า
    const [projects, setProjects] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isInitialLoad = useRef(true); // ป้องกันไม่ให้สูตรคำนวณทับข้อมูลเก่าตอนโหลดครั้งแรก

    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositPercent, setDepositPercent] = useState(30); 
    const [activeItemIndex, setActiveItemIndex] = useState(null); 

    const [vatRate, setVatRate] = useState(7);
    const [whtRate, setWhtRate] = useState(3);
    const [customVatAmount, setCustomVatAmount] = useState(0);
    const [customWhtAmount, setCustomWhtAmount] = useState(0);

    const [formData, setFormData] = useState({
        doc_number: '', // เอาไว้โชว์เฉยๆ
        project_id: '',
        customer_name: '',
        customer_address: '',
        customer_tax_id: '',
        due_date: '',
        doc_date: ''
    });

    const [items, setItems] = useState([]);

    // คำนวณยอดรวมก่อนภาษี (Subtotal)
    const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);

    // Auto-calculate Taxes (จะทำงานก็ต่อเมื่อโหลดข้อมูลเก่าเสร็จแล้วเท่านั้น)
    useEffect(() => {
        if (isInitialLoad.current) return;
        setCustomVatAmount(subtotal * (vatRate / 100));
        setCustomWhtAmount(subtotal * (whtRate / 100));
    }, [subtotal, vatRate, whtRate]);

    const grandTotal = subtotal + parseFloat(customVatAmount || 0);

    // ✅ ฟังก์ชันดึงข้อมูล "โปรเจกต์" และ "ข้อมูลใบแจ้งหนี้เดิม"
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. ดึงโปรเจกต์
                const projRes = await fetch('/api/production/projects');
                const projData = await projRes.json();
                setProjects(Array.isArray(projData) ? projData : (projData.projects || []));

                // 2. ดึงข้อมูลใบแจ้งหนี้เก่ามาใส่ฟอร์ม
                const invRes = await fetch(`/api/accounting/invoices/${id}`);
                const invData = await invRes.json();

                if (invData.invoice) {
                    const inv = invData.invoice;
                    setFormData({
                        doc_number: inv.doc_number,
                        project_id: inv.project_id || '',
                        customer_name: inv.customer_name || '',
                        customer_address: inv.customer_address || '',
                        customer_tax_id: inv.customer_tax_id || '',
                        due_date: inv.due_date ? new Date(inv.due_date).toISOString().split('T')[0] : '',
                        doc_date: inv.doc_date ? new Date(inv.doc_date).toISOString().split('T')[0] : ''
                    });

                    setVatRate(Number(inv.vat_rate) || 0);
                    setCustomVatAmount(Number(inv.vat_amount) || 0);
                    setWhtRate(Number(inv.wht_rate) || 0);
                    setCustomWhtAmount(Number(inv.wht_amount) || 0);

                    if (invData.items) {
                        setItems(invData.items.map(item => ({
                            description: item.description,
                            quantity: Number(item.quantity),
                            unit_price: Number(item.unit_price)
                        })));
                    }
                }
            } catch (error) {
                console.error("Error loading edit data:", error);
            } finally {
                setIsFetching(false);
                // รอแป๊บนึงค่อยปลดล็อกให้สูตร Auto-calc ทำงาน (ป้องกันการล้างค่ายอดที่เคยพิมพ์แก้ไว้)
                setTimeout(() => { isInitialLoad.current = false; }, 500);
            }
        };

        if (id) loadData();
    }, [id]);

    const handleProjectChange = (e) => {
        const pid = e.target.value;
        const selectedProject = projects.find(p => p.id == pid);

        if (selectedProject) {
            setFormData({
                ...formData,
                project_id: pid,
                customer_name: selectedProject.customer_name || '',
                customer_address: selectedProject.customer_address || formData.customer_address 
            });

            const qty = parseFloat(selectedProject.quantity) || 1;
            const price = parseFloat(selectedProject.sale_price) || 0;
            let unitPrice = selectedProject.billing_type === 'unit_based' ? price : price / qty; 
            const typeText = selectedProject.billing_type === 'unit_based' ? 'คิดตามรายชิ้น' : 'เหมาจ่าย';

            setItems([{ description: `โครงการ: ${selectedProject.project_name} (${typeText})`, quantity: qty, unit_price: unitPrice }]);
        } else {
            setFormData({ ...formData, project_id: '', customer_name: '' });
            setItems([{ description: '', quantity: 1, unit_price: 0 }]);
        }
    };

    const openDepositModal = (index) => {
        setActiveItemIndex(index);
        setDepositPercent(30);
        setShowDepositModal(true);
    };

    const confirmDeposit = () => {
        if (activeItemIndex === null) return;
        const newItems = [...items];
        const currentItem = newItems[activeItemIndex];
        const depositAmount = currentItem.unit_price * (depositPercent / 100);
        newItems[activeItemIndex].unit_price = depositAmount;
        const cleanDescription = currentItem.description.replace(/\s*\(มัดจำ \d+%\)$/, "");
        newItems[activeItemIndex].description = `${cleanDescription} (มัดจำ ${depositPercent}%)`;
        setItems(newItems);
        setShowDepositModal(false);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    const removeItem = (index) => { if (items.length > 1) setItems(items.filter((_, i) => i !== index)); };

    // ✅ ฟังก์ชันกดบันทึก (เปลี่ยนเป็น PUT แทน POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/accounting/invoices/${id}`, {
                method: 'PUT', // อัปเดตข้อมูลเดิม
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...formData, 
                    items: items, 
                    quantity: items[0]?.quantity || 1,
                    description: items[0]?.description || '',
                    subtotal: subtotal,
                    vat_rate: vatRate,               
                    vat_amount: customVatAmount, 
                    grand_total: grandTotal,
                    wht_rate: whtRate,               
                    wht_amount: customWhtAmount
                })
            });

            if (res.ok) router.push('/accounting/invoices');
            else {
                const errorData = await res.json();
                alert("❌ เกิดข้อผิดพลาดในการบันทึก: " + (errorData.error || "Unknown Error"));
            }
        } catch (error) {
            console.error(error);
            alert("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition shadow-sm";

    if (isFetching) {
        return <div className="flex h-screen items-center justify-center bg-slate-50">กำลังโหลดข้อมูลเอกสาร...</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
            <div className="hidden lg:block w-64 shrink-0 h-full bg-slate-900 text-white z-20"><Sidebar /></div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-64 h-full bg-slate-900 shadow-xl">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
                        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* Modal มัดจำ */}
            {showDepositModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDepositModal(false)}></div>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg flex items-center gap-2"><Calculator size={20} /> คำนวณเงินมัดจำ</h3>
                            <button onClick={() => setShowDepositModal(false)} className="hover:bg-blue-700 p-1 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">ระบุเปอร์เซ็นต์ที่ต้องการ (%)</label>
                                <div className="relative">
                                    <input type="number" min="1" max="100" value={depositPercent} onChange={(e) => setDepositPercent(parseFloat(e.target.value) || 0)} className="w-full text-4xl font-bold text-blue-600 text-center p-4 border-2 border-blue-100 rounded-xl outline-none" autoFocus />
                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">%</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                <p className="text-sm text-slate-500 mb-1">ยอดเงินเดิม: {items[activeItemIndex]?.unit_price.toLocaleString()} บาท</p>
                                <p className="text-slate-800 font-medium">จะถูกปรับเป็น <span className="text-green-600 font-bold text-xl">{(items[activeItemIndex]?.unit_price * (depositPercent / 100)).toLocaleString()}</span> บาท</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDepositModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">ยกเลิก</button>
                                <button onClick={confirmDeposit} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex justify-center items-center gap-2"><CheckCircle size={20} /> ยืนยันคำนวณ</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 h-full overflow-y-auto w-full">
                <div className="lg:hidden bg-white p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><Menu size={24} /></button>
                        <span className="font-bold text-slate-800">ระบบบัญชี</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/accounting/invoices" className="p-2 hover:bg-slate-200 rounded-full transition"><ArrowLeft size={24} className="text-slate-600" /></Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">แก้ไขใบแจ้งหนี้</h1>
                                <p className="text-slate-500 text-sm font-medium text-orange-600">{formData.doc_number}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button type="button" onClick={() => router.back()} className="flex-1 md:flex-none px-4 py-2 text-slate-700 font-bold hover:bg-slate-200 rounded-lg border border-slate-300">ยกเลิก</button>
                            <button type="submit" disabled={loading} className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200"><Save size={20} /> {loading ? 'กำลังบันทึก...' : 'อัปเดตเอกสาร'}</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 space-y-6">
                            {/* ข้อมูลลูกค้า */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2"><User className="text-blue-600" size={20} /> ข้อมูลลูกค้า (Customer)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-bold text-slate-700">อ้างอิงโครงการ (Project) <span className="text-red-500">*</span></label>
                                            {formData.project_id && projects.find(p => p.id == formData.project_id) && (
                                                <span className={`text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border shadow-sm ${projects.find(p => p.id == formData.project_id).billing_type === 'unit_based' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                                    {projects.find(p => p.id == formData.project_id).billing_type === 'unit_based' ? '📦 คิดตามรายชิ้น' : '💼 เหมาจ่ายทั้งก้อน'}
                                                </span>
                                            )}
                                        </div>
                                        <select value={formData.project_id} onChange={handleProjectChange} className={inputStyle + " cursor-pointer appearance-none"}>
                                            <option value="">-- ไม่ระบุโปรเจกต์ --</option>
                                            <optgroup label="งานทั้งหมด">
                                                {projects.map(p => (
                                                    <option key={p.id} value={p.id}>{p.project_name} - {p.customer_name} [{p.billing_type === 'unit_based' ? 'รายชิ้น' : 'เหมาจ่าย'}]</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">ชื่อลูกค้า <span className="text-red-500">*</span></label>
                                        <input required type="text" value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} className={inputStyle} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">ที่อยู่</label>
                                        <textarea rows="2" value={formData.customer_address} onChange={e => setFormData({ ...formData, customer_address: e.target.value })} className={inputStyle}></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">เลขผู้เสียภาษี (Tax ID)</label>
                                        <input type="text" maxLength={13} placeholder="ระบุเลข 13 หลัก" value={formData.customer_tax_id} onChange={(e) => setFormData({ ...formData, customer_tax_id: e.target.value.replace(/[^0-9]/g, '') })} className={`${inputStyle} tracking-widest`} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">กำหนดชำระ (Due Date)</label>
                                        <input type="date" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} className={inputStyle} />
                                    </div>
                                </div>
                            </div>

                            {/* รายการสินค้า */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2"><FileText className="text-blue-600" size={20} /> รายการสินค้า (Items)</h3>
                                <div className="hidden md:block">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-sm text-slate-500 border-b border-slate-100">
                                                <th className="py-2 w-[45%]">รายการ</th>
                                                <th className="py-2 w-[10%] text-center">จำนวน</th>
                                                <th className="py-2 w-[30%] text-right">ราคา/หน่วย</th>
                                                <th className="py-2 w-[10%] text-right">รวม</th>
                                                <th className="py-2 w-[5%]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="align-top">
                                            {items.map((item, index) => (
                                                <tr key={index} className="group">
                                                    <td className="p-2 pl-0"><input required type="text" placeholder="ชื่อสินค้า..." value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className={inputStyle} /></td>
                                                    <td className="p-2"><input required type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className={`${inputStyle} text-center`} /></td>
                                                    <td className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <input required type="number" step="0.01" value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)} className={`${inputStyle} text-right min-w-[120px]`} />
                                                            <button type="button" onClick={() => openDepositModal(index)} className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2.5 rounded-xl transition text-xs font-bold border border-blue-100"><Percent size={14} /> มัดจำ</button>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 py-4 text-right font-bold text-slate-800">{(item.quantity * item.unit_price).toLocaleString()}</td>
                                                    <td className="p-2 text-center">
                                                        {items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-500 transition"><Trash2 size={18} /></button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <button type="button" onClick={addItem} className="mt-4 w-full md:w-auto flex justify-center items-center gap-2 text-blue-600 font-bold text-sm hover:bg-blue-50 px-4 py-3 rounded-lg border border-dashed border-blue-300 transition"><Plus size={18} /> เพิ่มรายการใหม่</button>
                            </div>
                        </div>

                        {/* ✅ สรุปยอดเงินแบบพิมพ์แก้ได้อิสระ */}
                        <div className="xl:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Calculator className="text-blue-600" size={20} /> สรุปยอดเงิน
                                </h3>
                                
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>รวมเป็นเงิน (Subtotal)</span>
                                        <span className="font-bold text-slate-800 text-base">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <span>VAT</span>
                                            <div className="relative">
                                                <input type="number" value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} className="w-16 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-1 text-xs font-bold text-center focus:ring-2 outline-none"/>
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                                            </div>
                                        </div>
                                        <input type="number" step="0.01" value={customVatAmount} onChange={(e) => setCustomVatAmount(e.target.value)} className="w-24 text-right bg-white border border-red-200 text-red-600 rounded-lg p-1 font-bold focus:ring-2 focus:ring-red-100 outline-none"/>
                                    </div>

                                    <div className="border-t border-slate-100 my-2"></div>

                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-slate-800 text-lg">ยอดสุทธิ</span>
                                        <span className="font-black text-blue-600 text-2xl">{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="text-right text-xs text-slate-400">บาท (THB)</div>

                                    <div className="mt-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                                        <div className="flex justify-between items-center text-slate-600 mb-2">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold">หักภาษี ณ ที่จ่าย</span>
                                                <div className="relative">
                                                    <input type="number" value={whtRate} onChange={(e) => setWhtRate(Number(e.target.value))} className="w-16 bg-white border border-orange-200 text-orange-700 rounded-lg p-1 text-xs font-bold text-center focus:ring-2 outline-none shadow-sm"/>
                                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-orange-400">%</span>
                                                </div>
                                            </div>
                                            <input type="number" step="0.01" value={customWhtAmount} onChange={(e) => setCustomWhtAmount(e.target.value)} className="w-28 text-right bg-white border border-orange-200 text-orange-600 rounded-lg p-1.5 font-bold focus:ring-2 focus:ring-orange-100 outline-none shadow-sm"/>
                                        </div>
                                        <p className="text-[10px] text-orange-500 leading-snug">
                                            * ปรับแก้ตัวเลขจำนวนเงินภาษีได้โดยตรง หากมีเศษสตางค์ไม่ตรงกัน
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}