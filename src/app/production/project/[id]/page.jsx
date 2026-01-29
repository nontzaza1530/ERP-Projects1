'use client';

import { useState, useEffect, use } from 'react';
import Sidebar from '../../../../components/Sidebar';
import { 
  ArrowLeft, Calendar, DollarSign, Clock, User, 
  Plus, FileText, CheckCircle, TrendingUp, AlertTriangle, Hammer,
  CheckSquare, Calendar as CalendarIcon, Briefcase, Users, UserPlus,
  Wallet, PieChart, BarChart3, Send
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function ProjectDetailPage({ params }) {
  const unwrappedParams = use(params); 
  const id = unwrappedParams?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline'); 

  const [products, setProducts] = useState([]); 
  
  // Form States
  const [logForm, setLogForm] = useState({ action: '', note: '' });
  const [costForm, setCostForm] = useState({ 
      cost_type: 'material', 
      description: '', 
      amount: '', 
      quantity: 1, 
      product_id: '', 
      recorded_date: new Date().toISOString().split('T')[0] 
  });
  const [planForm, setPlanForm] = useState({ task_name: '', planned_date: '' });

  // Load Data
  useEffect(() => {
    if (!id) return;
    fetchData();
    fetchProducts();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/production/projects/${id}`);
      if(!res.ok) throw new Error("Failed to fetch");
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

  const handleProductSelect = (productId) => {
      const selectedProduct = Array.isArray(products) ? products.find(p => p.id == productId) : null;
      if (selectedProduct) {
          setCostForm({
              ...costForm,
              product_id: productId,
              description: selectedProduct.name,
              amount: selectedProduct.price * costForm.quantity,
              cost_type: 'material'
          });
      } else {
          setCostForm({ ...costForm, product_id: '', description: '', amount: '' });
      }
  };

  // --- Actions ---
  const handleStatusChange = async (newStatus) => {
    // กดยืนยันก่อนเปลี่ยนสถานะ (ป้องกันมือลั่น)
    let confirmTitle = '';
    let confirmText = '';
    let confirmColor = '';

    if (newStatus === 'in_progress') {
        confirmTitle = 'เริ่มการผลิต?';
        confirmText = 'ระบบจะเริ่มนับเวลาการทำงานทันที';
        confirmColor = '#4f46e5'; // Indigo
    } else if (newStatus === 'qc') {
        confirmTitle = 'ผลิตเสร็จสิ้น?';
        confirmText = 'ยืนยันการจบงานผลิตและส่งต่อให้ QC ตรวจสอบ';
        confirmColor = '#f97316'; // Orange
    } else if (newStatus === 'completed') {
        confirmTitle = 'ผ่านตรวจสอบ / จบงาน?';
        confirmText = 'ยืนยันว่างานเรียบร้อยสมบูรณ์แล้ว';
        confirmColor = '#16a34a'; // Green
    }

    const result = await Swal.fire({
        title: confirmTitle,
        text: confirmText,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        try {
            await fetch('/api/production/action', {
                method: 'POST',
                body: JSON.stringify({ type: 'update_project_status', project_id: id, status: newStatus })
            });
            fetchData(); 
            Swal.fire({ icon: 'success', title: 'อัปเดตสถานะเรียบร้อย', timer: 1000, showConfirmButton: false });
        } catch (err) { Swal.fire('Error', err.message, 'error'); }
    }
  };

  const handleSendToAccounting = async () => {
    const result = await Swal.fire({
        title: 'ยืนยันการส่งยอดบัญชี?',
        text: "เมื่อส่งแล้วจะไม่สามารถแก้ไขต้นทุนได้อีก ข้อมูลจะถูกส่งไปยังฝ่ายบัญชีทันที",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน, ส่งเลย!',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        try {
            await fetch('/api/production/action', {
                method: 'POST',
                body: JSON.stringify({ type: 'send_to_accounting', project_id: id })
            });
            fetchData();
            Swal.fire('สำเร็จ!', 'ข้อมูลถูกส่งไปยังฝ่ายบัญชีแล้ว', 'success');
        } catch (err) { Swal.fire('Error', err.message, 'error'); }
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    try {
        await fetch('/api/production/action', {
            method: 'POST',
            body: JSON.stringify({ type: 'log', project_id: id, ...logForm, employee_id: 'Admin' })
        });
        setLogForm({ action: '', note: '' });
        fetchData();
        Swal.fire({ icon: 'success', title: 'อัปเดตงานสำเร็จ', timer: 1000, showConfirmButton: false });
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
  };

  const handleAddCost = async (e) => {
    e.preventDefault();
    try {
        await fetch('/api/production/action', {
            method: 'POST',
            body: JSON.stringify({ type: 'cost', project_id: id, ...costForm, recorded_by: 'Admin' })
        });
        setCostForm({ 
            cost_type: 'material', 
            description: '', 
            amount: '', 
            quantity: 1, 
            product_id: '', 
            recorded_date: new Date().toISOString().split('T')[0] 
        });
        fetchData();
        Swal.fire({ icon: 'success', title: 'บันทึกต้นทุนสำเร็จ', timer: 1000, showConfirmButton: false });
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
        await fetch('/api/production/action', {
            method: 'POST',
            body: JSON.stringify({ type: 'plan', project_id: id, ...planForm })
        });
        setPlanForm({ task_name: '', planned_date: '' });
        fetchData();
        Swal.fire({ icon: 'success', title: 'เพิ่มแผนงานสำเร็จ', timer: 1000, showConfirmButton: false });
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
  };

  const completePlan = async (plan_id, task_name) => {
    try {
        await fetch('/api/production/action', {
            method: 'POST',
            body: JSON.stringify({ type: 'complete_plan', project_id: id, plan_id, task_name })
        });
        fetchData();
        Swal.fire({ icon: 'success', title: 'อัปเดตงานเสร็จสิ้น', timer: 1000, showConfirmButton: false });
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
  };

  if (loading || !data) return <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-400">กำลังโหลดข้อมูล...</div>;

  const { project, costs, logs, plans, members } = data;
  
  // --- 💰 คำนวณตัวเลขการเงิน ---
  const budget = parseFloat(project.budget) || 0;
  const salePrice = parseFloat(project.sale_price) || 0;
  const totalCost = costs.reduce((sum, c) => sum + parseFloat(c.amount), 0);
  const remainingBudget = budget - totalCost;
  const profit = salePrice - totalCost;
  const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  const budgetUsagePercent = budget > 0 ? (totalCost / budget) * 100 : 0;

  // Styles (Vibrant)
  const cardStyle = "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md";
  const inputStyle = "bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition duration-200";
  
  const getStatusColor = (status) => {
      switch(status) {
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
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-6">
             <Link href="/production" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-bold transition group">
                <div className="bg-white p-2 rounded-full shadow-sm border border-slate-100 group-hover:border-indigo-200 transition"><ArrowLeft size={16}/></div> กลับหน้ารวม
            </Link>
            
            {/* Deadline Alert */}
            {(() => {
                if (!project.due_date) return null;
                const due = new Date(project.due_date);
                const today = new Date();
                const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
                if (diffDays < 0 && project.status !== 'completed' && !project.is_sent_to_accounting) {
                    return <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse shadow-sm"><AlertTriangle size={16} className="text-red-500"/> ล่าช้า {Math.abs(diffDays)} วัน!</div>;
                } else if (diffDays <= 3 && diffDays >= 0 && project.status !== 'completed' && !project.is_sent_to_accounting) {
                    return <div className="bg-orange-50 border border-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm"><Clock size={16} className="text-orange-500"/> เหลือ {diffDays} วัน</div>;
                }
                return null;
            })()}
        </div>

        {/* ================= HERO CARD ================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3">
                
                {/* --- Left Side: Project Info --- */}
                <div className="lg:col-span-2 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(project.status)}`}>
                            {project.status.replace('_', ' ')}
                        </span>
                        <span className="text-slate-500 text-sm flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-200/60">
                            <Calendar size={14} className="text-slate-400"/> Deadline: {project.due_date ? new Date(project.due_date).toLocaleDateString('th-TH') : '-'}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">{project.project_name}</h1>
                    
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-8">
                        <p className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg"><User size={16} className="text-indigo-400"/> {project.customer_name || 'ไม่ระบุลูกค้า'}</p>
                        {/* Team Preview */}
                        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                            <Users size={16} className="text-slate-400"/>
                            <div className="flex -space-x-2">
                                {members && members.length > 0 ? members.slice(0, 5).map((m, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm" title={`${m.first_name} (${m.position})`}>
                                        {m.first_name ? m.first_name.charAt(0) : '?'}
                                    </div>
                                )) : <span className="text-xs text-slate-400">-</span>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons (The Workflow) */}
                    <div>
                        {!project.is_sent_to_accounting ? (
                             <div className="flex gap-3">
                                {/* 1. ยังไม่เริ่ม -> กด Start */}
                                {project.status === 'pending' && (
                                    <button onClick={() => handleStatusChange('in_progress')} className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 transform hover:scale-105">
                                        <Hammer size={20} /> เริ่มการผลิต (Start)
                                    </button>
                                )}
                                
                                {/* 2. กำลังทำ -> กด จบงานผลิต (ส่ง QC) */}
                                {project.status === 'in_progress' && (
                                    <button onClick={() => handleStatusChange('qc')} className="bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center gap-2 transform hover:scale-105">
                                        <Send size={20} /> ผลิตเสร็จ / ส่งตรวจสอบ (Send to QC)
                                    </button>
                                )}
                                
                                {/* 3. อยู่ QC -> กด ผ่าน/จบงาน (Complete) */}
                                {project.status === 'qc' && (
                                    <button onClick={() => handleStatusChange('completed')} className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all flex items-center gap-2 transform hover:scale-105">
                                        <CheckSquare size={20} /> ผ่านตรวจสอบ / จบงาน (Complete)
                                    </button>
                                )}
                            </div>
                        ) : (
                             <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl font-bold"><CheckCircle size={20} className="text-green-600"/> โปรเจกต์นี้ปิดบัญชีแล้ว</div>
                        )}
                        
                        {project.status === 'completed' && !project.is_sent_to_accounting && (
                           <div className="mt-6 bg-amber-50 p-4 rounded-xl border border-amber-200 flex justify-between items-center animate-in fade-in">
                               <div className="flex items-center gap-3 text-amber-800">
                                    <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600"><DollarSign size={20}/></div>
                                    <div><p className="font-bold">งานเสร็จสิ้น! พร้อมส่งบัญชี</p><p className="text-xs opacity-80">ตรวจสอบความถูกต้องก่อนส่งข้อมูล</p></div>
                               </div>
                               <button onClick={handleSendToAccounting} className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-sm transition flex items-center gap-2"><CheckCircle size={18}/> ยืนยันส่ง</button>
                           </div>
                       )}
                    </div>
                </div>

                {/* --- Right Side: Financial Health Widget --- */}
                <div className="lg:col-span-1 bg-linear-to-br from-indigo-50 via-blue-50 to-white p-8 border-l border-slate-100 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 text-indigo-200/30 opacity-50 rotate-12"><Wallet size={200}/></div>
                    
                    <div className="relative z-10">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><div className="p-2 bg-white rounded-lg shadow-sm"><BarChart3 className="text-indigo-600" size={20}/></div> สรุปสถานะการเงิน</h3>
                        
                        <div className="mb-6 bg-white/60 p-4 rounded-2xl border border-indigo-100/50 shadow-sm backdrop-blur-sm">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600 font-bold">การใช้งบประมาณ</span>
                                <span className={`font-extrabold ${budgetUsagePercent > 90 ? 'text-red-600' : 'text-indigo-700'}`}>{budgetUsagePercent.toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-700 ease-out rounded-full ${budgetUsagePercent > 95 ? 'bg-linear-to-r from-red-500 to-orange-500' : 'bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500'}`} style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                                <span>งบ: ฿{budget.toLocaleString()}</span>
                                <span>ใช้ไป: ฿{totalCost.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className={`p-5 rounded-2xl border-2 shadow-sm backdrop-blur-sm ${remainingBudget >= 0 ? 'bg-white/80 border-green-200/80' : 'bg-red-50/80 border-red-200/80'} text-center mb-4`}>
                            <p className={`text-sm font-bold uppercase tracking-wider mb-1 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>งบคงเหลือสุทธิ</p>
                            <p className={`text-4xl font-extrabold ${remainingBudget >= 0 ? 'text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600' : 'text-red-600'}`}>
                                {remainingBudget >= 0 ? '+' : ''}{remainingBudget.toLocaleString()} <span className="text-lg text-slate-400 font-medium leading-none">฿</span>
                            </p>
                        </div>

                         <div className="bg-white/70 p-4 rounded-xl shadow-sm border border-indigo-100/50 backdrop-blur-sm flex justify-between items-center">
                            <div><p className="text-xs text-slate-500 font-bold uppercase">ราคาขาย</p><p className="font-bold text-slate-700 text-lg">฿{salePrice.toLocaleString()}</p></div>
                            <div className="text-right border-l border-slate-200 pl-4">
                                <p className="text-xs text-slate-500 font-bold uppercase">กำไรขั้นต้น ({profitMargin.toFixed(0)}%)</p>
                                <p className={`font-bold text-xl ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>฿{profit.toLocaleString()}</p>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 w-fit mx-auto lg:mx-0">
            <button onClick={() => setActiveTab('timeline')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === 'timeline' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}><Clock size={18} className={activeTab === 'timeline' ? 'text-indigo-600' : 'text-slate-400'}/> ไทม์ไลน์ & แผนงาน</button>
            <button onClick={() => setActiveTab('cost')} className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 ${activeTab === 'cost' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}><DollarSign size={18} className={activeTab === 'cost' ? 'text-indigo-600' : 'text-slate-400'}/> ต้นทุนการผลิต</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ================= LEFT CONTENT (2/3) ================= */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* --- COST TAB --- */}
                {activeTab === 'cost' && (
                    <div className={cardStyle}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 shadow-sm"><DollarSign size={22}/></div> บันทึกต้นทุนการผลิต
                            </h3>
                        </div>

                        <form onSubmit={handleAddCost} className="mb-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60">
                            <div className="mb-6">
                                <label className="text-xs text-slate-500 uppercase font-bold mb-3 block tracking-wider">1. เลือกประเภทต้นทุน</label>
                                <div className="flex gap-4">
                                    {['material', 'labor', 'overhead'].map((type) => (
                                        <button key={type} type="button" onClick={() => setCostForm({ ...costForm, cost_type: type, product_id: '', quantity: 1, amount: '', description: '' })} className={`flex-1 py-4 rounded-2xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 border-2 ${costForm.cost_type === type ? 'bg-white border-indigo-500 text-indigo-700 shadow-md transform -translate-y-1' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm'}`}>
                                            <div className={`p-2 rounded-full ${costForm.cost_type === type ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {type === 'material' ? <Briefcase size={20}/> : type === 'labor' ? <User size={20}/> : <FileText size={20}/>}
                                            </div>
                                            <span>{type === 'material' ? 'วัตถุดิบ' : type === 'labor' ? 'ค่าแรง/ล่วงเวลา' : 'ค่าใช้จ่ายอื่นๆ'}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                {costForm.cost_type === 'material' && (
                                    <><div className="md:col-span-5"><label className="text-xs font-bold text-slate-700 mb-1 block">เลือกสินค้าจากคลัง</label><select className={inputStyle + " w-full"} value={costForm.product_id} onChange={(e) => handleProductSelect(e.target.value)}><option value="">-- พิมพ์เอง (ไม่ตัดสต็อก) --</option>{products.map(p => <option key={p.id} value={p.id}>{p.name} (เหลือ: {p.quantity})</option>)}</select></div><div className="md:col-span-7"><label className="text-xs font-bold text-slate-700 mb-1 block">รายละเอียด</label><input type="text" className={inputStyle + " w-full"} value={costForm.description} onChange={e => setCostForm({...costForm, description: e.target.value})} required placeholder="ระบุชื่อรายการ..."/></div></>
                                )}
                                {costForm.cost_type === 'labor' && (
                                    <><div className="md:col-span-5"><label className="text-xs font-bold text-slate-700 mb-1 block">พนักงาน</label><select className={inputStyle + " w-full bg-orange-50/50 border-orange-200 text-orange-800 focus:ring-orange-100 focus:border-orange-400"} value={costForm.description.split(' - ')[0]} onChange={e => setCostForm({...costForm, description: `${e.target.value} - ${costForm.description.split(' - ')[1] || ''}`})}><option value="">-- เลือก --</option>{members && members.map(m => <option key={m.id} value={`${m.first_name} ${m.last_name}`}>{m.first_name} {m.last_name}</option>)}</select></div><div className="md:col-span-7"><label className="text-xs font-bold text-slate-700 mb-1 block">งานที่ทำ</label><input type="text" className={inputStyle + " w-full"} value={costForm.description.split(' - ')[1] || ''} onChange={e => setCostForm({...costForm, description: `${costForm.description.split(' - ')[0]} - ${e.target.value}`})} placeholder="เช่น เชื่อมเหล็ก"/></div></>
                                )}
                                {costForm.cost_type === 'overhead' && (<div className="md:col-span-12"><label className="text-xs font-bold text-slate-700 mb-1 block">รายการค่าใช้จ่าย</label><input type="text" className={inputStyle + " w-full"} value={costForm.description} onChange={e => setCostForm({...costForm, description: e.target.value})} required placeholder="เช่น ค่าน้ำมัน, ค่าขนส่ง"/></div>)}
                                
                                <div className="md:col-span-3">
                                    <label className="text-xs font-bold text-slate-700 mb-1 block">
                                        {costForm.cost_type === 'labor' ? 'ระยะเวลา (ชม./วัน)' : 'จำนวน (หน่วย)'}
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        step="1" 
                                        className={inputStyle + " w-full text-center"} 
                                        value={costForm.quantity} 
                                        onChange={e => { 
                                            const val = e.target.value;
                                            const qty = parseInt(val) || 0; 
                                            let newAmt = costForm.amount; 
                                            if(costForm.product_id){
                                                const p=products.find(x=>x.id==costForm.product_id); 
                                                if(p) newAmt=p.price*qty;
                                            }
                                            setCostForm({...costForm, quantity: qty, amount: newAmt})
                                        }}
                                    />
                                </div>

                                {costForm.cost_type === 'labor' && <div className="md:col-span-4"><label className="text-xs font-bold text-slate-700 mb-1 block">ค่าจ้างโอที (บาท)</label><input type="number" className={inputStyle + " w-full"} onChange={e => setCostForm({...costForm, amount: (parseFloat(e.target.value)||0)*parseFloat(costForm.quantity)})} placeholder="0.00"/></div>}
                                <div className="md:col-span-5"><label className="text-xs font-bold text-slate-700 mb-1 block">รวมเป็นเงิน (บาท)</label><div className="relative"><span className="absolute left-4 top-3 text-indigo-400 font-bold">฿</span><input type="number" className={`${inputStyle} w-full pl-8 font-bold text-lg text-indigo-700 bg-indigo-50/30 border-indigo-200`} value={costForm.amount} onChange={e => setCostForm({...costForm, amount: e.target.value})} required placeholder="0.00"/></div></div>
                            </div>
                            <div className="mt-6 text-right"><button type="submit" className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2 ml-auto"><Plus size={20}/> บันทึกรายการ</button></div>
                        </form>

                        {/* Cost Table */}
                        <div className="overflow-hidden rounded-xl border border-slate-200/60 shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200"><tr><th className="p-4">วันที่</th><th className="p-4">ประเภท</th><th className="p-4 w-1/2">รายการ</th><th className="p-4 text-right">จำนวนเงิน</th></tr></thead>
                                <tbody className="divide-y divide-slate-100 bg-white">{costs && costs.length > 0 ? costs.map((c)=>(<tr key={c.id} className="hover:bg-slate-50/80 transition"><td className="p-4 text-slate-500 font-medium">{new Date(c.recorded_date).toLocaleDateString('th-TH')}</td><td className="p-4"><span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize border ${c.cost_type==='material'?'bg-blue-50 text-blue-700 border-blue-100':c.cost_type==='labor'?'bg-orange-50 text-orange-700 border-orange-100':'bg-purple-50 text-purple-700 border-purple-100'}`}>{c.cost_type}</span></td><td className="p-4 text-slate-800 font-medium">{c.description} <span className="text-slate-400 text-xs ml-1 font-normal">(x{c.quantity})</span></td><td className="p-4 text-right font-bold text-slate-800">฿{parseFloat(c.amount).toLocaleString()}</td></tr>)) : <tr><td colSpan="4" className="p-8 text-center text-slate-400 italic">ยังไม่มีข้อมูลต้นทุน</td></tr>}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- TIMELINE TAB --- */}
                {activeTab === 'timeline' && (
                    <div className="space-y-8">
                        {/* แผนงาน (Next Steps) */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
                            <h3 className="font-bold text-xl text-indigo-800 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm"><CalendarIcon size={22}/></div> แผนงานในอนาคต (Next Steps)
                            </h3>
                            <form onSubmit={handleAddPlan} className="flex gap-3 mb-6 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/80">
                                <input type="text" placeholder="พิมพ์สิ่งที่ต้องทำ..." className={`${inputStyle} flex-1 bg-white border-indigo-200 focus:border-indigo-400`} value={planForm.task_name} onChange={e => setPlanForm({...planForm, task_name: e.target.value})} required/>
                                <input type="date" className={`${inputStyle} bg-white border-indigo-200 focus:border-indigo-400`} value={planForm.planned_date} onChange={e => setPlanForm({...planForm, planned_date: e.target.value})} required/>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition flex items-center gap-2"><Plus size={18}/> เพิ่มแผน</button>
                            </form>
                            <div className="space-y-3">
                                {plans && plans.filter(p => p.status === 'pending').map(plan => (
                                    <div key={plan.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-indigo-200 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl group-hover:bg-indigo-100 transition shadow-sm"><CalendarIcon size={20}/></div>
                                            <div><p className="font-bold text-slate-800 text-base group-hover:text-indigo-700 transition">{plan.task_name}</p><p className="text-sm text-slate-500 font-medium mt-0.5">กำหนด: {new Date(plan.planned_date).toLocaleDateString('th-TH')}</p></div>
                                        </div>
                                        <button onClick={() => completePlan(plan.id, plan.task_name)} className="text-sm bg-white border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 shadow-sm"><CheckSquare size={16}/> ทำเสร็จแล้ว</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ประวัติงาน (History) */}
                        <div className={cardStyle}>
                            <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-sm"><Clock size={22}/></div> ประวัติการทำงาน (History)
                            </h3>
                            {/* <form onSubmit={handleAddLog} className="flex gap-3 mb-8 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                                <input type="text" className={`${inputStyle} flex-1 bg-white`} placeholder="บันทึกงานที่ทำไปแล้ว..." value={logForm.action} onChange={e=>setLogForm({...logForm, action:e.target.value})} required/>
                                <input type="text" className={`${inputStyle} w-1/3 bg-white`} placeholder="หมายเหตุ (ถ้ามี)" value={logForm.note} onChange={e=>setLogForm({...logForm, note:e.target.value})}/>
                                <button className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-900 transition">บันทึก</button>
                            </form> */}
                            <div className="space-y-6 ml-4 pl-8 border-l-2 border-slate-200/60 relative">
                                {logs && logs.map(l=>(<div key={l.id} className="relative"><div className="absolute -left-[41px] top-1 w-6 h-6 bg-white border-4 border-slate-300 rounded-full shadow-sm"></div><p className="text-base font-bold text-slate-800">{l.action}</p>{l.note && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 inline-block shadow-sm">{l.note}</p>}<div className="flex gap-2 mt-2 text-xs text-slate-400 font-medium items-center"><span><User size={14} className="inline mr-1 text-slate-300"/>{l.employee_id}</span><span>•</span><span>{new Date(l.log_date).toLocaleString('th-TH')}</span></div></div>))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ================= RIGHT SIDEBAR (1/3) ================= */}
            <div className="space-y-8">
                {/* Cost Breakdown Widget */}
                <div className={cardStyle}>
                    <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-3 text-lg">
                        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-sm"><PieChart size={22}/></div> สัดส่วนต้นทุน
                    </h4>
                    <div className="space-y-5">
                        {['material', 'labor', 'overhead'].map(type => {
                             const amount = costs ? costs.filter(c => c.cost_type === type).reduce((s, c) => s + parseFloat(c.amount), 0) : 0;
                             const percent = totalCost > 0 ? (amount / totalCost) * 100 : 0;
                             const colorClass = type==='material'?'bg-blue-500':type==='labor'?'bg-orange-500':'bg-purple-500';
                             return (
                                 <div key={type}>
                                    <div className="flex justify-between text-sm mb-2 font-bold">
                                        <span className="capitalize text-slate-600 flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${colorClass}`}></div> {type === 'material' ? 'วัตถุดิบ' : type === 'labor' ? 'ค่าโอที' : 'ค่าใช้จ่ายอื่นๆ'}
                                        </span>
                                        <span className="text-slate-800">฿{amount.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 shadow-inner">
                                        <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{width: `${percent}%`}}></div>
                                    </div>
                                 </div>
                             )
                        })}
                         <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between font-extrabold text-slate-800 text-lg"><span>รวมทั้งหมด</span><span>฿{totalCost.toLocaleString()}</span></div>
                    </div>
                </div>

                {/* Team Widget */}
                <div className={cardStyle}>
                    <h4 className="font-bold text-slate-700 mb-6 flex items-center gap-3 text-lg">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm"><Users size={22}/></div> ทีมงาน (Team)
                    </h4>
                    <div className="space-y-4">
                        {members && members.map((m, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition group">
                                <div className="w-12 h-12 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg shadow-sm group-hover:scale-105 transition">{m.first_name.charAt(0)}</div>
                                <div><p className="font-bold text-slate-800 text-base">{m.first_name} {m.last_name}</p><p className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-0.5 bg-blue-50 px-2 py-0.5 rounded-md w-fit">{m.position}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}