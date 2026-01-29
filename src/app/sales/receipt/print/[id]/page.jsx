'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Printer } from 'lucide-react';

export default function PrintReceiptPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลเมื่อหน้าโหลด
    fetch(`/api/sales/receipt/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
        // setTimeout(() => window.print(), 500); // เปิดบรรทัดนี้ถ้าอยากให้เด้งพิมพ์อัตโนมัติ
      })
      .catch(err => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-10 text-center">กำลังโหลดใบเสร็จ...</div>;
  if (!data || data.error) return <div className="p-10 text-center text-red-500">ไม่พบข้อมูลใบเสร็จ (ID: {params.id})</div>;

  const { order, items } = data;

  return (
    <div className="bg-gray-100 min-h-screen p-8 print:p-0 print:bg-white font-sans text-slate-800">
      
      {/* ปุ่มสั่งพิมพ์ (ซ่อนตอนพิมพ์จริง) */}
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-end gap-2 print:hidden">
        <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
            <Printer size={18}/> พิมพ์ใบเสร็จ
        </button>
      </div>

      {/* กระดาษ A4 */}
      <div className="max-w-[210mm] mx-auto bg-white p-[10mm] shadow-lg rounded-xl print:shadow-none print:rounded-none min-h-[297mm] relative">
        
        {/* Header */}
        <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด</h1>
            <p className="text-sm text-slate-500 mt-1">717/63 หมู่ 5 ต.หัวทะเล อ.เมือง จ.นครราชสีมา 30000</p>
            <p className="text-sm text-slate-500">โทร: 044-300659, 093-3254422</p>
            <div className="mt-4 border-2 border-slate-800 inline-block px-6 py-1 rounded-lg">
                <h2 className="text-xl font-bold uppercase tracking-wide">ใบเสร็จรับเงิน / Receipt</h2>
            </div>
        </div>

        {/* Info Box */}
        <div className="flex justify-between border border-slate-200 rounded-lg p-5 mb-6 text-sm bg-slate-50">
            <div className="space-y-1.5">
                <p><span className="font-bold w-20 inline-block text-slate-700">ลูกค้า:</span> {order.customer_name || 'ลูกค้าทั่วไป'}</p>
                <p><span className="font-bold w-20 inline-block text-slate-700">ที่อยู่:</span> {order.customer_address || '-'}</p>
                {/* ✅ แสดงเบอร์โทรตรงนี้ */}
                <p><span className="font-bold w-20 inline-block text-slate-700">เบอร์โทร:</span> {order.customer_phone || '-'}</p>
            </div>
            <div className="space-y-1.5 text-right">
                <p><span className="font-bold text-slate-500">เลขที่ใบเสร็จ:</span> <span className="font-mono font-bold text-lg text-blue-700">INV-{String(order.id).padStart(6, '0')}</span></p>
                <p><span className="font-bold text-slate-500">วันที่:</span> {new Date(order.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-bold text-slate-500">ชำระโดย:</span> <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold">{order.payment_method}</span></p>
            </div>
        </div>

        {/* Table */}
        <table className="w-full border-collapse mb-6">
            <thead>
                <tr className="bg-slate-100 text-slate-700 text-sm border-y border-slate-200 uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-12">#</th>
                    <th className="py-3 px-3 text-left">รายการสินค้า (Description)</th>
                    <th className="py-3 px-3 text-right w-28">ราคา/หน่วย</th>
                    <th className="py-3 px-3 text-center w-20">จำนวน</th>
                    <th className="py-3 px-3 text-right w-32">รวมเงิน</th>
                </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
                {items.map((item, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-b-0">
                        <td className="py-3 px-3 text-center">{index + 1}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">{item.product_name}</td>
                        <td className="py-3 px-3 text-right">{Number(item.price_per_unit).toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-800">{Number(item.price_per_unit * item.quantity).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot className="text-sm border-t-2 border-slate-200">
                <tr>
                    <td colSpan="4" className="pt-4 text-right pr-4 font-bold text-slate-600">ยอดรวมสุทธิ (Total Amount)</td>
                    <td className="pt-4 text-right">
                        <span className="text-xl font-black text-slate-900 border-b-4 border-double border-slate-300 pb-1">
                            ฿{Number(order.total_amount).toLocaleString()}
                        </span>
                    </td>
                </tr>
            </tfoot>
        </table>

        {/* Footer Signatures */}
        <div className="absolute bottom-[20mm] left-0 w-full px-[10mm]">
            <div className="flex justify-between text-center text-sm text-slate-500 pt-8 border-t border-slate-200">
                <div className="flex flex-col gap-10">
                    <span>ผู้รับเงิน (Cashier)</span>
                    <span className="border-b border-slate-300 w-40 mx-auto border-dashed"></span>
                    <span className="text-xs font-light">(....................................................)</span>
                </div>
                <div className="flex flex-col gap-10">
                    <span>ผู้รับสินค้า (Customer)</span>
                    <span className="border-b border-slate-300 w-40 mx-auto border-dashed"></span>
                    <span className="text-xs font-light">(....................................................)</span>
                </div>
            </div>
            <div className="text-center text-[10px] text-slate-300 mt-8">
                ขอบคุณที่ใช้บริการ / Thank you for your business
            </div>
        </div>

      </div>
    </div>
  );
}