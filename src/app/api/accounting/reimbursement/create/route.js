import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { minioClient } from '../../../../../lib/minio';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // 1. รับข้อมูล Text
    const title = formData.get('title');
    const amount = formData.get('amount');
    const expenseDate = formData.get('date');
    const description = formData.get('description');
    const userId = 1; // ⚠️ ของจริงต้องดึงจาก Session/Token

    // 2. รับไฟล์รูปภาพ (หลายรูป)
    const files = formData.getAll('files');
    const bucketName = 'reimbursement-slips'; // ชื่อ Bucket
    const uploadedUrls = []; // เตรียมไว้เก็บลิงก์

    // 3. วนลูปอัปโหลดขึ้น MinIO
    // ⚠️ ถ้ายังเชื่อม MinIO ไม่ได้ ให้ข้าม loop นี้ไป แล้ว push dummy url แทน
    for (const file of files) {
        if (file instanceof File) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `slip-${Date.now()}-${file.name}`; // ตั้งชื่อไม่ให้ซ้ำ

            // เช็คและสร้าง Bucket ถ้ายังไม่มี
            const bucketExists = await minioClient.bucketExists(bucketName).catch(()=>false);
            if (!bucketExists) await minioClient.makeBucket(bucketName).catch(()=>{});

            // อัปโหลดไฟล์
            await minioClient.putObject(bucketName, fileName, buffer, file.size);

            // สร้าง URL (ปรับตาม IP จริงของคุณ)
            const url = `http://smartg.trueddns.com:29454/${bucketName}/${fileName}`;
            uploadedUrls.push(url);
        }
    }

    // 4. บันทึกลง MySQL (รวมลิงก์เป็น JSON ก้อนเดียว)
    const connection = await pool.getConnection();
    await connection.query(
      `INSERT INTO reimbursements 
       (user_id, title, amount, expense_date, description, slip_images, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        userId, 
        title, 
        amount, 
        expenseDate, 
        description, 
        JSON.stringify(uploadedUrls) // ✅ หัวใจสำคัญ: แปลง Array เป็น JSON String
      ]
    );
    connection.release();

    return NextResponse.json({ success: true, message: 'ส่งเรื่องเบิกสำเร็จ' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}