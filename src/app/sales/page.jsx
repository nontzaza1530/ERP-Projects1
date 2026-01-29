'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import Link from 'next/link';
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, Banknote, Package, User, 
  MapPin, Menu, FileText, History, Box, Tag, Home, Phone // ✅ เพิ่ม icon Phone
} from 'lucide-react';
import Swal from 'sweetalert2';
import ThaiAddressInput from '../../components/ThaiAddressInput'; 

export default function SalesPage() {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Customer & Payment Info
  const [paymentMethod, setPaymentMethod] = useState('Cash'); 
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState(''); // ✅ เพิ่ม State เบอร์โทร
  
  // State ที่อยู่
  const [addressDetails, setAddressDetails] = useState(''); 
  const [thaiAddress, setThaiAddress] = useState(null);     

  // --- Load Products ---
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryParam = encodeURIComponent('Finished Goods');
      const res = await fetch(`/api/inventory?category=${categoryParam}`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Cart Logic ---
  const addToCart = (product) => {
    if (product.quantity <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty + 1 > product.quantity) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'สินค้าไม่พอ', showConfirmButton: false, timer: 1500 });
            return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return item.qty > 1 ? { ...item, qty: item.qty - 1 } : item;
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

  const getFullAddress = () => {
      let fullAddr = addressDetails;
      if (thaiAddress) {
          fullAddr += ` ต.${thaiAddress.district} อ.${thaiAddress.amphoe} จ.${thaiAddress.province} ${thaiAddress.zipcode}`;
      }
      return fullAddr;
  };

  const handleAddressSelect = (addressObj) => {
      setThaiAddress(addressObj);
  };

  // --- Handlers ---
  const handleCreateQuotation = async () => {
    if (cart.length === 0) return Swal.fire({ icon: 'warning', title: 'ตะกร้าว่างเปล่า' });
    
    try {
      const res = await fetch('/api/sales/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            customerName, 
            customerPhone, // ✅ ส่งเบอร์โทรไป API
            customerAddress: getFullAddress(),
            cart, 
            total: totalAmount 
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: 'success', title: 'สร้างใบเสนอราคาสำเร็จ', text: data.quotationNo,
          showCancelButton: true, confirmButtonText: 'พิมพ์', cancelButtonText: 'ปิด'
        }).then((r) => {
          if (r.isConfirmed) window.open(`/sales/quotation/print/${data.quotationId}`, '_blank');
          clearForm();
        });
      }
    } catch (e) { Swal.fire('Error', 'เกิดข้อผิดพลาด', 'error'); }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return Swal.fire({ icon: 'warning', title: 'ตะกร้าว่างเปล่า' });

    Swal.fire({
      title: 'ยืนยันการขาย?',
      html: `<div class="text-left text-sm"><p>ยอดรวม: <b class="text-xl text-blue-600">฿${totalAmount.toLocaleString()}</b></p></div>`,
      showCancelButton: true, confirmButtonText: 'รับเงิน', confirmButtonColor: '#10b981'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                customer_name: customerName,
                customer_phone: customerPhone, // ✅ ส่งเบอร์โทรไป API (ชื่อ field: customer_phone)
                customer_address: getFullAddress(), 
                cart, 
                total_amount: totalAmount, 
                payment_method: paymentMethod 
            })
          });
          const data = await res.json();
          if (res.ok) {
            Swal.fire({
                title: 'ขายสำเร็จ!', text: `Order #${data.orderId}`, icon: 'success',
                showCancelButton: true, confirmButtonText: 'พิมพ์ใบเสร็จ', cancelButtonText: 'ปิด'
            }).then((r) => {
                if (r.isConfirmed) window.open(`/sales/receipt/print/${data.orderId}`, '_blank');
                clearForm();
                fetchProducts();
            });
          }
        } catch (e) { Swal.fire('Error', 'เชื่อมต่อไม่ได้', 'error'); }
      }
    });
  };

  const clearForm = () => {
      setCart([]); 
      setCustomerName(''); 
      setCustomerPhone(''); // ✅ เคลียร์เบอร์โทร
      setAddressDetails(''); 
      setThaiAddress(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.product_code.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transition-transform lg:translate-x-0 lg:static lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative">
        
        {/* --- LEFT: Product Catalog --- */}
        <div className="flex-1 flex flex-col h-full relative z-0">
            {/* Header */}
            <header className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600">
                        <Menu size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Package className="text-blue-600" size={24}/> จุดขาย (POS)
                        </h1>
                        <p className="text-xs text-slate-500 hidden sm:block">เลือกสินค้าเพื่อทำรายการขาย</p>
                    </div>
                </div>
                <Link href="/sales/history" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full transition-all">
                    <History size={18} /> <span className="hidden sm:inline">ประวัติการขาย</span>
                </Link>
            </header>

            {/* Search */}
            <div className="px-6 py-4 bg-slate-50/50">
                <div className="relative max-w-2xl mx-auto lg:mx-0">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="text" placeholder="🔍 ค้นหาชื่อสินค้า, รหัสสินค้า..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-slate-700 placeholder-slate-400 font-medium"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                {loading ? (
                    <div className="flex justify-center items-center h-40 text-slate-400 gap-2"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> กำลังโหลดสินค้า...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <Box size={48} className="mb-3 opacity-20"/>
                        <p>ไม่พบสินค้า</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                        {filteredProducts.map((p) => {
                            const isOutOfStock = p.quantity <= 0;
                            return (
                                <button key={p.id} onClick={() => addToCart(p)} disabled={isOutOfStock}
                                    className={`group relative flex flex-col p-4 bg-white rounded-2xl border border-slate-200 text-left transition-all duration-200 h-40 justify-between ${isOutOfStock ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'hover:border-blue-300 hover:shadow-lg hover:-translate-y-1'}`}
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><Tag size={18} /></div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.quantity <= 5 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>{isOutOfStock ? 'หมด' : `${p.quantity} ชิ้น`}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight text-sm mb-1 group-hover:text-blue-700 transition-colors">{p.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-mono">{p.product_code}</p>
                                    </div>
                                    <div className="text-lg font-bold text-slate-900 mt-2">฿{Number(p.price).toLocaleString()}</div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

        {/* --- RIGHT: Cart & Checkout --- */}
        <div className="w-full lg:w-[420px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20 h-full">
            {/* Cart Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-slate-800"><ShoppingCart className="text-slate-900" size={20}/><span className="font-bold text-lg">ตะกร้าสินค้า</span></div>
                <div className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">{cart.length} รายการ</div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2"><ShoppingCart size={48} className="opacity-20"/><p className="text-sm font-medium">ยังไม่มีสินค้าในตะกร้า</p></div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex flex-col p-4 bg-white border border-slate-100 rounded-xl shadow-sm group hover:border-blue-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-slate-700 line-clamp-2 w-[70%]">{item.name}</span>
                                <span className="text-sm font-bold text-slate-900">฿{Number(item.price * item.qty).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <div className="text-xs text-slate-400 font-mono">@{Number(item.price).toLocaleString()} / {item.unit}</div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                    <button onClick={() => decreaseQty(item.id)} className="w-6 h-6 flex items-center justify-center rounded bg-white text-slate-600 shadow-sm hover:text-blue-600 transition"><Minus size={14}/></button>
                                    <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                                    <button onClick={() => addToCart(item)} className="w-6 h-6 flex items-center justify-center rounded bg-white text-slate-600 shadow-sm hover:text-blue-600 transition"><Plus size={14}/></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Customer & Checkout Footer */}
            <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-30 space-y-4">
                
                {/* --- ส่วนข้อมูลลูกค้า (ปรับเพิ่มเบอร์โทร) --- */}
                <div className="space-y-3">
                    <div className="flex gap-2">
                        {/* ชื่อลูกค้า */}
                        <div className="relative flex-1">
                            <User size={16} className="absolute left-3 top-3 text-slate-400"/>
                            <input 
                                type="text" placeholder="ชื่อลูกค้า" 
                                className="w-full pl-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-400 focus:bg-white outline-none transition placeholder-slate-400"
                                value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                        {/* ✅ เบอร์โทร */}
                        <div className="relative w-1/3">
                            <Phone size={16} className="absolute left-3 top-3 text-slate-400"/>
                            <input 
                                type="text" placeholder="เบอร์โทร" 
                                className="w-full pl-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-400 focus:bg-white outline-none transition placeholder-slate-400"
                                value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <Home size={16} className="absolute left-3 top-3 text-slate-400"/>
                        <input 
                            type="text" placeholder="บ้านเลขที่, หมู่บ้าน, ซอย..." 
                            className="w-full pl-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-400 focus:bg-white outline-none transition placeholder-slate-400"
                            value={addressDetails} onChange={(e) => setAddressDetails(e.target.value)}
                        />
                    </div>

                    <div className="relative z-50"> 
                        <ThaiAddressInput onAddressSelect={handleAddressSelect} />
                    </div>

                    {thaiAddress && (
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">ต.{thaiAddress.district}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">อ.{thaiAddress.amphoe}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">จ.{thaiAddress.province}</span>
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 font-bold">{thaiAddress.zipcode}</span>
                        </div>
                    )}
                </div>

                {/* Total & Actions */}
                <div className="flex justify-between items-end py-2 border-t border-dashed border-slate-200 mt-2">
                    <span className="text-sm text-slate-500 font-medium">ยอดรวมสุทธิ</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tight">฿{totalAmount.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleCreateQuotation} className="py-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex flex-col items-center justify-center gap-1">
                        <FileText size={18} /> ใบเสนอราคา
                    </button>
                    <button onClick={handleCheckout} disabled={cart.length === 0} className={`py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all flex flex-col items-center justify-center gap-1 ${cart.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300 active:scale-95'}`}>
                        <Banknote size={18} /> ชำระเงิน
                    </button>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}