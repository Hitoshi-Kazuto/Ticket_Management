import express from "express";
const app = express();

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
app.get('/', async (req, res) => {
    try {
        const softwares = await pool.query('SELECT * FROM public.software_master ORDER BY sw_id ASC');
        res.json(softwares.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/:sw_id', async (req, res) => {
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
app.post('/inactivate', async (req, res) => {
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
app.post('/activate', async (req, res) => {
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

export default app;