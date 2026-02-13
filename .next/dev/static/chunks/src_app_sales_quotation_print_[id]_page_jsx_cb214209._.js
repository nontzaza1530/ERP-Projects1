(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/sales/quotation/print/[id]/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuotationPrintPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2d$pro$2f$dist$2f$html2canvas$2d$pro$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas-pro/dist/html2canvas-pro.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// ฟังก์ชันแปลงตัวเลขเป็นบาท (Placeholder)
const bahtText = (num)=>{
    if (!num || isNaN(num)) return '-';
    const numberText = [
        "ศูนย์",
        "หนึ่ง",
        "สอง",
        "สาม",
        "สี่",
        "ห้า",
        "หก",
        "เจ็ด",
        "แปด",
        "เก้า"
    ];
    const unitText = [
        "",
        "สิบ",
        "ร้อย",
        "พัน",
        "หมื่น",
        "แสน",
        "ล้าน"
    ];
    const convert = (number)=>{
        let res = "";
        let len = number.length;
        for(let i = 0; i < len; i++){
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
function QuotationPrintPage({ params }) {
    _s();
    const unwrappedParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const id = unwrappedParams.id;
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isOrdered, setIsOrdered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "QuotationPrintPage.useEffect": ()=>{
            const fetchData = {
                "QuotationPrintPage.useEffect.fetchData": async ()=>{
                    try {
                        // 1. ลองดึงจากตาราง Quotation (ก่อนจ่ายเงิน)
                        let res = await fetch(`/api/sales/quotation/${id}`);
                        let result = await res.json();
                        // 2. ถ้าไม่พบ หรือเป็นรายการที่ขายแล้ว (รูปที่ 3) ให้ดึงจากตาราง Receipt/Order
                        if (!res.ok || result.error || result.quotation && result.quotation.status === 'ordered') {
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
                                    items: orderData.items.map({
                                        "QuotationPrintPage.useEffect.fetchData": (item)=>({
                                                product_name: item.product_name,
                                                quantity: item.quantity,
                                                price: item.price_per_unit,
                                                total: item.price_per_unit * item.quantity
                                            })
                                    }["QuotationPrintPage.useEffect.fetchData"])
                                });
                                setLoading(false);
                                return;
                            }
                        }
                        if (res.ok) {
                            setData(result);
                            setIsOrdered(result.quotation.status === 'ordered');
                        }
                    } catch (error) {
                        console.error(error);
                    } finally{
                        setLoading(false);
                    }
                }
            }["QuotationPrintPage.useEffect.fetchData"];
            fetchData();
        }
    }["QuotationPrintPage.useEffect"], [
        id
    ]);
    const handleDownloadPDF = async ()=>{
        const element = document.getElementById('print-content');
        if (!element) return;
        const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2d$pro$2f$dist$2f$html2canvas$2d$pro$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(element, {
            scale: 2,
            useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, canvas.height * 210 / canvas.width);
        pdf.save(`QT-${id}.pdf`);
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10 text-center flex justify-center items-center gap-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                className: "animate-spin"
            }, void 0, false, {
                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                lineNumber: 110,
                columnNumber: 96
            }, this),
            " กำลังโหลดแบบฟอร์ม..."
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
        lineNumber: 110,
        columnNumber: 23
    }, this);
    if (!data) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10 text-center text-red-500",
        children: "ไม่พบข้อมูล"
    }, void 0, false, {
        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
        lineNumber: 111,
        columnNumber: 21
    }, this);
    const { quotation, items } = data;
    const grandTotal = Number(quotation.total_amount);
    const vatAmount = grandTotal * 7 / 107;
    const preVatAmount = grandTotal - vatAmount;
    // สีตามแบบ MS Track
    const themeBlue = '#003399';
    const themeRed = '#cc0000';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-100 p-4 print:p-0 font-sans",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-[210mm] mx-auto mb-4 flex justify-end gap-3 print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDownloadPDF,
                        className: "flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            " PDF"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.print(),
                        className: "flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            " พิมพ์"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 130,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "print-content",
                className: "max-w-[210mm] mx-auto bg-white p-[8mm] shadow-lg print:shadow-none print:w-full min-h-[297mm] relative text-black text-[11px] leading-tight",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-bold",
                                style: {
                                    color: themeBlue
                                },
                                children: "บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด (สำนักงานใหญ่)"
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "717/63 หมู่ 5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000"
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "โทร. 044-300659 , 093-3254422 Email : mstrack.thailand@gmail.com www.smartgtechnology.com"
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            "เลขที่ประจำตัวผู้เสียภาษี 0305556002921",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-end mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[200px] flex justify-center items-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "/MSTrack_Logo_2.png",
                                            alt: "Company Logo",
                                            className: "w-full h-auto object-contain max-h-20"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 165,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 163,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[150px] text-right",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-[50px_1fr] text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-gray-600",
                                                    children: "เลขที่"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 173,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    children: quotation.quotation_no
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 174,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold text-gray-600",
                                                    children: "วันที่"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 175,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: new Date(quotation.created_at).toLocaleDateString('th-TH')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 176,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 172,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 171,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white text-center font-bold text-lg py-1 mb-2 rounded-sm",
                        style: {
                            backgroundColor: themeBlue
                        },
                        children: "ใบเสนอราคา (Quotation)"
                    }, void 0, false, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-2xl p-3 h-32 relative",
                                style: {
                                    borderColor: themeBlue
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-[80px_1fr] gap-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "ชื่อลูกค้า"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 196,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            children: quotation.customer_name || 'ลูกค้าทั่วไป'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 199,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "ที่อยู่"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 201,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "wrap-break-word whitespace-pre-wrap leading-normal",
                                            children: quotation.customer_address || '-'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 204,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "เบอร์โทร"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 208,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "-"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 211,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "เลขผู้เสียภาษี"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 213,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "-"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 216,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                    lineNumber: 195,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border border-blue-900 rounded-2xl p-3 h-32",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-[90px_1fr] gap-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "ผู้เสนอราคา"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 223,
                                            columnNumber: 29
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-black",
                                            children: "Admin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 225,
                                            columnNumber: 35
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "ยืนราคาภายใน"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 226,
                                            columnNumber: 29
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-black",
                                            children: "7 วัน"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 228,
                                            columnNumber: 36
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "Expire Date"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 229,
                                            columnNumber: 29
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-black",
                                            children: new Date(new Date(quotation.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 231,
                                            columnNumber: 35
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            style: {
                                                color: themeBlue
                                            },
                                            children: "เงื่อนไขการชำระ"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 232,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-black font-bold",
                                            children: isOrdered && quotation.payment_method && quotation.payment_method !== '-' ? quotation.payment_method : "เงินสด / โอนเงิน"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 236,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                    lineNumber: 222,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full border-collapse border border-black mb-0 text-[11px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "text-white text-center font-bold",
                                    style: {
                                        backgroundColor: themeRed
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 border-r border-white w-10",
                                            children: [
                                                "รหัสสินค้า",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 249,
                                                    columnNumber: 79
                                                }, this),
                                                "ITEM CODE"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 249,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 border-r border-white",
                                            children: [
                                                "รายละเอียดสินค้า",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 250,
                                                    columnNumber: 80
                                                }, this),
                                                "DESCRIPTION"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 250,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 border-r border-white w-14",
                                            children: [
                                                "จำนวน",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 251,
                                                    columnNumber: 74
                                                }, this),
                                                "QUANTITY"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 251,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 border-r border-white w-12",
                                            children: [
                                                "หน่วย",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 252,
                                                    columnNumber: 74
                                                }, this),
                                                "UNIT"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 252,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 border-r border-white w-20",
                                            children: [
                                                "ราคา/หน่วย",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 253,
                                                    columnNumber: 79
                                                }, this),
                                                "UNIT PRICE"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 253,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 border-r border-white w-16",
                                            children: [
                                                "ส่วนลด",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 254,
                                                    columnNumber: 75
                                                }, this),
                                                "DISCOUNT"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 254,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-1 w-20",
                                            children: [
                                                "จำนวนเงิน",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 255,
                                                    columnNumber: 56
                                                }, this),
                                                "AMOUNT"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 255,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                    lineNumber: 246,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 245,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "text-gray-800",
                                children: [
                                    items.map((item_0, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-l border-r border-black align-top h-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-center border-r border-black",
                                                    children: index + 1
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 260,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "pl-2 border-r border-black",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold",
                                                        children: item_0.product_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                        lineNumber: 262,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 261,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-center border-r border-black",
                                                    children: item_0.quantity
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 266,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-center border-r border-black",
                                                    children: "ชิ้น"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 267,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-right pr-1 border-r border-black",
                                                    children: Number(item_0.price).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 268,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-center border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 271,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "text-right pr-1",
                                                    children: Number(item_0.total).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 272,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 259,
                                            columnNumber: 47
                                        }, this)),
                                    Array.from({
                                        length: Math.max(0, 15 - items.length)
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-l border-r border-black h-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 280,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 281,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 282,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 283,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 284,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "border-r border-black"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 285,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {}, void 0, false, {
                                                    fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                    lineNumber: 286,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, `empty-${i}`, true, {
                                            fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                            lineNumber: 279,
                                            columnNumber: 28
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                                className: "border-t border-black font-bold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: "4",
                                                rowSpan: "5",
                                                className: "border-r border-black align-top p-2 border-b text-[10px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "underline mb-1",
                                                        style: {
                                                            color: themeBlue
                                                        },
                                                        children: "ช่องทางการชำระ (บัญชีออมทรัพย์)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                        lineNumber: 293,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "ชื่อบัญชี บริษัท เอ็มเอส แทรค (ประเทศไทย)จำกัด"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                        lineNumber: 296,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "ธนาคารกสิกรไทย ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[13px] ml-2",
                                                                children: "522-2-23478-8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                                lineNumber: 297,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                        lineNumber: 297,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "ธนาคารไทยพาณิชย์ ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[13px] ml-1",
                                                                children: "468-0-84384-8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                                lineNumber: 298,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                        lineNumber: 298,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2 border border-black text-center py-1 bg-white",
                                                        children: bahtText(grandTotal)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                        lineNumber: 300,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 292,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: "2",
                                                className: "text-right pr-2 border-r border-black border-b",
                                                children: "รวมจำนวนเงิน"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 304,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "text-right pr-1 border-b border-gray-400",
                                                children: Number(preVatAmount + vatAmount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 305,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 291,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: "2",
                                                className: "text-right pr-2 border-r border-black border-b",
                                                children: "ส่วนลดการค้า"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 310,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "text-right pr-1 border-b border-gray-400",
                                                children: "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 311,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: "2",
                                                className: "text-right pr-2 border-r border-black border-b",
                                                children: "เงินหลังหักส่วนลด"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 314,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "text-right pr-1 border-b border-gray-400",
                                                children: Number(preVatAmount + vatAmount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 315,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: "2",
                                                className: "text-right pr-2 border-r border-black border-b",
                                                children: "ภาษีมูลค่าเพิ่ม 7%"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "text-right pr-1 border-b border-black",
                                                children: Number(vatAmount).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 321,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: "2",
                                                className: "text-right pr-2 border-r border-black border-b bg-gray-100",
                                                children: "จำนวนเงินทั้งสิ้น"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 326,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "text-right pr-1 border-b border-black bg-gray-100",
                                                children: Number(grandTotal).toLocaleString(undefined, {
                                                    minimumFractionDigits: 2
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                                lineNumber: 327,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-2 mt-4 text-[10px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2",
                                style: {
                                    borderColor: themeBlue
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-gray-400 w-3/4 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 340,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold",
                                        style: {
                                            color: themeBlue
                                        },
                                        children: "ผู้อนุมัติซื้อ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 341,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute bottom-1 left-2 text-gray-400",
                                        children: "วันที่"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 344,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 337,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2",
                                style: {
                                    borderColor: themeBlue
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-gray-400 w-3/4 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 350,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold",
                                        style: {
                                            color: themeBlue
                                        },
                                        children: "พนักงานขาย"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 351,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute bottom-1 left-2 text-gray-400",
                                        children: "วันที่"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 354,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 347,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border rounded-2xl h-24 relative flex flex-col justify-end items-center pb-2",
                                style: {
                                    borderColor: themeBlue
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-b border-gray-400 w-3/4 mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 360,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-bold",
                                        style: {
                                            color: themeBlue
                                        },
                                        children: "ผู้จัดการขาย"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 361,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute bottom-1 left-2 text-gray-400",
                                        children: "วันที่"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                        lineNumber: 364,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
                lineNumber: 136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/sales/quotation/print/[id]/page.jsx",
        lineNumber: 123,
        columnNumber: 10
    }, this);
}
_s(QuotationPrintPage, "LxlSPrh+oYonKNrripXEwsOPM+8=");
_c = QuotationPrintPage;
var _c;
__turbopack_context__.k.register(_c, "QuotationPrintPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_sales_quotation_print_%5Bid%5D_page_jsx_cb214209._.js.map