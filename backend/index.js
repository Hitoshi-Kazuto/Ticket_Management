import dotenv from "dotenv";
// Load environment variables
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import pool from "./config.js";
import passport from "passport";
import verifyToken from "./middlewares/authenticate.js";

import login from "./routes/login_route.js";
import ticket from "./controllers/ticket_controller.js";
import user from "./routes/user_route.js";
import partner from "./routes/partner_route.js";
import software from "./routes/software_route.js";
import category from "./routes/category_route.js";
import status from "./routes/status_route.js";


const PORT = process.env.port || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Authorization, Content-Type',
    optionsSuccessStatus: 204
}));
// Initialize passport
app.use(passport.initialize());



app.use('/api/login', login);

app.use('/api/user', user);

app.use('/api/partner', partner);

app.use('/api/software', software);

app.use('/api/category', category);

app.use('/api/status', status);

app.use('/api/ticket', ticket);


app.post('/api/change-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;

    try {
        // Fetch the current hashed password from the database
        const userQuery = 'SELECT password FROM User_Master WHERE username = $1';
        const userResult = await pool.query(userQuery, [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const currentHashedPassword = userResult.rows[0].password;

        // Check if the current password matches
        const isMatch = await bcrypt.compare(currentPassword, currentHashedPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        // Hash the new password
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        const updateQuery = 'UPDATE User_Master SET password = $1 WHERE username = $2';
        await pool.query(updateQuery, [newHashedPassword, username]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
app.get('/api/partner-codes', async (req, res) => {
    try {
        const query = 'SELECT * FROM Partner_Master WHERE status = true';
        const result = await pool.query(query);
        res.json({partners: result.rows});
    } catch (error) {
        console.error('Error fetching partner codes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/api/dropdown-values', async (req, res) => {
    try {
        const partners = await pool.query("SELECT * FROM Partner_Master WHERE status = 'True'");
        const softwares = await pool.query("SELECT * FROM Software_Master WHERE status = 'True'");
        const categories = await pool.query("SELECT * FROM Category_Master WHERE status = 'True'");
        const statuses = await pool.query("SELECT * FROM Status_Master WHERE status_activity = 'True'");
        const usernames = await pool.query("SELECT * FROM User_Master WHERE role = 'Helpdesk' ");
        const requested_by = await pool.query("SELECT * FROM User_Master WHERE role != 'Helpdesk' ")
        res.json({
            partners: partners.rows,
            softwares: softwares.rows,
            categories: categories.rows,
            statuses: statuses.rows,
            usernames: usernames.rows,
            requested_by: requested_by.rows,
        });
    } catch (error) {
        console.error('Error fetching dropdown values:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/api/ticket-record/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;

    try {
        const escalation = await db.query('SELECT * FROM update_master WHERE ticket_id = $1', [ticket_id]);

        if (ticket.rows.length > 0) {
            res.json({
                success: true,
                escalation: escalation.rows.length > 0 ? escalation.rows[0] : null
            });
        } else {
            res.status(404).json({ success: false, message: 'Ticket not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
app.get('/api/getUser/:requested_by', async (req, res) => {
    const Requested_by = req.params.requested_by;
    try {
        const result = await pool.query('SELECT role, Partner_Code FROM user_master WHERE username = $1', [Requested_by]);
        if (result.rows.length > 0) {
            res.json({ role: result.rows[0].role, partner: result.rows[0].partner_code });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});


async function resetSequence(tableName, sequenceName, idColumn) {
    const client = await pool.connect();

    try {
        // Start a transaction
        await client.query('BEGIN');

        // Get the current maximum id from the specified table and column
        const { rows } = await client.query(`SELECT MAX(${idColumn}) AS max_id FROM ${tableName}`);
        const maxId = rows[0].max_id || 0;

        // Reset the sequence
        await client.query(`ALTER SEQUENCE ${sequenceName} RESTART WITH ${maxId + 1}`);

        // Commit the transaction
        await client.query('COMMIT');

        console.log(`Sequence ${sequenceName} reset successfully for table ${tableName}`);
    } catch (err) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        console.error('Error resetting sequence:', err);
    } finally {
        // Release the client back to the pool
        client.release();
    }
}
