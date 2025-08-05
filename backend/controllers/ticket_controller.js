import pool from "../config.js";
import express from "express";
import fs from 'fs'
import path from "path";
import upload from "../middlewares/upload_middleware.js"
const app = express();

// Ensure uploads directory exists
const __dirname = path.resolve();
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

export const createTicketAdmin = async (req, res) => {
    const { Requested_by, Organization, Partner_code, Software_Name, Description, Priority, Category, Status, created_by, Title, Assigned_Staff } = req.body;
    const files = req.files;

    let uploadedFilePaths = [];

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

        if (files && files.length > 0) {
            const filePaths = [];
            files.forEach(file => {
                const finalPath = path.join(uploadDir, file.filename);
                fs.renameSync(file.path, finalPath);
                filePaths.push(finalPath);
                uploadedFilePaths.push(finalPath);
            });

            const updateQuery = `
                UPDATE ticket
                SET File_Path = $1
                WHERE ticket_id = $2
                RETURNING *;
            `;
            const updateValues = [filePaths, ticket_id];
            const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

            return res.json({ success: true, ticket: updatedRows[0] });
        }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        uploadedFilePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};

export const createTicketUser = async (req, res) => {
    const { Requested_by, Organization, Partner_code, Software_Name, Description, Priority, Category, Status, created_by, Title } = req.body;
    const files = req.files;

    let uploadedFilePaths = [];

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
        if (files && files.length > 0) {
            const filePaths = [];
            files.forEach(file => {
                const finalPath = path.join(uploadDir, file.filename);
                fs.renameSync(file.path, finalPath);
                filePaths.push(finalPath);
                uploadedFilePaths.push(finalPath);
            });

            const updateQuery = `
                UPDATE ticket
                SET File_Path = $1
                WHERE ticket_id = $2
                RETURNING *;
            `;
            const updateValues = [filePaths, ticket_id];
            const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

            return res.json({ success: true, ticket: updatedRows[0] });
        }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        uploadedFilePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};

export const createTicketHelpdesk = async (req, res) => {
    const { Requested_by, Organization, Partner_code, Software_Name, Description, Priority, Category, Status, created_by, Title, Assigned_Staff } = req.body;
    const files = req.files;

    let uploadedFilePaths = [];

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
        if (files && files.length > 0) {
            const filePaths = [];
            files.forEach(file => {
                const finalPath = path.join(uploadDir, file.filename);
                fs.renameSync(file.path, finalPath);
                filePaths.push(finalPath);
                uploadedFilePaths.push(finalPath);
            });

            const updateQuery = `
                UPDATE ticket
                SET File_Path = $1
                WHERE ticket_id = $2
                RETURNING *;
            `;
            const updateValues = [filePaths, ticket_id];
            const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

            return res.json({ success: true, ticket: updatedRows[0] });
        }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        uploadedFilePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};

export const getTicketsAdmin = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Ticket where status != 'Closed' ORDER BY created_time DESC");
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getTicketsHelpdesk = async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket where status != 'Closed' ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getTicketsUser = async (req, res) => {
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
};

