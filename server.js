const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const cors=require('cors');
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Devi@2002',
    database: 'db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

app.get('/',(req,res) => {
    res.send('Server started')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Step 1: Check if the username exists
    const sqlUserCheck = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlUserCheck, [username], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            // If the username does not exist
            res.json({ success: false, message: 'Username not found' });
        } else {
            // Step 2: If username exists, check if the password matches
            const user = results[0];
            if (user.password === password) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Invalid password' });
            }
        }
    });
});

// Handle signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, results) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
