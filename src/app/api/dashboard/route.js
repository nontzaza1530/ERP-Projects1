// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import pool from '../../lib/db'; 

export async function GET() {
  try {
    // 1. Employee Count
    const [empResult] = await pool.query('SELECT COUNT(*) as count FROM employees');
    const employeeCount = empResult[0].count;

    // 2. Low Stock Count (Items with quantity <= min_level)
    const [stockResult] = await pool.query('SELECT COUNT(*) as count FROM products WHERE quantity <= min_level');
    const stockAlert = stockResult[0].count;

    // 3. Today's Sales
    // Assuming 'orders' table has a 'sale_date' or similar timestamp column
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const [salesResult] = await pool.query(
      'SELECT SUM(total_amount) as total FROM orders WHERE DATE(sale_date) = ?', 
      [today]
    );
    const todaysSales = salesResult[0].total || 0;

    // 4. Recent Transactions (Combining Orders and potential other logs)
    // For now, let's just pull the 5 most recent orders
    const [recentOrders] = await pool.query(`
      SELECT 
        id, 
        customer_name, 
        total_amount, 
        sale_date 
      FROM orders 
      ORDER BY sale_date DESC 
      LIMIT 5
    `);

    // Format recent transactions for the frontend
    const recentActivities = recentOrders.map(order => ({
      id: order.id,
      title: `ขายสินค้า Order #${order.id}`,
      desc: `โดย ${order.customer_name || 'ลูกค้าทั่วไป'}`, // You might want to join with users table if you track who sold it
      amount: order.total_amount,
      time: new Date(order.sale_date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      type: 'sale'
    }));

    return NextResponse.json({
      employeeCount,
      stockAlert,
      todaysSales,
      pendingDocs: 0, // Placeholder as requested
      recentActivities
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}