import express from 'express';
import multer from 'multer';
import upload from '../middlewares/upload_middleware.js';
import { updateTicket, createTicket, getTicket } from '../controllers/ticket_controller.js';
import verifyToken from '../middlewares/authenticate.js';

const app = express();
// const upload = multer({dest: 'uploads/'});

app.put('/:ticket_id', verifyToken, upload.single('File_Path'), updateTicket);
app.get('/', verifyToken, getTicket);
app.post('/ticket-form', verifyToken, upload.single('File_Path'), createTicket);


export default app;