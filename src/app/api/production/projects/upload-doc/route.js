import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const projectId = formData.get('projectId');
        const uploadedBy = formData.get('uploaded_by');

        if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

        // 1. จัดการบันทึกไฟล์ลงเครื่อง
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // 2. เชื่อมต่อฐานข้อมูล
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        // ✅ แก้ไข: ปรับจำนวนเครื่องหมาย ? และตัวแปรให้ตรงกับ 6 คอลัมน์ในตารางจริงของคุณ
        // (project_id, file_name, file_path, file_type, file_size, uploaded_by)
        await connection.execute(
            'INSERT INTO project_documents (project_id, file_name, file_path, file_type, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
            [
                projectId, 
                file.name, 
                `/uploads/${filename}`, 
                file.type, 
                file.size, // ✅ ส่งค่าขนาดไฟล์ไปบันทึกตามรูปโครงสร้างตาราง
                uploadedBy || 'Admin'
            ]
        );

        await connection.end();
        return NextResponse.json({ message: "Upload success" });

    } catch (error) {
        console.error("UPLOAD ERROR:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}