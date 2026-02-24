'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function PRPrintPage({ params }) {
    const router = useRouter();
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    
    const [prData, setPrData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPRDetail = async () => {
            try {
                const res = await fetch(`/api/purchasing/pr/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPrData(data);
                } else {
                    Swal.fire('เกิดข้อผิดพลาด', 'ไม่พบข้อมูลใบขอซื้อ', 'error');
                    router.push('/purchasing/pr');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPRDetail();
    }, [id, router]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('print-document');
        if (!element) return;
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const opt = { margin: [10, 0, 10, 0], filename: `PR-${prData.header.pr_number}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
            html2pdf().set(opt).from(element).save();
        } catch (error) { Swal.fire('Error', 'ไม่สามารถสร้างไฟล์ PDF ได้', 'error'); }
    };

    if (loading) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100"><Loader2 className="animate-spin text-blue-600 mb-4" size={40} /><p>กำลังโหลดเอกสาร...</p></div>;
    if (!prData) return null;

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white font-sans pb-10 print:pb-0">
            <style>{`@media print { @page { size: A4 portrait; margin: 5mm; } html, body { background-color: white !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
            
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button onClick={() => router.push('/purchasing/pr')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition"><ArrowLeft size={20} /> กลับหน้ารายการ</button>
                    <div className="flex gap-3">
                        <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2.5 rounded-lg font-bold transition shadow-md"><Download size={18} /> ดาวน์โหลด PDF</button>
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-[#020617] hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-md"><Printer size={18} /> สั่งพิมพ์เอกสาร</button>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center px-4 print:mt-0 print:px-0 print:block">
                <div id="print-document" className="bg-white w-[210mm] min-h-[297mm] p-[10mm] md:p-[15mm] shadow-xl print:shadow-none print:m-0 print:p-0 print:min-h-0 print:w-full">
                    <div className="text-center mb-6 text-black">
                        <h1 className="text-xl font-bold text-[#002868] mb-1">บริษัท เอ็มเอส แทรก (ประเทศไทย) จำกัด (สำนักงานใหญ่)</h1>
                        <p className="text-[11px] font-medium text-[#002868]">717/63 หมู่ 5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000</p>
                        <p className="text-[11px] font-medium text-[#002868]">โทร. 044-300659 , 093-3254422 Email : mstrack.thailand@gmail.com www.smartgtechnology.com</p>
                        <p className="text-[11px] font-medium text-[#002868]">เลขประจำตัวผู้เสียภาษี 0305556002921</p>
                    </div>

                    <div className="mb-4">
                        <img src="/MSTrack_Logo_2.png" alt="MS Track Logo" className="h-16 object-contain" onError={(e) => { e.target.style.display = 'none'; document.getElementById('fallback-logo').style.display = 'block'; }} />
                        <div id="fallback-logo" className="hidden">
                            <h2 className="text-3xl font-black text-[#002868] italic tracking-tighter">MS<span className="text-red-600">TRACK</span></h2>
                            <p className="text-[10px] font-bold text-gray-700 italic border-b border-gray-400 inline-block pb-0.5">MS Track (Thailand) Co., Ltd.</p>
                        </div>
                    </div>

                    <div className="bg-[#002868] text-white text-center py-2 rounded-md mb-6 shadow-sm"><h2 className="text-[18px] font-bold tracking-wide">ใบขอซื้อ (PURCHASE REQUEST)</h2></div>

                    <div className="flex justify-between gap-3 mb-6 text-[10px] text-[#002868]">
                        <div className="border-[1.5px] border-[#002868] rounded-xl p-3 w-1/3 min-h-[90px]">
                            <table className="w-full">
                                <tbody>
                                    <tr><td className="w-16 py-1 font-bold align-top">ผู้ขอซื้อ</td><td className="font-bold text-black align-top">{prData.header.first_name || 'Admin'} {prData.header.last_name || ''}</td></tr>
                                    <tr><td className="w-16 py-1 font-bold align-top">แผนก</td><td className="text-black align-top">ฝ่ายผลิต / ส่วนกลาง</td></tr>
                                    {/* ✅ โชว์ข้อมูลโครงการ */}
                                    <tr><td className="w-16 py-1 font-bold align-top">โครงการ</td><td className="text-black align-top">{prData.header.project_name || '-'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="border-[1.5px] border-[#002868] rounded-xl p-3 w-1/3 min-h-[90px]">
                            <table className="w-full">
                                <tbody>
                                    {/* ✅ โชว์ข้อมูลผู้ขาย, ติดต่อ, วันที่ใช้ของ */}
                                    <tr><td className="w-20 py-1 font-bold align-top">ผู้ขาย (แนะนำ)</td><td className="text-black align-top break-words">{prData.header.suggested_vendor || '-'}</td></tr>
                                    <tr><td className="w-20 py-1 font-bold align-top">ผู้ติดต่อ/โทร</td><td className="text-black align-top break-words">{prData.header.vendor_contact || '-'}</td></tr>
                                    <tr><td className="w-20 py-1 font-bold align-top">ต้องการใช้ของ</td><td className="text-black align-top">{prData.header.required_date || 'ทั่วไป'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="border-[1.5px] border-[#002868] rounded-xl p-3 w-1/3 min-h-[90px]">
                            <table className="w-full">
                                <tbody>
                                    <tr><td className="w-20 py-1 font-bold align-top">เลขที่ใบขอซื้อ</td><td className="font-bold text-black align-top">{prData.header.pr_number}</td></tr>
                                    <tr><td className="w-20 py-1 font-bold align-top">วันที่ขอซื้อ</td><td className="text-black align-top">{new Date(prData.header.request_date).toLocaleDateString('th-TH')}</td></tr>
                                    <tr><td className="w-20 py-1 font-bold align-top">สถานะ</td><td className={`font-bold align-top ${prData.header.status === 'Pending' ? 'text-orange-600' : 'text-green-600'}`}>{prData.header.status === 'Pending' ? 'รออนุมัติ/สั่งซื้อ' : 'ออก PO แล้ว'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <table className="w-full border-collapse border border-[#002868] text-[11px] mb-4 text-black">
                        <thead>
                            <tr className="bg-[#dc2626] text-white text-center font-bold">
                                <th className="border border-[#002868] py-2 px-1 w-12">ลำดับ<br/><span className="text-[9px] font-normal uppercase">No.</span></th>
                                <th className="border border-[#002868] py-2 px-1 w-28">รหัสสินค้า<br/><span className="text-[9px] font-normal uppercase">ITEM CODE</span></th>
                                <th className="border border-[#002868] py-2 px-3 text-left">รายละเอียด<br/><span className="text-[9px] font-normal uppercase">DESCRIPTION</span></th>
                                <th className="border border-[#002868] py-2 px-1 w-20">จำนวน<br/><span className="text-[9px] font-normal uppercase">QTY</span></th>
                                <th className="border border-[#002868] py-2 px-1 w-20">หน่วย<br/><span className="text-[9px] font-normal uppercase">UNIT</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {prData.items.map((item, index) => (
                                <tr key={index} className="text-center h-8 font-bold">
                                    <td className="border-x border-[#002868] px-2 py-1">{index + 1}</td>
                                    <td className="border-x border-[#002868] px-2 py-1">{item.product_code || '-'}</td>
                                    <td className="border-x border-[#002868] px-3 py-1 text-left break-all">{item.product_name || item.custom_item_name}</td>
                                    <td className="border-x border-[#002868] px-2 py-1">{item.quantity}</td>
                                    <td className="border-x border-[#002868] px-2 py-1">{item.unit || 'ชิ้น'}</td>
                                </tr>
                            ))}
                            {[...Array(Math.max(0, 6 - prData.items.length))].map((_, i) => (
                                <tr key={`empty-${i}`} className="h-8"><td className="border-x border-[#002868]"></td><td className="border-x border-[#002868]"></td><td className="border-x border-[#002868]"></td><td className="border-x border-[#002868]"></td><td className="border-x border-[#002868]"></td></tr>
                            ))}
                            <tr><td colSpan="5" className="border-t border-[#002868]"></td></tr>
                        </tbody>
                    </table>

                    <div className="border border-[#002868] p-3 min-h-[120px] text-[11px] text-black mb-6 rounded-lg flex flex-col overflow-hidden">
                        <span className="font-bold text-[#002868] mb-1">หมายเหตุ (Remarks):</span>
                        <p className="mt-1 font-medium flex-1 whitespace-pre-wrap break-words break-all">{prData.header.remarks || '-'}</p>
                    </div>

                    <div className="flex justify-between items-end px-8 text-[11px] text-[#002868]">
                        <div className="text-center w-52 border border-[#002868] rounded-xl p-3 pt-12 relative">
                            <div className="border-b border-[#002868] mb-2 w-full"></div>
                            <p className="font-bold">ผู้ขออนุมัติจัดซื้อ</p><p className="text-[9px]">(Requested By)</p>
                            <div className="absolute bottom-2 left-3 right-3 text-left text-[9px] mt-2 font-bold"><span>วันที่ ........................................</span></div>
                        </div>
                        <div className="text-center w-52 border border-[#002868] rounded-xl p-3 pt-12 relative">
                            <div className="border-b border-[#002868] mb-2 w-full"></div>
                            <p className="font-bold">ผู้อนุมัติเอกสาร</p><p className="text-[9px]">(Authorized Signature)</p>
                            <div className="absolute bottom-2 left-3 right-3 text-left text-[9px] mt-2 font-bold"><span>วันที่ ........................................</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}