'use client';

// ✅ ใช้ตัว Pro เพื่อแก้ปัญหา Error สี lab()
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Loader2, AlertCircle, Building2, Download } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function PrintPOPage() {
  const params = useParams(); 
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    fetch(`/api/purchasing/po/${params.id}`)
      .then(res => {
          if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้ หรือ ข้อมูลไม่ถูกต้อง");
          return res.json();
      })
      .then(result => {
          setData(result);
      })
      .catch(err => setError(err.message));
  }, [params.id]);

  // --- ฟังก์ชันดาวน์โหลด PDF ---
  const handleDownloadPDF = async () => {
    const element = document.getElementById('po-content'); // อ้างอิง ID ของกระดาษ A4
    if (!element) return;

    // แสดง Loading
    Swal.fire({
      title: 'กำลังสร้างไฟล์ PDF...',
      text: 'กรุณารอสักครู่ ระบบกำลังประมวลผล',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      // 1. แปลง HTML เป็นรูปภาพ (canvas)
      const canvas = await html2canvas(element, { 
          scale: 2, // ความคมชัด 2 เท่า (Retina quality)
          useCORS: true, // อนุญาตให้โหลดรูปข้ามโดเมนได้ (ถ้ามี)
          backgroundColor: '#ffffff', // ✅ บังคับพื้นหลังสีขาว (กัน PDF ดำ)
          logging: false // ปิด log รกๆ ใน console
      });
      
      const imgData = canvas.toDataURL('image/png');

      // 2. สร้าง PDF ขนาด A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      // คำนวณความสูงตามสัดส่วนภาพจริง (จะได้ไม่ยืดไม่หด)
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // 3. ใส่รูปลงไป
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // 4. บันทึกไฟล์
      pdf.save(`PO-${data.po_number}.pdf`);
      
      Swal.close(); // ปิด Loading

    } catch (error) {
      console.error("PDF Error:", error);
      Swal.close();
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้ในขณะนี้', 'error');
    }
  };

  if (error) {
      return (
          <div className="flex h-screen flex-col justify-center items-center gap-4 text-slate-500 bg-slate-50">
              <AlertCircle size={48} className="text-red-500" />
              <p className="text-lg font-bold text-red-600">{error}</p>
              <Link href="/purchasing/po-list" className="text-blue-600 hover:underline">กลับไปหน้ารายการ</Link>
          </div>
      );
  }

  if (!data) {
      return (
        <div className="flex flex-col h-screen justify-center items-center gap-4 bg-white">
            <Loader2 className="animate-spin text-blue-600" size={48}/>
            <p className="text-slate-400 font-medium animate-pulse">กำลังสร้างเอกสาร...</p>
        </div>
      );
  }

  const po = data; 
  const items = data.items || [];

  return (
    <div className="min-h-screen bg-slate-100 p-8 print:p-0 print:bg-white font-sans text-slate-900">
      
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: white;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* --- Toolbar --- */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/purchasing/po-list" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition font-medium">
            <ArrowLeft size={20}/> กลับหน้ารายการ
        </Link>
        
        <div className="flex gap-3">
            {/* ✅ ปุ่ม Download PDF */}
            <button 
                onClick={handleDownloadPDF} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-lg flex items-center gap-2 transition active:scale-95"
            >
                <Download size={20}/> ดาวน์โหลด PDF
            </button>

            {/* ปุ่ม Print */}
            <button 
                onClick={() => window.print()} 
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg flex items-center gap-2 transition active:scale-95"
            >
                <Printer size={20}/> สั่งพิมพ์เอกสาร
            </button>
        </div>
      </div>

      {/* --- A4 Paper Container --- */}
      {/* 💡 หมายเหตุ: การใช้ html2canvas จะแคปเจอร์ "ตามที่ตาเห็น" 
         ดังนั้นใน PDF จะมีเงา (shadow-xl) และเส้นขอบ (border) ติดไปด้วยเหมือนดูบนเว็บ
      */}
      <div 
        id="po-content" 
        className="w-[210mm] h-[296mm] bg-white mx-auto shadow-xl border border-slate-900 print:border-none print:shadow-none print:w-[210mm] print:h-[296mm] relative flex flex-col justify-between overflow-hidden text-slate-900"
      >
        
        <div className="p-[15mm] pb-0 flex-1 flex flex-col">
            {/* 1. Header */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-slate-900 pb-4">
                <div>
                    <div className="flex items-center gap-3 text-slate-900 mb-2">
                        <div className="bg-slate-900 p-1.5 rounded text-white">
                             <Building2 size={20}/>
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase">ERP SYSTEM</span>
                    </div>
                    <div className="text-[10px] text-slate-700 leading-tight pl-1 font-medium">
                        <p className="font-bold text-slate-900 text-xs mb-1">บริษัท ของเรา จำกัด (มหาชน)</p>
                        <p>123 อาคารทีวัน ชั้น 20 ถ.สุขุมวิท แขวงคลองตันเหนือ</p>
                        <p>เขตวัฒนา กรุงเทพฯ 10110</p>
                        <p className="font-mono mt-0.5 text-slate-600">Tax ID: 0105555555555</p>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{po.po_number}</h1>
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">ใบสั่งซื้อ (Purchase Order)</p>
                    <div className="inline-block text-right bg-white p-2 rounded border border-slate-700 min-w-[140px]">
                        <div className="text-[9px] text-slate-600 uppercase font-bold">วันที่ (Date)</div>
                        <div className="font-bold text-slate-900 text-sm">
                            {new Date(po.order_date).toLocaleDateString('th-TH')}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Info Grid */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-white rounded-lg border border-slate-700">
                    <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                        ผู้ขาย (Vendor)
                    </h3>
                    <p className="font-bold text-sm text-slate-900 mb-1">{po.supplier_name}</p>
                    <p className="text-[10px] text-slate-700 leading-relaxed mb-3 h-8 overflow-hidden font-medium">
                        {po.supplier_full_address || po.supplier_address || '-'}
                    </p>
                    <div className="text-[10px] text-slate-700 space-y-0.5 font-medium">
                        <div className="flex"><span className="text-slate-600 w-20">ผู้ติดต่อ (Attn):</span> <span className="font-bold">{po.contact_person || '-'}</span></div>
                        <div className="flex"><span className="text-slate-600 w-20">โทร (Tel):</span> <span className="font-bold font-mono">{po.supplier_phone || '-'}</span></div>
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-slate-700">
                    <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-wider mb-2 border-b border-slate-700 pb-1">
                        สถานที่จัดส่ง (Ship To)
                    </h3>
                    <p className="font-bold text-sm text-slate-900 mb-1">Main Warehouse</p>
                    <p className="text-[10px] text-slate-700 leading-relaxed mb-3 h-8 overflow-hidden font-medium">
                        99/9 นิคมอุตสาหกรรมบางพลี ต.บางเสาธง <br/> อ.บางเสาธง จ.สมุทรปราการ 10540
                    </p>
                    <div className="text-[10px] text-slate-700 space-y-0.5 font-medium">
                        <div className="flex"><span className="text-slate-600 w-24">ผู้ติดต่อ (Contact):</span> <span className="font-bold">K. Somchai</span></div>
                        <div className="flex"><span className="text-slate-600 w-24">กำหนดส่ง (Delivery):</span> <span className="font-bold text-slate-900">ภายใน 7 วัน (Within 7 Days)</span></div>
                    </div>
                </div>
            </div>

            {/* 3. Items Table */}
            <div className="flex-1">
                <table className="w-full text-sm mb-4 font-medium">
                    <thead>
                        <tr className="border-b-2 border-slate-900">
                            <th className="py-2 pl-2 text-left text-[9px] font-black text-slate-700 uppercase tracking-wider w-12">ลำดับ<br/>(No.)</th>
                            <th className="py-2 text-left text-[9px] font-black text-slate-700 uppercase tracking-wider">รายการสินค้า<br/>(Description)</th>
                            <th className="py-2 text-right text-[9px] font-black text-slate-700 uppercase tracking-wider w-16">จำนวน<br/>(Qty)</th>
                            <th className="py-2 text-right text-[9px] font-black text-slate-700 uppercase tracking-wider w-24">ราคา/หน่วย<br/>(Unit Price)</th>
                            <th className="py-2 text-right text-[9px] font-black text-slate-700 uppercase tracking-wider w-24 pr-2">จำนวนเงิน<br/>(Amount)</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-900">
                        {items.map((item, idx) => (
                            <tr key={idx} className="border-b border-slate-700">
                                <td className="py-2 pl-2 font-mono text-[10px] text-slate-600 align-top pt-3 font-bold">{idx + 1}</td>
                                <td className="py-2 align-top pt-3">
                                    <div className="font-bold text-slate-900 text-xs">{item.product_name}</div>
                                    {item.product_code && item.product_code !== '-' && (
                                        <div className="text-[9px] text-slate-600 font-mono mt-0.5 font-semibold">Code: {item.product_code}</div>
                                    )}
                                </td>
                                <td className="py-2 text-right align-top pt-3">
                                    <span className="font-bold text-slate-900 text-xs">{item.quantity}</span> 
                                    <span className="text-[9px] text-slate-600 ml-1 font-semibold">{item.unit}</span>
                                </td>
                                <td className="py-2 text-right text-slate-900 align-top pt-3 font-mono text-xs font-bold">
                                    {parseFloat(item.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                                <td className="py-2 text-right font-black text-slate-900 pr-2 align-top pt-3 font-mono text-xs">
                                    {parseFloat(item.total_price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 4. Totals */}
            <div className="flex justify-end mb-4">
                <div className="w-64 border-t-2 border-slate-900 pt-2">
                    <div className="flex justify-between items-center py-1 text-slate-700 text-[10px] font-bold">
                        <span>รวมเป็นเงิน (Subtotal)</span>
                        <span className="font-mono">{parseFloat(po.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 text-slate-700 text-[10px] pb-2 border-b border-slate-700 font-bold">
                        <span>ภาษีมูลค่าเพิ่ม 7% (VAT)</span>
                        <span className="font-mono text-slate-500">-</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-900">
                        <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">ยอดรวมสุทธิ (Total)</span>
                        <span className="font-black text-xl text-slate-900">
                            <span className="text-xs align-top mr-1">฿</span>
                            {parseFloat(po.total_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Footer (Signatures) --- */}
        <div className="px-[15mm] pb-[15mm]">
            
            {/* Terms */}
            <div className="mb-6 pt-4 border-t-2 border-slate-900">
                <h4 className="text-[9px] font-bold text-slate-900 uppercase mb-1">เงื่อนไขและข้อกำหนด (Terms & Conditions)</h4>
                <ul className="text-[8px] text-slate-700 list-disc list-inside space-y-0.5 leading-tight font-medium">
                    <li>สินค้าต้องส่งมอบภายในระยะเวลาที่กำหนด (Delivery within agreed timeline).</li>
                    <li>ใบแจ้งหนี้ต้องอ้างอิงเลขที่ใบสั่งซื้อนี้ทุกครั้ง (Invoice must quote this PO number).</li>
                    <li>บริษัทสงวนสิทธิ์ในการปฏิเสธสินค้าที่ไม่ได้มาตรฐาน (We reserve the right to reject non-standard goods).</li>
                </ul>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-3 gap-6">
                
                {/* 1. Prepared By */}
                <div className="text-center">
                    <div className="mb-8">
                        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-1">ผู้จัดทำ (Prepared By)</p>
                    </div>
                    <div className="relative border-b border-slate-900 pb-1 mb-2">
                        <span className="absolute -top-4 left-0 right-0 text-slate-400 font-script text-lg">AdminUser</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-900 mb-0.5">Admin User</p>
                    <p className="text-[8px] text-slate-600 font-medium">วันที่ (Date): {new Date(po.order_date).toLocaleDateString('th-TH')}</p>
                </div>

                {/* 2. Authorized By */}
                <div className="text-center">
                        <div className="mb-8">
                        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-1">ผู้อนุมัติ (Authorized By)</p>
                        <p className="text-[8px] text-slate-600 font-medium">ในนามบริษัท (For and on behalf of Company)</p>
                    </div>
                    <div className="border-b border-slate-900 pb-1 mb-2 h-6"></div>
                    <p className="text-[10px] font-bold text-slate-900 mb-0.5">( ....................................................... )</p>
                    <p className="text-[9px] text-slate-700 font-bold">ผู้จัดการฝ่ายจัดซื้อ (Purchasing Manager)</p>
                </div>

                {/* 3. Vendor Acceptance */}
                <div className="text-center">
                    <div className="mb-8">
                        <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mb-1">ผู้ขาย (Vendor Acceptance)</p>
                        <p className="text-[8px] text-slate-600 font-medium">ยืนยันการสั่งซื้อ (Confirmed & Accepted by)</p>
                    </div>
                    <div className="border-b border-slate-900 pb-1 mb-2 h-6"></div>
                    <p className="text-[10px] font-bold text-slate-900 mb-0.5">( ....................................................... )</p>
                    <p className="text-[8px] text-slate-600 font-medium">วันที่ (Date): _______/_______/_______</p>
                </div>

            </div>

            <div className="text-center mt-6 pt-2 border-t border-slate-900 flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                <span>{po.po_number}</span>
                <span>Computer Generated Document</span>
                <span>Page 1 of 1</span>
            </div>
        </div>

      </div>
    </div>
  );
}