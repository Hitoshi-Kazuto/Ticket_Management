import pool from "../config.js"
import express from "express";
const app = express();

export const createPartner = async (req, res) => {
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
};

export const getPartner = async (req, res) => {
    try {
        const partners = await pool.query('SELECT * FROM public.partner_master ORDER BY partner_id ASC');
        res.json(partners.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updatePartner = async (req, res) => {
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
};

export const inactivatePartner = async (req, res) => {
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
};

export const activatePartner = async (req, res) => {
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
};


export default app;