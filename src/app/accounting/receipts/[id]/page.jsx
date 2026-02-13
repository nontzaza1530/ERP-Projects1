'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Download } from 'lucide-react';

// --- ⚙️ Config: จำนวนรายการต่อ 1 หน้า ---
const ITEMS_PER_PAGE = 10;

// --- 🛠️ Helper: แปลงเลขเป็นคำอ่านภาษาไทย (BahtText) ---
const THBText = (num) => {
    if (!num) return "";
    num = parseFloat(num).toFixed(2);
    const thaiNum = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
    const unit = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

    let [integer, decimal] = num.split(".");
    let text = "";

    if (parseInt(integer) === 0) {
        text = "ศูนย์บาท";
    } else {
        let len = integer.length;
        for (let i = 0; i < len; i++) {
            let digit = parseInt(integer.charAt(i));
            let pos = len - i - 1;
            if (digit !== 0) {
                if (pos === 1 && digit === 1) text += "";
                else if (pos === 1 && digit === 2) text += "ยี่";
                else if (pos === 0 && digit === 1 && len > 1) text += "เอ็ด";
                else text += thaiNum[digit];

                text += unit[pos];
            }
        }
        text += "บาท";
    }

    if (parseInt(decimal) === 0) {
        text += "ถ้วน";
    } else {
        let len = decimal.length;
        for (let i = 0; i < len; i++) {
            let digit = parseInt(decimal.charAt(i));
            let pos = len - i - 1;
            if (digit !== 0) {
                if (pos === 1 && digit === 1) text += "";
                else if (pos === 1 && digit === 2) text += "ยี่";
                else if (pos === 0 && digit === 1 && len > 1) text += "เอ็ด";
                else text += thaiNum[digit];

                text += (pos === 1 ? "สิบ" : "สตางค์");
            }
        }
    }
    return text;
};

