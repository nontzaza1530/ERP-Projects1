module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/accounting/invoices/[id]/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InvoiceViewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
// ✅ Import ครบถ้วน
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
'use client';
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
function InvoiceViewPage() {
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [invoice, setInvoice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // ✅ ประกาศ State กัน Error
    const [isDownloading, setIsDownloading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!id) return;
        fetch(`/api/accounting/invoices/${id}`).then((res)=>res.json()).then((data)=>{
            if (data.invoice) {
                setInvoice(data.invoice);
                setItems(data.items);
            }
        }).catch((err)=>console.error(err)).finally(()=>setLoading(false));
    }, [
        id
    ]);
    // --- 📥 ฟังก์ชันดาวน์โหลด PDF ---
    const handleDownloadPDF = async ()=>{
        setIsDownloading(true);
        try {
            const html2pdf = (await __turbopack_context__.A("[project]/node_modules/html2pdf.js/dist/html2pdf.js [app-ssr] (ecmascript, async loader)")).default;
            const element = document.getElementById('invoice-content-area');
            const opt = {
                margin: 0,
                filename: `invoice-${invoice.doc_number}.pdf`,
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    backgroundColor: '#ffffff' // ✅ บังคับพื้นหลังขาว แก้ปัญหา Lab Color
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("PDF Error:", error);
            alert("เกิดข้อผิดพลาดในการสร้าง PDF");
        } finally{
            setIsDownloading(false);
        }
    };
    if (loading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10 text-center",
        children: "กำลังโหลดเอกสาร..."
    }, void 0, false, {
        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
        lineNumber: 114,
        columnNumber: 25
    }, this);
    if (!invoice) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10 text-center text-red-500",
        children: "ไม่พบเอกสาร"
    }, void 0, false, {
        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
        lineNumber: 115,
        columnNumber: 26
    }, this);
    const pages = [];
    if (items.length === 0) {
        pages.push([]);
    } else {
        for(let i = 0; i < items.length; i += ITEMS_PER_PAGE){
            pages.push(items.slice(i, i + ITEMS_PER_PAGE));
        }
    }
    // กำหนดสี Theme (ใช้ Hex Code ตรงๆ เพื่อความชัวร์)
    const themeColor = "#002060";
    const redHighlight = "#C00000";
    return(// ใช้ bg-[#f3f4f6] แทน bg-gray-100 เพื่อเลี่ยง variable
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-e445f2f4d1e9cf31" + " " + "min-h-screen bg-[#f3f4f6] p-8 font-sans print:bg-white print:p-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "e445f2f4d1e9cf31",
                children: "@media print{@page{size:A4;margin:0}body{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}*{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Arial,sans-serif!important}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-e445f2f4d1e9cf31" + " " + "max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex items-center gap-2 text-[#4b5563] hover:text-[#000000]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 145,
                                columnNumber: 21
                            }, this),
                            " กลับหน้ารายการ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                        lineNumber: 144,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleDownloadPDF,
                                disabled: isDownloading,
                                className: "jsx-e445f2f4d1e9cf31" + " " + "bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded shadow flex items-center gap-2 disabled:bg-[#9ca3af]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 153,
                                        columnNumber: 25
                                    }, this),
                                    " ",
                                    isDownloading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 148,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>window.print(),
                                className: "jsx-e445f2f4d1e9cf31" + " " + "bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded shadow flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 159,
                                        columnNumber: 25
                                    }, this),
                                    " สั่งพิมพ์"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 155,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                        lineNumber: 147,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                lineNumber: 143,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "invoice-content-area",
                className: "jsx-e445f2f4d1e9cf31",
                children: pages.map((pageItems, pageIndex)=>{
                    const isLastPage = pageIndex === pages.length - 1;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            pageBreakAfter: 'always'
                        },
                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-[210mm] min-h-[296mm] mx-auto bg-[#ffffff] p-8 shadow-lg print:shadow-none print:w-[210mm] print:h-[296mm] print:overflow-hidden relative flex flex-col text-[12px] leading-snug text-[#000000] mb-8 print:mb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e445f2f4d1e9cf31" + " " + "mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: themeColor
                                        },
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "text-center mb-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "text-xl font-bold",
                                                children: "บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด (สำนักงานใหญ่)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 180,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "text-sm",
                                                children: [
                                                    "717/63 หมู่5 ถนนเพชรมาตุคลา ตำบลหัวทะเล อำเภอเมือง จังหวัดนครราชสีมา 30000",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                        className: "jsx-e445f2f4d1e9cf31"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 182,
                                                        columnNumber: 115
                                                    }, this),
                                                    "โทร Tel. 044-300659, 093-3254422, 0881143656 Email: tanapolma@gmail.com www.smartgtechnology.com"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 181,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 179,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-full text-left mb-0 pl-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: themeColor
                                                },
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "text-sm mb-5",
                                                children: "เลขที่ประจำตัวผู้เสียภาษี 0305556002921"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 187,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "/MSTrack_Logo_2.png",
                                                alt: "Company Logo",
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "h-16 w-auto object-contain"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 190,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 186,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            backgroundColor: themeColor
                                        },
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-full text-[#ffffff] text-center py-2 font-bold text-xl print:bg-[#002060] print:text-white mb-0",
                                        children: "ใบแจ้งหนี้ (INVOICE)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 193,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 178,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex justify-between mb-1 px-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-[55%]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-24 font-bold",
                                                        children: "ชื่อลูกค้า"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 201,
                                                        columnNumber: 64
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1 font-bold",
                                                        children: invoice.customer_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 201,
                                                        columnNumber: 142
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 201,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-24 font-bold",
                                                        children: "ที่อยู่"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 202,
                                                        columnNumber: 64
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1 whitespace-normal wrap-break-word max-w-[300px] leading-relaxed",
                                                        children: invoice.customer_address
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 202,
                                                        columnNumber: 139
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 202,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-24 font-bold",
                                                        children: "เลขผู้เสียภาษี"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 205,
                                                        columnNumber: 59
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1",
                                                        children: invoice.customer_tax_id || '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 205,
                                                        columnNumber: 141
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 205,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 200,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-[40%]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-32 font-bold",
                                                        children: "เลขที่ใบแจ้งหนี้"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 208,
                                                        columnNumber: 64
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1",
                                                        children: invoice.doc_number
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 208,
                                                        columnNumber: 148
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 208,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-32 font-bold",
                                                        children: "วันที่"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 209,
                                                        columnNumber: 64
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1",
                                                        children: new Date(invoice.doc_date).toLocaleDateString('th-TH')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 209,
                                                        columnNumber: 138
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 209,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex mb-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-32 font-bold",
                                                        children: "เงื่อนไขการชำระ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 210,
                                                        columnNumber: 64
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1",
                                                        children: "เงินสด / เครดิต 30 วัน"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 210,
                                                        columnNumber: 147
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 210,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "flex",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "w-32 font-bold",
                                                        children: "วันครบกำหนด"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 211,
                                                        columnNumber: 59
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex-1",
                                                        children: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('th-TH') : '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 211,
                                                        columnNumber: 138
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 211,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 207,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 199,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e445f2f4d1e9cf31" + " " + "",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "jsx-e445f2f4d1e9cf31" + " " + "w-full border-collapse text-xs border-t border-r border-[#000000]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "jsx-e445f2f4d1e9cf31",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    backgroundColor: themeColor
                                                },
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "text-[#ffffff] text-center font-bold print:bg-[#002060]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-l border-r border-[#ffffff] py-1.5 w-24",
                                                        children: [
                                                            "รหัสสินค้า",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 221,
                                                                columnNumber: 118
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "font-normal text-[10px]",
                                                                children: "ITEM CODE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 221,
                                                                columnNumber: 124
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 221,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#ffffff] py-1.5",
                                                        children: [
                                                            "รายละเอียด",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 222,
                                                                columnNumber: 104
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "font-normal text-[10px]",
                                                                children: "DESCRIPTION"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 222,
                                                                columnNumber: 110
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 222,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#ffffff] py-1.5 w-20",
                                                        children: [
                                                            "จำนวน",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 223,
                                                                columnNumber: 104
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "font-normal text-[10px]",
                                                                children: "QUANTITY"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 223,
                                                                columnNumber: 110
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 223,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#ffffff] py-1.5 w-16",
                                                        children: [
                                                            "หน่วย",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 224,
                                                                columnNumber: 104
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "font-normal text-[10px]",
                                                                children: "UNIT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 224,
                                                                columnNumber: 110
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 224,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#ffffff] py-1.5 w-24",
                                                        children: [
                                                            "ราคาต่อหน่วย",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 225,
                                                                columnNumber: 111
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "font-normal text-[10px]",
                                                                children: "UNIT PRICE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 225,
                                                                columnNumber: 117
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 225,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "py-1.5 w-32",
                                                        children: [
                                                            "จำนวนเงิน",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 226,
                                                                columnNumber: 82
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "font-normal text-[10px]",
                                                                children: "AMOUNT"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 226,
                                                                columnNumber: 88
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 226,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 220,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                            lineNumber: 219,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "jsx-e445f2f4d1e9cf31" + " " + "text-[#000000] font-medium",
                                            children: [
                                                pageItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "align-top text-[13px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-l border-r border-[#000000] py-1 text-center",
                                                                children: "A101"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 232,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1 px-2 leading-relaxed",
                                                                children: item.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 233,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1 text-center",
                                                                children: item.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 237,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1 text-center",
                                                                children: "ชุด"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 240,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1 text-right px-2",
                                                                children: (parseFloat(item.total) / (item.quantity || 1)).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 242,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "py-1 text-right px-2 font-bold",
                                                                children: parseFloat(item.total).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 245,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 231,
                                                        columnNumber: 45
                                                    }, this)),
                                                [
                                                    ...Array(Math.max(0, ITEMS_PER_PAGE - pageItems.length))
                                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-l border-r border-[#000000] py-1 h-6"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 253,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 254,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 255,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 256,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 257,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "py-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 258,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, `empty-${i}`, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 252,
                                                        columnNumber: 45
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                            lineNumber: 229,
                                            columnNumber: 37
                                        }, this),
                                        isLastPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                                            className: "jsx-e445f2f4d1e9cf31",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-e445f2f4d1e9cf31" + " " + "border-t border-[#000000]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            colSpan: 4,
                                                            rowSpan: 3,
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-b border-[#000000] align-middle text-center px-4 font-bold italic text-[11px]",
                                                            children: [
                                                                "( ",
                                                                THBText(invoice.grand_total),
                                                                " )"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 268,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-b border-[#000000] py-1 pl-2 font-bold text-[11px]",
                                                            children: "รวมเป็นเงิน"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 271,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "border-b border-[#000000] py-1 text-right pr-2 font-medium text-[11px]",
                                                            children: parseFloat(invoice.subtotal).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 274,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                    lineNumber: 266,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-e445f2f4d1e9cf31",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                color: themeColor
                                                            },
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-b border-[#000000] py-1 pl-2 font-bold text-[11px]",
                                                            children: "ภาษีมูลค่าเพิ่ม 7%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 279,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "border-b border-[#000000] py-1 text-right pr-2 font-medium text-[11px]",
                                                            children: parseFloat(invoice.vat_amount).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 282,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                    lineNumber: 278,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: "jsx-e445f2f4d1e9cf31",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                backgroundColor: redHighlight
                                                            },
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] py-2 pl-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]",
                                                            children: "ยอดสุทธิ"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 287,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                backgroundColor: redHighlight
                                                            },
                                                            className: "jsx-e445f2f4d1e9cf31" + " " + "py-2 text-right pr-2 font-bold text-sm text-[#ffffff] print:bg-[#C00000]",
                                                            children: parseFloat(invoice.grand_total).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                            lineNumber: 290,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                    lineNumber: 286,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                            lineNumber: 265,
                                            columnNumber: 41
                                        }, this),
                                        !isLastPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                                            className: "jsx-e445f2f4d1e9cf31",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-t border-[#000000]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    colSpan: 6,
                                                    className: "jsx-e445f2f4d1e9cf31"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                    lineNumber: 298,
                                                    columnNumber: 90
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 298,
                                                columnNumber: 48
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                            lineNumber: 298,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                    lineNumber: 218,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 216,
                                columnNumber: 29
                            }, this),
                            isLastPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e445f2f4d1e9cf31" + " " + "border border-t-0 border-[#000000] mt-0 text-[#000000]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-b border-[#000000] p-1 flex justify-between items-start",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "space-y-0 text-[12px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            color: themeColor
                                                        },
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "font-bold text-[#000000] border-b border-[#000000] inline-block mb-1",
                                                        children: "ช่องทางการชำระ ประเภทบัญชีออมทรัพย์"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 308,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: [
                                                            "ชื่อบัญชี ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "",
                                                                children: "บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 309,
                                                                columnNumber: 58
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 309,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: [
                                                            "ธนาคารกสิกรไทย ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "",
                                                                children: "522-2-23478-8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 310,
                                                                columnNumber: 63
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 310,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: [
                                                            "ธนาคารไทยพาณิชย์ ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "",
                                                                children: "468-084384-8"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 311,
                                                                columnNumber: 65
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 311,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: "หลังชำระเรียบร้อย กรุณาติดต่อฝ่ายบัญชี/การเงิน 044-300659"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 312,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: "หรือเพิ่มเพื่อนทางไลน์ ID : 5477208"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 313,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 307,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "text-right space-y-5 text-[15px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + " text-[#dc2626]",
                                                        children: 'กรุณาส่ง "ใบหัก ณ ที่จ่าย" พร้อมหลักฐานการชำระเงิน'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 316,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "flex justify-end items-center gap-19 text-[#dc2626]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31",
                                                                children: "หักภาษี ณ ที่จ่าย/TAX (3%)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 318,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-e445f2f4d1e9cf31" + " " + "text-red w-20 text-right",
                                                                children: (parseFloat(invoice.subtotal) * 0.03).toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 319,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 317,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 315,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 306,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-e445f2f4d1e9cf31" + " " + "grid grid-cols-3 text-center text-[10px]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] p-4 pb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "mb-8",
                                                        children: [
                                                            "ได้รับมอบสินค้าตามจำนวนรายการและราคาข้างต้นไว้",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                                                className: "jsx-e445f2f4d1e9cf31"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                                lineNumber: 325,
                                                                columnNumber: 111
                                                            }, this),
                                                            "ครบถ้วน ในสภาพเรียบร้อย ถูกต้องตามวัตถุประสงค์ทุกประการ"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 325,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-b border-[#000000] h-6 w-3/4 mx-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 326,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "mt-1",
                                                        children: "ผู้รับสินค้า / Received By"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 327,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: "วันที่ ...../...../....."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 328,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 324,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "border-r border-[#000000] p-4 pb-2 flex flex-col justify-end",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-b border-[#000000] h-6 w-3/4 mx-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 331,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "mt-1",
                                                        children: "ผู้วางบิล / Invoiced By"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 332,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: "วันที่ ...../...../....."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 333,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 330,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-e445f2f4d1e9cf31" + " " + "p-4 pb-2 flex flex-col justify-end",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "mb-15",
                                                        children: "ในนาม บริษัท เอ็มเอส แทรค (ประเทศไทย) จำกัด"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 336,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "border-b border-[#000000] h-6 w-3/4 mx-auto"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 337,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31" + " " + "mt-1",
                                                        children: "ลายเซ็นต์ผู้มีอำนาจลงนาม"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 338,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-e445f2f4d1e9cf31",
                                                        children: "วันที่ ...../...../....."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                        lineNumber: 339,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                                lineNumber: 335,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                        lineNumber: 323,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 305,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-e445f2f4d1e9cf31" + " " + "grow"
                            }, void 0, false, {
                                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                                lineNumber: 344,
                                columnNumber: 33
                            }, this)
                        ]
                    }, pageIndex, true, {
                        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                        lineNumber: 170,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
                lineNumber: 165,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/accounting/invoices/[id]/page.jsx",
        lineNumber: 132,
        columnNumber: 9
    }, this));
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6f0c7dea._.js.map