export const getClosedAndWithdrawnTicketsAdmin = async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket WHERE status IN ('Closed', 'Withdraw') ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching closed and withdrawn tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getClosedAndWithdrawnTicketsUser = async (req, res) => {
    const { username } = req.params;
    try {
        const query = "SELECT * FROM Ticket WHERE (requested_by = $1 OR created_by = $1) AND status IN ('Closed', 'Withdraw') ORDER BY created_time DESC";
        const value = [username];
        const result = await pool.query(query, value);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching closed and withdrawn tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getClosedAndWithdrawnTicketsHelpdesk = async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket WHERE status IN ('Closed', 'Withdraw') ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching closed and withdrawn tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getClosedAndWithdrawnTicketsHelpdeskVendor = async (req, res) => {
    const { partnerCode } = req.params;
    try {
        const query = "SELECT * FROM Ticket WHERE partner_code = $1 AND status IN ('Closed', 'Withdraw') ORDER BY created_time DESC";
        const values = [partnerCode];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching closed and withdrawn tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const getAssignStaff = async (req, res) => {
    try {
        const query = "SELECT * FROM Ticket where assigned_staff IS NULL ORDER BY created_time DESC";
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const assignStaffHelpdesk = async (req, res) => {
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
};

export const updateTicketAdmin = async (req, res) => {
    const { ticket_id } = req.params;
    const {
        Assigned_Staff, Status, updated_by,
        escalate, escalate_to, Update_Description, Technical_Description
    } = req.body;

    const files = req.files;

    let uploadedFilePaths = [];

    const client = await pool.connect();

    try {
        const updated_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');

        await client.query('BEGIN');

        // Fetch current file paths from the ticket
        const currentTicketQuery = `
            SELECT File_Path FROM ticket
            WHERE Ticket_Id = $1
        `;
        const { rows: currentTicketRows } = await client.query(currentTicketQuery, [ticket_id]);
        let existingFilePaths = currentTicketRows[0]?.File_Path || [];
        if (typeof existingFilePaths === 'string') {
            existingFilePaths = [existingFilePaths];
        }

        let newFilePaths = [];
        if (files && files.length > 0) {
            files.forEach(file => {
                const finalPath = path.join(uploadDir, file.filename);
                fs.renameSync(file.path, finalPath);
                newFilePaths.push(finalPath);
                uploadedFilePaths.push(finalPath); // Add to cleanup list
            });
        }
        const combinedFilePaths = [...existingFilePaths, ...newFilePaths];

        const ticketUpdateQuery = `
            UPDATE ticket
            SET Status = $1, updated_by = $2, updated_time = $3, assigned_staff = $4, file_path = $5
            WHERE Ticket_Id = $6
        `;
        const staffToAssign = (escalate && escalate_to) ? escalate_to : Assigned_Staff;
        const ticketUpdateValues = [Status, updated_by, updated_time, staffToAssign, combinedFilePaths, ticket_id];
        await client.query(ticketUpdateQuery, ticketUpdateValues);

        const insertEscalationQuery = `
            INSERT INTO ticket_update (ticket_id, escalate, escalate_to, user_description, technical_description, created_by, created_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const insertEscalationValues = [ticket_id, escalate, escalate_to, Update_Description, Technical_Description, updated_by, created_time];
        await client.query(insertEscalationQuery, insertEscalationValues); // Use client.query for consistency within transaction

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing update:', err);

        // Clean up newly uploaded files if an error occurs
        uploadedFilePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const updateTicketHelpdesk = async (req, res) => {
    const { ticket_id } = req.params;
    const {
        Assigned_Staff, Status, updated_by,
        escalate, escalate_to, Update_Description, Technical_Description
    } = req.body;

    const files = req.files;

    let uploadedFilePaths = [];

    const client = await pool.connect();

    try {
        const updated_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const created_time = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await client.query('BEGIN');

        // Fetch current file paths from the ticket
        const currentTicketQuery = `
            SELECT File_Path FROM ticket
            WHERE Ticket_Id = $1
        `;
        const { rows: currentTicketRows } = await client.query(currentTicketQuery, [ticket_id]);
        let existingFilePaths = currentTicketRows[0]?.File_Path || [];
        if (typeof existingFilePaths === 'string') {
            existingFilePaths = [existingFilePaths];
        }

        let newFilePaths = [];
        if (files && files.length > 0) {
            files.forEach(file => {
                const finalPath = path.join(uploadDir, file.filename);
                fs.renameSync(file.path, finalPath);
                newFilePaths.push(finalPath);
                uploadedFilePaths.push(finalPath); // Add to cleanup list
            });
        }
        const combinedFilePaths = [...existingFilePaths, ...newFilePaths];

        const ticketUpdateQuery = `
            UPDATE ticket
            SET Status = $1, updated_by = $2, updated_time = $3, assigned_staff = $4, file_path = $5
            WHERE Ticket_Id = $6
        `;
        const staffToAssign = (escalate && escalate_to) ? escalate_to : Assigned_Staff;
        const ticketUpdateValues = [Status, updated_by, updated_time, staffToAssign, combinedFilePaths, ticket_id];
        await client.query(ticketUpdateQuery, ticketUpdateValues);

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

        uploadedFilePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const getTicketByFilePathAdmin = async (req, res) => {
    const File_Path = req.params.File_Path;
    try {
        const query = `
            SELECT * FROM ticket
            WHERE $1 = ANY(file_path);
        `;
        const values = [File_Path];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const updateTicket = async (req, res) => {
    const { ticket_id } = req.params;
    const {
        Assigned_Staff, Status, updated_by,
        escalate, escalate_to, Update_Description, Technical_Description
    } = req.body;

    const client = await pool.connect();

    try {
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

        const insertEscalationQuery = `
            INSERT INTO ticket_update (ticket_id, escalate, escalate_to, user_description, technical_description, created_by, created_time)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const insertEscalationValues = [ticket_id, escalate, escalate_to, Update_Description, Technical_Description, updated_by, created_time];
        await client.query(insertEscalationQuery, insertEscalationValues); // Use client.query for consistency within transaction

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error processing update:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        client.release();
    }
};

export const withdrawTicket = async (req, res) => {
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
            'Ticket withdrawn',
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

export const getWithdrawnUpdates = async (req, res) => {
    const { ticket_id } = req.params;
    try {
        const query = 'SELECT * FROM ticket_update WHERE ticket_id = $1 ORDER BY created_time DESC';
        const values = [ticket_id];
        const result = await pool.query(query, values);
        res.json({ success: true, updates: result.rows });
    } catch (error) {
        console.error('Error fetching withdrawn updates:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

// Get tickets assigned to a specific helpdesk vendor (by username)
export const getTicketsHelpdeskVendorAssigned = async (req, res) => {
    const { username } = req.params;
    try {
        const query = "SELECT * FROM Ticket WHERE assigned_staff = $1 AND status != 'Closed' ORDER BY created_time DESC";
        const values = [username];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching assigned tickets for helpdesk vendor:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};


// Ticket statistics for dashboard
export const getTicketStats = async (req, res) => {
    try {
        console.log('Dashboard stats req.user:', req.user);
        if (!req.user || !req.user.role) {
            return res.status(400).json({ success: false, error: 'User role not found in token' });
        }
        const role = req.user.role;
        const username = req.user.username;
        let whereClause = '';
        let values = [];
        if (role === 'Partner' || role === 'Orbis' || role === 'User' || role === 'Helpdesk-Vendor') {
            if (!username) {
                return res.status(400).json({ success: false, error: 'Username not found in token' });
            }
            whereClause = 'WHERE (requested_by = $1 OR created_by = $1)';
            values = [username];
        }
        // Get all statuses from Status_Master
        const statusMasterResult = await pool.query("SELECT status FROM Status_Master WHERE status_activity = 'True'");
        const allStatuses = statusMasterResult.rows.map(row => row.status);
        // Get all tickets for this user/role
        const baseQuery = `SELECT status, priority FROM ticket ${whereClause}`;
        const result = await pool.query(baseQuery, values);
        const rows = result.rows;
        // Count by status
        const statusCounts = {};
        allStatuses.forEach(status => {
            statusCounts[status] = 0;
        });
        rows.forEach(row => {
            if (row.status && statusCounts.hasOwnProperty(row.status)) {
                statusCounts[row.status]++;
            }
        });
        // Priority counts (unchanged)
        const priorityCounts = { critical: 0, high: 0, medium: 0, low: 0 };
        let total = rows.length;
        rows.forEach(row => {
            if (row.priority && row.priority.toLowerCase() === 'critical') priorityCounts.critical++;
            else if (row.priority && row.priority.toLowerCase() === 'high') priorityCounts.high++;
            else if (row.priority && row.priority.toLowerCase() === 'medium') priorityCounts.medium++;
            else if (row.priority && row.priority.toLowerCase() === 'low') priorityCounts.low++;
        });
        res.json({
            total,
            statusCounts,
            critical: priorityCounts.critical,
            high: priorityCounts.high,
            medium: priorityCounts.medium,
            low: priorityCounts.low
        });
    } catch (error) {
        console.error('Error fetching ticket stats:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export default app;