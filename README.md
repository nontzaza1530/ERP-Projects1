# ERP System (Enterprise Resource Planning)

**วันที่อัปเดต:** 8 ธันวาคม 2567

---

## 📋 บทนำ

นี่คือระบบ **ERP (Enterprise Resource Planning)** ที่สร้างด้วย **Next.js 16** ที่ช่วยจัดการธุรกิจในหลายด้าน เช่น การบริหารพนักงาน (HR), คลังสินค้า (Inventory), การขาย (Sales), และบัญชี (Accounting)

---

## 🏗️ สถาปัตยกรรมระบบ

ระบบนี้ประกอบด้วย **2 ส่วนหลัก**:

### 1️⃣ **Front-end (หน้าบ้าน)**
- **เทคโนโลยี**: Next.js 16, React 19, Tailwind CSS 4
- **บทบาท**: ส่วนติดต่อผู้ใช้ (UI) ที่ให้ผู้ใช้สามารถ view, create, update, delete ข้อมูล
- **ไฟล์ที่เกี่ยวข้อง**: `src/app/`, `src/components/`

### 2️⃣ **Back-end (หลังบ้าน)**
- **เทคโนโลยี**: Next.js API Routes, MySQL 2, Node.js
- **บทบาท**: จัดการตรรกะทางธุรกิจ, เชื่อมต่อฐานข้อมูล, ส่งข้อมูลให้ front-end
- **ไฟล์ที่เกี่ยวข้อง**: `src/app/api/`, `src/app/lib/`

---

## 📁 โครงสร้างโปรเจค

```
erp_project/
├── src/
│   ├── app/
│   │   ├── page.jsx                    # หน้าแรก (Dashboard)
│   │   ├── layout.jsx                  # Layout หลัก
│   │   ├── globals.css                 # Stylesheet ทั่วโปรเจค
│   │   │
│   │   ├── Home/page.jsx               # เนื้อหา Dashboard
│   │   ├── hr/page.jsx                 # หน้า HR (บริหารพนักงาน)
│   │   ├── inventory/page.jsx          # หน้า Inventory (คลังสินค้า)
│   │   ├── sales/page.jsx              # หน้า Sales (การขาย)
│   │   ├── accounting/page.jsx         # หน้า Accounting (บัญชี)
│   │   ├── attendance/page.jsx         # หน้า Attendance (การเข้างาน)
│   │   │
│   │   ├── api/                        # API Routes (Back-end)
│   │   │   ├── employees/route.js      # API จัดการพนักงาน
│   │   │   ├── time/route.js           # API จัดการเวลา/การเข้างาน
│   │   │   └── [id]/route.js           # API ดึงข้อมูลตาม ID
│   │   │
│   │   ├── lib/
│   │   │   └── db.js                   # การตั้งค่าฐานข้อมูล MySQL
│   │   │
│   │   └── db/
│   │       └── db.sql                  # SQL Script สำหรับสร้างตาราง
│   │
│   └── components/
│       └── Sidebar.jsx                 # แถบเมนูด้านข้าง
│
├── public/                             # ไฟล์รูปภาพและ icon
├── package.json                        # Dependencies
├── next.config.mjs                     # ตั้งค่า Next.js
├── jsconfig.json                       # ตั้งค่า JavaScript
├── postcss.config.mjs                  # ตั้งค่า PostCSS
└── eslint.config.mjs                   # ตั้งค่า ESLint
```

---

## 🎨 ส่วนหน้าบ้าน (Front-end)

### คืออะไร?
ส่วนที่ **ผู้ใช้มองเห็น** บนหน้าจออย่างที่เข้าใจได้ การแสดงผลหน้าต่าง ๆ ของระบบ ERP

### ส่วนประกอบหลัก

