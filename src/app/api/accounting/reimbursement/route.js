import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { minioClient, BUCKET_NAME } from '../../../../lib/minio';

// ⚙️ ตั้งค่า MinIO (เช็ค IP และ Port ให้ตรงกับเครื่องคุณ)
const MINIO_SERVER_IP = 'smartg.trueddns.com';
const MINIO_API_PORT = '29454'; 

// ==============================================================================
// 🟢 GET: ดึงข้อมูล (สูตร Best Practice: Join 3 ตาราง)
// ==============================================================================
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // ✅ SQL ขั้นเทพ: ดึงใบเบิก + ชื่อ User + ข้อมูลพนักงาน (รหัส, ชื่อจริง, ตำแหน่ง)
        const sqlData = `
            SELECT r.*, 
                -- ดึงรหัสพนักงาน (emp_code) มาด้วย
                e.emp_code,
                -- สร้างชื่อผู้เบิก: ถ้ามีชื่อจริงให้ใช้ชื่อจริง ถ้าไม่มีให้ใช้ username
                COALESCE(CONCAT(e.first_name, ' ', e.last_name), u.username) as requester_name,
                -- ดึงตำแหน่ง
                e.position,
                -- ดึง Role จาก User
                u.role
            FROM reimbursements r
            LEFT JOIN users u ON r.user_id = u.id              -- 1. เชื่อมไปหา Users (เพื่อเอา employee_id)
            LEFT JOIN employees e ON u.employee_id = e.emp_code -- 2. เชื่อมไปหา Employees (เพื่อเอาชื่อจริง)
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const sqlCount = `SELECT COUNT(*) as total FROM reimbursements`;

        const [rows] = await pool.query(sqlData, [limit, offset]);
        const [countResult] = await pool.query(sqlCount);

        const totalItems = countResult[0].total;
        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json({
            data: rows,
            pagination: { totalItems, totalPages, currentPage: page, itemsPerPage: limit }
        });

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ==============================================================================
// 🔵 POST: บันทึกข้อมูล (รองรับหลายไฟล์)
export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const amount = formData.get('amount');
        const expense_date = formData.get('date');
        const description = formData.get('description') || '';
        
        // ✅ รับไฟล์ทั้งหมดมาเป็น Array
        const files = formData.getAll('files'); 
        
        const userId = formData.get('userId') || '34';

        const fileUrls = [];

        // ✅ วนลูปอัปโหลดทีละไฟล์
        if (files && files.length > 0) {
            for (const file of files) {
                if (file.size > 0) {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    
                    // ตั้งชื่อไฟล์ (เติมเลขสุ่มนิดหน่อยกันชื่อซ้ำในเสี้ยววินาที)
                    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}-${file.name}`;
                    
                    const metaData = { 'Content-Type': file.type };

                    await minioClient.putObject(BUCKET_NAME, fileName, buffer, file.size, metaData);

                    const url = `http://${MINIO_SERVER_IP}:${MINIO_API_PORT}/${BUCKET_NAME}/${fileName}`;
                    fileUrls.push(url);
                }
            }
        }

        const sql = `
            INSERT INTO reimbursements 
            (user_id, title, amount, expense_date, description, slip_images, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
        `;

        // ✅ แปลง Array ของ URL เป็น JSON String (เช่น '["url1", "url2"]')
        const slipImagesJson = JSON.stringify(fileUrls);

        await pool.query(sql, [
            userId, 
            title,
            amount,
            expense_date,
            description,
            slipImagesJson
        ]);

        return NextResponse.json({ success: true, message: 'บันทึกสำเร็จ' });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ==============================================================================
// 🟡 PUT: อนุมัติ / ไม่อนุมัติ
// ==============================================================================
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, status, reject_reason } = body;
        if (!id || !status) return NextResponse.json({ error: 'Data missing' }, { status: 400 });
        const sql = `UPDATE reimbursements SET status = ?, reject_reason = ?, approved_at = NOW() WHERE id = ?`;
        await pool.query(sql, [status, reject_reason || null, id]);
        return NextResponse.json({ success: true, message: 'Updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}