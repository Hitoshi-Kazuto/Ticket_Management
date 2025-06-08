import pool from "../config.js";
import express from "express";
import fs from 'fs'
import path from "path";
import upload from "../middlewares/upload_middleware.js"
const app = express();

// Ensure uploads directory exists
// const __dirname = path.resolve();
// const uploadDir = 'tmp/uploads/tmp/';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, {recursive: true});
// }
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/admin-access/ticket-form', upload.single('file'), async (req, res) => {
    const { Requested_by, Organization, Partner_code, Software_Name, Description, Priority, Category, Status, created_by, Title, Assigned_Staff } = req.body;
    const file = req.file;

    try {
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const query = `
            INSERT INTO ticket
            (Requested_by, Organization, Partner_code, Software_Name, Category, Status,  Title, Priority, Description, created_by, created_time, assigned_staff) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;
        const values = [Requested_by, Organization, Partner_code, Software_Name, Category, Status, Title, Priority, Description, created_by, created_time, Assigned_Staff];

        const { rows } = await pool.query(query, values);
        const ticket_id = rows[0].ticket_id;
        if (file) {
            // Move file from temporary storage to final location
            const finalPath = path.join(`${file.path}`);
            console.log(`Temporary File Path: ${file.path}`);
            console.log(`Final File Path: ${finalPath}`);
            fs.renameSync(file.path, finalPath);

            // Update the file path in the database
            const updateQuery = `
                UPDATE ticket
                SET File_Path = $1
                WHERE ticket_id = $2
                RETURNING *;
            `;
            const updateValues = [finalPath, ticket_id];
            const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

            return res.json({ success: true, ticket: updatedRows[0] });
        }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        if (file) {
            // Clean up the uploaded file if the query fails
            fs.unlinkSync(file.path);
        }

        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
});
app.post('/user-access/ticket-form', upload.single('file'), async (req, res) => {
    const { Requested_by, Organization, Partner_code, Software_Name, Description, Priority, Category, Status, created_by, Title } = req.body;

    try {
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const query = `
            INSERT INTO ticket
            (Requested_by, Organization, Partner_code, Software_Name, Status, Title, Priority, Description, created_by, created_time) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;
        const values = [Requested_by, Organization, Partner_code, Software_Name, Status, Title, Priority, Description, created_by, created_time];

        const { rows } = await pool.query(query, values);
        const ticket_id = rows[0].ticket_id;
        // if (file) {
        //     // Move file from temporary storage to final location
        //     const finalPath = path.join(`${file.path}`);
        //     console.log(`Temporary File Path: ${file.path}`);
        //     console.log(`Final File Path: ${finalPath}`);
        //     fs.renameSync(file.path, finalPath);

        //     // Update the file path in the database
        //     const updateQuery = `
        //         UPDATE ticket
        //         SET File_Path = $1
        //         WHERE ticket_id = $2
        //         RETURNING *;
        //     `;
        //     const updateValues = [finalPath, ticket_id];
        //     const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

        //     return res.json({ success: true, ticket: updatedRows[0] });
        // }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        // if (file) {
        //     // Clean up the uploaded file if the query fails
        //     fs.unlinkSync(file.path);
        // }

        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
});
app.post('/helpdesk-access/ticket-form', upload.single('file'), async (req, res) => {
    const { Requested_by, Organization, Partner_code, Software_Name, Description, Priority, Category, Status, created_by, Title, Assigned_Staff } = req.body;
    // const file = req.file;

    try {
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const query = `
            INSERT INTO ticket
            (Requested_by, Organization, Partner_code, Software_Name, Category, Status,  Title, Priority, Description, created_by, created_time, assigned_staff) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;
        const values = [Requested_by, Organization, Partner_code, Software_Name, Category, Status, Title, Priority, Description, created_by, created_time, Assigned_Staff];

        const { rows } = await pool.query(query, values);
        const ticket_id = rows[0].ticket_id;
        // if (file) {
        //     // Move file from temporary storage to final location
        //     const finalPath = path.join(`${file.path}`);
        //     console.log(`Temporary File Path: ${file.path}`);
        //     console.log(`Final File Path: ${finalPath}`);
        //     fs.renameSync(file.path, finalPath);

        //     // Update the file path in the database
        //     const updateQuery = `
        //         UPDATE ticket
        //         SET File_Path = $1
        //         WHERE ticket_id = $2
        //         RETURNING *;
        //     `;
        //     const updateValues = [finalPath, ticket_id];
        //     const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

        //     return res.json({ success: true, ticket: updatedRows[0] });
        // }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        // if (file) {
        //     // Clean up the uploaded file if the query fails
        //     fs.unlinkSync(file.path);
        // }

        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
});



app.get('/admin-access', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Ticket where status != 'Closed' ORDER BY created_time DESC");
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/helpdesk-access/all', async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket where status != 'Closed' ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/user-access/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const query = "SELECT * FROM Ticket where (requested_by = $1 OR created_by = $1) AND status != 'Closed' ORDER BY created_time DESC";
        const value = [username];
        const result = await pool.query(query, value);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/closed-ticket/admin-access', async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket where status = 'Closed' ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/closed-ticket/user-access/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const query = "SELECT * FROM Ticket where (requested_by = $1 OR created_by = $1) AND status = 'Closed' ORDER BY created_time DESC";
        const value = [username];
        const result = await pool.query(query, value);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.get('/closed-ticket/helpdesk-access', async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket where status = 'Closed' ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.get('/assign-staff', async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket where assigned_staff IS NULL ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.put('/helpdesk-access/assign-staff/:ticket_id', upload.single('file'), async (req, res) => {
    const { ticket_id } = req.params;
    const { Assigned_Staff, Category, Status } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        const ticketUpdateQuery = `
            UPDATE ticket
            SET assigned_staff = $1, category = $2, status = $3
            WHERE Ticket_Id = $4
        `;
        const ticketUpdateValues = [Assigned_Staff, Category, Status, ticket_id];
        await client.query(ticketUpdateQuery, ticketUpdateValues);
        
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing update:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release();
    }
});





app.put('/admin-access/:ticket_id', upload.single('file'), async (req, res) => {
    const { ticket_id } = req.params;
    const {
        Assigned_Staff, Status, updated_by,
        escalate, escalate_to, Update_Description, Technical_Description
    } = req.body;

    const client = await pool.connect();

    try {
        // Format timestamps with both date and time
        const updated_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        await client.query('BEGIN');

        const ticketUpdateQuery = `
            UPDATE ticket
            SET Status = $1, updated_by = $2, updated_time = $3, assigned_staff = $4
            WHERE Ticket_Id = $5
        `;
        const staffToAssign = (escalate && escalate_to) ? escalate_to : Assigned_Staff;
        const ticketUpdateValues = [Status, updated_by, updated_time, staffToAssign, ticket_id];
        await client.query(ticketUpdateQuery, ticketUpdateValues);

        // Insert new escalation entry
        const insertEscalationQuery = `
            INSERT INTO ticket_update (ticket_id, escalate, escalate_to, user_description, technical_description, created_by, created_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const insertEscalationValues = [ticket_id, escalate, escalate_to, Update_Description, Technical_Description, updated_by, created_time];
        await client.query(insertEscalationQuery, insertEscalationValues);

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing update:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release(); // Release client back to pool
    }
});

app.put('/helpdesk-access/:ticket_id', upload.single('file'), async (req, res) => {
    const { ticket_id } = req.params;
    const {
        Assigned_Staff, Status, updated_by,
        escalate, escalate_to, Update_Description, Technical_Description
    } = req.body;

    const client = await pool.connect(); // Assuming db pool setup with client

    try {
        const updated_time = new Date();
        const created_time = new Date();
        await client.query('BEGIN');

        // Update ticket details - use escalate_to as assigned_staff if escalating
        const ticketUpdateQuery = `
            UPDATE ticket
            SET Status = $1, updated_by = $2, updated_time = $3, assigned_staff = $4
            WHERE Ticket_Id = $5
        `;
        const staffToAssign = (escalate && escalate_to) ? escalate_to : Assigned_Staff;
        const ticketUpdateValues = [Status, updated_by, updated_time, staffToAssign, ticket_id];
        await client.query(ticketUpdateQuery, ticketUpdateValues);

        // Insert new update entry
        const insertEscalationQuery = `
            INSERT INTO ticket_update (ticket_id, escalate, escalate_to, user_description, technical_description, created_by, created_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const insertEscalationValues = [ticket_id, escalate, escalate_to, Update_Description, Technical_Description, updated_by, created_time];
        await client.query(insertEscalationQuery, insertEscalationValues);

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing update:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release();
    }
});


// app.get('/admin-access/:File_Path', async (req, res) => {
//     const File_Path = req.params.File_Path;
//     console.log(File_Path);
//     try {
//         const query = `
//             SELECT * FROM ticket
//             WHERE file_path = $1;
//         `;
//         const values = [File_Path];

//         const { rows } = await pool.query(query, values);

//         if (rows.length === 0) {
//             return res.status(404).json({ success: false, message: 'Ticket not found' });
//         }

//         res.json({ success: true, ticket: rows[0] });
//     } catch (error) {
//         console.error('Error fetching ticket:', error);
//         res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// });

app.get('/admin-access/ticket-updates/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
    try {
        const query = 'SELECT * FROM ticket_update WHERE ticket_id = $1 ORDER BY created_time DESC';
        const values = [ticket_id];
        const result = await pool.query(query, values);
        res.json({ success: true, updates: result.rows });
    } catch (error) {
        console.error('Error fetching updates:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.put('/withdraw/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Get the current time for the update
        const updated_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Update ticket status to Closed
        const ticketUpdateQuery = `
            UPDATE ticket
            SET status = 'Withdraw', 
                updated_time = $1
            WHERE ticket_id = $2
            RETURNING *;
        `;
        const ticketUpdateValues = [updated_time, ticket_id];
        const updatedTicket = await client.query(ticketUpdateQuery, ticketUpdateValues);

        // Add an entry in ticket_update table to record the withdrawal
        const insertUpdateQuery = `
            INSERT INTO ticket_update 
            (ticket_id, user_description, created_by, created_time)
            VALUES ($1, $2, $3, $4)
        `;
        const insertUpdateValues = [
            ticket_id,
            'Ticket withdrawn by requester',
            updatedTicket.rows[0].requested_by,
            created_time
        ];
        await client.query(insertUpdateQuery, insertUpdateValues);

        await client.query('COMMIT');
        res.json({ success: true, message: 'Ticket withdrawn successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing withdrawal:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release();
    }
});

export const getWithdrawnUpdates = async (req, res) => {
    const { ticket_id } = req.params;
    try {
        // First verify the ticket is withdrawn
        const ticketQuery = "SELECT status FROM ticket WHERE ticket_id = $1";
        const ticketResult = await pool.query(ticketQuery, [ticket_id]);
        
        if (ticketResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        if (ticketResult.rows[0].status !== 'Withdraw') {
            return res.status(400).json({ success: false, message: 'Ticket is not withdrawn' });
        }

        // Get all updates for the withdrawn ticket
        const updatesQuery = `
            SELECT * FROM ticket_update 
            WHERE ticket_id = $1 
            ORDER BY created_time DESC
        `;
        
        const updatesResult = await pool.query(updatesQuery, [ticket_id]);
        
        res.json({
            success: true,
            updates: updatesResult.rows
        });
    } catch (error) {
        console.error('Error fetching withdrawn ticket updates:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getTicketUpdates = async (req, res) => {
    const { ticket_id } = req.params;
    try {
        const query = 'SELECT * FROM ticket_update WHERE ticket_id = $1 ORDER BY created_time DESC';
        const values = [ticket_id];
        const result = await pool.query(query, values);
        res.json({ success: true, updates: result.rows });
    } catch (error) {
        console.error('Error fetching updates:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getTicketById = async (req, res) => {
    const { ticket_id } = req.params;
    try {
        const query = 'SELECT * FROM ticket WHERE ticket_id = $1';
        const values = [ticket_id];
        const result = await pool.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// ... existing code ...




export default app;