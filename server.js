const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3015;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Replace with your actual password or use an environment variable
    database: 'swiggydata' // Ensure your database name is correct
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL connected...');
});

// Endpoint to handle form submissions
app.post('/submit', (req, res) => {
    const { name, city, phone, source } = req.body;
    
    if (!name || !city || !phone || !source) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const query = 'INSERT INTO form_data (name, city, phone, source) VALUES (?, ?, ?, ?)';
    db.query(query, [name, city, phone, source], (err, result) => {
        if (err) {
            console.error('Error saving data:', err);
            return res.status(500).json({ success: false, message: 'Failed to save data' });
        }
        res.json({ success: true, message: 'Form data saved successfully' });
    });
});

// Endpoint to fetch delivery partner data
app.get('/api/delivery-partners', (req, res) => {
    const query = 'SELECT * FROM form_data';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return res.status(500).send('Error fetching data');
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
