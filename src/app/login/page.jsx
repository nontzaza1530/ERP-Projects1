'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// เอา User ออก และใช้ Mail แทน
import { Lock, LogIn, AlertCircle, Layers, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  // ✅ 1. เปลี่ยนจาก identifier เป็น email
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ✅ ส่ง key ชื่อ 'email' ไปให้ Backend (เพราะ Backend รอรับ const { email } = body)
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.refresh();
        router.push('/Dashboard'); 
      } else {
        setError(data.message || 'ข้อมูลไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เชื่อมต่อ Server ไม่ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800">
        
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex p-3 bg-blue-50 rounded-full text-blue-900 mb-4">
            <Layers size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ ERP</h1>
          <p className="text-gray-500 text-sm">กรุณากรอกอีเมลและรหัสผ่านเพื่อเริ่มใช้งาน</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-3 text-sm border border-red-100">
               <AlertCircle size={18} /> <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* ✅ 2. ช่องกรอก Email (เปลี่ยน Label, Icon, Type) */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* เปลี่ยนไอคอนเป็นรูปซองจดหมาย */}
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email"  // บังคับรูปแบบอีเมล
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-700 bg-gray-50/50 focus:bg-white"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* ช่อง Password (คงเดิม) */}
            <div>
               <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-gray-700 text-sm font-semibold">รหัสผ่าน</label>
               </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-700 bg-gray-50/50 focus:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl shadow-lg mt-2 transition ${loading ? 'opacity-70' : ''}`}>
              <LogIn size={18} className="inline mr-2"/>
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* <div className="mt-8 text-center text-sm text-gray-500">
            ยังไม่มีบัญชีผู้ใช้งาน? <Link href="/register" className="text-blue-600 font-semibold hover:underline">ลงทะเบียนที่นี่</Link>
          </div> */}

          <div className="mt-4 text-center">
            <a 
              href="#" 
              onClick={(e) => {
                 e.preventDefault();
                 // ในอนาคตค่อยมาใส่โค้ดเปิด Modal ลืมรหัสผ่านตรงนี้
                 // Swal.fire('Coming Soon', 'ระบบกู้คืนรหัสผ่านกำลังพัฒนาครับ', 'info');
              }} 
              className="text-sm text-slate-400 hover:text-blue-600 transition flex items-center justify-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> ลืมรหัสผ่าน?
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}