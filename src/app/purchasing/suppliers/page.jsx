'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import { 
  Plus, Search, Phone, MapPin, User, Edit, Trash2, 
  X, Save, Loader2, Building2, Mail 
} from 'lucide-react';
import Swal from 'sweetalert2';
// นำเข้า Component เลือกที่อยู่
import ThaiAddressInput from '@/components/ThaiAddressInput';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ 1. อัปเดต State ให้มีฟิลด์ที่อยู่ครบถ้วน
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    tax_id: '',
    credit_term: 30,
    address: '',        // เก็บรายละเอียด (เลขที่/หมู่/ซอย/ถนน)
    sub_district: '',   // ตำบล
    district: '',       // อำเภอ
    province: '',       // จังหวัด
    zipcode: ''         // รหัสไปรษณีย์
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/purchasing/suppliers');
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 2. ฟังก์ชันรับค่าจาก Dropdown (Auto-fill)
  const handleAddressSelect = (addressData) => {
    setFormData(prev => ({
      ...prev,
      sub_district: addressData.district, // Library ส่งค่ามาชื่อ district คือ ตำบล
      district: addressData.amphoe,       // Library ส่งค่ามาชื่อ amphoe คือ อำเภอ
      province: addressData.province,
      zipcode: addressData.zipcode
    }));
  };

  const openAddModal = () => {
      setFormData({
          id: null,
          code: '',
          name: '',
          contact_person: '',
          phone: '',
          email: '',
          tax_id: '',
          credit_term: 30,
          address: '',
          sub_district: '',
          district: '',
          province: '',
          zipcode: ''
      });
      setIsEditMode(false);
      setShowModal(true);
  };

  const openEditModal = (supplier) => {
      setFormData({
          id: supplier.id,
          code: supplier.code,
          name: supplier.name,
          contact_person: supplier.contact_name || supplier.contact_person || '',
          phone: supplier.phone || '',
          email: supplier.email || '',
          tax_id: supplier.tax_id || '',
          credit_term: supplier.credit_term || 30,
          // ดึงข้อมูลที่อยู่เดิมมาใส่ (ถ้ามี)
          address: supplier.address || '', 
          sub_district: supplier.sub_district || '',
          district: supplier.district || '',
          province: supplier.province || '',
          zipcode: supplier.zipcode || ''
      });
      setIsEditMode(true);
      setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name) {
        Swal.fire('แจ้งเตือน', 'กรุณากรอกรหัสและชื่อร้านค้า', 'warning');
        return;
    }

    setIsSubmitting(true);
    try {
        const method = isEditMode ? 'PUT' : 'POST';
        
        const payload = {
            ...formData,
            contact_name: formData.contact_person
        };

        const res = await fetch('/api/purchasing/suppliers', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
            Swal.fire('สำเร็จ', isEditMode ? 'แก้ไขข้อมูลเรียบร้อย' : 'เพิ่มข้อมูลคู่ค้าเรียบร้อย', 'success');
            setShowModal(false);
            fetchSuppliers();
        } else {
            throw new Error(result.error || 'Failed to save');
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
        title: 'ยืนยันการลบ?',
        text: "ข้อมูลนี้จะถูกลบถาวร",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ลบเลย'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/purchasing/suppliers?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire('ลบสำเร็จ', 'ข้อมูลถูกลบแล้ว', 'success');
                    fetchSuppliers();
                } else {
                    throw new Error('Failed to delete');
                }
            } catch (err) {
                Swal.fire('Error', 'ลบไม่สำเร็จ', 'error');
            }
        }
    });
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 w-[calc(100%-16rem)]">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ข้อมูลคู่ค้า (Suppliers)</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการรายชื่อร้านค้าและผู้จำหน่ายวัตถุดิบ</p>
          </div>
          <button 
            onClick={openAddModal} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={3}/> เพิ่มคู่ค้าใหม่
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
            <Search className="text-slate-400" size={20}/>
            <input 
                type="text" 
                placeholder="ค้นหารหัส หรือ ชื่อร้านค้า..." 
                className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b-2 border-slate-200">
                        <tr>
                            <th className="p-4 pl-6 w-[15%]">รหัส (Code)</th>
                            <th className="p-4 w-[25%]">ชื่อร้านค้า (Name)</th>
                            <th className="p-4 w-[20%]">ผู้ติดต่อ</th>
                            <th className="p-4 w-[25%]">ที่อยู่ / ติดต่อ</th>
                            <th className="p-4 text-center w-[15%]">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            [...Array(3)].map((_, i) => (
                                <tr key={i} className="animate-pulse bg-white">
                                    <td className="p-4 pl-6"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-40"></div></td>
                                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                                    <td className="p-4"></td>
                                </tr>
                            ))
                        ) : filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map((s) => (
                                <tr key={s.id} className="bg-white even:bg-slate-50 hover:bg-blue-50/60 transition-colors">
                                    <td className="p-4 pl-6 font-mono font-bold text-blue-600">{s.code}</td>
                                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400"/> {s.name}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-slate-400"/> 
                                            {s.contact_name || s.contact_person || '-'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            {s.phone && <p className="flex items-center gap-2 text-slate-600 text-xs"><Phone size={12}/> {s.phone}</p>}
                                            {s.email && <p className="flex items-center gap-2 text-slate-500 text-xs"><Mail size={12}/> {s.email}</p>}
                                            {/* แสดงที่อยู่แบบรวม */}
                                            {(s.address || s.province) && (
                                                <p className="flex items-start gap-2 text-slate-400 text-[10px] mt-1">
                                                    <MapPin size={12} className="shrink-0 mt-0.5"/> 
                                                    {[s.address, s.sub_district, s.district, s.province, s.zipcode].filter(Boolean).join(' ')}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => openEditModal(s)} 
                                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                            >
                                                <Edit size={16}/>
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-10 text-center text-slate-400">ไม่พบข้อมูลคู่ค้า</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </main>

      {/* --- Modal Form --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {isEditMode ? <Edit className="text-blue-600"/> : <Building2 className="text-green-600"/>}
                        {isEditMode ? 'แก้ไขข้อมูลคู่ค้า' : 'เพิ่มคู่ค้าใหม่'}
                    </h2>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-full transition">
                        <X size={20}/>
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-8 bg-slate-50/50">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">รหัส (Code) <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="เช่น SUP-001" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={formData.code}
                                    onChange={e => setFormData({...formData, code: e.target.value})}
                                    required
                                    disabled={isEditMode}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">ชื่อร้านค้า / บริษัท <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="ระบุชื่อ..." 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">ชื่อผู้ติดต่อ</label>
                                <input 
                                    type="text" 
                                    placeholder="เช่น คุณสมชาย" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={formData.contact_person}
                                    onChange={e => setFormData({...formData, contact_person: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">เบอร์โทรศัพท์</label>
                                <input 
                                    type="text" 
                                    placeholder="08x-xxx-xxxx" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">อีเมล</label>
                            <input 
                                type="email" 
                                placeholder="example@company.com" 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">เลขผู้เสียภาษี (Tax ID)</label>
                                <input 
                                    type="text" 
                                    placeholder="13 หลัก" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={formData.tax_id}
                                    onChange={e => setFormData({...formData, tax_id: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">เครดิตเทอม (วัน)</label>
                                <input 
                                    type="number" 
                                    placeholder="30" 
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    value={formData.credit_term}
                                    onChange={e => setFormData({...formData, credit_term: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* ✅ 3. ส่วนที่อยู่แบบใหม่ (Smart Address) */}
                        <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-2">
                            {/* ช่องกรอกรายละเอียด */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                    รายละเอียดที่อยู่ (เลขที่, หมู่บ้าน, ซอย, ถนน)
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50"
                                    placeholder="เช่น 123/45 หมู่ 8 ถ.แจ้งวัฒนะ"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>

                            {/* Dropdown ค้นหาที่อยู่ */}
                            <div>
                                <p className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1">
                                    📍 ค้นหาพื้นที่ (พิมพ์ชื่อตำบล/แขวง ระบบจะขึ้นให้เลือกเอง)
                                </p>
                                <ThaiAddressInput onAddressSelect={handleAddressSelect} />
                            </div>
                            
                            {/* แสดงผลค่าที่เลือก (Read-only) */}
                            {(formData.sub_district || formData.district) && (
                                <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded-lg flex flex-wrap gap-2 items-center">
                                    <span className="font-bold text-slate-700">ที่เลือก:</span>
                                    <span>{formData.sub_district}</span>
                                    <span className="text-slate-300">|</span>
                                    <span>{formData.district}</span>
                                    <span className="text-slate-300">|</span>
                                    <span>{formData.province}</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="font-bold text-blue-600">{formData.zipcode}</span>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition active:scale-[0.98] flex justify-center items-center gap-2 mt-4"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin"/> : <><Save size={20}/> {isEditMode ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล'}</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}