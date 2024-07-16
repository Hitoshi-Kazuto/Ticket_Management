import pool from "../config.js";
import express from "express";
const app = express();

export const createCategory = async (req, res) => {
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
};
export const getCategory = async (req, res) => {
    try {
        const categories = await pool.query('SELECT * FROM public.category_master ORDER BY cat_id ASC');
        res.json(categories.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const updateCategory = async (req, res) => {
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
};
export const inactivateCategory = async (req, res) => {
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
};
export const activateCategory = async (req, res) => {
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
};

export default app;