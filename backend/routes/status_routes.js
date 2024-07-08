import express from "express";
const app = express();

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
app.get('/', async (req, res) => {
    try {
        const statuses = await pool.query('SELECT * FROM public.status_master ORDER BY status_id ASC');
        res.json(statuses.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/:status_id', async (req, res) => {
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
app.post('/inactivate', async (req, res) => {
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
app.post('/activate', async (req, res) => {
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

export default app;