#### 1. **Layout หลัก** (`src/app/layout.jsx`)
```
┌─────────────────────────────────────────┐
│  ERP SYSTEM - ส่วนหน้าเนื้อหา            │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │     เนื้อหาหลัก              │
│  (Menu)  │     (Pages)                  │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

- ตั้งค่าฟอนต์ **Kanit** (ไทย)
- ตั้งค่า title และ description ของเพจ
- ใช้ Tailwind CSS สำหรับสไตล์

#### 2. **Sidebar (เมนูด้านข้าง)** (`src/components/Sidebar.jsx`)
ยังไม่เสร็จ - ส่วนประกอบหลักต่าง ๆ:
- 🏠 **Dashboard** - หน้าแรก
- 👥 **HR (พนักงาน)** - บริหารข้อมูลพนักงาน
- 📦 **Inventory (คลังสินค้า)** - จัดการสินค้า
- 🛒 **Sales (การขาย)** - บันทึกการขาย
- 📊 **Accounting (บัญชี)** - จัดการการเงิน

#### 3. **หน้าต่าง ๆ** 
- `src/app/page.jsx` - หน้าแรก
- `src/app/Home/page.jsx` - Dashboard หลัก
- `src/app/hr/page.jsx` - หน้า HR
- `src/app/inventory/page.jsx` - หน้า Inventory
- `src/app/sales/page.jsx` - หน้า Sales
- `src/app/accounting/page.jsx` - หน้า Accounting
- `src/app/attendance/page.jsx` - หน้า Attendance

### ⚠️ สิ่งที่ขาด/ต้องทำต่อ
- ❌ ยังไม่มีการสร้าง **Form** สำหรับ input ข้อมูล
- ❌ ยังไม่มี **Table** แสดงข้อมูล
- ❌ ยังไม่มี **Button** เพื่อบันทึก/ลบ/แก้ไข
- ❌ ยังไม่มี **Modal** สำหรับ Dialog boxes
- ❌ ยังไม่มี **Loading State** และ **Error Message**
- ❌ ยังไม่มี **Authentication** (Login)
- ❌ ยังไม่มี **Pagination** สำหรับข้อมูลจำนวนมาก

---

## ⚙️ ส่วนหลังบ้าน (Back-end)

### คืออะไร?
ส่วนที่ **เก็บข้อมูล** ใน **ฐานข้อมูล MySQL** และ **ประมวลผล** คำขอจากหน้าบ้าน

### ส่วนประกอบหลัก

#### 1. **API Routes** (`src/app/api/`)
```
/api/employees              - API สำหรับจัดการพนักงาน
├── GET              - ดึงข้อมูลพนักงานทั้งหมด
└── POST             - เพิ่มพนักงานใหม่

/api/employees/[id]        - API สำหรับจัดการพนักงาน แบบระบุ ID
├── GET              - ดึงข้อมูลพนักงาน ID เดียว
├── PUT              - แก้ไขข้อมูลพนักงาน
└── DELETE           - ลบพนักงาน

/api/time                  - API สำหรับเวลาเข้า-ออกงาน
└── POST             - บันทึกเวลาเข้า-ออกงาน
```

#### 2. **ฐานข้อมูล MySQL** (`src/app/lib/db.js`)
- ใช้ **mysql2/promise** เพื่อเชื่อมต่อ
- สร้าง **Connection Pool** เพื่อประสิทธิภาพ
- ดึง config จาก **Environment Variables** (`.env.local`)

#### 3. **Environment Variables** (ต้องสร้าง)
สร้างไฟล์ `.env.local` ในรูท:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=erp_db
DB_PORT=3306
```

### ⚠️ สิ่งที่ขาด/ต้องทำต่อ
- ❌ ยังไม่มี **Validation** สำหรับข้อมูล input
- ❌ ยังไม่มี **Error Handling** ที่ดี
- ❌ ยังไม่มี **Authentication/Authorization** (ตรวจสอบสิทธิ์ผู้ใช้)
- ❌ ยังไม่มี **API สำหรับ Inventory, Sales, Accounting**
- ❌ ยังไม่มี **Logging** เพื่อ debug
- ❌ ยังไม่มี **Input Sanitization** (ป้องกัน SQL Injection)

---

## 🗄️ ฐานข้อมูล (Database)

### ตั้งค่าฐานข้อมูล
```bash
# 1. สร้างฐานข้อมูล
CREATE DATABASE erp_db;

# 2. รันไฟล์ SQL script
# อ่านไฟล์ src/app/db/db.sql แล้วรันคำสั่งใน MySQL
```

### โครงสร้างตาราง (ต้องชำรุด)
ตาราง `employees`:
```
┌─────────────────┬──────────┬──────────────────┐
│ Column Name     │ Type     │ Description      │
├─────────────────┼──────────┼──────────────────┤
│ id              │ INT      │ Primary Key      │
│ name            │ VARCHAR  │ ชื่อ             │
│ email           │ VARCHAR  │ อีเมล            │
│ phone           │ VARCHAR  │ เบอร์โทร         │
│ position        │ VARCHAR  │ ตำแหน่ง          │
│ created_at      │ DATETIME │ วันที่สร้าง     │
│ updated_at      │ DATETIME │ วันที่อัปเดต    │
└─────────────────┴──────────┴──────────────────┘
```

