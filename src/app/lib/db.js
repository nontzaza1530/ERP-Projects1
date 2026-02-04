import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 30, // จำนวน connection สูงสุดใน pool
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,


};

// --- เทคนิค Singleton ---
// เช็คว่ามี pool อยู่ในตัวแปร Global หรือยัง? ถ้ามีแล้วให้ใช้ตัวเดิม
// ถ้าไม่มี ให้สร้างใหม่ (ป้องกันการสร้างซ้ำตอน Hot Reload)
let pool;

// 🔥 ทีเด็ด 2: Singleton Pattern
// เช็คก่อนว่า "เคยสร้างท่อเชื่อมต่อไว้หรือยัง?"
if (process.env.NODE_ENV === 'production') {
  // ถ้าขึ้นเซิร์ฟเวอร์จริง ให้สร้างใหม่ตามปกติ
  pool = mysql.createPool(dbConfig);
} else {
  // ถ้าอยู่เครื่องเรา (Dev) ให้ฝากตัวแปรไว้ที่ Global
  // ต่อให้แก้โค้ดแล้ว Save ใหม่ Next.js รีโหลด ก็จะกลับมาใช้ท่อเดิม ไม่สร้างท่อใหม่ซ้อนทับกัน
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(dbConfig);
  }
  pool = global.mysqlPool;
}

export default pool;