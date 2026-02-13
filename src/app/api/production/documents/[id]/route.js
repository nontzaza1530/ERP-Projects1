import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(req, { params }) {
    try {
        // ✅ 1. แก้จุดตาย Next.js 15: ต้อง await params ก่อนเสมอ
        const resolvedParams = await params;
        const { id } = resolvedParams;

        if (!id) {
            return NextResponse.json({ error: "Document ID is missing" }, { status: 400 });
        }

        console.log("🗑️ Deleting Document ID:", id);

        // ✅ 2. เชื่อมต่อฐานข้อมูล (ใช้ Config กันเหนียวแบบเดียวกับ GET/POST)
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'erp_project',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            connectTimeout: 10000
        });

        // 3. หาชื่อไฟล์เพื่อลบไฟล์จริงออกจากเครื่อง
        const [rows] = await connection.execute('SELECT file_path FROM project_documents WHERE id = ?', [id]);
        
        if (rows.length > 0) {
            const relativePath = rows[0].file_path; 
            // แปลง Path ให้ถูกต้องและปลอดภัย
            const safePath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
            const absolutePath = path.join(process.cwd(), 'public', safePath);
            
            try { 
                await unlink(absolutePath); // สั่งลบไฟล์
                console.log("✅ File deleted from disk:", absolutePath);
            } catch (e) { 
                console.warn("⚠️ File not found on disk (skipping delete):", e.message); 
            }
        }

        // 4. ลบข้อมูลออกจากฐานข้อมูล
        await connection.execute('DELETE FROM project_documents WHERE id = ?', [id]);
        await connection.end();

        return NextResponse.json({ message: "Deleted successfully" });

    } catch (error) {
        console.error("❌ DELETE ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}