import { Geist, Geist_Mono } from "next/font/google";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
    subsets: ["latin", "thai"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-kanit",
    display: "swap",
});

export const metadata = {
  title: "SMART G | ERP System",
  description: "ระบบบริหารจัดการทรัพยากรองค์กร",
  icons: {
        // แก้ไขนามสกุลไฟล์จาก .png เป็น .jpg ให้ตรงกับไฟล์ที่มี
        icon: "/SmartG.svg", 
        shortcut: "/SmartG.svg",
        apple: "/SmartG.svg",
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={kanit.variable}>
      <body
        className={`${kanit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
