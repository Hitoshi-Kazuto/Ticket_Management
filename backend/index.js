import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body; //get the credentials from request body
    // console.log('Received login request:', username, password); // Debugging: log received credentials

    try {
        const result = await pool.query('SELECT * FROM user_master WHERE username = $1', [username]); // run query to find the associated user
        // console.log('Query result:', result.rows); // Debugging: log query result

        if (result.rows.length > 0) { // as the array is returned from the query
            const user = result.rows[0]; // get the first element and check if the passwords match
            if (password === user.password) {
                req.session.userId = user.id; // Create a session
                res.json({ success: true });
            } else if (password != user.password) {
                res.json({ success: false, message: 'Incorrect password.' });
            } else if (!user.active_status) {
                return res.status(403).json({ success: false, message: 'User account is inactive' });
            } else {
                res.json({ success: false, message: 'User not found' });
            }
        }
    } catch (error) {
        console.error('Error during authentication', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'Failed to log out' });
        }
        res.clearCookie('connect.sid'); // Clear the cookie
        res.json({ success: true });
    });
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
        const created_time = new Date();
        const active_status = true;
        const query = `
            INSERT INTO user_master
            (user_id, name, username, password, confirm_password, email_address, mobile_number, role, partner_code, active_status, created_by, created_time, valid_from, valid_till) 
            VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *;
        `;
        const values = [name, username, password, confirmPassword, email, mobile, role, partner_code, active_status, created_by, created_time, valid_from, valid_till];

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
        const query = `
            UPDATE user_master
            SET password = $2, confirm_password = $3, email_address = $4, mobile_number = $5, valid_till = $6, updated_by = $7, updated_time = $8
            WHERE user_id = $1
            RETURNING *;
        `;
        const values = [user_id, password, confirm_password, email_address, mobile_number, valid_till, updated_by, updated_time];

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

        await pool.query(query, values);

        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting into Partner_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/partner', async (req, res) => {
    const { search, status } = req.query;
    let query = 'SELECT * FROM Partner_Master WHERE 1=1';
    let values = [];
    let paramIndex = 1; // Track parameter index for dynamic query

    if (search) {
        query += ` AND Partner_Name ILIKE $${paramIndex}`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        query += ` AND Status = $${paramIndex}`;
        values.push(status === 'active');
        paramIndex++;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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

        await pool.query(query, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting into Software_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/software', async (req, res) => {
    const { search, status } = req.query;
    let query = 'SELECT * FROM Software_Master WHERE 1=1';
    let values = [];
    let paramIndex = 1; // Track parameter index for dynamic query

    if (search) {
        query += ` AND Software_Name ILIKE $${paramIndex}`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        query += ` AND Status = $${paramIndex}`;
        values.push(status === 'active');
        paramIndex++;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching softwares:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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

        await pool.query(query, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting into Category_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/category', async (req, res) => {
    const { search, status } = req.query;
    let query = 'SELECT * FROM Category_Master WHERE 1=1';
    let values = [];
    let paramIndex = 1; // Track parameter index for dynamic query

    if (search) {
        query += ` AND Category ILIKE $${paramIndex}`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        query += ` AND Status = $${paramIndex}`;
        values.push(status === 'active');
        paramIndex++;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching Categories:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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

        await pool.query(query, values);
        res.json({ success: true });
    } catch (error) {
        console.error('Error inserting into Status_Master:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/status', async (req, res) => {
    const { search, status } = req.query;
    let query = 'SELECT * FROM Status_Master WHERE 1=1';
    let values = [];
    let paramIndex = 1; // Track parameter index for dynamic query

    if (search) {
        query += ` AND status ILIKE $${paramIndex}`;
        values.push(`%${search}%`);
        paramIndex++;
    }

    if (status) {
        query += ` AND Status_Activity = $${paramIndex}`;
        values.push(status === 'active');
        paramIndex++;
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching Categories:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
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
