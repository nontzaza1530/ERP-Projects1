import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { minioClient } from '../../../../lib/minio'; 

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

      const subFolder = costType || 'general';
      const timestamp = Date.now();
      const objectName = `costs/${subFolder}/${timestamp}-${file.name.replace(/\s/g, '_')}`;
      
      // ส่งรูปเข้าถังเก็บ (Bucket) ใน MinIO
      await minioClient.putObject(BUCKET_NAME, objectName, buffer, file.size, {
        'Content-Type': file.type
      });

      // -----------------------------------------------------------------------
      // ✅ แก้ไขจุดนี้: เปลี่ยนจาก localhost เป็น DDNS ของคุณ
      // เพื่อให้ลิงก์เหมือนกับตาราง reimbursements และกดดูได้จริง
      // -----------------------------------------------------------------------
      const publicUrl = 'http://smartg.trueddns.com:29454'; 

      // สร้างลิงก์ที่ถูกต้อง
      fileUrl = `${publicUrl}/${BUCKET_NAME}/${objectName}`;
    }

    // 3. บันทึกลง Database
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