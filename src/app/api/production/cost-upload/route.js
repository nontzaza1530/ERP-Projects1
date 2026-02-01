import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
// ✅ แก้ 1: Import จากไฟล์ minio.js ที่คุณมีอยู่แล้ว
// (ถ้าในไฟล์ minio.js คุณใช้ export default ให้เอาวงเล็บปีกกา {} ออกนะครับ)
import { minioClient } from '../../../../lib/minio'; 

// ✅ แก้ 2: ใช้ชื่อ Bucket ว่า 'erp' ตามที่คุณตั้ง
const BUCKET_NAME = 'erp'; 

export async function POST(request) {
  try {
    const data = await request.formData();
    
    // 1. รับข้อมูล Form
    const projectId = data.get('project_id');
    const costType = data.get('cost_type');
    const description = data.get('description');
    const amount = data.get('amount');
    const quantity = data.get('quantity');
    const recordedBy = data.get('recorded_by');
    const recordedDate = data.get('recorded_date');
    
    // 2. จัดการไฟล์รูป (Upload to MinIO)
    const file = data.get('evidence_file');
    let fileUrl = null;

    if (file && file !== 'undefined') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // ตั้งชื่อไฟล์: costs/ประเภท/เวลา-ชื่อไฟล์
      const subFolder = costType || 'general';
      const timestamp = Date.now();
      const objectName = `costs/${subFolder}/${timestamp}-${file.name.replace(/\s/g, '_')}`;
      
      // ส่งเข้า MinIO
      await minioClient.putObject(BUCKET_NAME, objectName, buffer, file.size, {
        'Content-Type': file.type
      });

      // สร้าง Link URL
      const minioConfig = minioClient.transport; // ดึง config ที่คุณตั้งไว้ใน minio.js
      const protocol = minioConfig.useSSL ? 'https' : 'http';
      const host = minioConfig.endPoint;
      const port = minioConfig.port ? `:${minioConfig.port}` : '';
      
      // URL ผลลัพธ์: http://localhost:9000/erp/costs/material/xxxx.jpg
      fileUrl = `${protocol}://${host}${port}/${BUCKET_NAME}/${objectName}`;
    }

    // 3. บันทึกลง Database (ใช้ชื่อตาราง project_costs)
    await pool.query(
      `INSERT INTO project_costs 
      (project_id, cost_type, description, amount, quantity, recorded_by, recorded_date, evidence_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [projectId, costType, description, amount, quantity, recordedBy, recordedDate, fileUrl]
    );

    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}