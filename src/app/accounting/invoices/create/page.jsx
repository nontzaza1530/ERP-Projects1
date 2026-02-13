'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Save, Plus, Trash2, ArrowLeft, Calculator, User, Menu, X, FileText, Percent, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CreateInvoicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- State สำหรับ Modal คำนวณมัดจำ ---
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [depositPercent, setDepositPercent] = useState(30); // ค่าเริ่มต้น 30%
    const [activeItemIndex, setActiveItemIndex] = useState(null); // จำว่ากำลังแก้แถวไหน
    // -------------------------------------

    const [formData, setFormData] = useState({
        project_id: '',
        customer_name: '',
        customer_address: '',
        customer_tax_id: '',
        due_date: '',
        doc_date: new Date().toISOString().split('T')[0]
    });

    const [items, setItems] = useState([
        { description: '', quantity: 1, unit_price: 0 }
    ]);

    useEffect(() => {
        fetch('/api/production/projects')
            .then(res => res.json())
            .then(data => {
                const projectList = Array.isArray(data) ? data : (data.projects || []);
                setProjects(projectList);
            })
            .catch(err => console.error("Error fetching projects:", err));
    }, []);

    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
        const vat = subtotal * 0.07;
        const grandTotal = subtotal + vat;
        return { subtotal, vat, grandTotal };
    };

    const { subtotal, vat, grandTotal } = calculateTotals();

    const handleProjectChange = (e) => {
        const pid = e.target.value;
        // ค้นหาข้อมูลโครงการที่ถูกเลือกจาก State projects
        const selectedProject = projects.find(p => p.id == pid);

        if (selectedProject) {
            // ✅ 1. อัปเดตข้อมูลลูกค้าและ ID โครงการลงในฟอร์ม (จุดที่หายไป)
            setFormData({
                ...formData,
                project_id: pid,
                customer_name: selectedProject.customer_name || '', // ดึงชื่อลูกค้ามาใส่
                // ถ้าในตาราง projects มีที่อยู่ลูกค้า ให้ดึงมาด้วย (ถ้าไม่มีก็ใช้ค่าเดิม)
                customer_address: selectedProject.customer_address || formData.customer_address 
            });

        // ✅ แก้ไขตรงนี้: ดึง selectedProject.quantity จากฐานข้อมูลมาใส่ใน items
        setItems([
            {
                description: `ค่าบริการโครงการ: ${selectedProject.project_name}`,
                quantity: selectedProject.quantity || 1, // <--- ดึงค่าจริงจากฝ่ายผลิต
                unit_price: parseFloat(selectedProject.sale_price || 0)
            }
        ]);
    } else {
        setFormData({ ...formData, project_id: '', customer_name: '' });
        setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    }
};

    // ✅ 1. เปิด Modal เมื่อกดปุ่ม
    const openDepositModal = (index) => {
        setActiveItemIndex(index);
        setDepositPercent(30); // รีเซ็ตเป็น 30% ทุกครั้งที่เปิด
        setShowDepositModal(true);
    };

    // ✅ 2. คำนวณและบันทึกเมื่อกด "ยืนยัน" ใน Modal
    const confirmDeposit = () => {
        if (activeItemIndex === null) return;

        const newItems = [...items];
        const currentItem = newItems[activeItemIndex];

        // คำนวณยอดเงินมัดจำ
        const depositAmount = currentItem.unit_price * (depositPercent / 100);

        // อัปเดตราคา
        newItems[activeItemIndex].unit_price = depositAmount;

        // อัปเดตชื่อรายการ
        const cleanDescription = currentItem.description.replace(/\s*\(มัดจำ \d+%\)$/, "");
        newItems[activeItemIndex].description = `${cleanDescription} (มัดจำ ${depositPercent}%)`;

        setItems(newItems);
        setShowDepositModal(false); // ปิด Modal
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // คำนวณเลขที่เอกสารแบบสุ่มเบื้องต้น
        const generatedDocNumber = `INV-${new Date().getTime().toString().slice(-6)}`;

        const res = await fetch('/api/accounting/invoices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...formData, 
                items: items, 
                
                // ✅ ส่วนที่ต้องส่งเพิ่มเติมเพื่อบันทึกลง Table invoices จริงๆ
                quantity: items[0].quantity,       // บันทึกจำนวนลงตารางหลัก
                description: items[0].description, // บันทึกรายละเอียดลงตารางหลัก
                subtotal: subtotal,               // ยอดก่อนภาษี
                vat_amount: vat,                  // ยอดภาษี
                grand_total: grandTotal,           // ยอดสุทธิ
                doc_number: generatedDocNumber     // เลขที่เอกสาร
            })
        });

        if (res.ok) {
            router.push('/accounting/invoices');
        } else {
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

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">

            {/* Sidebar Desktop */}
            <div className="hidden lg:block w-64 shrink-0 h-full bg-slate-900 text-white z-20">
                <Sidebar />
            </div>

            {/* Sidebar Mobile */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-64 h-full bg-slate-900 shadow-xl">
                        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
                    </div>
                </div>
            )}

            {/* --- ✨ MODAL POPUP (เด้งขึ้นมาสวยๆ) --- */}
            {showDepositModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop สีดำจางๆ */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowDepositModal(false)}></div>

                    {/* กล่อง Modal */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Calculator size={20} /> คำนวณเงินมัดจำ (Deposit)
                            </h3>
                            <button onClick={() => setShowDepositModal(false)} className="hover:bg-blue-700 p-1 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">ระบุเปอร์เซ็นต์ที่ต้องการ (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1" max="100"
                                        value={depositPercent}
                                        onChange={(e) => setDepositPercent(parseFloat(e.target.value) || 0)}
                                        className="w-full text-4xl font-bold text-blue-600 text-center p-4 border-2 border-blue-100 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                                        autoFocus
                                    />
                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">%</span>
                                </div>
                            </div>

                            {/* Preview ยอดเงิน */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                <p className="text-sm text-slate-500 mb-1">ยอดเงินเดิม: {items[activeItemIndex]?.unit_price.toLocaleString()} บาท</p>
                                <p className="text-slate-800 font-medium">
                                    จะถูกปรับเป็น <span className="text-green-600 font-bold text-xl">
                                        {(items[activeItemIndex]?.unit_price * (depositPercent / 100)).toLocaleString()}
                                    </span> บาท
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setShowDepositModal(false)} className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">
                                    ยกเลิก
                                </button>
                                <button onClick={confirmDeposit} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2">
                                    <CheckCircle size={20} /> ยืนยันคำนวณ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* --------------------------------------- */}

            <main className="flex-1 h-full overflow-y-auto w-full">
                <div className="lg:hidden bg-white p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-slate-800">สร้างใบแจ้งหนี้</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-8 max-w-7xl mx-auto">
                    {/* ... (Header Section คงเดิม) ... */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/accounting/invoices" className="p-2 hover:bg-slate-200 rounded-full transition">
                                <ArrowLeft size={24} className="text-slate-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">
                                    สร้างใบแจ้งหนี้ใหม่
                                </h1>
                                <p className="text-slate-500 text-sm">Create New Invoice</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                            <button type="button" onClick={() => router.back()} className="flex-1 md:flex-none px-4 py-2 text-slate-700 font-bold hover:bg-slate-200 rounded-lg transition border border-slate-300 md:border-transparent">
                                ยกเลิก
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition">
                                <Save size={20} /> {loading ? 'กำลังบันทึก...' : 'บันทึกเอกสาร'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2 space-y-6">
                            {/* ... (Customer Info คงเดิม) ... */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <User className="text-blue-600" size={20} /> ข้อมูลลูกค้า (Customer)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            อ้างอิงโครงการ (Project) <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.project_id}
                                            onChange={handleProjectChange}
                                            className={inputStyle + " cursor-pointer appearance-none"}
                                        >
                                            <option value="">-- กรุณาเลือกโครงการ (Select Project) --</option>
                                            <optgroup label="⏳ งานที่กำลังดำเนินการ (Active Projects)">
                                                {projects.filter(p => ['pending', 'in_progress', 'doing', 'qc'].includes(p.status)).map(p => (
                                                    <option key={p.id} value={p.id}>{p.project_name} - {p.customer_name} ({p.status === 'pending' ? 'รอเริ่ม' : p.status === 'qc' ? 'รอ QC' : 'กำลังทำ'})</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="✅ งานที่เสร็จแล้ว (Completed Projects)">
                                                {projects.filter(p => ['completed', 'done'].includes(p.status)).map(p => (
                                                    <option key={p.id} value={p.id}>{p.project_name} - {p.customer_name}</option>
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
                                        <input
                                            type="text"
                                            maxLength={13} // ✅ ล็อกความยาว 13 ตัว
                                            placeholder="ระบุเลข 13 หลัก"
                                            value={formData.customer_tax_id}
                                            onChange={(e) => {
                                                // ✅ ยอมให้พิมพ์แค่ตัวเลข 0-9 เท่านั้น
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                setFormData({ ...formData, customer_tax_id: value });
                                            }}
                                            className={`${inputStyle} tracking-widest`} // tracking-widest ทำให้ตัวเลขห่างกันนิดนึง อ่านง่าย
                                        />
                                        {/* (Optional) ตัวนับจำนวนว่าพิมพ์ไปกี่ตัวแล้ว */}
                                        <div className="text-right text-xs text-slate-400 mt-1">
                                            {formData.customer_tax_id?.length || 0} / 13
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">กำหนดชำระ (Due Date)</label>
                                        <input type="date" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} className={inputStyle} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <FileText className="text-blue-600" size={20} /> รายการสินค้า (Items)
                                </h3>

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
                                                    <td className="p-2 pl-0">
                                                        <input required type="text" placeholder="ชื่อสินค้า/บริการ..."
                                                            value={item.description}
                                                            onChange={e => handleItemChange(index, 'description', e.target.value)}
                                                            className={inputStyle}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input required type="number" min="1"
                                                            value={item.quantity}
                                                            onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                            className={`${inputStyle} text-center`}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex items-center gap-2">
                                                            <input required type="number" step="0.01"
                                                                value={item.unit_price}
                                                                onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                                className={`${inputStyle} text-right min-w-[120px]`}
                                                            />
                                                            {/* ✅ ปุ่มคำนวณมัดจำ (แบบชัดเจน) */}
                                                            <button
                                                                type="button"
                                                                onClick={() => openDepositModal(index)}
                                                                className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-2.5 rounded-xl transition text-xs font-bold whitespace-nowrap shadow-sm border border-blue-100"
                                                            >
                                                                <Percent size={14} /> คำนวณมัดจำ
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 py-4 text-right font-bold text-slate-800">
                                                        {(item.quantity * item.unit_price).toLocaleString()}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        {items.length > 1 && (
                                                            <button type="button" onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-500 transition">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden space-y-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                                            <div className="space-y-3">
                                                <input required type="text" placeholder="ชื่อสินค้า..."
                                                    value={item.description}
                                                    onChange={e => handleItemChange(index, 'description', e.target.value)}
                                                    className={inputStyle}
                                                />
                                                <div className="flex gap-2">
                                                    <div className="w-20">
                                                        <label className="text-xs text-slate-500 font-bold mb-1 block">จำนวน</label>
                                                        <input required type="number" value={item.quantity}
                                                            onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                                            className={`${inputStyle} text-center`}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="text-xs text-slate-500 font-bold mb-1 block">ราคา/หน่วย</label>
                                                        <div className="flex gap-2">
                                                            <input required type="number" value={item.unit_price}
                                                                onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                                                className={`${inputStyle} text-right`}
                                                            />
                                                            <button type="button" onClick={() => openDepositModal(index)} className="bg-blue-100 text-blue-600 p-2 rounded-lg font-bold text-xs shrink-0">
                                                                มัดจำ %
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 mt-2">
                                                    <span className="font-bold text-slate-800">รวม: {(item.quantity * item.unit_price).toLocaleString()}</span>
                                                    {items.length > 1 && (
                                                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 text-sm flex items-center gap-1 font-bold">
                                                            <Trash2 size={16} /> ลบ
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button type="button" onClick={addItem} className="mt-4 w-full md:w-auto flex justify-center items-center gap-2 text-blue-600 font-bold text-sm hover:bg-blue-50 px-4 py-3 rounded-lg border border-dashed border-blue-300 transition">
                                    <Plus size={18} /> เพิ่มรายการใหม่ (Add Item)
                                </button>
                            </div>
                        </div>

                        <div className="xl:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Calculator className="text-blue-600" size={20} /> สรุปยอดเงิน
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>รวมเป็นเงิน (Subtotal)</span>
                                        <span className="font-medium text-slate-800">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>ภาษีมูลค่าเพิ่ม 7% (VAT)</span>
                                        <span className="font-medium text-red-500">{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="border-t border-slate-100 my-3"></div>
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-slate-800 text-lg">ยอดสุทธิ</span>
                                        <span className="font-bold text-blue-600 text-2xl">{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="text-right text-xs text-slate-400 mt-1">บาท (THB)</div>
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-600 text-center">
                                        ตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก <br />
                                        เอกสารจะถูกสร้างในสถานะ "รอชำระเงิน"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}