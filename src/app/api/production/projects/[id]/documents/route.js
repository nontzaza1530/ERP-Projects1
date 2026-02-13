import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(req, { params }) {
    try {
        // ✅ แก้ไขจุดตาย: ใส่ await เพื่อรอรับค่า params ให้สมบูรณ์ก่อน (Next.js 15+)
        const resolvedParams = await params;
        const id = resolvedParams.id; 

        console.log("📂 Fetching documents for Project ID:", id); 

        if (!id) {
            return NextResponse.json({ error: "Project ID is missing" }, { status: 400 });
        }

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'erp_project',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            connectTimeout: 10000
        });

        // ส่งค่า id ที่ได้ (ซึ่งตอนนี้มีค่าแล้วแน่นอน) ไปค้นหาใน DB
        const [rows] = await connection.execute(
            'SELECT * FROM project_documents WHERE project_id = ? ORDER BY created_at DESC',
            [id]
        );

        await connection.end();

        console.log("✅ Documents Found:", rows.length);
        return NextResponse.json({ files: rows });

    } catch (error) {
        console.error("❌ GET ERROR DETAIL:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}