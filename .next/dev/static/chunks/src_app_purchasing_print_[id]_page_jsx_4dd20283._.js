(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/purchasing/print/[id]/page.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PrintPOPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
// ✅ ใช้ตัว Pro เพื่อแก้ปัญหา Error สี lab()
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2d$pro$2f$dist$2f$html2canvas$2d$pro$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/html2canvas-pro/dist/html2canvas-pro.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sweetalert2/dist/sweetalert2.all.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
// --- ⚙️ Config: จำนวนรายการต่อ 1 หน้า ---
const ITEMS_PER_PAGE = 10;
// --- 🛠️ Helper: แปลงเลขเป็นคำอ่านภาษาไทย ---
const THBText = (num)=>{
    if (!num) return "";
    num = parseFloat(num).toFixed(2);
    const thaiNum = [
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
    const unit = [
        "",
        "สิบ",
        "ร้อย",
        "พัน",
        "หมื่น",
        "แสน",
        "ล้าน"
    ];
    let [integer, decimal] = num.split(".");
    let text = "";
    if (parseInt(integer) === 0) {
        text = "ศูนย์บาท";
    } else {
        let len = integer.length;
        for(let i = 0; i < len; i++){
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
        for(let i = 0; i < len; i++){
            let digit = parseInt(decimal.charAt(i));
            let pos = len - i - 1;
            if (digit !== 0) {
                if (pos === 1 && digit === 1) text += "";
                else if (pos === 1 && digit === 2) text += "ยี่";
                else if (pos === 0 && digit === 1 && len > 1) text += "เอ็ด";
                else text += thaiNum[digit];
                text += pos === 1 ? "สิบ" : "สตางค์";
            }
        }
    }
    return text;
};
_c = THBText;
function PrintPOPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDownloading, setIsDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrintPOPage.useEffect": ()=>{
            if (!params.id) return;
            fetch(`/api/purchasing/po/${params.id}`).then({
                "PrintPOPage.useEffect": (res)=>{
                    if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้ หรือ ข้อมูลไม่ถูกต้อง");
                    return res.json();
                }
            }["PrintPOPage.useEffect"]).then({
                "PrintPOPage.useEffect": (result)=>{
                    setData(result);
                }
            }["PrintPOPage.useEffect"]).catch({
                "PrintPOPage.useEffect": (err)=>setError(err.message)
            }["PrintPOPage.useEffect"]);
        }
    }["PrintPOPage.useEffect"], [
        params.id
    ]);
    // --- ✅ แก้ไขฟังก์ชันดาวน์โหลด PDF ใหม่ทั้งหมด ---
    const handleDownloadPDF = async ()=>{
        setIsDownloading(true);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire({
            title: 'กำลังสร้างไฟล์ PDF...',
            text: 'กรุณารอสักครู่ ระบบกำลังประมวลผล',
            allowOutsideClick: false,
            didOpen: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].showLoading()
        });
        try {
            const pdf = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]('p', 'mm', 'a4');
            // ค้นหาทุกๆ หน้าที่มีคลาส .po-page
            const elements = document.querySelectorAll('.po-page');
            for(let i = 0; i < elements.length; i++){
                const canvas = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$html2canvas$2d$pro$2f$dist$2f$html2canvas$2d$pro$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(elements[i], {
                    scale: 2,
                    // เพิ่มความคมชัด
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].close();
        } catch (error_0) {
            console.error("PDF Error:", error_0);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].close();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sweetalert2$2f$dist$2f$sweetalert2$2e$all$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].fire('เกิดข้อผิดพลาด', 'ไม่สามารถสร้างไฟล์ PDF ได้ในขณะนี้', 'error');
        } finally{
            setIsDownloading(false);
        }
    };
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-screen flex-col justify-center items-center gap-4 text-slate-500 bg-slate-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                    size: 48,
                    className: "text-red-500"
                }, void 0, false, {
                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                    lineNumber: 112,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-lg font-bold text-red-600",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                    lineNumber: 113,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/purchasing/po-list",
                    className: "text-blue-600 hover:underline",
                    children: "กลับไปหน้ารายการ"
                }, void 0, false, {
                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                    lineNumber: 114,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
            lineNumber: 111,
            columnNumber: 12
        }, this);
    }
    if (!data) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col h-screen justify-center items-center gap-4 bg-white",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "animate-spin text-[#002060]",
                    size: 48
                }, void 0, false, {
                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                    lineNumber: 119,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-400 font-medium animate-pulse",
                    children: "กำลังสร้างเอกสาร..."
                }, void 0, false, {
                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                    lineNumber: 120,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
            lineNumber: 118,
            columnNumber: 12
        }, this);
    }
    const po = data;
    const items = data.items || [];
    const pages = [];
    if (items.length === 0) {
        pages.push([]);
    } else {
        for(let i_0 = 0; i_0 < items.length; i_0 += ITEMS_PER_PAGE){
            pages.push(items.slice(i_0, i_0 + ITEMS_PER_PAGE));
        }
    }
    const themeColor = "#002060";
    const redHighlight = "#C00000";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-d82398f25d815c44" + " " + "min-h-screen bg-[#f3f4f6] p-8 font-sans print:bg-white print:p-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "d82398f25d815c44",
                children: "@media print{@page{size:A4;margin:0}body{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}*{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Arial,sans-serif!important}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-d82398f25d815c44" + " " + "max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "jsx-d82398f25d815c44" + " " + "flex items-center gap-2 text-slate-500 hover:text-[#002060] transition font-bold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 148,
                                columnNumber: 21
                            }, this),
                            " กลับหน้ารายการ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                        lineNumber: 147,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-d82398f25d815c44" + " " + "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleDownloadPDF,
                                disabled: isDownloading,
                                className: "jsx-d82398f25d815c44" + " " + "bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition active:scale-95 disabled:bg-gray-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 153,
                                        columnNumber: 25
                                    }, this),
                                    " ",
                                    isDownloading ? 'กำลังสร้าง...' : 'ดาวน์โหลด PDF'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 152,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.print(),
                                className: "jsx-d82398f25d815c44" + " " + "bg-[#002060] hover:bg-blue-900 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm flex items-center gap-2 transition active:scale-95",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 156,
                                        columnNumber: 25
                                    }, this),
                                    " สั่งพิมพ์เอกสาร"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 155,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                        lineNumber: 151,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                lineNumber: 146,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "po-content-area",
                className: "jsx-d82398f25d815c44",
                children: pages.map((pageItems, pageIndex)=>{
                    const isLastPage = pageIndex === pages.length - 1;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            pageBreakAfter: 'always'
                        },
                        className: "jsx-d82398f25d815c44" + " " + "po-page w-[210mm] min-h-[296mm] mx-auto bg-[#ffffff] p-8 shadow-lg print:shadow-none print:w-[210mm] print:h-[296mm] print:overflow-hidden relative flex flex-col text-[12px] leading-snug text-[#000000] mb-8 print:mb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d82398f25d815c44" + " " + "mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d82398f25d815c44" + " " + "text-center mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                style: {
                                                    color: themeColor
                                                },
                                                className: "jsx-d82398f25d815c44" + " " + "text-[17px] font-bold mb-1",
                                                children: "บริษัท เอ็มเอส แทรค (ประเทศไทย) จํากัด (สำนักงานใหญ่)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 172,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-d82398f25d815c44" + " " + "text-[11px] font-medium text-[#000000] leading-relaxed",
                                                children: [
                                                    "717/63 หมู่ 5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำาเภอเมือง จังหวัดนครราชสีมา 30000",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                        className: "jsx-d82398f25d815c44"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 178,
                                                        columnNumber: 117
                                                    }, this),
                                                    "โทร. 044-300659 , 093-3254422 Email : mstrack.thailand@gmail.com www.smartgtechnology.com",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                        className: "jsx-d82398f25d815c44"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 179,
                                                        columnNumber: 130
                                                    }, this),
                                                    "เลขที่ประจําตัวผู้เสียภาษี 0305556002921"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 177,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 171,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d82398f25d815c44" + " " + "w-full text-left mb-0 pl-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: "/MSTrack_Logo_2.png",
                                            alt: "Company Logo",
                                            className: "jsx-d82398f25d815c44" + " " + "h-16 w-auto object-contain"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 185,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 184,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            backgroundColor: themeColor
                                        },
                                        className: "jsx-d82398f25d815c44" + " " + "w-full text-[#ffffff] text-center py-2 font-bold text-xl rounded-sm print:text-white mb-4",
                                        children: "ใบสั่งซื้อ (PURCHASE ORDER)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 188,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 170,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d82398f25d815c44" + " " + "flex justify-between mb-4 px-2 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderColor: themeColor
                                        },
                                        className: "jsx-d82398f25d815c44" + " " + "w-[35%] border-2 rounded-xl p-3 shadow-sm print:shadow-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "jsx-d82398f25d815c44" + " " + "w-full text-[11px] leading-relaxed",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "jsx-d82398f25d815c44",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "w-16 font-bold align-top",
                                                                children: "ผู้ขาย"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 205,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold text-slate-900",
                                                                children: po?.supplier_name || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 208,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 204,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top pt-1",
                                                                children: "ที่อยู่"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 211,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "whitespace-pre-wrap break-words text-slate-800 pt-1",
                                                                children: po?.supplier_full_address || po?.supplier_address || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 214,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 210,
                                                        columnNumber: 45
                                                    }, this),
                                                    (po?.supplier_tax_id || po?.supplier_branch) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top pt-1",
                                                                children: "Tax ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 219,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800 pt-1",
                                                                children: [
                                                                    po?.supplier_tax_id || "-",
                                                                    po?.supplier_branch && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-d82398f25d815c44" + " " + "ml-1 text-slate-500",
                                                                        children: [
                                                                            "(",
                                                                            po.supplier_branch,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                        lineNumber: 224,
                                                                        columnNumber: 81
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 222,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 218,
                                                        columnNumber: 94
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 203,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 202,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 199,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderColor: themeColor
                                        },
                                        className: "jsx-d82398f25d815c44" + " " + "w-[28%] border-2 rounded-xl p-3 shadow-sm print:shadow-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "jsx-d82398f25d815c44" + " " + "w-full text-[11px] leading-relaxed",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "jsx-d82398f25d815c44",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "w-20 font-bold align-top",
                                                                children: "ผู้ติดต่อ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 238,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po?.contact_person || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 241,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 237,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top",
                                                                children: "โทรศัพท์"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 244,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po?.supplier_phone || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 247,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 243,
                                                        columnNumber: 45
                                                    }, this),
                                                    po?.supplier_fax && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top",
                                                                children: "โทรสาร"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 250,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po.supplier_fax
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 253,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 249,
                                                        columnNumber: 66
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top pt-1",
                                                                children: "เครดิตเทอม"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 256,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800 pt-1",
                                                                children: po?.credit_terms || "เงินสด"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 259,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 255,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top",
                                                                children: "กำหนดส่ง"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 262,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po?.expected_date ? new Date(po.expected_date).toLocaleDateString('th-TH') : "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 266,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 261,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 236,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 235,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 232,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderColor: themeColor
                                        },
                                        className: "jsx-d82398f25d815c44" + " " + "w-[37%] border-2 rounded-xl p-3 shadow-sm print:shadow-none",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            className: "jsx-d82398f25d815c44" + " " + "w-full text-[11px] leading-relaxed",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "jsx-d82398f25d815c44",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "w-24 font-bold align-top",
                                                                children: "เลขที่ใบสั่งซื้อ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 279,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold text-slate-900",
                                                                children: po?.po_number || po?.doc_number || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 282,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 278,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top",
                                                                children: "วันที่สั่งซื้อ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 285,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po?.order_date ? new Date(po.order_date).toLocaleDateString('th-TH') : "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 288,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 284,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top",
                                                                children: "อ้างอิง QT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 291,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po?.quotation_ref || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 294,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 290,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top",
                                                                children: "อ้างอิง PR"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 297,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "text-slate-800",
                                                                children: po?.pr_ref || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 300,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 296,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    color: themeColor
                                                                },
                                                                className: "jsx-d82398f25d815c44" + " " + "font-bold align-top pt-1",
                                                                children: "สถานที่จัดส่ง"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 303,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "whitespace-pre-wrap break-words text-slate-800 pt-1",
                                                                children: po?.shipping_address || "สำนักงานใหญ่ (HQ)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 306,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 302,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 277,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 276,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 273,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 196,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d82398f25d815c44" + " " + "",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "jsx-d82398f25d815c44" + " " + "w-full border-collapse text-xs border-t border-r border-[#000000]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "jsx-d82398f25d815c44",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    backgroundColor: redHighlight
                                                },
                                                className: "jsx-d82398f25d815c44" + " " + "text-[#ffffff] text-center font-bold print:bg-[#C00000]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-l border-r border-b border-[#000000] py-1.5 w-12",
                                                        children: [
                                                            "ลำดับ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 323,
                                                                columnNumber: 122
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "No."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 323,
                                                                columnNumber: 128
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 323,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5 w-36",
                                                        children: [
                                                            "รหัสสินค้า",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 324,
                                                                columnNumber: 118
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "ITEM CODE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 324,
                                                                columnNumber: 124
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 324,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5",
                                                        children: [
                                                            "รายละเอียด",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 325,
                                                                columnNumber: 113
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "DESCRIPTION"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 325,
                                                                columnNumber: 119
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 325,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5 w-16",
                                                        children: [
                                                            "จํานวน",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 326,
                                                                columnNumber: 114
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "QTY"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 326,
                                                                columnNumber: 120
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 326,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5 w-16",
                                                        children: [
                                                            "หน่วย",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 327,
                                                                columnNumber: 113
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "UNIT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 327,
                                                                columnNumber: 119
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 327,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5 w-24",
                                                        children: [
                                                            "ราคา/หน่วย",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 328,
                                                                columnNumber: 118
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "UNIT PRICE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 328,
                                                                columnNumber: 124
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 328,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000] py-1.5 w-28",
                                                        children: [
                                                            "จํานวนเงิน",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-d82398f25d815c44"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 329,
                                                                columnNumber: 109
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-d82398f25d815c44" + " " + "font-normal text-[10px]",
                                                                children: "AMOUNT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 329,
                                                                columnNumber: 115
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 329,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 320,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 319,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "jsx-d82398f25d815c44" + " " + "text-[#000000] font-medium text-[13px]",
                                            children: [
                                                pageItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44" + " " + "align-top",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-l border-r border-[#000000] py-1.5 text-center",
                                                                children: idx + 1 + pageIndex * ITEMS_PER_PAGE
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 334,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1.5 px-2 text-center break-words",
                                                                children: item.product_code || item.item_code || "-"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 335,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1.5 px-2 leading-relaxed",
                                                                children: item.product_name || item.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 336,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1.5 text-center font-bold",
                                                                children: item.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 337,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1.5 text-center",
                                                                children: item.unit || "ชุด"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 338,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1.5 text-right px-2",
                                                                children: parseFloat(item.unit_price).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 339,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-b-0 py-1.5 text-right px-2 font-bold",
                                                                children: parseFloat(item.total_price || item.total || 0).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 342,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 333,
                                                        columnNumber: 71
                                                    }, this)),
                                                [
                                                    ...Array(Math.max(0, ITEMS_PER_PAGE - pageItems.length))
                                                ].map((_, i_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-d82398f25d815c44",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-l border-r border-[#000000] py-1 h-7"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 114
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 166
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 218
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 270
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 322
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-d82398f25d815c44" + " " + "py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                lineNumber: 348,
                                                                columnNumber: 374
                                                            }, this)
                                                        ]
                                                    }, `empty-${i_1}`, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 347,
                                                        columnNumber: 117
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 332,
                                            columnNumber: 37
                                        }, this),
                                        isLastPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                                            className: "jsx-d82398f25d815c44",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-d82398f25d815c44" + " " + "border-t border-[#000000]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            colSpan: 5,
                                                            rowSpan: 3,
                                                            className: "jsx-d82398f25d815c44" + " " + "border-l border-r border-b border-[#000000] align-top text-left px-4 py-3 text-[11px]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        color: themeColor
                                                                    },
                                                                    className: "jsx-d82398f25d815c44" + " " + "font-bold mb-2",
                                                                    children: "หมายเหตุ/เงื่อนไขเพิ่มเติม (Remarks):"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                    lineNumber: 356,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-d82398f25d815c44" + " " + "whitespace-pre-wrap min-h-[80px] leading-relaxed text-slate-800",
                                                                    children: po?.remarks || "1. กรุณาส่งสินค้าตามกำหนดเวลา\n2. โปรดแนบสำเนาใบสั่งซื้อมาพร้อมกับใบส่งสินค้า / ใบแจ้งหนี้ทุกครั้ง"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                    lineNumber: 359,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 355,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5 pl-2 font-bold text-[11px]",
                                                            children: "รวมเป็นเงิน"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 363,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000] py-1.5 text-right pr-2 font-medium text-[12px]",
                                                            children: parseFloat(po?.subtotal || po?.total_amount || 0).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 368,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 354,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-d82398f25d815c44",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-1.5 pl-2 font-bold text-[11px]",
                                                            children: "ภาษีมูลค่าเพิ่ม 7%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 375,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000] py-1.5 text-right pr-2 font-medium text-[12px]",
                                                            children: parseFloat(po?.vat_amount || 0).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 380,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 374,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-d82398f25d815c44",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                backgroundColor: redHighlight
                                                            },
                                                            className: "jsx-d82398f25d815c44" + " " + "border-r border-b border-[#000000] py-2 pl-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]",
                                                            children: "ยอดสุทธิ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 387,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                backgroundColor: redHighlight
                                                            },
                                                            className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000] py-2 text-right pr-2 font-bold text-[15px] text-[#ffffff] print:bg-[#C00000]",
                                                            children: parseFloat(po?.grand_total || po?.total_amount || 0).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 392,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 386,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000]",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-d82398f25d815c44" + " " + "border-l border-r text-center py-2 font-bold text-[12px]",
                                                        children: [
                                                            "( ",
                                                            THBText(po?.grand_total || po?.total_amount || 0),
                                                            " )"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                        lineNumber: 401,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 400,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 353,
                                            columnNumber: 52
                                        }, this),
                                        !isLastPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                                            className: "jsx-d82398f25d815c44",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "jsx-d82398f25d815c44" + " " + "border-t border-[#000000]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 7,
                                                    className: "jsx-d82398f25d815c44"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 409,
                                                    columnNumber: 102
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                lineNumber: 409,
                                                columnNumber: 60
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 409,
                                            columnNumber: 53
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                    lineNumber: 318,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 317,
                                columnNumber: 29
                            }, this),
                            isLastPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d82398f25d815c44" + " " + "mt-6 grid grid-cols-3 gap-4 text-[11px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderColor: themeColor
                                        },
                                        className: "jsx-d82398f25d815c44" + " " + "border-2 rounded-xl p-4 flex flex-col justify-end h-28 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-d82398f25d815c44" + " " + "w-full text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000] w-4/5 mx-auto mb-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 419,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-d82398f25d815c44" + " " + "flex justify-between items-center px-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-d82398f25d815c44" + " " + "text-[10px] text-gray-500",
                                                            children: "วันที่ ..............................."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 421,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-d82398f25d815c44" + " " + "text-center font-bold",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-d82398f25d815c44",
                                                                    children: "ผู้จัดทำเอกสาร"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-d82398f25d815c44" + " " + "text-[9px] font-normal",
                                                                    children: "(Prepared By)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                    lineNumber: 426,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 422,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 420,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 418,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 415,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-d82398f25d815c44"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 432,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderColor: themeColor
                                        },
                                        className: "jsx-d82398f25d815c44" + " " + "border-2 rounded-xl p-4 flex flex-col justify-end h-28 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-d82398f25d815c44" + " " + "w-full text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-d82398f25d815c44" + " " + "border-b border-[#000000] w-4/5 mx-auto mb-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 438,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-d82398f25d815c44" + " " + "flex justify-between items-center px-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-d82398f25d815c44" + " " + "text-[10px] text-gray-500",
                                                            children: "วันที่ ..............................."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 440,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-d82398f25d815c44" + " " + "text-center font-bold",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-d82398f25d815c44",
                                                                    children: "ผู้มีอำนาจลงนาม"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                    lineNumber: 444,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-d82398f25d815c44" + " " + "text-[9px] font-normal",
                                                                    children: "(Authorized Signature)"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                                    lineNumber: 445,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                            lineNumber: 441,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                                    lineNumber: 439,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                            lineNumber: 437,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                        lineNumber: 434,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 414,
                                columnNumber: 43
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d82398f25d815c44" + " " + "grow"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 450,
                                columnNumber: 42
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-d82398f25d815c44" + " " + "absolute bottom-[5mm] right-[10mm] text-[9px] text-gray-500",
                                children: [
                                    "หน้า (Page) ",
                                    pageIndex + 1,
                                    " / ",
                                    pages.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                                lineNumber: 452,
                                columnNumber: 29
                            }, this)
                        ]
                    }, pageIndex, true, {
                        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                        lineNumber: 165,
                        columnNumber: 16
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
                lineNumber: 162,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/purchasing/print/[id]/page.jsx",
        lineNumber: 135,
        columnNumber: 10
    }, this);
}
_s(PrintPOPage, "qxaTF9jW3fvpjAQp0e+ux45YQ98=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c1 = PrintPOPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "THBText");
__turbopack_context__.k.register(_c1, "PrintPOPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_purchasing_print_%5Bid%5D_page_jsx_4dd20283._.js.map