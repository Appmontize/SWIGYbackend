const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3015;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'swiggydata' // Note: Ensure your database name is correct
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Endpoint to handle form submissions
app.post('/submit', (req, res) => {
    const { name, city, phone } = req.body;
    
    if (!name || !city || !phone) {
        return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO form_data (name, city, phone) VALUES (?, ?, ?)';
    db.query(query, [name, city, phone], (err, result) => {
        if (err) throw err;
        res.send('Form data saved successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
