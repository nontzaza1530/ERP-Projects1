'use client';

// แนะนำให้เปลี่ยนวิธี import เป็นแบบนี้ (ถ้าคุณย้ายไฟล์แล้ว)
// import Dashboard from "@/components/Dashboard"; 

// แต่ถ้าคุณยังใช้โครงสร้างเดิม โค้ดนี้ก็ทำงานได้ครับ
import DashboardContent from "@/app/Dashboard/page"; 

export default function RootPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
       {/* หน้านี้จะแสดงผลก็ต่อเมื่อ Login ผ่าน Middleware มาแล้วเท่านั้น 
          ดังนั้นมั่นใจได้เลยว่าคนเห็นหน้านี้คือคนที่มีสิทธิ์แล้ว
       */}
      <DashboardContent />
    </div>
  );
}