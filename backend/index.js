import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import session from "express-session";
import bcrypt from "bcrypt"
import pool from "./config.js";

const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', // allow requests from react app
    credentials: true, // allow cookies to be sent
}));

// Configure session middleware
app.use(session({
    secret: 'secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

const jwtSecret = 'your_jwt_secret'; // Change this to a more secure secret in production

app.post('/login', async (req, res) => {
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

        const token = jwt.sign({ id: user.user_id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });

        res.json({ success: true, token, user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/change-password', async (req, res) => {
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


app.post('/user-form', async (req, res) => {
    const {
        name,
        username,
        password,
        confirmPassword,
        email,
        mobile,
        role,
        partner_code,
        created_by,
        valid_from,
        valid_till
    } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const created_time = new Date();
        const active_status = true;
        const query = `
            INSERT INTO user_master
            (user_id, name, username, password, email_address, mobile_number, role, partner_code, active_status, created_by, created_time, valid_from, valid_till) 
            VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;
        const values = [name, username, hashedPassword, email, mobile, role, partner_code, active_status, created_by, created_time, valid_from, valid_till];

        const result = await pool.query(query, values);

        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        console.error('Error inserting into users:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/user', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM public.User_master ORDER BY user_id ASC');
        res.json(users.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/user/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { password, confirm_password, email_address, mobile_number, valid_till, updated_by } = req.body;
    const updated_time = new Date();

    try {
        if (password !== confirm_password) {
            return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            UPDATE user_master
            SET password = $2, email_address = $3, mobile_number = $4, valid_till = $5, updated_by = $6, updated_time = $7
            WHERE user_id = $1
            RETURNING *;
        `;
        const values = [user_id, hashedPassword, email_address, mobile_number, valid_till, updated_by, updated_time];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json({ success: true, users: result.rows[0] });
        } else {
            res.json({ success: false, error: 'No users found with the given id' });
        }
    } catch (error) {
        console.error('Error updating User_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/user/inactivate', async (req, res) => {
    const { user_id } = req.body;

    try {
        const query = `
            UPDATE User_Master 
            SET Active_Status = false 
            WHERE user_id = $1
            RETURNING *;
        `;
        const values = [user_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating User_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/user/activate', async (req, res) => {
    const { user_id } = req.body;

    try {
        const query = `
            UPDATE User_Master 
            SET Active_Status = true 
            WHERE user_id = $1
            RETURNING *;
        `;
        const values = [user_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating User_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



app.post('/partner-form', async (req, res) => {
    const { Partner_Code, Partner_Name, Remarks, created_by } = req.body;

    try {
        const created_time = new Date();
        const status = true;

        const query = `
            INSERT INTO Partner_Master 
            (Partner_Code, Partner_Name, Remarks, Status, Created_By, Created_Time) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [Partner_Code, Partner_Name, Remarks, status, created_by, created_time];

        const { rows } = await pool.query(query, values);
        res.json({ success: true, partner: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Partner with this name already exists' });
        } else {
            console.error('Error inserting into Partner_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        (async () => { await resetSequence('Partner_Master', 'partner_master_partner_id_seq', 'partner_id'); })();
    }
});
app.get('/partner', async (req, res) => {
    try {
        const partners = await pool.query('SELECT * FROM public.partner_master ORDER BY partner_id ASC');
        res.json(partners.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/partner/:partner_id', async (req, res) => {
    const { partner_id } = req.params;
    const { Partner_Name, Remarks, Updated_By } = req.body;
    const Updated_Time = new Date();

    try {
        const query = `
            UPDATE Partner_Master
            SET Partner_Name = $1, Remarks = $2, Updated_By = $4, Updated_Date = $5
            WHERE Partner_Id = $3
            RETURNING *;
        `;
        const values = [Partner_Name, Remarks, partner_id, Updated_By, Updated_Time];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json({ success: true, partner: result.rows[0] });
        } else {
            res.json({ success: false, error: 'No partner found with the given id' });
        }
    } catch (error) {
        console.error('Error updating Partner_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/partner/inactivate', async (req, res) => {
    const { partner_id } = req.body;

    try {
        const query = `
            UPDATE Partner_Master 
            SET Status = false 
            WHERE Partner_Id = $1
            RETURNING *;
        `;
        const values = [partner_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Partner not found' });
        }
    } catch (error) {
        console.error('Error updating Partner_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/partner/activate', async (req, res) => {
    const { partner_id } = req.body;

    try {
        const query = `
            UPDATE Partner_Master 
            SET Status = true 
            WHERE Partner_Id = $1
            RETURNING *;
        `;
        const values = [partner_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Partner not found' });
        }
    } catch (error) {
        console.error('Error updating Partner_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.post('/software-form', async (req, res) => {
    const { Software_Name, Remarks, created_by } = req.body;
    try {
        const created_time = new Date();
        const status = true;

        const query = `
            INSERT INTO Software_Master 
            (Software_Name, Remarks, Status, Created_By, Created_Time) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [Software_Name, Remarks, status, created_by, created_time]

        const { rows } = await pool.query(query, values);
        res.json({ success: true, partner: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Software with this name already exists' });
        } else {
            console.error('Error inserting into Category_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        (async () => { await resetSequence('Software_Master', 'software_master_sw_id_seq', 'sw_id'); })();
    }
});
app.get('/software', async (req, res) => {
    try {
        const softwares = await pool.query('SELECT * FROM public.software_master ORDER BY sw_id ASC');
        res.json(softwares.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/software/:sw_id', async (req, res) => {
    const { sw_id } = req.params;
    const { Software_Name, Remarks, Updated_By } = req.body;
    const Updated_Time = new Date();

    try {
        const query = `
            UPDATE Software_Master
            SET Software_Name = $1, Remarks = $2, Updated_By = $4, Updated_Date = $5
            WHERE sw_id = $3
            RETURNING *;
        `;
        const values = [Software_Name, Remarks, sw_id, Updated_By, Updated_Time];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json({ success: true, software: result.rows[0] });
        } else {
            res.json({ success: false, error: 'No software found with the given id' });
        }
    } catch (error) {
        console.error('Error updating Software_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/software/inactivate', async (req, res) => {
    const { sw_id } = req.body;

    try {
        const query = `
            UPDATE Software_Master 
            SET Status = false 
            WHERE sw_id = $1
            RETURNING *;
        `;
        const values = [sw_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Software not found' });
        }
    } catch (error) {
        console.error('Error updating Software_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/software/activate', async (req, res) => {
    const { sw_id } = req.body;

    try {
        const query = `
            UPDATE Software_Master 
            SET Status = true 
            WHERE sw_id = $1
            RETURNING *;
        `;
        const values = [sw_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Software not found' });
        }
    } catch (error) {
        console.error('Error updating Software_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.post('/category-form', async (req, res) => {
    const { Category_Name, Remarks, created_by } = req.body;
    try {
        const created_time = new Date();
        const status = true;

        const query = `
            INSERT INTO Category_Master 
            (Category, Remarks, Status, Created_By, Created_Time) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [Category_Name, Remarks, status, created_by, created_time]

        const { rows } = await pool.query(query, values);
        res.json({ success: true, partner: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Category with this name already exists' });
        } else {
            console.error('Error inserting into Category_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        (async () => { await resetSequence('Category_Master', 'category_master_cat_id_seq', 'cat_id'); })();
    }
});
app.get('/category', async (req, res) => {
    try {
        const categories = await pool.query('SELECT * FROM public.category_master ORDER BY cat_id ASC');
        res.json(categories.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/category/:cat_id', async (req, res) => {
    const { cat_id } = req.params;
    const { Category_Name, Remarks, Updated_By } = req.body;
    const Updated_Time = new Date();

    try {
        const query = `
            UPDATE Category_Master
            SET Category = $1, Remarks = $2, Updated_By = $4, Updated_Date = $5
            WHERE cat_id = $3
            RETURNING *;
        `;
        const values = [Category_Name, Remarks, cat_id, Updated_By, Updated_Time];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json({ success: true, Category: result.rows[0] });
        } else {
            res.json({ success: false, error: 'No Category found with the given id' });
        }
    } catch (error) {
        console.error('Error updating Category_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/category/inactivate', async (req, res) => {
    const { cat_id } = req.body;

    try {
        const query = `
            UPDATE Category_Master 
            SET Status = false 
            WHERE cat_id = $1
            RETURNING *;
        `;
        const values = [cat_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating Category_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/category/activate', async (req, res) => {
    const { cat_id } = req.body;

    try {
        const query = `
            UPDATE Category_Master 
            SET Status = true 
            WHERE cat_id = $1
            RETURNING *;
        `;
        const values = [cat_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating Category_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



app.post('/status-form', async (req, res) => {
    const { Status_Name, Remarks, created_by } = req.body;
    try {
        const created_time = new Date();
        const status = true;

        const query = `
            INSERT INTO Status_Master 
            (Status, Remarks, Status_Activity, Created_By, Created_Time) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [Status_Name, Remarks, status, created_by, created_time]

        const { rows } = await pool.query(query, values);
        res.json({ success: true, partner: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Status with this name already exists' });
        } else {
            console.error('Error inserting into Status_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        (async () => { await resetSequence('Status_Master', 'status_master_status_id_seq', 'status_id'); })();
    }
});
app.get('/status', async (req, res) => {
    try {
        const statuses = await pool.query('SELECT * FROM public.status_master ORDER BY status_id ASC');
        res.json(statuses.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/status/:status_id', async (req, res) => {
    const { Status_id } = req.params;
    const { Status_Name, Remarks, Updated_By } = req.body;
    const Updated_Time = new Date();

    try {
        const query = `
            UPDATE Status_Master
            SET status = $1, Remarks = $2, Updated_By = $4, Updated_Date = $5
            WHERE status_id = $3
            RETURNING *;
        `;
        const values = [Status_Name, Remarks, Status_id, Updated_By, Updated_Time];

        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            res.json({ success: true, status: result.rows[0] });
        } else {
            res.json({ success: false, error: 'No status found with the given id' });
        }
    } catch (error) {
        console.error('Error updating Status_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/status/inactivate', async (req, res) => {
    const { status_id } = req.body;

    try {
        const query = `
            UPDATE Status_Master 
            SET Status_Activity = false 
            WHERE status_id = $1
            RETURNING *;
        `;
        const values = [status_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Status not found' });
        }
    } catch (error) {
        console.error('Error updating Status_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/status/activate', async (req, res) => {
    const { status_id } = req.body;

    try {
        const query = `
            UPDATE Status_Master 
            SET status_activity = true 
            WHERE status_id = $1
            RETURNING *;
        `;
        const values = [status_id];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Status not found' });
        }
    } catch (error) {
        console.error('Error updating Status_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.get('/partner-codes', async (req, res) => {
    try {
        const query = 'SELECT partner_code FROM Partner_Master WHERE status = true';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching partner codes:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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