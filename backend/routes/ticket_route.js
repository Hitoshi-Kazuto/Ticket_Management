import express from 'express';
import multer from 'multer';
import upload from '../middlewares/upload_middleware.js';
import { updateTicket, createTicket, getTicket, getTicketUpdates, getWithdrawnUpdates, getTicketById } from '../controllers/ticket_controller.js';
import verifyToken from '../middlewares/authenticate.js';
import { pool } from '../db/db.js';

const app = express();
// const upload = multer({dest: 'uploads/'});

app.put('/:ticket_id', upload.single('File_Path'), updateTicket);
app.get('/', getTicket);
app.post('/ticket-form', upload.single('File_Path'), createTicket);
app.put('/withdraw/:ticket_id', withdrawTicket);
app.get('/admin-access/ticket-updates/:ticket_id', verifyToken, getTicketUpdates);

export default app;