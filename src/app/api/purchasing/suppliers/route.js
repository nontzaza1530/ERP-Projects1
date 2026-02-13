import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

// 1. GET: ดึงข้อมูลคู่ค้า
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let sql = `SELECT * FROM suppliers`;
    let params = [];

    if (search) {
      sql += ` WHERE name LIKE ? OR code LIKE ? OR contact_name LIKE ? OR phone LIKE ?`;
      params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];
    }
    
    sql += ` ORDER BY id DESC`;

    const [rows] = await pool.query(sql, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: เพิ่มคู่ค้าใหม่ (✅ เพิ่ม branch และ fax)
export async function POST(request) {
    try {
        const body = await request.json();
        
        // รับค่า branch และ fax เพิ่มเติม
        const { 
            code, name, contact_name, 
            address, sub_district, district, province, zipcode, 
            phone, email, tax_id, credit_term,
            branch, fax // <--- มารับค่าตรงนี้
        } = body;

        // Validation
        if (!code || !name) {
            return NextResponse.json({ error: 'กรุณากรอกรหัสและชื่อคู่ค้า' }, { status: 400 });
        }

        // เช็ค Code ซ้ำ
        const [existing] = await pool.query('SELECT id FROM suppliers WHERE code = ?', [code]);
        if (existing.length > 0) {
            return NextResponse.json({ error: 'รหัสคู่ค้านี้มีอยู่แล้ว' }, { status: 400 });
        }

        const sql = `
            INSERT INTO suppliers 
            (
                code, name, contact_name, 
                address, sub_district, district, province, zipcode, 
                phone, email, tax_id, credit_term, branch, fax
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            code, 
            name, 
            contact_name || '', 
            address || '',          
            sub_district || '',     
            district || '',         
            province || '',         
            zipcode || '',          
            phone || '', 
            email || '', 
            tax_id || '', 
            credit_term || 0,
            branch || '',           // <--- บันทึกสาขา
            fax || ''               // <--- บันทึกแฟกซ์
        ];

        await pool.query(sql, values);
        return NextResponse.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ' });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 3. PUT: แก้ไขข้อมูล (✅ เพิ่ม branch และ fax)
export async function PUT(request) {
    try {
        const body = await request.json();
        const { 
            id, code, name, contact_name, 
            address, sub_district, district, province, zipcode, 
            phone, email, tax_id, credit_term,
            branch, fax // <--- มารับค่าตรงนี้
        } = body;

        const sql = `
            UPDATE suppliers SET 
            code=?, name=?, contact_name=?, 
            address=?, sub_district=?, district=?, province=?, zipcode=?, 
            phone=?, email=?, tax_id=?, credit_term=?, branch=?, fax=? 
            WHERE id=?
        `;
        
        const values = [
            code, name, contact_name, 
            address, sub_district, district, province, zipcode,
            phone, email, tax_id, credit_term, 
            branch || '', fax || '', // <--- อัปเดตสาขา และแฟกซ์
            id
        ];

        await pool.query(sql, values);
        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 4. DELETE: ลบข้อมูล
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

        await pool.query('DELETE FROM suppliers WHERE id = ?', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}