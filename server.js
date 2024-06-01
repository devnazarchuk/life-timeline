const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
    user: 'yourusername',
    host: 'localhost',
    database: 'life_tracker',
    password: 'yourpassword',
    port: 5432,
});

app.post('/api/users', async (req, res) => {
    const { birthdate, interval } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (birthdate, interval) VALUES ($1, $2) RETURNING *',
            [birthdate, interval]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/events', async (req, res) => {
    const { userId } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM events WHERE user_id = $1',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/events', async (req, res) => {
    const { userId, eventDate, content } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO events (user_id, event_date, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, eventDate, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
