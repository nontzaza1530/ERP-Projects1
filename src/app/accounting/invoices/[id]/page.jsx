'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Download } from 'lucide-react';

// --- ⚙️ Config: จำนวนรายการต่อ 1 หน้า ---
const ITEMS_PER_PAGE = 10;

// --- 🛠️ Helper: แปลงเลขเป็นคำอ่านภาษาไทย ---
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

export default function InvoiceViewPage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/accounting/invoices/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.invoice) {
                    setInvoice(data.invoice);
                    setItems(data.items);
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
            const element = document.getElementById('invoice-content-area');

            const opt = {
                margin: 0,
                filename: `invoice-${invoice.doc_number}.pdf`,
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
    if (!invoice) return <div className="p-10 text-center text-red-500">ไม่พบเอกสาร</div>;

    const pages = [];
    if (items.length === 0) {
        pages.push([]);
    } else {
        for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
            pages.push(items.slice(i, i + ITEMS_PER_PAGE));
        }
    }

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

            {/* --- พื้นที่เนื้อหาใบแจ้งหนี้ --- */}
            <div id="invoice-content-area">
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
                                <div className="text-center mb-0" style={{ color: themeColor }}>
                                    <h1 className="text-xl font-bold">บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด (สำนักงานใหญ่)</h1>
                                    <p className="text-sm">
                                        717/63 หมู่5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000<br />
                                        โทร Tel. 044-300659, 093-3254422, 0881143656 Email: tanapolma@gmail.com www.smartgtechnology.com
                                    </p>
                                </div>
                                <div className="w-full text-left mb-0 pl-2">
                                    <p className="text-sm mb-5" style={{ color: themeColor }}>
                                        เลขที่ประจำตัวผู้เสียภาษี 0305556002921
                                    </p>
                                    <img src="/MSTrack_Logo_2.png" alt="Company Logo" className="h-16 w-auto object-contain" />
                                </div>
                                <div className="w-full text-[#ffffff] text-center py-2 font-bold text-xl print:bg-[#002060] print:text-white mb-0" style={{ backgroundColor: themeColor }}>
                                    ใบแจ้งหนี้ (INVOICE)
                                </div>
                            </div>

                            {/* 2. Customer Info */}
                            <div className="flex justify-between mb-1 px-2">
                                <div className="w-[55%]">
                                    <div className="flex mb-0"><div className="w-24 font-bold" style={{ color: themeColor }}>ชื่อลูกค้า</div><div className="flex-1 font-bold">{invoice.customer_name}</div></div>
                                    <div className="flex mb-0"><div className="w-24 font-bold" style={{ color: themeColor }}>ที่อยู่</div><div className="flex-1 whitespace-normal wrap-break-word max-w-[300px] leading-relaxed">
                                        {invoice.customer_address}
                                    </div></div>
                                    <div className="flex"><div className="w-24 font-bold" style={{ color: themeColor }}>เลขผู้เสียภาษี</div><div className="flex-1">{invoice.customer_tax_id || '-'}</div></div>
                                </div>
                                <div className="w-[40%]">
                                    <div className="flex mb-0"><div className="w-32 font-bold" style={{ color: themeColor }}>เลขที่ใบแจ้งหนี้</div><div className="flex-1">{invoice.doc_number}</div></div>
                                    <div className="flex mb-0"><div className="w-32 font-bold" style={{ color: themeColor }}>วันที่</div><div className="flex-1">{new Date(invoice.doc_date).toLocaleDateString('th-TH')}</div></div>
                                    <div className="flex mb-0"><div className="w-32 font-bold" style={{ color: themeColor }}>เงื่อนไขการชำระ</div><div className="flex-1">เงินสด / เครดิต 30 วัน</div></div>
                                    <div className="flex"><div className="w-32 font-bold" style={{ color: themeColor }}>วันครบกำหนด</div><div className="flex-1">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('th-TH') : '-'}</div></div>
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
                                            <tr key={index} className="align-top text-[13px]">
                                                <td className="border-l border-r border-[#000000] py-1 text-center">A101</td>
                                                <td className="border-r border-[#000000] py-1 px-2 leading-relaxed">
                                                    {item.description}
                                                </td>
                                                <td className="border-r border-[#000000] py-1 text-center">
                                                    {item.quantity}
                                                </td>
                                                <td className="border-r border-[#000000] py-1 text-center">ชุด</td>
                                                <td className="border-r border-[#000000] py-1 text-right px-2">
                                                    {(parseFloat(item.total) / (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-1 text-right px-2 font-bold">
                                                    {parseFloat(item.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Fill Empty Rows */}
                                        {[...Array(Math.max(0, ITEMS_PER_PAGE - pageItems.length))].map((_, i) => (
                                            <tr key={`empty-${i}`}>
                                                <td className="border-l border-r border-[#000000] py-1 h-6"></td>
                                                <td className="border-r border-[#000000] py-1"></td>
                                                <td className="border-r border-[#000000] py-1"></td>
                                                <td className="border-r border-[#000000] py-1"></td>
                                                <td className="border-r border-[#000000] py-1"></td>
                                                <td className="py-1"></td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* 4. Footer Rows (เฉพาะหน้าสุดท้าย) */}
                                    {isLastPage && (
                                        <tfoot>
                                            <tr className="border-t border-[#000000]">
                                                <td colSpan={4} rowSpan={3} className="border-r border-b border-[#000000] align-middle text-center px-4 font-bold italic text-[11px]" style={{ color: themeColor }}>
                                                    ( {THBText(invoice.grand_total)} )
                                                </td>
                                                <td className="border-r border-b border-[#000000] py-1 pl-2 font-bold text-[11px]" style={{ color: themeColor }}>
                                                    รวมเป็นเงิน
                                                </td>
                                                <td className="border-b border-[#000000] py-1 text-right pr-2 font-medium text-[11px]">
                                                    {parseFloat(invoice.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-b border-[#000000] py-1 pl-2 font-bold text-[11px]" style={{ color: themeColor }}>
                                                    {/* ✅ เปลี่ยนให้โชว์เรท VAT แบบไดนามิก (รองรับบิลเก่าที่ไม่มีข้อมูล vat_rate โดยเช็คว่ามียอด VAT ไหม) */}
                                                    ภาษีมูลค่าเพิ่ม {invoice.vat_rate !== undefined && invoice.vat_rate !== null ? parseFloat(invoice.vat_rate) : (parseFloat(invoice.vat_amount) > 0 ? 7 : 0)}%
                                                </td>
                                                <td className="border-b border-[#000000] py-1 text-right pr-2 font-medium text-[11px]">
                                                    {parseFloat(invoice.vat_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-[#000000] py-2 pl-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                                    ยอดสุทธิ
                                                </td>
                                                <td className="py-2 text-right pr-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                                    {parseFloat(invoice.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}

                                    {!isLastPage && (
                                        <tfoot><tr className="border-t border-[#000000]"><td colSpan={6}></td></tr></tfoot>
                                    )}
                                </table>
                            </div>

                            {/* 5. Payment & Signatures (เฉพาะหน้าสุดท้าย) */}
                            {isLastPage ? (
                                <div className="border border-t-0 border-[#000000] mt-0 text-[#000000]">
                                    <div className="border-b border-[#000000] p-1 flex justify-between items-start">
                                        <div className="space-y-0 text-[12px]">
                                            <p className="font-bold text-[#000000] border-b border-[#000000] inline-block mb-1" style={{ color: themeColor }}>ช่องทางการชำระ ประเภทบัญชีออมทรัพย์</p>
                                            <p>ชื่อบัญชี <span className="">บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด</span></p>
                                            <p>ธนาคารกสิกรไทย <span className="">522-2-23478-8</span></p>
                                            <p>ธนาคารไทยพาณิชย์ <span className="">468-084384-8</span></p>
                                            <p>หลังชำระเรียบร้อย กรุณาติดต่อฝ่ายบัญชี/การเงิน 044-300659</p>
                                            <p>หรือเพิ่มเพื่อนทางไลน์ ID : 5477208</p>
                                        </div>
                                        
                                        <div className="text-right space-y-5 text-[15px]">
                                            {/* ✅ เช็คว่ามี หัก ณ ที่จ่าย หรือไม่ ถ้ามีก็โชว์ ถ้าไม่มีก็ซ่อน */}
                                            {parseFloat(invoice.wht_rate) > 0 ? (
                                                <>
                                                    <p className=" text-[#dc2626]">กรุณาส่ง "ใบหัก ณ ที่จ่าย" พร้อมหลักฐานการชำระเงิน</p>
                                                    <div className="flex justify-end items-center gap-19 text-[#dc2626]">
                                                        <span>หักภาษี ณ ที่จ่าย/TAX ({parseFloat(invoice.wht_rate)}%)</span>
                                                        <span className="text-red w-20 text-right">
                                                            {parseFloat(invoice.wht_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="h-[50px]"></div> // ดัน Layout ไม่ให้เพี้ยนกรณีไม่มีหัก ณ ที่จ่าย
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 text-center text-[10px]">
                                        <div className="border-r border-[#000000] p-4 pb-2">
                                            <p className="mb-8">ได้รับมอบสินค้าตามจำนวนรายการและราคาข้างต้นไว้<br />ครบถ้วน ในสภาพเรียบร้อย ถูกต้องตามวัตถุประสงค์ทุกประการ</p>
                                            <div className="border-b border-[#000000] h-6 w-3/4 mx-auto"></div>
                                            <p className="mt-1">ผู้รับสินค้า / Received By</p>
                                            <p>วันที่ ...../...../.....</p>
                                        </div>
                                        <div className="border-r border-[#000000] p-4 pb-2 flex flex-col justify-end">
                                            <div className="border-b border-[#000000] h-6 w-3/4 mx-auto"></div>
                                            <p className="mt-1">ผู้วางบิล / Invoiced By</p>
                                            <p>วันที่ ...../...../.....</p>
                                        </div>
                                        <div className="p-4 pb-2 flex flex-col justify-end">
                                            <div className="mb-15">ในนาม บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด</div>
                                            <div className="border-b border-[#000000] h-6 w-3/4 mx-auto"></div>
                                            <p className="mt-1">ลายเซ็นต์ผู้มีอำนาจลงนาม</p>
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