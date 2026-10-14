const express = require('express');
require('dotenv').config(); // Yeh line sabse upar honi chahiye taaki .env load ho jaye
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Frontend files ko direct backend port se serve karne ke liye
app.use(express.static(__dirname));

// MySQL Database Connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 11930,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection fail ho gaya bhai: ' + err.stack);
        return;
    }
    console.log('MySQL Database se successfully connect ho gaye! 🚀');

    // Automatic Tables Creation Logic
    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            order_id INT AUTO_INCREMENT PRIMARY KEY,
            table_no VARCHAR(50) NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createOrderItemsTable = `
        CREATE TABLE IF NOT EXISTS order_items (
            item_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            dish_name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
        );
    `;

    db.query(createOrdersTable, (err1) => {
        if (err1) {
            console.error('Error creating orders table:', err1.message);
            return;
        }
        console.log('Orders table ready ho gaya! ✅');

        db.query(createOrderItemsTable, (err2) => {
            if (err2) {
                console.error('Error creating order_items table:', err2.message);
                return;
            }
            console.log('Order Items table ready ho gaya! ✅');
        });
    });
});

// 1. API Endpoint: Customer order save karne ke liye
app.post('/api/orders', (req, res) => {
    const { tableNo, items, totalAmount } = req.body;

    const orderQuery = 'INSERT INTO orders (table_no, total_amount) VALUES (?, ?)';
    db.query(orderQuery, [tableNo, totalAmount], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const orderId = result.insertId;
        const itemQuery = 'INSERT INTO order_items (order_id, dish_name, price) VALUES ?';
        const itemValues = items.map(item => [orderId, item.name, item.price]);

        db.query(itemQuery, [itemValues], (err2) => {
            if (err2) {
                return res.status(500).json({ error: err2.message });
            }
            res.json({ success: true, message: 'Order successfully save ho gaya!', orderId });
        });
    });
});

// 2. API Endpoint: Kitchen screen ke liye orders fetch karne ke liye
app.get('/api/orders', (req, res) => {
    const query = 'SELECT o.order_id, o.table_no, o.total_amount, o.status, o.created_at, GROUP_CONCAT(i.dish_name SEPARATOR ", ") as items FROM orders o LEFT JOIN order_items i ON o.order_id = i.order_id GROUP BY o.order_id ORDER BY o.order_id DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results || []);
    });
});

// 3. API Endpoint: Order serve hone par delete karne ke liye
app.delete('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;

    db.query('DELETE FROM orders WHERE order_id = ?', [orderId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Order successfully delete ho gaya!' });
    });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server port ${PORT} par chal raha hai bhai! 🔥`);
});