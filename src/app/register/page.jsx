// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { UserPlus, User, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';

// export default function RegisterPage() {
//   const router = useRouter();
  
//   // State เก็บข้อมูลฟอร์ม
//   const [formData, setFormData] = useState({ 
//     username: '', 
//     email: '', 
//     password: '', 
//     confirmPassword: '' 
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError('');

//     // 1. Validation ฝั่ง Frontend ก่อนส่ง
//     if (formData.password !== formData.confirmPassword) {
//         setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
//         return;
//     }

//     if (formData.password.length < 6) {
//         setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
//         return;
//     }
    
//     setLoading(true);

//     try {
//       // 2. ยิง Request ไปที่ Backend
//       const res = await fetch('/api/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             username: formData.username,
//             email: formData.email,
//             password: formData.password
//             // เราไม่ส่ง role, role_id ไป เพราะต้องการให้ Backend ใช้ค่า Default (Employee)
//         }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         // 3. สำเร็จ: แจ้งเตือนและไปหน้า Login
//         alert('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
//         router.push('/login');
//       } else {
//         // 4. ไม่สำเร็จ: แสดงข้อความจาก Backend (เช่น Username ซ้ำ)
//         setError(data.message || 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('ไม่สามารถเชื่อมต่อกับ Server ได้');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ฟังก์ชันช่วยอัปเดต State และเคลียร์ Error เมื่อพิมพ์ใหม่
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (error) setError(''); // เคลียร์ error เมื่อผู้ใช้เริ่มพิมพ์แก้ไข
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-800">
//         <div className="p-8 pb-0 text-center">
//            <div className="inline-flex p-3 bg-blue-50 rounded-full text-blue-900 mb-4">
//             <UserPlus size={32} />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">ลงทะเบียนผู้ใช้ใหม่</h1>
//           <p className="text-gray-500 text-sm">สร้างบัญชีเพื่อเริ่มต้นใช้งานระบบ ERP</p>
//         </div>

//         <div className="p-8">
//           {/* ส่วนแสดง Error */}
//           {error && (
//             <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-3 text-sm border border-red-100 animate-pulse">
//                <AlertCircle size={18} /> <p>{error}</p>
//             </div>
//           )}

//           <form onSubmit={handleRegister} className="space-y-4">
            
//             {/* Username */}
//             <div>
//               <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">ชื่อผู้ใช้</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={18} className="text-gray-400" />
//                 </div>
//                 <input 
//                   type="text" 
//                   name="username"
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-700 bg-gray-50/50 focus:bg-white"
//                   placeholder="ตั้งชื่อผู้ใช้ (ภาษาอังกฤษ)"
//                   value={formData.username}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">อีเมล</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail size={18} className="text-gray-400" />
//                 </div>
//                 <input 
//                   type="email" 
//                   name="email"
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-700 bg-gray-50/50 focus:bg-white"
//                   placeholder="name@company.com"
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">รหัสผ่าน</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock size={18} className="text-gray-400" />
//                 </div>
//                 <input 
//                   type="password" 
//                   name="password"
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-700 bg-gray-50/50 focus:bg-white"
//                   placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Confirm Password */}
//              <div>
//               <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">ยืนยันรหัสผ่าน</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   {/* เปลี่ยนสีไอคอนเมื่อรหัสตรงกัน */}
//                   <CheckCircle size={18} className={formData.confirmPassword && formData.password === formData.confirmPassword ? 'text-green-500' : 'text-gray-400'} />
//                 </div>
//                 <input 
//                   type="password" 
//                   name="confirmPassword"
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition text-gray-700 bg-gray-50/50 focus:bg-white"
//                   placeholder="กรอกรหัสผ่านอีกครั้ง"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <button type="submit" disabled={loading}
//               className={`w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl shadow-lg mt-4 transition ${loading ? 'opacity-70 cursor-not-allowed' : 'transform hover:scale-[1.02]'}`}>
//               {loading ? 'กำลังบันทึกข้อมูล...' : 'ลงทะเบียน'}
//             </button>
//           </form>

//           <div className="mt-6 text-center text-sm text-gray-500">
//             มีบัญชีผู้ใช้งานแล้ว? <Link href="/login" className="text-blue-600 font-semibold hover:underline">เข้าสู่ระบบที่นี่</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }