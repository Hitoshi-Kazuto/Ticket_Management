import express from "express"
import pool from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"


const jwtSecret = 'your_jwt_secret'; // Change this to a more secure secret in production


const app = express();

app.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM user_master WHERE username = $1';
        const { rows } = await pool.query(query, [username]);

        if (rows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        const user = rows[0];

        if (!user.active_status) {
            return res.json({ success: false, message: 'User is not active' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect password' });
        }

        const token = jwt.sign({ id: user.user_id, username: user.username, role: user.role, partner_name: user.partner_name }, jwtSecret, { expiresIn: '1h' });

        res.json({ success: true, token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default app;