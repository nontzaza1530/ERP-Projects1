import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

// 1. GET: ดึงข้อมูล
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId');

    let sqlFolders, sqlFiles, params;

    if (!folderId || folderId === 'null') {
      sqlFolders = `SELECT * FROM document_folders WHERE parent_id IS NULL ORDER BY name ASC`;
      sqlFiles = `SELECT * FROM documents WHERE folder_id IS NULL ORDER BY created_at DESC`;
      params = [];
    } else {
      sqlFolders = `SELECT * FROM document_folders WHERE parent_id = ? ORDER BY name ASC`;
      sqlFiles = `SELECT * FROM documents WHERE folder_id = ? ORDER BY created_at DESC`;
      params = [folderId];
    }

    const [folders] = await pool.query(sqlFolders, params);
    const [files] = await pool.query(sqlFiles, params);

    return NextResponse.json({ folders, files });

  } catch (error) {
    console.error("GET Error:", error); // ดู log ใน terminal
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: สร้างโฟลเดอร์ หรือ อัปโหลดไฟล์
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file');
    const folderId = formData.get('folderId') === 'null' ? null : formData.get('folderId');
    const userId = formData.get('userId') || 1;

    // --- กรณีที่ 1: มีไฟล์ส่งมา (UPLOAD) ---
    if (file) {
        console.log("Starting upload:", file.name); // เช็คว่าไฟล์มาถึงไหม

        const buffer = Buffer.from(await file.arrayBuffer());
        
        // ✅ แก้ไข: ใช้ .replace แทน .replaceAll เพื่อความชัวร์ในทุก env
        const safeName = file.name.replace(/\s+/g, '_'); 
        const uniqueName = Date.now() + '_' + safeName;
        
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        
        // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
        try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

        // เขียนไฟล์ลงเครื่อง
        await writeFile(path.join(uploadDir, uniqueName), buffer);

        // บันทึกลง Database
        const filePath = `/uploads/${uniqueName}`;
        const fileType = file.name.split('.').pop().toLowerCase();
        const fileSize = file.size; // ✅ เพิ่มการเก็บขนาดไฟล์

        // ✅ แก้ไข SQL: เพิ่ม file_size
        await pool.query(
            `INSERT INTO documents (name, file_path, file_type, file_size, folder_id, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)`,
            [file.name, filePath, fileType, fileSize, folderId, userId]
        );

        return NextResponse.json({ success: true, message: 'Upload success' });
    } 
    
    // --- กรณีที่ 2: ไม่มีไฟล์ = สร้างโฟลเดอร์ (CREATE FOLDER) ---
    else {
        const name = formData.get('name');
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        await pool.query(
            `INSERT INTO document_folders (name, parent_id, created_by) VALUES (?, ?, ?)`,
            [name, folderId, userId]
        );
        return NextResponse.json({ success: true, message: 'Folder created' });
    }

  } catch (error) {
    console.error("POST Error:", error); // 🚨 ดู Error ตัวแดงใน Terminal ได้เลย
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. DELETE: ลบไฟล์ หรือ โฟลเดอร์
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type'); 

    if (!id || !type) return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

    if (type === 'file') {
        const [files] = await pool.query('SELECT file_path FROM documents WHERE id = ?', [id]);
        if (files.length > 0) {
            const filePath = files[0].file_path;
            try {
                const absolutePath = path.join(process.cwd(), 'public', filePath);
                await unlink(absolutePath);
            } catch (e) { console.log('File not found on disk, deleting DB only'); }
            
            await pool.query('DELETE FROM documents WHERE id = ?', [id]);
        }
    } else {
        await pool.query('DELETE FROM document_folders WHERE id = ?', [id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. PUT: เปลี่ยนชื่อไฟล์ หรือ โฟลเดอร์ (✅ เพิ่มใหม่)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, type, newName } = body; // type = 'file' หรือ 'folder'

    if (!id || !type || !newName) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (type === 'file') {
        await pool.query('UPDATE documents SET name = ? WHERE id = ?', [newName, id]);
    } else {
        await pool.query('UPDATE document_folders SET name = ? WHERE id = ?', [newName, id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}