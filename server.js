require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- FORCE HOME PAGE ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- FIX 1: Serve Static Files Correctly for Vercel ---
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- HELPER FUNCTIONS ---
function generateCode() {
    return crypto.randomBytes(4).toString('hex').slice(0, 6);
}

// --- ROUTES ---

// --- FIX 2: Serve the HTML Page at the Root URL ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/healthz', (req, res) => {
    res.status(200).json({ ok: true, version: "1.0" });
});

// 1. CREATE LINK (POST)
app.post('/api/links', async (req, res) => {
    const { url, code } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    let shortCode = code || generateCode();
    const codeRegex = /^[a-zA-Z0-9]{6,8}$/;
    if (!codeRegex.test(shortCode)) {
        return res.status(400).json({ error: "Code must be 6-8 alphanumeric characters." });
    }

    try {
        const query = `
            INSERT INTO links (code, original_url) 
            VALUES ($1, $2) 
            RETURNING *
        `;
        const result = await pool.query(query, [shortCode, url]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: "Short code already exists. Choose another." });
        }
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// 2. GET ALL LINKS (GET)
app.get('/api/links', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM links ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// 3. GET SINGLE LINK STATS (GET)
app.get('/api/links/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Link not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// 4. DELETE LINK (DELETE)
app.delete('/api/links/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Link not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// 5. THE REDIRECT (The Middleman Logic)
app.get('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query('SELECT * FROM links WHERE code = $1', [code]);
        
        if (result.rows.length === 0) {
            return res.status(404).send("<h1>404 - Link Not Found</h1>");
        }

        const link = result.rows[0];

        await pool.query(`
            UPDATE links 
            SET clicks = clicks + 1, last_clicked = NOW() 
            WHERE id = $1
        `, [link.id]);

        res.redirect(link.original_url);

    } catch (err) {
        console.error("Redirect Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
