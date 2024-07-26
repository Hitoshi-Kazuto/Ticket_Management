import pool from "../config.js";
import express from "express";
import bcrypt from "bcrypt";

const app = express();

export const createUser = async (req, res) => {
    const {
        name,
        username,
        password,
        confirmPassword,
        email,
        mobile,
        role,
        partner_name,
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
            (user_id, name, username, password, email_address, mobile_number, role, partner_name, active_status, created_by, created_time, valid_from, valid_till) 
            VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *;
        `;
        const values = [name, username, hashedPassword, email, mobile, role, partner_name, active_status, created_by, created_time, valid_from, valid_till];

        const result = await pool.query(query, values);

        res.json({ success: true, user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            let message = 'User with this ';
            if (error.constraint === 'user_master_username_key') {
                message += 'username';
            } else if (error.constraint === 'user_master_email_address_key') {
                message += 'email';
            } else if (error.constraint === 'unique_mobile_number') {
                message += 'mobile number';
            }
            message += ' already exists';
            res.status(409).json({ success: false, message });
            console.log(message);
        } else {
            console.error('Error inserting into User_Master:', error);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};

export const getUser = async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM public.User_master ORDER BY username ASC');
        res.json(users.rows);
    } catch (error) {
        console.error('Error fetching status', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateUser = async (req, res) => {
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
};

export const inactivateUser = async (req, res) => {
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
};

export const activateUser = async (req, res) => {
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
};

export default app;