'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';

export default function PrintQuotation() {
    const params = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/accounting/project-quotations/${params.id}`);
                if (res.ok) setData(await res.json());
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchData();
    }, [params.id]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
    if (!data) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">ไม่พบข้อมูลเอกสาร</div>;

    const totalAmount = data.items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);

    return (
        <div className="min-h-screen bg-gray-100 py-10 print:py-0 print:bg-white text-black font-sans">
            
            {/* ปุ่ม Action (จะถูกซ่อนอัตโนมัติตอนกดปริ้นท์) */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden px-4">
                <button onClick={() => window.close()} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold bg-white px-4 py-2 rounded-lg shadow-sm">
                    <ArrowLeft size={18} /> ปิดหน้าต่าง
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition">
                    <Printer size={18} /> พิมพ์ / บันทึกเป็น PDF
                </button>
            </div>

            {/* หน้ากระดาษ A4 */}
            <div className="max-w-4xl mx-auto bg-white p-12 shadow-2xl print:shadow-none print:p-0">
                
                {/* Header บริษัท & เลขที่บิล */}
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">ใบเสนอราคา</h1>
                        <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Quotation</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-slate-800">{data.quotation_number}</p>
                        <p className="text-sm text-slate-500 mt-1">วันที่เสนอราคา: {new Date(data.issue_date).toLocaleDateString('th-TH')}</p>
                        {data.valid_until && <p className="text-sm text-slate-500">ยืนยันราคาถึง: {new Date(data.valid_until).toLocaleDateString('th-TH')}</p>}
                    </div>
                </div>

                {/* ข้อมูลลูกค้า & โปรเจกต์ */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">เสนอให้ (Customer)</h3>
                        <p className="text-lg font-bold text-slate-800">{data.customer_name}</p>
                        <p className="text-sm text-slate-600 mt-1">{data.customer_address || '-'}</p>
                        {(data.contact_person || data.phone) && (
                            <div className="mt-3 text-sm text-slate-600 flex flex-col gap-1">
                                {data.contact_person && <span>ผู้ติดต่อ: {data.contact_person}</span>}
                                {data.phone && <span>โทร: {data.phone}</span>}
                            </div>
                        )}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ชื่องาน (Project Name)</h3>
                        <p className="text-base font-bold text-slate-800">{data.project_name}</p>
                    </div>
                </div>

                {/* ตารางรายการ */}
                <table className="w-full text-left mb-8 border-collapse">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="py-3 px-4 w-12 text-center rounded-tl-lg font-bold">#</th>
                            <th className="py-3 px-4 font-bold">รายละเอียด (Description)</th>
                            <th className="py-3 px-4 w-24 text-center font-bold">จำนวน</th>
                            <th className="py-3 px-4 w-24 text-center font-bold">หน่วย</th>
                            <th className="py-3 px-4 w-32 text-right font-bold">ราคา/หน่วย</th>
                            <th className="py-3 px-4 w-32 text-right rounded-tr-lg font-bold">จำนวนเงิน</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {data.items.map((item, idx) => (
                            <tr key={idx} className="bg-white">
                                <td className="py-4 px-4 text-center text-slate-500">{idx + 1}</td>
                                <td className="py-4 px-4 font-medium text-slate-800">{item.description}</td>
                                <td className="py-4 px-4 text-center text-slate-700">{item.quantity}</td>
                                <td className="py-4 px-4 text-center text-slate-700">{item.unit}</td>
                                <td className="py-4 px-4 text-right text-slate-700">{parseFloat(item.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                <td className="py-4 px-4 text-right font-bold text-slate-800">{parseFloat(item.total_price).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* สรุปยอดและลายเซ็น */}
                <div className="grid grid-cols-2 gap-12">
                    <div>
                        {data.remarks && (
                            <div className="mb-4">
                                <h4 className="font-bold text-slate-800 text-sm mb-1">หมายเหตุ / เงื่อนไข:</h4>
                                <p className="text-sm text-slate-600 whitespace-pre-line">{data.remarks}</p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>รวมเป็นเงิน</span>
                            <span>{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600 pb-3 border-b border-slate-200">
                            <span>ภาษีมูลค่าเพิ่ม 7% (กรณีมี)</span>
                            <span>-</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-black text-slate-800 pt-2">
                            <span>ยอดรวมสุทธิ (Grand Total)</span>
                            <span>฿{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                        </div>
                    </div>
                </div>

                {/* พื้นที่เซ็นชื่อ */}
                <div className="grid grid-cols-2 gap-16 mt-20 pt-10 border-t border-slate-200 text-center">
                    <div>
                        <div className="w-48 border-b border-slate-400 mx-auto mb-3"></div>
                        <p className="font-bold text-slate-800 text-sm">ผู้เสนอราคา (Authorized Signature)</p>
                        <p className="text-xs text-slate-500 mt-1">วันที่: ....../....../..........</p>
                    </div>
                    <div>
                        <div className="w-48 border-b border-slate-400 mx-auto mb-3"></div>
                        <p className="font-bold text-slate-800 text-sm">ผู้อนุมัติสั่งซื้อ (Customer Accepted)</p>
                        <p className="text-xs text-slate-500 mt-1">วันที่: ....../....../..........</p>
                    </div>
                </div>

            </div>
        </div>
    );
}