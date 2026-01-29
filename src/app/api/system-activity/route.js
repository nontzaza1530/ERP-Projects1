import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import pool from '../../lib/db';

export async function GET() {
  // เช็ค Token นิดหน่อยว่ามีสิทธิ์ไหม (ข้ามไปก่อนก็ได้ถ้าเน้นเร็ว)
  
  try {
    // ✅ Query ข้อมูล Activity ล่าสุด 20 รายการ ของ "ทุกคน"
    // JOIN ตาราง users เพื่อเอาชื่อคนทำมาโชว์ด้วย
    const sql = `
      SELECT 
        a.id, 
        a.type, 
        a.title, 
        a.status, 
        a.created_at,
        u.username,
        u.role
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC 
      LIMIT 20
    `;
    
    const [rows] = await pool.query(sql);

    // จัด Format วันที่และเวลา
    const activities = rows.map(row => {
        const dateObj = new Date(row.created_at);
        const today = new Date();
        const isToday = dateObj.getDate() === today.getDate() && dateObj.getMonth() === today.getMonth();
        
        return {
            id: row.id,
            type: row.type, 
            title: row.title,
            // ✅ เพิ่มชื่อคนทำลงไป
            user: row.username || 'Unknown', 
            role: row.role,
            time: dateObj.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
            date: isToday ? 'วันนี้' : dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
            status: row.status
        };
    });

    return NextResponse.json(activities);

  } catch (error) {
    console.error("System Activity Error:", error);
    return NextResponse.json([]);
  }
}