export default function ReceiptViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [receipt, setReceipt] = useState(null); // เปลี่ยนชื่อตัวแปรจาก invoice เป็น receipt
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!id) return;

        // ✅ เปลี่ยน Endpoint เป็น receipts
        fetch(`/api/accounting/receipts/${id}`)
            .then(res => res.json())
            .then(data => {
                // ปรับให้รับค่าตามโครงสร้าง API ของคุณ (สมมติว่าส่งกลับมาเป็น data.receipt)
                if (data.receipt || data.invoice) {
                    setReceipt(data.receipt || data.invoice); // รองรับเผื่อใช้โมเดลเดียวกับ invoice
                    setItems(data.items || []);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    // --- 📥 ฟังก์ชันดาวน์โหลด PDF ---
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const element = document.getElementById('receipt-content-area');
            const opt = {
                margin: 0,
                filename: `receipt-${receipt.doc_number}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Error:", error);
            alert("เกิดข้อผิดพลาดในการสร้าง PDF");
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">กำลังโหลดเอกสาร...</div>;
    if (!receipt) return <div className="p-10 text-center text-red-500">ไม่พบเอกสาร</div>;

    // --- 🔄 Logic แบ่งหน้า ---
    const pages = [];
    if (items.length === 0) {
        pages.push([]);
    } else {
        for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
            pages.push(items.slice(i, i + ITEMS_PER_PAGE));
        }
    }

    // Theme สีเขียว (สื่อถึงการรับเงิน) หรือจะใช้สีน้ำเงินเหมือนเดิมก็ได้ครับ
    // แต่ส่วนใหญ่ ใบเสร็จมักใช้โทนสีเดียวกับ Invoice เพื่อคุม CI บริษัท
    const themeColor = "#002060";
    const redHighlight = "#C00000";

    return (
        <div className="min-h-screen bg-[#f3f4f6] p-8 font-sans print:bg-white print:p-0">

            <style jsx global>{`
                @media print {
                    @page { size: A4; margin: 0mm; }
                    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    * { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; }
                }
            `}</style>

            {/* Toolbar */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-[#4b5563] hover:text-[#000000]">
                    <ArrowLeft size={20} /> กลับหน้ารายการ
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded shadow flex items-center gap-2 disabled:bg-[#9ca3af]"
                    >
                        <Download size={20} /> {isDownloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded shadow flex items-center gap-2"
                    >
                        <Printer size={20} /> สั่งพิมพ์
                    </button>
                </div>
            </div>

            {/* --- พื้นที่เนื้อหาใบเสร็จรับเงิน --- */}
            <div id="receipt-content-area">
                {pages.map((pageItems, pageIndex) => {
                    const isLastPage = pageIndex === pages.length - 1;

                    return (
                        <div
                            key={pageIndex}
                            className="w-[210mm] min-h-[296mm] mx-auto bg-[#ffffff] p-8 shadow-lg print:shadow-none print:w-[210mm] print:h-[296mm] print:overflow-hidden relative flex flex-col text-[12px] leading-snug text-[#000000] mb-8 print:mb-0"
                            style={{ pageBreakAfter: 'always' }}
                        >

                            {/* 1. Header */}
                            <div className="mb-2">
                                <div className="text-center mb-1" style={{ color: themeColor }}>
                                    <h1 className="text-xl font-bold">บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด (สำนักงานใหญ่)</h1>
                                    <p className="text-sm font-medium text-[#000000]">
                                        717/63 หมู่5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000<br />
                                        โทร Tel. 044-300659, 093-3254422, 0881143656 Email: tanapolma@gmail.com www.smartgtechnology.com
                                    </p>
                                </div>
                                <div className="w-full text-left mb-2 pl-2">
                                    <p className="text-sm font-bold mb-1" style={{ color: themeColor }}>
                                        เลขที่ประจำตัวผู้เสียภาษี 0305556002921
                                    </p>
                                    <img src="/MSTrack_Logo_2.png" alt="Company Logo" className="h-16 w-auto object-contain" />
                                </div>

                                {/* ✅ เปลี่ยนหัวข้อเอกสาร */}
                                <div className="w-full text-[#ffffff] text-center py-2 font-bold text-xl print:bg-[#002060] print:text-white mb-4" style={{ backgroundColor: themeColor }}>
                                    ใบเสร็จรับเงิน / ใบกำกับภาษี (RECEIPT / TAX INVOICE)
                                </div>
                            </div>

                            {/* 2. Customer Info */}
                            <div className="flex justify-between mb-4 px-2">
                                <div className="w-[55%]">
                                    <div className="flex mb-1"><div className="w-24 font-bold" style={{ color: themeColor }}>ชื่อลูกค้า</div><div className="flex-1 font-bold">{receipt.customer_name}</div></div>
                                    <div className="flex mb-1"><div className="w-24 font-bold" style={{ color: themeColor }}>ที่อยู่</div><div className="flex-1">{receipt.customer_address}</div></div>
                                    <div className="flex"><div className="w-24 font-bold" style={{ color: themeColor }}>เลขผู้เสียภาษี</div><div className="flex-1">{receipt.customer_tax_id || '-'}</div></div>
                                </div>
                                <div className="w-[40%]">
                                    <div className="flex mb-1"><div className="w-32 font-bold" style={{ color: themeColor }}>เลขที่ใบเสร็จ</div><div className="flex-1">{receipt.doc_number}</div></div>
                                    <div className="flex mb-1"><div className="w-32 font-bold" style={{ color: themeColor }}>วันที่</div><div className="flex-1">{new Date(receipt.doc_date).toLocaleDateString('th-TH')}</div></div>

                                    {/* ✅ เพิ่มบรรทัดอ้างอิงใบแจ้งหนี้ (ถ้ามีข้อมูลใน DB) */}
                                    <div className="flex mb-1"><div className="w-32 font-bold" style={{ color: themeColor }}>อ้างอิงใบแจ้งหนี้</div><div className="flex-1">{receipt.ref_doc_number || '-'}</div></div>

                                    <div className="flex"><div className="w-32 font-bold" style={{ color: themeColor }}>เงื่อนไขการชำระ</div><div className="flex-1">เงินสด / โอนเงิน</div></div>
                                </div>
                            </div>

                            {/* 3. Table */}
                            <div className="">
                                <table className="w-full border-collapse text-xs border-t border-r border-[#000000]">
                                    <thead>
                                        <tr className="text-[#ffffff] text-center font-bold print:bg-[#002060]" style={{ backgroundColor: themeColor }}>
                                            <th className="border-l border-r border-[#ffffff] py-1.5 w-24">รหัสสินค้า<br /><span className="font-normal text-[10px]">ITEM CODE</span></th>
                                            <th className="border-r border-[#ffffff] py-1.5">รายละเอียด<br /><span className="font-normal text-[10px]">DESCRIPTION</span></th>
                                            <th className="border-r border-[#ffffff] py-1.5 w-20">จำนวน<br /><span className="font-normal text-[10px]">QUANTITY</span></th>
                                            <th className="border-r border-[#ffffff] py-1.5 w-16">หน่วย<br /><span className="font-normal text-[10px]">UNIT</span></th>
                                            <th className="border-r border-[#ffffff] py-1.5 w-24">ราคาต่อหน่วย<br /><span className="font-normal text-[10px]">UNIT PRICE</span></th>
                                            <th className="py-1.5 w-32">จำนวนเงิน<br /><span className="font-normal text-[10px]">AMOUNT</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#000000] font-medium">
                                        {pageItems.map((item, index) => (
                                            <tr key={index} className="align-top">
                                                <td className="border-l border-r border-[#000000] py-1 text-center">A101</td>
                                                <td className="border-r border-[#000000] py-1 px-2 leading-relaxed">{item.description}</td>
                                                {/* ✅ แก้ไข: ดึงจำนวนจริงมาแสดงผลในใบเสร็จด้วย */}
                                                <td className="border-r border-[#000000] py-1 text-center font-bold text-lg">
                                                    {item.quantity}
                                                </td>
                                                <td className="border-r border-[#000000] py-1 text-center">ชุด</td>
                                                {/* ✅ แก้ไข: คำนวณราคาต่อหน่วยจริง */}
                                                <td className="border-r border-[#000000] py-1 text-right px-2">
                                                    {(parseFloat(item.total) / (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-1 text-right px-2 font-bold">
                                                    {parseFloat(item.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                        {[...Array(Math.max(0, ITEMS_PER_PAGE - pageItems.length))].map((_, i) => (
                                            <tr key={`empty-${i}`}>
                                                <td className="border-l border-r border-[#000000] py-1 h-6"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="py-1"></td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {isLastPage && (
                                        <tfoot>
                                            <tr className="border-t border-[#000000]">
                                                <td colSpan={4} rowSpan={3} className="border-r border-b border-[#000000] align-middle text-center px-4 font-bold italic text-[11px]" style={{ color: themeColor }}>
                                                    ( {THBText(receipt.grand_total)} )
                                                </td>
                                                <td className="border-r border-b border-[#000000] py-1 pl-2 font-bold text-[11px]" style={{ color: themeColor }}>
                                                    รวมเป็นเงิน
                                                </td>
                                                <td className="border-b border-[#000000] py-1 text-right pr-2 font-medium text-[11px]">
                                                    {parseFloat(receipt.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-b border-[#000000] py-1 pl-2 font-bold text-[11px]" style={{ color: themeColor }}>
                                                    ภาษีมูลค่าเพิ่ม 7%
                                                </td>
                                                <td className="border-b border-[#000000] py-1 text-right pr-2 font-medium text-[11px]">
                                                    {parseFloat(receipt.vat_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-[#000000] py-2 pl-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                                    ยอดสุทธิ
                                                </td>
                                                <td className="py-2 text-right pr-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                                    {parseFloat(receipt.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}

                                    {!isLastPage && (
                                        <tfoot><tr className="border-t border-[#000000]"><td colSpan={6}></td></tr></tfoot>
                                    )}
                                </table>
                            </div>

                            {/* 5. Payment & Signatures */}
                            {isLastPage ? (
                                <div className="border border-t-0 border-[#000000] mt-0 text-[#000000]">
                                    <div className="border-b border-[#000000] p-1 flex justify-between items-start">
                                        <div className="space-y-0 text-[12px]">
                                            <p className="font-bold text-[#000000] border-b border-[#000000] inline-block mb-1" style={{ color: themeColor }}>การชำระเงิน (Payment Method)</p>
                                            <div className="flex gap-4 mt-1">
                                                <label className="flex items-center gap-1"><input type="checkbox" checked={false} readOnly /> เงินสด (Cash)</label>
                                                <label className="flex items-center gap-1"><input type="checkbox" checked={true} readOnly /> โอนเงิน (Transfer)</label>
                                                <label className="flex items-center gap-1"><input type="checkbox" checked={false} readOnly /> เช็ค (Cheque)</label>
                                            </div>
                                            <p className="mt-1">ธนาคารกสิกรไทย 522-2-23478-8</p>
                                            <p>ชื่อบัญชี บจก. เอ็มเอส แทรค (ประเทศไทย)</p>
                                        </div>
                                        <div className="text-right space-y-2 text-[15px]">
                                            <p className="text-[#000000] font-bold">ได้รับเงินไว้ถูกต้องเรียบร้อยแล้ว</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 text-center text-[10px]">
                                        <div className="border-r border-[#000000] p-4 pb-2 flex flex-col justify-end">
                                            <div className="border-b border-[#000000] h-6 w-3/4 mx-auto"></div>
                                            <p className="mt-1">ผู้รับเงิน / Collector</p>
                                            <p>วันที่ ...../...../.....</p>
                                        </div>
                                        <div className="p-4 pb-2 flex flex-col justify-end">
                                            <div className="mb-15">ในนาม บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด</div>
                                            <div className="border-b border-[#000000] h-6 w-3/4 mx-auto"></div>
                                            <p className="mt-1">ผู้มีอำนาจลงนาม / Authorized Signature</p>
                                            <p>วันที่ ...../...../.....</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grow"></div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}