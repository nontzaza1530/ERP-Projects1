'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  Package, Search, Plus, Filter, AlertTriangle, Edit, Trash2, X, Box, CheckCircle, Menu 
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function InventoryPage() {
  // --- 1. State Management ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI State (สำหรับ Sidebar ในมือถือ)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form Data State
  const [formData, setFormData] = useState({
    id: null,
    product_code: '',
    name: '',
    category: 'Finished Goods',
    quantity: 0,
    unit: 'ชิ้น',
    price: 0,
    location: '',
    min_level: 5 
  });

  // --- 2. Fetch Data ---
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Calculations ---
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.quantity <= p.min_level).length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0);

  // --- 4. Handlers ---
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ 
      id: null, product_code: '', name: '', category: 'Finished Goods', 
      quantity: 0, unit: 'ชิ้น', price: 0, location: '', min_level: 5 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode ? `/api/inventory/${formData.id}` : '/api/inventory';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          title: 'สำเร็จ!',
          text: isEditMode ? 'แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว' : 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#2563eb'
        });

        setIsModalOpen(false);
        fetchProducts(); 
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: result.error || 'ไม่สามารถบันทึกข้อมูลได้',
          icon: 'error',
          confirmButtonText: 'ลองใหม่'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'เชื่อมต่อ Server ไม่ได้', 'error');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "ข้อมูลจะหายไปถาวร ไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลสินค้าถูกลบเรียบร้อยแล้ว', 'success');
            fetchProducts();
          } else {
            Swal.fire('ลบไม่สำเร็จ', 'เกิดข้อผิดพลาดบางอย่าง', 'error');
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  // --- 5. Filtering ---
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.product_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 6. Render UI ---
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans w-full overflow-hidden">
      
      {/* --- Sidebar (Responsive) --- */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Overlay สำหรับปิด Sidebar ในมือถือ */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* --- Main Content --- */}
      <main className="flex-1 p-4 md:p-8 w-full h-screen overflow-y-auto bg-gray-50">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu (เฉพาะมือถือ) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 lg:hidden text-gray-600 hover:text-blue-600 active:scale-95 transition"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Package className="text-blue-600" /> คลังสินค้า (Inventory)
              </h1>
              <p className="text-gray-500 text-sm mt-1">จัดการสต็อก วัตถุดิบ และสินค้าพร้อมขาย</p>
            </div>
          </div>
          
          <button 
            onClick={openAddModal} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition active:scale-95"
          >
            <Plus size={20} /> เพิ่มสินค้าใหม่
          </button>
        </div>

        {/* Stats Dashboard Cards (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">รายการสินค้าทั้งหมด</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalItems}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Box size={32} /></div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">สินค้าใกล้หมด (Low Stock)</p>
              <h3 className={`text-3xl font-bold mt-1 ${lowStockItems > 0 ? 'text-red-600' : 'text-gray-800'}`}>{lowStockItems}</h3>
              {lowStockItems > 0 && <p className="text-xs text-red-400 mt-1 font-medium">ต้องสั่งซื้อเพิ่มทันที</p>}
            </div>
            <div className={`p-3 rounded-lg ${lowStockItems > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                <AlertTriangle size={32} />
            </div>
          </div>

          {/* การ์ดมูลค่าสินค้ารวม (กินพื้นที่ 2 ช่องในแท็บเล็ต) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-gray-500 text-sm font-medium">มูลค่าสินค้ารวม</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">฿{totalValue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg flex items-center justify-center w-14 h-14">
                <span className="text-2xl font-bold">฿</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อสินค้า หรือ สแกนรหัส Barcode..." 
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus 
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 font-medium transition">
            <Filter size={20} /> ตัวกรอง
          </button>
        </div>

        {/* Data Table (Responsive Scroll) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* overflow-x-auto ช่วยให้ตารางเลื่อนแนวนอนได้ในจอมือถือ */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">รหัสสินค้า</th>
                  <th className="p-4">ชื่อสินค้า</th>
                  <th className="p-4">หมวดหมู่</th>
                  <th className="p-4">สถานที่เก็บ</th>
                  <th className="p-4 text-center">คงเหลือ</th>
                  <th className="p-4 text-right">ต้นทุน/หน่วย</th>
                  <th className="p-4 text-center">สถานะ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {loading ? (
                  <tr><td colSpan="8" className="p-12 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="8" className="p-12 text-center text-gray-400">ไม่พบสินค้าที่ค้นหา</td></tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/30 transition duration-150">
                      <td className="p-4 font-mono text-blue-600 font-medium">{p.product_code}</td>
                      <td className="p-4 font-medium text-gray-900">{p.name}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          p.category === 'Raw Material' 
                            ? 'bg-orange-50 text-orange-700 border-orange-100' 
                            : 'bg-purple-50 text-purple-700 border-purple-100'
                        }`}>
                          {p.category === 'Raw Material' ? 'วัตถุดิบ' : 'สินค้าพร้อมขาย'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500">{p.location || '-'}</td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-gray-800 text-base">{p.quantity}</span> 
                        <span className="text-xs text-gray-400 ml-1">{p.unit}</span>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-600">{Number(p.price).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        {p.quantity <= p.min_level ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-600 text-xs font-bold border border-red-200">
                            <AlertTriangle size={12} /> ใกล้หมด
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-100 text-green-600 text-xs font-bold border border-green-200">
                            <CheckCircle size={12} /> ปกติ
                          </span>
                        )}
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-orange-400 hover:bg-orange-50 rounded-lg transition" title="แก้ไข">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition" title="ลบ">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL (Responsive Form) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                   <Package className="text-blue-600" size={24}/>
                   {isEditMode ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-red-500 bg-white rounded-full p-1 hover:bg-red-50 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Body (Scrollable ในมือถือ) */}
              <div className="overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* แถว 1 */}
                  <div className="col-span-1 md:col-span-1">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">รหัสสินค้า (Barcode/RFID) <span className="text-red-500">*</span></label>
                        <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-mono">
                            {formData.product_code.length}/15
                        </span>
                    </div>
                    <input 
                      type="text" required 
                      maxLength={15} 
                      placeholder="ยิง Barcode (สูงสุด 15 ตัว)"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 font-bold placeholder-gray-500 font-mono"
                      value={formData.product_code} 
                      onChange={e => setFormData({...formData, product_code: e.target.value})} 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อสินค้า/วัตถุดิบ <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 font-bold"
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>

                  {/* แถว 2 */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">หมวดหมู่</label>
                    <select 
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 font-medium"
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Finished Goods">สินค้าพร้อมขาย (Finished Goods)</option>
                      <option value="Raw Material">วัตถุดิบ (Raw Material)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">สถานที่เก็บ (Location)</label>
                    <input 
                      type="text" 
                      placeholder="เช่น Shelf A1, โกดัง 2"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 placeholder-gray-500"
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                    />
                  </div>
                  
                  <div className="border-t col-span-1 md:col-span-2 my-2 border-gray-100"></div>

                  {/* แถว 3 */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">จำนวนคงเหลือ</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-gray-900 placeholder-gray-500"
                      value={formData.quantity} 
                      onChange={e => setFormData({...formData, quantity: e.target.value})} 
                    />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">หน่วยนับ</label>
                     <input 
                      type="text" 
                      placeholder="ชิ้น, กล่อง, kg, แพ็ค"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 placeholder-gray-500"
                      value={formData.unit} 
                      onChange={e => setFormData({...formData, unit: e.target.value})} 
                    />
                  </div>

                  {/* แถว 4 */}
                   <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ต้นทุนต่อหน่วย (บาท)</label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900 placeholder-gray-500"
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                    />
                  </div>
                   <div>
                    <label className="block text-xs font-bold text-red-500 uppercase mb-1 items-center gap-1">
                      <AlertTriangle size={12}/> จุดเตือนสินค้าหมด (Min Level)
                    </label>
                    <input 
                      type="number" 
                      className="w-full p-2.5 border border-red-200 bg-red-50 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition text-red-900 placeholder-red-300 font-bold"
                      value={formData.min_level} 
                      onChange={e => setFormData({...formData, min_level: e.target.value})} 
                    />
                  </div>

                  {/* ปุ่ม Action */}
                  <div className="col-span-1 md:col-span-2 flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)} 
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
                    >
                      ยกเลิก
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition font-semibold"
                    >
                      {isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}