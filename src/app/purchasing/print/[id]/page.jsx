'use client';

// ✅ ใช้ตัว Pro เพื่อแก้ปัญหา Error สี lab()
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, Loader2, AlertCircle, Download } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

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

export default function PrintPOPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

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

    // --- ✅ แก้ไขฟังก์ชันดาวน์โหลด PDF ใหม่ทั้งหมด ---
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        Swal.fire({
            title: 'กำลังสร้างไฟล์ PDF...',
            text: 'กรุณารอสักครู่ ระบบกำลังประมวลผล',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            // ค้นหาทุกๆ หน้าที่มีคลาส .po-page
            const elements = document.querySelectorAll('.po-page');

            for (let i = 0; i < elements.length; i++) {
                const canvas = await html2canvas(elements[i], {
                    scale: 2, // เพิ่มความคมชัด
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                const pdfWidth = 210; // ความกว้าง A4 มาตรฐาน (mm)
                const pdfHeight = 297; // ความสูง A4 มาตรฐาน (mm)

                if (i > 0) {
                    pdf.addPage(); // ถ้ามีหลายหน้า ให้สร้างแผ่นใหม่
                }

                // วางรูปลงไปให้พอดีขอบ A4 เป๊ะๆ
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`PO-${data?.po_number || params.id}.pdf`);
            Swal.close();
        } catch (error) {
            console.error("PDF Error:", error);
            Swal.close();
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้ในขณะนี้', 'error');
        } finally {
            setIsDownloading(false);
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
                <Loader2 className="animate-spin text-[#002060]" size={48} />
                <p className="text-slate-400 font-medium animate-pulse">กำลังสร้างเอกสาร...</p>
            </div>
        );
    }

    const po = data;
    const items = data.items || [];

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

            {/* --- Toolbar --- */}
            <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-[#002060] transition font-bold">
                    <ArrowLeft size={20} /> กลับหน้ารายการ
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition active:scale-95 disabled:bg-gray-400"
                    >
                        <Download size={20} /> {isDownloading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'}
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-[#002060] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition active:scale-95"
                    >
                        <Printer size={20} /> สั่งพิมพ์เอกสาร
                    </button>
                </div>
            </div>

            {/* --- พื้นที่เนื้อหาใบสั่งซื้อ --- */}
            <div id="po-content-area">
                {pages.map((pageItems, pageIndex) => {
                    const isLastPage = pageIndex === pages.length - 1;

                    return (
                        <div
                            key={pageIndex}
                            className="po-page w-[210mm] min-h-[296mm] mx-auto bg-[#ffffff] p-8 shadow-lg print:shadow-none print:w-[210mm] print:h-[296mm] print:overflow-hidden relative flex flex-col text-[12px] leading-snug text-[#000000] mb-8 print:mb-0"
                            style={{ pageBreakAfter: 'always' }}
                        >

                            {/* 1. Header */}
                            <div className="mb-2">
                                <div className="text-center mb-4">
                                    <h1 className="text-[17px] font-bold mb-1" style={{ color: themeColor }}>
                                        บริษัท เอ็มเอส แทรค (ประเทศไทย) จํากัด (สำนักงานใหญ่)
                                    </h1>
                                    <p className="text-[11px] font-medium text-[#000000] leading-relaxed">
                                        717/63 หมู่ 5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำาเภอเมือง จังหวัดนครราชสีมา 30000<br />
                                        โทร. 044-300659 , 093-3254422 Email : mstrack.thailand@gmail.com www.smartgtechnology.com<br />
                                        เลขที่ประจําตัวผู้เสียภาษี 0305556002921
                                    </p>
                                </div>

                                <div className="w-full text-left mb-0 pl-2">
                                    <img src="/MSTrack_Logo_2.png" alt="Company Logo" className="h-16 w-auto object-contain" />
                                </div>

                                <div className="w-full text-[#ffffff] text-center py-2 font-bold text-xl rounded-sm print:text-white mb-4" style={{ backgroundColor: themeColor }}>
                                    ใบสั่งซื้อ (PURCHASE ORDER)
                                </div>
                            </div>

                            {/* 2. Info Grid (แบ่งเป็น 3 กล่อง) */}
                            <div className="flex justify-between mb-4 px-2 gap-3">

                                {/* กล่องที่ 1: ข้อมูลผู้ขาย (ซ้าย) */}
                                <div className="w-[35%] border-2 rounded-xl p-3 shadow-sm print:shadow-none" style={{ borderColor: themeColor }}>
                                    <table className="w-full text-[11px] leading-relaxed">
                                        <tbody>
                                            <tr>
                                                <td className="w-16 font-bold align-top" style={{ color: themeColor }}>ผู้ขาย</td>
                                                <td className="font-bold text-slate-900">{po?.supplier_name || "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top pt-1" style={{ color: themeColor }}>ที่อยู่</td>
                                                <td className="whitespace-pre-wrap break-words text-slate-800 pt-1">
                                                    {po?.supplier_full_address || po?.supplier_address || "-"}
                                                </td>
                                            </tr>
                                            {(po?.supplier_tax_id || po?.supplier_branch) && (
                                                <tr>
                                                    <td className="font-bold align-top pt-1" style={{ color: themeColor }}>Tax ID</td>
                                                    <td className="text-slate-800 pt-1">
                                                        {po?.supplier_tax_id || "-"}
                                                        {po?.supplier_branch && <span className="ml-1 text-slate-500">({po.supplier_branch})</span>}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* กล่องที่ 2: การติดต่อและเงื่อนไข (กลาง) */}
                                <div className="w-[28%] border-2 rounded-xl p-3 shadow-sm print:shadow-none" style={{ borderColor: themeColor }}>
                                    <table className="w-full text-[11px] leading-relaxed">
                                        <tbody>
                                            <tr>
                                                <td className="w-20 font-bold align-top" style={{ color: themeColor }}>ผู้ติดต่อ</td>
                                                <td className="text-slate-800">{po?.contact_person || "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top" style={{ color: themeColor }}>โทรศัพท์</td>
                                                <td className="text-slate-800">{po?.supplier_phone || "-"}</td>
                                            </tr>
                                            {po?.supplier_fax && (
                                                <tr>
                                                    <td className="font-bold align-top" style={{ color: themeColor }}>โทรสาร</td>
                                                    <td className="text-slate-800">{po.supplier_fax}</td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="font-bold align-top pt-1" style={{ color: themeColor }}>เครดิตเทอม</td>
                                                <td className="text-slate-800 pt-1">{po?.credit_terms || "เงินสด"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top" style={{ color: themeColor }}>กำหนดส่ง</td>
                                                {/* เปลี่ยนจาก delivery_date เป็น expected_date ให้ตรงกับ Database */}
                                                <td className="text-slate-800">{po?.expected_date ? new Date(po.expected_date).toLocaleDateString('th-TH') : "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* กล่องที่ 3: ข้อมูลเอกสาร (ขวา) */}
                                <div className="w-[37%] border-2 rounded-xl p-3 shadow-sm print:shadow-none" style={{ borderColor: themeColor }}>
                                    <table className="w-full text-[11px] leading-relaxed">
                                        <tbody>
                                            <tr>
                                                <td className="w-24 font-bold align-top" style={{ color: themeColor }}>เลขที่ใบสั่งซื้อ</td>
                                                <td className="font-bold text-slate-900">{po?.po_number || po?.doc_number || "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top" style={{ color: themeColor }}>วันที่สั่งซื้อ</td>
                                                <td className="text-slate-800">{po?.order_date ? new Date(po.order_date).toLocaleDateString('th-TH') : "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top" style={{ color: themeColor }}>อ้างอิง QT</td>
                                                <td className="text-slate-800">{po?.quotation_ref || "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top" style={{ color: themeColor }}>อ้างอิง PR</td>
                                                <td className="text-slate-800">{po?.pr_ref || "-"}</td>
                                            </tr>
                                            <tr>
                                                <td className="font-bold align-top pt-1" style={{ color: themeColor }}>สถานที่จัดส่ง</td>
                                                <td className="whitespace-pre-wrap break-words text-slate-800 pt-1">
                                                    {po?.shipping_address || "สำนักงานใหญ่ (HQ)"}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>

                            {/* 3. Items Table */}
                            <div className="">
                                <table className="w-full border-collapse text-xs border-t border-r border-[#000000]">
                                    <thead>
                                        <tr className="text-[#ffffff] text-center font-bold print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                            <th className="border-l border-r border-b border-[#000000] py-1.5 w-12">ลำดับ<br /><span className="font-normal text-[10px]">No.</span></th>
                                            <th className="border-r border-b border-[#000000] py-1.5 w-36">รหัสสินค้า<br /><span className="font-normal text-[10px]">ITEM CODE</span></th>
                                            <th className="border-r border-b border-[#000000] py-1.5">รายละเอียด<br /><span className="font-normal text-[10px]">DESCRIPTION</span></th>
                                            <th className="border-r border-b border-[#000000] py-1.5 w-16">จํานวน<br /><span className="font-normal text-[10px]">QTY</span></th>
                                            <th className="border-r border-b border-[#000000] py-1.5 w-16">หน่วย<br /><span className="font-normal text-[10px]">UNIT</span></th>
                                            <th className="border-r border-b border-[#000000] py-1.5 w-24">ราคา/หน่วย<br /><span className="font-normal text-[10px]">UNIT PRICE</span></th>
                                            <th className="border-b border-[#000000] py-1.5 w-28">จํานวนเงิน<br /><span className="font-normal text-[10px]">AMOUNT</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[#000000] font-medium text-[13px]">
                                        {pageItems.map((item, idx) => (
                                            <tr key={idx} className="align-top">
                                                <td className="border-l border-r border-[#000000] py-1.5 text-center">{idx + 1 + (pageIndex * ITEMS_PER_PAGE)}</td>
                                                <td className="border-r border-[#000000] py-1.5 px-2 text-center break-words">{item.product_code || item.item_code || "-"}</td>
                                                <td className="border-r border-[#000000] py-1.5 px-2 leading-relaxed">{item.product_name || item.description}</td>
                                                <td className="border-r border-[#000000] py-1.5 text-center font-bold">{item.quantity}</td>
                                                <td className="border-r border-[#000000] py-1.5 text-center">{item.unit || "ชุด"}</td>
                                                <td className="border-r border-[#000000] py-1.5 text-right px-2">{parseFloat(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="border-b-0 py-1.5 text-right px-2 font-bold">{parseFloat(item.total_price || item.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                        {/* Fill Empty Rows */}
                                        {[...Array(Math.max(0, ITEMS_PER_PAGE - pageItems.length))].map((_, i) => (
                                            <tr key={`empty-${i}`}>
                                                <td className="border-l border-r border-[#000000] py-1 h-7"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="border-r border-[#000000] py-1"></td><td className="py-1"></td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* 4. Footer Rows */}
                                    {isLastPage && (
                                        <tfoot>
                                            <tr className="border-t border-[#000000]">
                                                <td colSpan={5} rowSpan={3} className="border-l border-r border-b border-[#000000] align-top text-left px-4 py-3 text-[11px]">
                                                    <div className="font-bold mb-2" style={{ color: themeColor }}>หมายเหตุ/เงื่อนไขเพิ่มเติม (Remarks):</div>
                                                    <div className="whitespace-pre-wrap min-h-[80px] leading-relaxed text-slate-800">
                                                        {po?.remarks || "1. กรุณาส่งสินค้าตามกำหนดเวลา\n2. โปรดแนบสำเนาใบสั่งซื้อมาพร้อมกับใบส่งสินค้า / ใบแจ้งหนี้ทุกครั้ง"}
                                                    </div>
                                                </td>
                                                <td className="border-r border-b border-[#000000] py-1.5 pl-2 font-bold text-[11px]" style={{ color: themeColor }}>
                                                    รวมเป็นเงิน
                                                </td>
                                                <td className="border-b border-[#000000] py-1.5 text-right pr-2 font-medium text-[12px]">
                                                    {parseFloat(po?.subtotal || po?.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-b border-[#000000] py-1.5 pl-2 font-bold text-[11px]" style={{ color: themeColor }}>
                                                    ภาษีมูลค่าเพิ่ม 7%
                                                </td>
                                                <td className="border-b border-[#000000] py-1.5 text-right pr-2 font-medium text-[12px]">
                                                    {parseFloat(po?.vat_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-r border-b border-[#000000] py-2 pl-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                                    ยอดสุทธิ
                                                </td>
                                                <td className="border-b border-[#000000] py-2 text-right pr-2 font-bold text-[15px] text-[#ffffff] print:bg-[#C00000]" style={{ backgroundColor: redHighlight }}>
                                                    {parseFloat(po?.grand_total || po?.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-[#000000]">
                                                <td colSpan={7} className="border-l border-r text-center py-2 font-bold text-[12px]" style={{ color: themeColor }}>
                                                    ( {THBText(po?.grand_total || po?.total_amount || 0)} )
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}

                                    {!isLastPage && (
                                        <tfoot><tr className="border-t border-[#000000]"><td colSpan={7}></td></tr></tfoot>
                                    )}
                                </table>
                            </div>

                            {/* 5. Signatures */}
                            {isLastPage ? (
                                <div className="mt-6 grid grid-cols-3 gap-4 text-[11px]">
                                    <div className="border-2 rounded-xl p-4 flex flex-col justify-end h-28 relative" style={{ borderColor: themeColor }}>
                                        <div className="w-full text-center">
                                            <div className="border-b border-[#000000] w-4/5 mx-auto mb-2"></div>
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[10px] text-gray-500">วันที่ ...............................</span>
                                                <div className="text-center font-bold" style={{ color: themeColor }}>
                                                    <p>ผู้จัดทำเอกสาร</p>
                                                    <p className="text-[9px] font-normal">(Prepared By)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div></div>

                                    <div className="border-2 rounded-xl p-4 flex flex-col justify-end h-28 relative" style={{ borderColor: themeColor }}>
                                        <div className="w-full text-center">
                                            <div className="border-b border-[#000000] w-4/5 mx-auto mb-2"></div>
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[10px] text-gray-500">วันที่ ...............................</span>
                                                <div className="text-center font-bold" style={{ color: themeColor }}>
                                                    <p>ผู้มีอำนาจลงนาม</p>
                                                    <p className="text-[9px] font-normal">(Authorized Signature)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grow"></div>
                            )}

                            <div className="absolute bottom-[5mm] right-[10mm] text-[9px] text-gray-500">
                                หน้า (Page) {pageIndex + 1} / {pages.length}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}