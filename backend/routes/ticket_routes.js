import express from "express";
const app = express();


app.post('/ticket-form', async (req, res) => {
    const { Requested_by, Organization, Partner_Name, Software_Name, Description, Priority, Category, Status, Created_By, Title } = req.body;

    try {
        const created_time = new Date();

        const query = `
            INSERT INTO ticket
            (Requested_by, Organization, Partner_Name, Software_Name, Category, Status,  Title, Priority, Description, Created_By, created_time) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        const values = [Requested_by, Organization, Partner_Name, Software_Name, Category, Status, Title, Priority, Description, Created_By, created_time];

        const { rows } = await pool.query(query, values);
        res.json({ success: true, ticket: rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            res.status(409).json({ success: false, message: 'Ticket already exists' });
        } else {
            console.error('Error inserting into Ticket_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
});
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Ticket');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
app.put('/:ticket_id', async (req, res) => {
    const { ticket_id } = req.params;
    const {
        Requested_by, Organization, Partner_Name, Software_Name, Title, Description, Priority, Category, Status, updated_by,
        escalate, escalate_to, Update_Description, created_by
    } = req.body;

    const client = await db.connect(); // Assuming db pool setup with client

    try {
        const updated_time = new Date();
        const created_time = new Date();
        await client.query('BEGIN');

        // Update ticket details
        const ticketUpdateQuery = `
            UPDATE ticket
            SET Requested_by = $1, Organization = $2, Partner_Name = $3, Software_Name = $4, Title = $5, Description = $6, 
                Priority = $7, Category = $8, Status = $9, updated_by = $10, updated_time = $11
            WHERE Ticket_Id = $12
        `;
        const ticketUpdateValues = [Requested_by, Organization, Partner_Name, Software_Name, Title, Description, Priority, Category, Status, updated_by, updated_time, ticket_id];
        await client.query(ticketUpdateQuery, ticketUpdateValues);

        // Insert new escalation entry
        const insertEscalationQuery = `
                    INSERT INTO update_master (ticket_id, escalate, escalate_to, description, created_by, created_time)
                    VALUES ($1, $2, $3, $4, $5, NOW())
                `;
        const insertEscalationValues = [ticket_id, escalate, escalate_to, Update_Description, created_by, created_time];
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