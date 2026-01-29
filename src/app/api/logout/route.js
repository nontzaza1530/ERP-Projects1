import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // 1. เรียกใช้ตัวจัดการ Cookie ของ Server
  const cookieStore = await cookies();

  // 2. สั่งลบ Token ทิ้ง (Server ทำได้แน่นอน 100%)
  cookieStore.delete('token');
  
  // (กันเหนียว) เซ็ตทับให้หมดอายุทันที
  cookieStore.set('token', '', { maxAge: 0, path: '/' });

  return NextResponse.json({ success: true, message: "Logged out" });
}