'use client';

import { useState, useEffect, use } from 'react';
import Sidebar from '../../../../components/Sidebar';
import {
    ArrowLeft, Calendar, DollarSign, Clock, User,
    Plus, FileText, CheckCircle, Hammer,
    CheckSquare, Calendar as CalendarIcon, Briefcase, Users,
    Wallet, PieChart, BarChart3, Send, AlertTriangle, Upload, X
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import ProductionTimeline from '@/components/ProductionTimeline';

export default function ProjectDetailPage({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams?.id;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('timeline');

    // --- State สำหรับ Smart Form ---
    const [products, setProducts] = useState([]);
    const [costType, setCostType] = useState('material');
    const [selectedItem, setSelectedItem] = useState('');
    const [evidenceFile, setEvidenceFile] = useState(null);

    // Form States
    const [costForm, setCostForm] = useState({
        description: '',
        amount: '',
        quantity: 1,
        product_id: '',
        recorded_date: new Date().toISOString().split('T')[0]
    });

    // Load Data
    useEffect(() => {
        if (!id) return;
        fetchData();
        fetchProducts();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/production/projects/${id}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const json = await res.json();
            setData(json);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/inventory/products');
            const json = await res.json();
            if (Array.isArray(json)) setProducts(json);
        } catch (err) { setProducts([]); }
    };

    // Smart Select Logic
    const handleSmartSelect = (e) => {
        const selectedId = e.target.value;
        setSelectedItem(selectedId);
        
        let newDesc = '';
        let newPrice = '';
        let newProdId = '';

        if (costType === 'material') {
            const prod = products.find(p => p.id == selectedId);
            if (prod) {
                newDesc = prod.name;
                newPrice = prod.price * costForm.quantity;
                newProdId = selectedId;
            }
        } else if (costType === 'labor') {
            const member = data?.members?.find(m => m.id == selectedId);
            if (member) {
                newDesc = `ค่าแรง: ${member.first_name} ${member.last_name}`;
            }
        }

        setCostForm(prev => ({
            ...prev,
            description: newDesc,
            amount: newPrice,
            product_id: newProdId
        }));
    };

    // Actions
    const handleStatusChange = async (newStatus) => {
        let confirmTitle = '', confirmText = '', confirmColor = '';
        if (newStatus === 'in_progress') { confirmTitle = 'เริ่มการผลิต?'; confirmText = 'ระบบจะเริ่มนับเวลาการทำงานทันที'; confirmColor = '#4f46e5'; }
        else if (newStatus === 'qc') { confirmTitle = 'ผลิตเสร็จสิ้น?'; confirmText = 'ยืนยันการจบงานผลิตและส่งต่อให้ QC ตรวจสอบ'; confirmColor = '#f97316'; }
        else if (newStatus === 'completed') { confirmTitle = 'ผ่านตรวจสอบ / จบงาน?'; confirmText = 'ยืนยันว่างานเรียบร้อยสมบูรณ์แล้ว'; confirmColor = '#16a34a'; }

        const result = await Swal.fire({ title: confirmTitle, text: confirmText, icon: 'question', showCancelButton: true, confirmButtonColor: confirmColor, cancelButtonColor: '#d33', confirmButtonText: 'ยืนยัน', cancelButtonText: 'ยกเลิก' });
        if (result.isConfirmed) {
            try {
                await fetch('/api/production/action', { method: 'POST', body: JSON.stringify({ type: 'update_project_status', project_id: id, status: newStatus }) });
                fetchData();
                Swal.fire({ icon: 'success', title: 'อัปเดตสถานะเรียบร้อย', timer: 1000, showConfirmButton: false });
            } catch (err) { Swal.fire('Error', err.message, 'error'); }
        }
    };

    const handleSendToAccounting = async () => {
        const result = await Swal.fire({ title: 'ยืนยันการส่งยอดบัญชี?', text: "เมื่อส่งแล้วจะไม่สามารถแก้ไขต้นทุนได้อีก", icon: 'warning', showCancelButton: true, confirmButtonColor: '#10B981', cancelButtonColor: '#d33', confirmButtonText: 'ยืนยัน', cancelButtonText: 'ยกเลิก' });
        if (result.isConfirmed) {
            try {
                await fetch('/api/production/action', { method: 'POST', body: JSON.stringify({ type: 'send_to_accounting', project_id: id }) });
                fetchData();
                Swal.fire('สำเร็จ!', 'ข้อมูลถูกส่งไปยังฝ่ายบัญชีแล้ว', 'success');
            } catch (err) { Swal.fire('Error', err.message, 'error'); }
        }
    };

    const handleAddCost = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('project_id', id);
        formData.append('cost_type', costType);
        formData.append('description', costForm.description);
        formData.append('amount', costForm.amount);
        formData.append('quantity', costForm.quantity);
        formData.append('product_id', costForm.product_id);
        formData.append('recorded_by', 'Admin');
        formData.append('recorded_date', costForm.recorded_date);
        if (evidenceFile) formData.append('evidence_file', evidenceFile);

        try {
            const res = await fetch('/api/production/cost-upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            setCostForm({ description: '', amount: '', quantity: 1, product_id: '', recorded_date: new Date().toISOString().split('T')[0] });
            setSelectedItem('');
            setEvidenceFile(null);
            fetchData();
            Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', timer: 1000, showConfirmButton: false });
        } catch (err) { Swal.fire('Error', err.message, 'error'); }
    };

    if (loading || !data) return <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-400">กำลังโหลดข้อมูล...</div>;

    const { project, costs, logs, members } = data;
    const budget = parseFloat(project.budget) || 0;
    const salePrice = parseFloat(project.sale_price) || 0;
    const totalCost = costs.reduce((sum, c) => sum + parseFloat(c.amount), 0);
    const remainingBudget = budget - totalCost;
    const profit = salePrice - totalCost;
    const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;
    const budgetUsagePercent = budget > 0 ? (totalCost / budget) * 100 : 0;

    const cardStyle = "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md";
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'qc': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50/90 font-sans">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/production" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold transition group">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 group-hover:border-indigo-200 transition"><ArrowLeft size={16} /></div> กลับหน้ารวม
                    </Link>
                    {/* ... (Deadline Alert Logic - คงเดิม) ... */}
                </div>

                {/* Hero Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        <div className="lg:col-span-2 p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>{project.status.replace('_', ' ')}</span>
                                <span className="text-slate-500 text-sm flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60"><Calendar size={14} className="text-slate-400" /> Deadline: {project.due_date ? new Date(project.due_date).toLocaleDateString('th-TH') : '-'}</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">{project.project_name}</h1>
                            <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-8">
                                <p className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg"><User size={16} className="text-indigo-400" /> {project.customer_name || 'ไม่ระบุลูกค้า'}</p>
                                <div className="flex items-center gap-2 pl-4 border-l border-slate-200"><Users size={16} className="text-slate-400" /><div className="flex -space-x-2">{members && members.length > 0 ? members.slice(0, 5).map((m, i) => (<div key={i} className="w-9 h-9 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm" title={`${m.first_name} (${m.position})`}>{m.first_name ? m.first_name.charAt(0) : '?'}</div>)) : <span className="text-xs text-slate-400">-</span>}</div></div>
                            </div>
                            <div>
                                {!project.is_sent_to_accounting ? (
                                    <div className="flex gap-3">
                                        {project.status === 'pending' && <button onClick={() => handleStatusChange('in_progress')} className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 transform hover:scale-105"><Hammer size={20} /> เริ่มการผลิต (Start)</button>}
                                        {project.status === 'in_progress' && <button onClick={() => handleStatusChange('qc')} className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2 transform hover:scale-105"><Send size={20} /> ผลิตเสร็จ / ส่งตรวจสอบ (Send to QC)</button>}
                                        {project.status === 'qc' && <button onClick={() => handleStatusChange('completed')} className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2 transform hover:scale-105"><CheckSquare size={20} /> ผ่านตรวจสอบ / จบงาน (Complete)</button>}
                                    </div>
                                ) : (<div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold"><CheckCircle size={20} className="text-green-600" /> โปรเจกต์นี้ปิดบัญชีแล้ว</div>)}
                                {project.status === 'completed' && !project.is_sent_to_accounting && (
                                    <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200 flex justify-between items-center animate-in fade-in">
                                        <div className="flex items-center gap-3 text-amber-800"><div className="bg-amber-100 p-2.5 rounded-lg text-amber-600"><DollarSign size={20} /></div><div><p className="font-bold">งานเสร็จสิ้น! พร้อมส่งบัญชี</p><p className="text-xs opacity-80">ตรวจสอบความถูกต้องก่อนส่งข้อมูล</p></div></div>
                                        <button onClick={handleSendToAccounting} className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition flex items-center gap-2"><CheckCircle size={18} /> ยืนยันส่ง</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Financial Widget */}
                        <div className="lg:col-span-1 bg-linear-to-br from-indigo-50 via-blue-50 to-white p-8 border-l border-slate-100 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-12 -mr-12 text-indigo-200/30 opacity-50 rotate-12"><Wallet size={200} /></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><div className="p-2 bg-white rounded-lg shadow-sm"><BarChart3 className="text-indigo-600" size={20} /></div> สรุปสถานะการเงิน</h3>
                                <div className="mb-6 bg-white/60 p-4 rounded-2xl border border-indigo-100/50 shadow-sm backdrop-blur-sm">
                                    <div className="flex justify-between text-sm mb-2"><span className="text-slate-600 font-bold">การใช้งบประมาณ</span><span className={`font-extrabold ${budgetUsagePercent > 90 ? 'text-red-600' : 'text-indigo-700'}`}>{budgetUsagePercent.toFixed(1)}%</span></div>
                                    <div className="h-4 bg-slate-200/80 rounded-full overflow-hidden shadow-inner"><div className={`h-full transition-all duration-700 ease-out rounded-full ${budgetUsagePercent > 95 ? 'bg-linear-to-r from-red-500 to-orange-500' : 'bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500'}`} style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}></div></div>
                                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium"><span>งบ: ฿{budget.toLocaleString()}</span><span>ใช้ไป: ฿{totalCost.toLocaleString()}</span></div>
                                </div>
                                <div className={`p-5 rounded-2xl border-2 shadow-sm backdrop-blur-sm ${remainingBudget >= 0 ? 'bg-white/80 border-green-200/80' : 'bg-red-50/80 border-red-200/80'} text-center mb-4`}>
                                    <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>งบคงเหลือสุทธิ</p>
                                    <p className={`text-4xl font-extrabold ${remainingBudget >= 0 ? 'text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600' : 'text-red-600'}`}>{remainingBudget >= 0 ? '+' : ''}{remainingBudget.toLocaleString()} <span className="text-lg text-slate-400 font-medium leading-none">฿</span></p>
                                </div>
                                <div className="bg-white/70 p-4 rounded-xl shadow-sm border border-indigo-100/50 backdrop-blur-sm flex justify-between items-center">
                                    <div><p className="text-xs text-slate-500 font-bold uppercase">ราคาขาย</p><p className="font-bold text-slate-700 text-lg">฿{salePrice.toLocaleString()}</p></div>
                                    <div className="text-right border-l border-slate-200 pl-4"><p className="text-xs text-slate-500 font-bold uppercase">กำไรขั้นต้น ({profitMargin.toFixed(0)}%)</p><p className={`font-bold text-xl ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>฿{profit.toLocaleString()}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit mx-auto lg:mx-0">
                    <button onClick={() => setActiveTab('timeline')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === 'timeline' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}><Clock size={18} className={activeTab === 'timeline' ? 'text-indigo-600' : 'text-slate-400'} /> ไทม์ไลน์ & แผนงาน</button>
                    <button onClick={() => setActiveTab('cost')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === 'cost' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}><DollarSign size={18} className={activeTab === 'cost' ? 'text-indigo-600' : 'text-slate-400'} /> ต้นทุนการผลิต</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'cost' && (
                            <div className={cardStyle}>
                                <div className="flex items-center justify-between mb-8"><h3 className="font-bold text-xl text-slate-800 flex items-center gap-3"><div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm"><DollarSign size={22} /></div> บันทึกต้นทุนการผลิต</h3></div>
                                
                                {/* 🟢 Smart Form (สีเข้มชัดเจน) */}
                                <form onSubmit={handleAddCost} className="mb-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit shadow-inner">
                                        {[{ id: 'material', label: '📦 วัตถุดิบ', color: 'text-blue-700 bg-white ring-1 ring-blue-200 shadow-sm' }, { id: 'labor', label: '👷 ค่าแรง', color: 'text-orange-700 bg-white ring-1 ring-orange-200 shadow-sm' }, { id: 'overhead', label: '📄 อื่นๆ', color: 'text-purple-700 bg-white ring-1 ring-purple-200 shadow-sm' }].map(tab => (
                                            <button key={tab.id} type="button" onClick={() => { setCostType(tab.id); setSelectedItem(''); setCostForm(prev => ({ ...prev, description: '', product_id: '', amount: '' })); }} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${costType === tab.id ? `${tab.color}` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}>{tab.label}</button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                        <div className="md:col-span-5">
                                            <label className="text-sm font-bold text-slate-900 mb-2 block">{costType === 'material' ? 'เลือกสินค้าจากคลัง' : costType === 'labor' ? 'เลือกพนักงาน' : 'ระบุหัวข้อ'} <span className="text-red-500">*</span></label>
                                            {costType === 'material' ? (<div className="relative"><select className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm appearance-none" value={selectedItem} onChange={handleSmartSelect}><option value="" className="text-slate-400">-- พิมพ์เอง (ไม่ตัดสต็อก) --</option>{products.map(p => <option key={p.id} value={p.id} className="text-slate-900">{p.name} (คงเหลือ: {p.quantity})</option>)}</select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div></div>) : costType === 'labor' ? (<div className="relative"><select className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition shadow-sm appearance-none" value={selectedItem} onChange={handleSmartSelect}><option value="" className="text-slate-400">-- ระบุเอง --</option>{members && members.map(m => <option key={m.id} value={m.id} className="text-slate-900">{m.first_name} {m.last_name} ({m.position})</option>)}</select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div></div>) : (<div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 text-sm font-bold flex items-center gap-2"><FileText size={18} /> ระบุรายละเอียดในช่องถัดไป 👉</div>)}
                                        </div>
                                        <div className="md:col-span-7"><label className="text-sm font-bold text-slate-900 mb-2 block">รายละเอียด <span className="text-red-500">*</span></label><input type="text" className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm" value={costForm.description} onChange={e => setCostForm({ ...costForm, description: e.target.value })} required placeholder="เช่น ค่าปูน, ค่าแรงช่างสมชาย..." /></div>
                                        <div className="md:col-span-4"><label className="text-sm font-bold text-slate-900 mb-2 block">จำนวน (หน่วย)</label><input type="number" min="1" step="1" className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 text-center font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition shadow-sm" value={costForm.quantity} onChange={e => { const qty = parseInt(e.target.value) || 0; let newAmt = costForm.amount; if (costType === 'material' && selectedItem) { const p = products.find(x => x.id == selectedItem); if (p) newAmt = p.price * qty; } setCostForm({ ...costForm, quantity: qty, amount: newAmt }); }} /></div>
                                        <div className="md:col-span-8"><label className="text-sm font-bold text-slate-900 mb-2 block">รวมเป็นเงิน (บาท) <span className="text-red-500">*</span></label><div className="relative"><span className="absolute left-4 top-3.5 text-indigo-600 font-bold text-lg">฿</span><input type="number" className="w-full p-3.5 pl-10 font-bold text-xl text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition shadow-sm placeholder:text-indigo-300" value={costForm.amount} onChange={e => setCostForm({ ...costForm, amount: e.target.value })} required placeholder="0.00" /></div></div>
                                        <div className="md:col-span-12"><label className="text-sm font-bold text-slate-900 mb-2 block">แนบหลักฐาน / ใบเสร็จ</label><div className="flex items-center gap-4 bg-white p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-slate-50 transition cursor-pointer relative group"><div className="p-3 bg-slate-100 rounded-full text-slate-600 group-hover:text-indigo-600 group-hover:bg-indigo-100 transition"><Upload size={24} /></div><div className="flex-1"><label className="block w-full h-full absolute inset-0 opacity-0 z-10 cursor-pointer"><input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setEvidenceFile(e.target.files[0])} /></label><span className="block text-base font-bold text-slate-800 pointer-events-none group-hover:text-indigo-700 transition">คลิกเพื่อเลือกไฟล์ (JPG, PNG, PDF)</span><div className="text-sm text-slate-500 pointer-events-none mt-1">{evidenceFile ? (<span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded w-fit"><CheckCircle size={14} /> {evidenceFile.name}</span>) : "ยังไม่ได้เลือกไฟล์"}</div></div>{evidenceFile && (<button type="button" onClick={() => setEvidenceFile(null)} className="relative z-20 text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition"><X size={20} /></button>)}</div></div></div>
                                    <div className="mt-8 text-right border-t border-slate-100 pt-6"><button type="submit" className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-xl text-base font-bold shadow-lg shadow-slate-200 transition-all flex items-center gap-2 ml-auto hover:-translate-y-0.5"><Plus size={20} /> บันทึกรายการ</button></div>
                                </form>

                                {/* Cost Table (แก้ Hydration Error: จัดระเบียบ TR/TD ใหม่) */}
                                <div className="overflow-hidden rounded-xl border border-slate-200/60 shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="p-4">วันที่</th>
                                                <th className="p-4">ประเภท</th>
                                                <th className="p-4 w-1/3">รายการ</th>
                                                <th className="p-4 text-center">หลักฐาน</th>
                                                <th className="p-4 text-right">จำนวนเงิน</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {costs && costs.length > 0 ? costs.map((c) => (
                                                <tr key={c.id} className="hover:bg-slate-50/80 transition group">
                                                    <td className="p-4 text-slate-500 font-medium">{new Date(c.recorded_date).toLocaleDateString('th-TH')}</td>
                                                    <td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize border inline-block ${c.cost_type === 'material' ? 'bg-blue-50 text-blue-700 border-blue-100' : c.cost_type === 'labor' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-purple-50 text-purple-700 border-purple-100'}`}>{c.cost_type === 'material' ? 'วัตถุดิบ' : c.cost_type === 'labor' ? 'ค่าแรง' : 'อื่นๆ'}</span></td>
                                                    <td className="p-4 text-slate-800 font-medium">{c.description} <span className="text-slate-400 text-xs ml-1 font-normal">(x{c.quantity})</span></td>
                                                    <td className="p-4 text-center">{c.evidence_path ? <a href={c.evidence_path} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 transition"><FileText size={12} /> ดูไฟล์</a> : <span className="text-slate-300">-</span>}</td>
                                                    <td className="p-4 text-right font-bold text-slate-800">฿{parseFloat(c.amount).toLocaleString()}</td>
                                                </tr>
                                            )) : (<tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">ยังไม่มีข้อมูลต้นทุน</td></tr>)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'timeline' && (
                            <div className="space-y-8">
                                <ProductionTimeline projectId={id} onRefresh={fetchData} />
                                <div className={cardStyle}>
                                    <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3"><div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-sm"><Clock size={22} /></div> ประวัติการทำงาน (History)</h3>
                                    <div className="space-y-6 ml-4 pl-8 border-l-2 border-slate-200/60 relative">{logs && logs.map(l => (<div key={l.id} className="relative"><div className="absolute -left-[41px] top-1 w-6 h-6 bg-white border-4 border-slate-300 rounded-full shadow-sm"></div><p className="text-base font-bold text-slate-800">{l.action}</p>{l.note && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 inline-block shadow-sm">{l.note}</p>}<div className="flex gap-2 mt-2 text-xs text-slate-400 font-medium items-center"><span><User size={14} className="inline mr-1 text-slate-300" />{l.employee_id}</span><span>•</span><span>{new Date(l.log_date).toLocaleString('th-TH')}</span></div></div>))}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className={cardStyle}>
                            <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-3 text-lg"><div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-sm"><PieChart size={22} /></div> สัดส่วนต้นทุน</h4>
                            <div className="space-y-5">
                                {['material', 'labor', 'overhead'].map(type => {
                                    const amount = costs ? costs.filter(c => c.cost_type === type).reduce((s, c) => s + parseFloat(c.amount), 0) : 0;
                                    const percent = totalCost > 0 ? (amount / totalCost) * 100 : 0;
                                    const colorClass = type === 'material' ? 'bg-blue-500' : type === 'labor' ? 'bg-orange-500' : 'bg-purple-500';
                                    return (<div key={type}><div className="flex justify-between text-sm mb-2 font-bold"><span className="capitalize text-slate-600 flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${colorClass}`}></div> {type === 'material' ? 'วัตถุดิบ' : type === 'labor' ? 'ค่าโอที' : 'ค่าใช้จ่ายอื่นๆ'}</span><span className="text-slate-800">฿{amount.toLocaleString()}</span></div><div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner"><div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${percent}%` }}></div></div></div>)
                                })}
                                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between font-extrabold text-slate-800 text-lg"><span>รวมทั้งหมด</span><span>฿{totalCost.toLocaleString()}</span></div>
                            </div>
                        </div>
                        <div className={cardStyle}>
                            <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-3 text-lg"><div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm"><Users size={22} /></div> ทีมงาน (Team)</h4>
                            <div className="space-y-4">{members && members.map((m, i) => (<div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition group"><div className="w-12 h-12 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg shadow-sm group-hover:scale-105 transition">{m.first_name.charAt(0)}</div><div><p className="font-bold text-slate-800 text-base">{m.first_name} {m.last_name}</p><p className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-0.5 bg-blue-50 px-2 py-0.5 rounded-md w-fit">{m.position}</p></div></div>))}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}