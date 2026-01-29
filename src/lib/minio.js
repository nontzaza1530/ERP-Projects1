import * as Minio from 'minio';

// การตั้งค่าเชื่อมต่อ (ตามที่คุณเข้าหน้าเว็บ MinIO ได้)
export const minioClient = new Minio.Client({
  endPoint: '192.168.1.76',      // ถ้าอยู่เครื่องเดียวกันใช้ localhost
  port: 9000,                 // Port API ของ MinIO (ไม่ใช่ Console 9001 นะ)
  useSSL: false, 
  accessKey: 'smartg',    // ⚠️ เช็ค User ที่คุณใช้ login
  secretKey: 'StrongPass123!'     // ⚠️ เช็ค Password ที่คุณใช้ login
});

export const BUCKET_NAME = 'erp'; // ชื่อ Bucket ตามรูปของคุณ