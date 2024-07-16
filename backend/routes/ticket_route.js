import express from 'express';
import multer from 'multer';
import upload from '../middlewares/upload_middleware.js';
import { updateTicket, createTicket, getTicket } from '../controllers/ticket_controller.js';

const app = express();
// const upload = multer({dest: 'uploads/'});

app.put('/:ticket_id', upload.single('File_Path'), updateTicket);
app.get('/', getTicket);
app.post('/ticket-form', upload.single('File_Path'), createTicket);

app.

export default app;