'use client';

import { useState, useEffect, use } from 'react';
import { Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import Swal from 'sweetalert2';

// ฟังก์ชันแปลงตัวเลขเป็นบาท
const bahtText = (num) => {
    if (!num && num !== 0) return '-';
    num = parseFloat(num);
    if (isNaN(num)) return '-';
    if (num === 0) return 'ศูนย์บาทถ้วน';

    const thaiNum = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const unit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

    let s0 = num.toFixed(2).split('.');
    let s1 = s0[0];
    let s2 = s0[1];
    let str = '';

    if (parseInt(s1) > 0) {
        let len = s1.length;
        for (let i = 0; i < len; i++) {
            let digit = s1.charAt(i);
            let n = parseInt(digit);
            let pos = len - i - 1;
            let u = pos % 6;

            if (n !== 0) {
                if (u === 0 && n === 1 && len > 1 && (len - i) > 1 && s1.charAt(i - 1) !== '0') str += 'เอ็ด';
                else if (u === 0 && n === 1 && len > 1 && i > 0) str += 'เอ็ด';
                else if (u === 1 && n === 2) str += 'ยี่';
                else if (u === 1 && n === 1) str += '';
                else str += thaiNum[n];
                str += unit[u];
            } else {
                if (pos > 0 && pos % 6 === 0) str += 'ล้าน';
            }
        }
        str += 'บาท';
    }

    if (parseInt(s2) > 0) {
        let len = s2.length;
        for (let i = 0; i < len; i++) {
            let digit = s2.charAt(i);
            let n = parseInt(digit);
            let pos = len - i - 1;
            if (n !== 0) {
                if (pos === 0 && n === 1 && len > 1 && s2.charAt(0) !== '0') str += 'เอ็ด';
                else if (pos === 1 && n === 2) str += 'ยี่';
                else if (pos === 1 && n === 1) str += '';
                else str += thaiNum[n];
                if (pos === 1) str += 'สิบ';
            }
        }
        str += 'สตางค์';
    } else {
        str += 'ถ้วน';
    }

    return `( ${str} )`;
};

export default function PrintOrderAsQuotation({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ✅ เปลี่ยนมาดึงข้อมูลจาก API Receipt (ซึ่งเก็บข้อมูลการชำระเงินจริงไว้)
                const res = await fetch(`/api/sales/receipt/${id}`);
                const result = await res.json();

                if (res.ok) {
                    setData(result);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDownloadPDF = async () => {
        const element = document.getElementById('print-content');
        if (!element) return;
        Swal.fire({ title: 'กำลังสร้าง PDF...', didOpen: () => Swal.showLoading() });

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (pdf.getImageProperties(imgData).height * pdfWidth) / pdf.getImageProperties(imgData).width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`QT-FromOrder-${id}.pdf`);
            Swal.close();
        } catch (error) { Swal.fire('Error', 'สร้าง PDF ไม่สำเร็จ', 'error'); }
    };

    if (loading) return <div className="p-10 text-center">กำลังโหลด...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">ไม่พบเอกสาร</div>;

    const { order, items } = data;

    const quotation = {
        quotation_no: `QT-INV-${String(order.id).padStart(6, '0')}`,
        created_at: order.created_at || order.sale_date,
        customer_name: order.customer_name,
        customer_address: order.customer_address,
        customer_phone: order.customer_phone,
        total_amount: order.total_amount
    };

    const grandTotal = Number(quotation.total_amount);
    const vatAmount = (grandTotal * 7) / 107;
    const preVatAmount = grandTotal - vatAmount;

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

                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="text-lg font-bold" style={{ color: themeBlue }}>บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด (สำนักงานใหญ่)</h1>
                    <p>717/63 หมู่ 5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000</p>
                    <p>โทร. 044-300659 , 093-3254422 Email : mstrack.thailand@gmail.com www.smartgtechnology.com</p>

                    {/* ✅ ย้ายเลขผู้เสียภาษีมาไว้ตรงนี้ ตามที่ขอ */}
                    <p className="">เลขที่ประจำตัวผู้เสียภาษี 0305556002921</p>

                    <div className="flex justify-between items-end mt-2">
                        {/* โลโก้ */}
                        <div className="w-[200px] flex justify-center items-center">
                            <img
                                src="/MSTrack_Logo_2.png"
                                alt="Company Logo"
                                className="w-full h-auto object-contain max-h-20"
                            />
                        </div>

                        {/* วันที่และเลขที่เอกสาร (ชิดขวา) */}
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

                {/* แถบหัวเรื่อง */}
                <div className="text-white text-center font-bold text-lg py-1 mb-2 rounded-sm" style={{ backgroundColor: themeBlue }}>
                    ใบเสนอราคา (Quotation)
                </div>

                {/* กรอบข้อมูลลูกค้า */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="border rounded-2xl p-3 min-h-32 relative" style={{ borderColor: themeBlue }}>
                        <div className="grid grid-cols-[80px_1fr] gap-y-1">
                            <span className="font-bold" style={{ color: themeBlue }}>ชื่อลูกค้า</span>
                            <span className="font-bold">{quotation.customer_name || 'ลูกค้าทั่วไป'}</span>

                            <span className="font-bold" style={{ color: themeBlue }}>ที่อยู่</span>
                            <span className="wrap-break-word whitespace-pre-wrap leading-normal">
                                {quotation.customer_address || '-'}
                            </span>

                            <span className="font-bold" style={{ color: themeBlue }}>เบอร์โทร</span>
                            <span>{quotation.customer_phone || '-'}</span>

                            <span className="font-bold" style={{ color: themeBlue }}>เลขผู้เสียภาษี</span>
                            <span>-</span>
                        </div>
                    </div>

                    <div className="border rounded-2xl p-3 min-h-32" style={{ borderColor: themeBlue }}>
                        <div className="grid grid-cols-[90px_1fr] gap-y-1">
                            <span className="font-bold" style={{ color: themeBlue }}>ผู้เสนอราคา</span> <span>Admin</span>
                            <span className="font-bold" style={{ color: themeBlue }}>ยืนราคาภายใน</span> <span>7 วัน</span>
                            <span className="font-bold" style={{ color: themeBlue }}>Expire Date</span>
                            <span>{quotation.created_at ? new Date(new Date(quotation.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH') : '-'}</span>
                            <span className="font-bold text-blue-900">เงื่อนไขการชำระ</span>
                            <span className="font-bold text-gray-900">
                                {order.payment_method === 'Transfer' ? 'เงินโอน' :
                                    order.payment_method === 'Cash' ? 'เงินสด' :
                                        order.payment_method || '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ตารางสินค้า */}
                <table className="w-full border-collapse border border-black mb-0 text-[11px]">
                    <thead>
                        <tr className="text-white text-center font-bold" style={{ backgroundColor: themeRed }}>
                            <th className="py-1 border-r border-white w-10">รหัสสินค้า<br />ITEM CODE</th>
                            <th className="py-1 border-r border-white">รายละเอียดสินค้า<br />DESCRIPTION</th>
                            <th className="py-1 border-r border-white w-14">จำนวน<br />QUANTITY</th>
                            <th className="py-1 border-r border-white w-12">หน่วย<br />UNIT</th>
                            <th className="py-1 border-r border-white w-20">ราคา/หน่วย<br />UNIT PRICE</th>
                            <th className="py-1 border-r border-white w-16">ส่วนลด<br />DISCOUNT</th>
                            <th className="py-1 w-20">จำนวนเงิน<br />AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {items.map((item, index) => (
                            <tr key={index} className="border-l border-r border-black align-top h-6">
                                <td className="text-center border-r border-black">{index + 1}</td>
                                <td className="pl-2 border-r border-black">
                                    <span className="font-bold">{item.product_name}</span>
                                </td>
                                <td className="text-center border-r border-black">{item.quantity}</td>
                                <td className="text-center border-r border-black">ชิ้น</td>
                                <td className="text-right pr-1 border-r border-black">{Number(item.price_per_unit || item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="text-center border-r border-black"></td>
                                <td className="text-right pr-1">{Number((item.price_per_unit || item.price) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
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
                            <td className="text-right pr-1 border-b border-gray-400">{Number(preVatAmount + vatAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="text-right pr-2 border-r border-black border-b">ส่วนลดการค้า</td>
                            <td className="text-right pr-1 border-b border-gray-400">-</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="text-right pr-2 border-r border-black border-b">เงินหลังหักส่วนลด</td>
                            <td className="text-right pr-1 border-b border-gray-400">{Number(preVatAmount + vatAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="text-right pr-2 border-r border-black border-b">ภาษีมูลค่าเพิ่ม 7%</td>
                            <td className="text-right pr-1 border-b border-black">{Number(vatAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="text-right pr-2 border-r border-black border-b bg-gray-100">จำนวนเงินทั้งสิ้น</td>
                            <td className="text-right pr-1 border-b border-black bg-gray-100">{Number(grandTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* ลายเซ็น */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-[10px]">
                    <div className="border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2" style={{ borderColor: themeBlue }}>
                        <div className="border-b border-gray-400 w-3/4 mb-4"></div>
                        <span className="font-bold" style={{ color: themeBlue }}>ผู้อนุมัติซื้อ</span>
                        <span className="absolute bottom-1 left-2 text-gray-400">วันที่</span>
                    </div>
                    <div className="border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2" style={{ borderColor: themeBlue }}>
                        <div className="border-b border-gray-400 w-3/4 mb-4"></div>
                        <span className="font-bold" style={{ color: themeBlue }}>พนักงานขาย</span>
                        <span className="absolute bottom-1 left-2 text-gray-400">วันที่</span>
                    </div>
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