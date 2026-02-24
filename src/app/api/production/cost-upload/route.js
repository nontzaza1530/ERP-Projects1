import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { minioClient } from '../../../../lib/minio'; 

const BUCKET_NAME = 'erp'; 

export async function POST(request) {
  let connection; 
  
  try {
    const data = await request.formData();
    
    // 1. รับข้อมูล Form
    const projectId = data.get('project_id');
    const costType = data.get('cost_type');
    const description = data.get('description');
    const amount = data.get('amount');
    const quantity = data.get('quantity') || 1;
    const productId = data.get('product_id'); 
    const recordedBy = data.get('recorded_by');
    const recordedDate = data.get('recorded_date');
    
    // 2. จัดการไฟล์รูป (Upload to MinIO)
    const file = data.get('evidence_file');
    let fileUrl = null;

    if (file && file !== 'undefined' && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const subFolder = costType || 'general';
      const timestamp = Date.now();
      const objectName = `costs/${subFolder}/${timestamp}-${file.name.replace(/\s/g, '_')}`;
      
      await minioClient.putObject(BUCKET_NAME, objectName, buffer, file.size, {
        'Content-Type': file.type
      });

      const publicUrl = 'http://smartg.trueddns.com:29454'; 
      fileUrl = `${publicUrl}/${BUCKET_NAME}/${objectName}`;
    }

    // ==========================================
    // 3. จัดการ Database (ใช้ Transaction)
    // ==========================================
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 3.1 บันทึกลงตาราง project_costs ตามโครงสร้างเดิมของคุณเป๊ะๆ
    await connection.query(
      `INSERT INTO project_costs 
      (project_id, cost_type, description, amount, quantity, recorded_by, recorded_date, evidence_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [projectId, costType, description, amount, quantity, recordedBy, recordedDate, fileUrl]
    );

    // 3.2 ระบบตัดสต็อกอัตโนมัติ (หัวใจสำคัญ!)
    if (costType === 'material' && productId) {
        const [stockCheck] = await connection.query('SELECT quantity FROM products WHERE id = ?', [productId]);
        
        if (stockCheck.length > 0) {
            const currentStock = stockCheck[0].quantity;
            const deductQty = parseInt(quantity, 10);

            if (currentStock < deductQty) {
                throw new Error(`สินค้าในคลังมีไม่เพียงพอ (คงเหลือ: ${currentStock} ชิ้น)`);
            }

            // สั่งตัดสต็อก
            await connection.query(
                'UPDATE products SET quantity = quantity - ? WHERE id = ?',
                [deductQty, productId]
            );
        }
    }

    // ❌ เอาการ insert ลง project_logs ออกแล้ว จะได้ไม่ Error ครับ!

    // ยืนยันการบันทึก
    await connection.commit();

    return NextResponse.json({ success: true, url: fileUrl, message: 'บันทึกข้อมูลและตัดสต็อกเรียบร้อย' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Cost Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}