---

## 🚀 วิธีใช้

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. สร้างไฟล์ `.env.local`
```bash
# สร้างไฟล์ในรูท directory
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=erp_db
DB_PORT=3306
```

### 3. ติดตั้ง MySQL
- ดาวน์โหลด MySQL จาก [mysql.com](https://www.mysql.com)
- สร้างฐานข้อมูล `erp_db`
- รันไฟล์ `src/app/db/db.sql` เพื่อสร้างตาราง

### 4. เรียกใช้ Development Server
```bash
npm run dev
```
- เข้าที่ `http://localhost:3000`

### 5. Build สำหรับ Production
```bash
npm run build
npm start
```

---

## 📦 Dependencies ที่ใช้

| Package | Version | บทบาท |
|---------|---------|--------|
| **next** | 16.0.6 | Framework หลัก |
| **react** | 19.2.0 | Library UI |
| **react-dom** | 19.2.0 | Render React เข้า DOM |
| **mysql2** | 3.15.3 | Database driver |
| **lucide-react** | 0.556.0 | Icon library |
| **tailwindcss** | 4 | CSS framework |
| **eslint** | 9 | Code linter |

---

## 🔄 Flow การทำงาน

```
User (หน้าจอ)
    ↓
Front-end (React Component)
    ↓
Fetch API (GET/POST/PUT/DELETE)
    ↓
Back-end API Route (Next.js)
    ↓
Database (MySQL)
    ↓
Response กลับไปหน้าจอ
```

### ตัวอย่างเพิ่มพนักงาน
1. ผู้ใช้ กรอกฟอร์ม (ยังไม่มี)
2. Click ปุ่ม "Save" (ยังไม่มี)
3. ส่ง POST request ไปที่ `/api/employees`
4. Back-end ตรวจสอบข้อมูล (ยังไม่มี validation)
5. บันทึกลง MySQL
6. ส่ง response กลับมา
7. Front-end แสดง success message (ยังไม่มี)

---

## 📊 สถานะการพัฒนา

### ✅ เสร็จแล้ว
- [x] โครงสร้าง Next.js + Tailwind CSS
- [x] Sidebar navigation
- [x] Layout หลัก
- [x] ตั้งค่า MySQL connection
- [x] API Route structure

### 🚧 กำลังทำ / ต้องทำต่อ
- [ ] สร้าง Form สำหรับ input
- [ ] สร้าง Table แสดงข้อมูล
- [ ] API CRUD ที่ complete สำหรับทุก module
- [ ] Validation และ Error Handling
- [ ] Authentication (Login/Logout)
- [ ] Authorization (ตรวจสอบสิทธิ์)
- [ ] Pagination
- [ ] Search และ Filter
- [ ] Report generation
- [ ] Unit tests

---

## 🛠️ Tech Stack สรุป

```
Front-end:  Next.js 16 + React 19 + Tailwind CSS 4
Back-end:   Next.js API Routes + Node.js
Database:   MySQL 2
Icons:      Lucide React
Language:   JavaScript/JSX
Font:       Kanit (Thai Font)
```

---

## 🚨 หมายเหตุสำคัญ

1. **ยังไม่มี Authentication**: ระบบ login ยังไม่มี ผู้ใช้ใดก็ได้เข้าได้
2. **ยังไม่มี Validation**: ข้อมูล input ไม่ได้ถูกตรวจสอบ
3. **ต้องตั้งค่า MySQL**: ดูวิธีใช้ข้างบน
4. **Environment Variables จำเป็น**: ต้องสร้างไฟล์ `.env.local`
5. **SQL Script ยังไม่เสร็จ**: ต้องตรวจสอบไฟล์ `src/app/db/db.sql`

---

## 📚 วิธีศึกษาเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [Lucide Icons](https://lucide.dev)

---

## 📝 หมายเหตุ

หากท่านไม่เข้าใจส่วนใดส่วนหนึ่ง สามารถติดต่อผู้พัฒนา หรือศึกษาเพิ่มเติมจากลิงก์ข้างต้น

**สร้างเมื่อ:** 8 ธันวาคม 2567
