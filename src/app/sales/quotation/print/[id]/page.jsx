'use client';

import { useState, useEffect, use } from 'react';
import { Printer, Download, Loader2, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import Swal from 'sweetalert2';
import Link from 'next/link';

// ฟังก์ชันแปลงตัวเลขเป็นบาท (Placeholder)
const bahtText = (num) => {
    if (!num || isNaN(num)) return '-';
    
    const numberText = [
        "ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"
    ];
    const unitText = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

    const convert = (number) => {
        let res = "";
        let len = number.length;
        for (let i = 0; i < len; i++) {
            let digit = parseInt(number.charAt(i));
            let pos = len - i - 1;
            if (digit !== 0) {
                if (pos % 6 === 1 && digit === 1) {
                    res += "เอ็ด"; // กรณีเลข 1 ในหลักสิบ
                } else if (pos % 6 === 1 && digit === 2) {
                    res += "ยี่"; // กรณีเลข 2 ในหลักสิบ
                } else if (pos % 6 === 0 && digit === 1 && i > 0) {
                    res += "เอ็ด"; // กรณีเลข 1 ในหลักหน่วย
                } else {
                    res += numberText[digit];
                }
                res += unitText[pos % 6];
            }
            if (pos !== 0 && pos % 6 === 0) res += "ล้าน";
        }
        return res;
    };

    let [integer, fraction] = parseFloat(num).toFixed(2).split(".");
    let baht = convert(integer);
    let satang = fraction === "00" ? "ถ้วน" : convert(fraction) + "สตางค์";
    
    return `( ${baht}บาท${satang} )`;
};

export default function QuotationPrintPage({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. ลองดึงจากตาราง Quotation (ก่อนจ่ายเงิน)
                let res = await fetch(`/api/sales/quotation/${id}`);
                let result = await res.json();

                // 2. ถ้าไม่พบ หรือเป็นรายการที่ขายแล้ว (รูปที่ 3) ให้ดึงจากตาราง Receipt/Order
                if (!res.ok || result.error || (result.quotation && result.quotation.status === 'ordered')) {
                    const resOrder = await fetch(`/api/sales/receipt/${id}`);
                    const orderData = await resOrder.json();
                    
                    if (resOrder.ok && !orderData.error) {
                        setIsOrdered(true);
                        setData({
                            quotation: {
                                quotation_no: `QT-INV-${String(orderData.order.id).padStart(6, '0')}`,
                                customer_name: orderData.order.customer_name,
                                customer_address: orderData.order.customer_address,
                                customer_phone: orderData.order.customer_phone,
                                total_amount: orderData.order.total_amount,
                                created_at: orderData.order.created_at,
                                customer_tax_id: orderData.order.customer_tax_id || '-',
                                // ✅ จุดสำคัญ: ดึงวิธีการชำระเงินที่เลือกจริงมาแสดง
                                payment_method: orderData.order.payment_method 
                            },
                            items: orderData.items.map(item => ({
                                product_name: item.product_name,
                                quantity: item.quantity,
                                price: item.price_per_unit, 
                                total: item.price_per_unit * item.quantity
                            }))
                        });
                        setLoading(false);
                        return;
                    }
                }
                
                if (res.ok) {
                    setData(result);
                    setIsOrdered(result.quotation.status === 'ordered');
                }
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

  const handleDownloadPDF = async () => {
        const element = document.getElementById('print-content');
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
        pdf.save(`QT-${id}.pdf`);
    };

  if (loading) return <div className="p-10 text-center flex justify-center items-center gap-3"><Loader2 className="animate-spin"/> กำลังโหลดแบบฟอร์ม...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">ไม่พบข้อมูล</div>;

  const { quotation, items } = data;
  const grandTotal = Number(quotation.total_amount);
  const vatAmount = (grandTotal * 7) / 107;
  const preVatAmount = grandTotal - vatAmount;

  // สีตามแบบ MS Track
  const themeBlue = '#003399';
  const themeRed = '#cc0000';

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0 font-sans">
      
      {/* ปุ่มควบคุม */}
      <div className="max-w-[210mm] mx-auto mb-4 flex justify-end gap-3 print:hidden">
        <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition">
          <Download size={20} /> PDF
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          <Printer size={20} /> พิมพ์
        </button>
      </div>

      {/* --- กระดาษ A4 --- */}
      <div id="print-content" className="max-w-[210mm] mx-auto bg-white p-[8mm] shadow-lg print:shadow-none print:w-full min-h-[297mm] relative text-black text-[11px] leading-tight">
        
        {/* Header: เลียนแบบโลโก้ด้วย CSS */}
        <div className="text-center mb-4">
            <h1 className="text-lg font-bold" style={{ color: themeBlue }}>บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด (สำนักงานใหญ่)</h1>
            <p>717/63 หมู่ 5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000</p>
            <p>โทร. 044-300659 , 093-3254422 Email : mstrack.thailand@gmail.com www.smartgtechnology.com</p>
            {/* ✅ 1. ย้ายมาไว้ตรงกลาง และปรับ font ให้ไม่หนาตามวงกลมสีแดงในรูป 2 */}
            
                เลขที่ประจำตัวผู้เสียภาษี 0305556002921
            
            <div className="flex justify-between items-end mt-2">
                
                {/* 🎨 โลโก้จำลอง (CSS) - ถ้ามีรูปจริง ให้ลบก้อนนี้ทิ้งแล้วใส่ <img src="/logo.png" /> แทน
                <div className="flex flex-col w-[200px]">
                    <div className="text-4xl font-black italic tracking-tighter flex items-baseline">
                        <span className="text-[#003399]">MS</span>
                        <span className="text-[#cc0000] ml-1">TRACK</span>
                    </div>
                    <div className="text-[10px] font-bold italic text-black border-t-2 border-black mt-[-5px] pt-1 w-full text-center">
                        MS Track (Thailand) Co., Ltd.
                    </div>
                </div> */}

                {/* ✅ ของใหม่ (รูปภาพจริง): ใส่แทนที่ตรงนี้ */}
                <div className="w-[200px] flex justify-center items-center">
                    {/* เปลี่ยนชื่อไฟล์ logo.png เป็นชื่อไฟล์ของคุณ */}
                    <img 
                        src="/MSTrack_Logo_2.png" 
                        alt="Company Logo" 
                        className="w-full h-auto object-contain max-h-20" 
                    />
                </div>

                

                {/* เลขที่/วันที่ (ขวา) */}
                <div className="w-[150px] text-right">
                    <div className="grid grid-cols-[50px_1fr] text-left">
                        <span className="font-bold text-gray-600">เลขที่</span> 
                        <span className="font-bold">{quotation.quotation_no}</span>
                        <span className="font-bold text-gray-600">วันที่</span> 
                        <span>{new Date(quotation.created_at).toLocaleDateString('th-TH')}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* แถบหัวเรื่องสีน้ำเงิน */}
        <div className="text-white text-center font-bold text-lg py-1 mb-2 rounded-sm" style={{ backgroundColor: themeBlue }}>
            ใบเสนอราคา (Quotation)
        </div>

        {/* กรอบข้อมูลลูกค้า & รายละเอียด (โค้งมนตามแบบ) */}
        <div className="grid grid-cols-2 gap-2 mb-2">
            {/* ซ้าย: ลูกค้า */}
            <div className="border rounded-2xl p-3 h-32 relative" style={{ borderColor: themeBlue }}>
                <div className="grid grid-cols-[80px_1fr] gap-y-1">
                    <span className="font-bold" style={{ color: themeBlue }}>ชื่อลูกค้า</span> 
                    <span className="font-bold">{quotation.customer_name || 'ลูกค้าทั่วไป'}</span>
                    
                    <span className="font-bold" style={{ color: themeBlue }}>ที่อยู่</span> 
                    <span className="wrap-break-word whitespace-pre-wrap leading-normal">
                        {quotation.customer_address || '-'}
                    </span>
                    
                    <span className="font-bold" style={{ color: themeBlue }}>เบอร์โทร</span> 
                    <span>-</span>
                    
                    <span className="font-bold" style={{ color: themeBlue }}>เลขผู้เสียภาษี</span> 
                    <span>-</span>
                </div>
            </div>

            {/* ขวา: เงื่อนไข */}
            <div className="border border-blue-900 rounded-2xl p-3 h-32">
                        <div className="grid grid-cols-[90px_1fr] gap-y-1">
                            <span className="font-bold" style={{ color: themeBlue }}>ผู้เสนอราคา</span> <span className="text-black">Admin</span>
                            <span className="font-bold" style={{ color: themeBlue }}>ยืนราคาภายใน</span> <span className="text-black">7 วัน</span>
                            <span className="font-bold" style={{ color: themeBlue }}>Expire Date</span> <span className="text-black">{new Date(new Date(quotation.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH')}</span>
                            <span className="font-bold" style={{ color: themeBlue }}>เงื่อนไขการชำระ</span> 
                            {/* ✅ แก้ไข: แสดง "เงินสด / โอนเงิน" อัตโนมัติ */}
                            <span className="text-black font-bold">
                                {isOrdered && quotation.payment_method && quotation.payment_method !== '-' 
                                    ? quotation.payment_method 
                                    : "เงินสด / โอนเงิน"}
                            </span>
                        </div>
            </div>
        </div>

        {/* ตารางสินค้า */}
        <table className="w-full border-collapse border border-black mb-0 text-[11px]">
            <thead>
                <tr className="text-white text-center font-bold" style={{ backgroundColor: themeRed }}>
                    <th className="py-1 border-r border-white w-10">รหัสสินค้า<br/>ITEM CODE</th>
                    <th className="py-1 border-r border-white">รายละเอียดสินค้า<br/>DESCRIPTION</th>
                    <th className="py-1 border-r border-white w-14">จำนวน<br/>QUANTITY</th>
                    <th className="py-1 border-r border-white w-12">หน่วย<br/>UNIT</th>
                    <th className="py-1 border-r border-white w-20">ราคา/หน่วย<br/>UNIT PRICE</th>
                    <th className="py-1 border-r border-white w-16">ส่วนลด<br/>DISCOUNT</th>
                    <th className="py-1 w-20">จำนวนเงิน<br/>AMOUNT</th>
                </tr>
            </thead>
            <tbody className="text-gray-800">
                {items.map((item, index) => (
                    <tr key={index} className="border-l border-r border-black align-top h-6">
                        <td className="text-center border-r border-black">{index + 1}</td>
                        <td className="pl-2 border-r border-black">
                            <span className="font-bold">{item.product_name}</span>
                            {/* บรรทัดนี้จำลองรายละเอียดสินค้าเพิ่มเติม ถ้ามีใน DB ก็เอามาใส่ได้ */}
                            {/* <div className="text-[9px] text-gray-500 pl-2">- รายละเอียดเพิ่มเติม...</div> */}
                        </td>
                        <td className="text-center border-r border-black">{item.quantity}</td>
                        <td className="text-center border-r border-black">ชิ้น</td>
                        <td className="text-right pr-1 border-r border-black">{Number(item.price).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                        <td className="text-center border-r border-black"></td>
                        <td className="text-right pr-1">{Number(item.total).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                    </tr>
                ))}
                {/* เติมบรรทัดว่างให้เต็มกล่อง */}
                {Array.from({ length: Math.max(0, 15 - items.length) }).map((_, i) => (
                    <tr key={`empty-${i}`} className="border-l border-r border-black h-6">
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td className="border-r border-black"></td>
                        <td></td>
                    </tr>
                ))}
            </tbody>
            {/* ส่วนสรุปท้ายตาราง */}
            <tfoot className="border-t border-black font-bold">
                <tr>
                    <td colSpan="4" rowSpan="5" className="border-r border-black align-top p-2 border-b text-[10px]">
                        <p className="underline mb-1" style={{ color: themeBlue }}>ช่องทางการชำระ (บัญชีออมทรัพย์)</p>
                        <p>ชื่อบัญชี บริษัท เอ็มเอส แทรค (ประเทศไทย)จำกัด</p>
                        <p>ธนาคารกสิกรไทย <span className="text-[13px] ml-2">522-2-23478-8</span></p>
                        <p>ธนาคารไทยพาณิชย์ <span className="text-[13px] ml-1">468-0-84384-8</span></p>
                        
                        <div className="mt-2 border border-black text-center py-1 bg-white">
                            {bahtText(grandTotal)}
                        </div>
                    </td>
                    <td colSpan="2" className="text-right pr-2 border-r border-black border-b">รวมจำนวนเงิน</td>
                    <td className="text-right pr-1 border-b border-gray-400">{Number(preVatAmount + vatAmount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                </tr>
                <tr>
                    <td colSpan="2" className="text-right pr-2 border-r border-black border-b">ส่วนลดการค้า</td>
                    <td className="text-right pr-1 border-b border-gray-400">-</td>
                </tr>
                <tr>
                    <td colSpan="2" className="text-right pr-2 border-r border-black border-b">เงินหลังหักส่วนลด</td>
                    <td className="text-right pr-1 border-b border-gray-400">{Number(preVatAmount + vatAmount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                </tr>
                <tr>
                    <td colSpan="2" className="text-right pr-2 border-r border-black border-b">ภาษีมูลค่าเพิ่ม 7%</td>
                    <td className="text-right pr-1 border-b border-black">{Number(vatAmount).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                </tr>
                <tr>
                    <td colSpan="2" className="text-right pr-2 border-r border-black border-b bg-gray-100">จำนวนเงินทั้งสิ้น</td>
                    <td className="text-right pr-1 border-b border-black bg-gray-100">{Number(grandTotal).toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                </tr>
            </tfoot>
        </table>

        {/* ลายเซ็น (3 ช่องโค้งมนเป๊ะๆ) */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-[10px]">
            {/* ช่อง 1 */}
            <div className="border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2" style={{ borderColor: themeBlue }}>
                 <div className="border-b border-gray-400 w-3/4 mb-4"></div>
                 <span className="font-bold" style={{ color: themeBlue }}>ผู้อนุมัติซื้อ</span>
                 <span className="absolute bottom-1 left-2 text-gray-400">วันที่</span>
            </div>
            {/* ช่อง 2 */}
            <div className="border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2" style={{ borderColor: themeBlue }}>
                 <div className="border-b border-gray-400 w-3/4 mb-4"></div>
                 <span className="font-bold" style={{ color: themeBlue }}>พนักงานขาย</span>
                 <span className="absolute bottom-1 left-2 text-gray-400">วันที่</span>
            </div>
            {/* ช่อง 3 */}
            <div className="border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2" style={{ borderColor: themeBlue }}>
                 <div className="border-b border-gray-400 w-3/4 mb-4"></div>
                 <span className="font-bold" style={{ color: themeBlue }}>ผู้จัดการขาย</span>
                 <span className="absolute bottom-1 left-2 text-gray-400">วันที่</span>
            </div>
        </div>

      </div>
    </div>
  );
}