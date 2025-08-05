import express from 'express';
import multer from 'multer';
import upload from '../middlewares/upload_middleware.js';
import { 
    updateTicket, 
    createTicketAdmin, 
    createTicketUser, 
    createTicketHelpdesk,
    getTicketsAdmin,
    getTicketsUser,
    getTicketsHelpdesk,
    getTicketUpdates, 
    getWithdrawnUpdates, 
    withdrawTicket, 
    getClosedAndWithdrawnTicketsAdmin, 
    getClosedAndWithdrawnTicketsUser, 
    getClosedAndWithdrawnTicketsHelpdesk, 
    getClosedAndWithdrawnTicketsHelpdeskVendor,
    getAssignStaff,
    assignStaffHelpdesk,
    updateTicketAdmin,
    updateTicketHelpdesk,
    getTicketByFilePathAdmin,
    getTicketsHelpdeskVendorAssigned,
    getTicketStats
} from '../controllers/ticket_controller.js';
import verifyToken from '../middlewares/authenticate.js';

const router = express.Router();

// Regular ticket routes
router.put('/:ticket_id', upload.array('File_Path'), updateTicket);
router.get('/admin-access', getTicketsAdmin);
router.get('/user-access/:username', getTicketsUser);
router.get('/helpdesk-access/all', getTicketsHelpdesk);

// Ticket creation routes
router.post('/admin-access/ticket-form', upload.array('File_Path'), createTicketAdmin);
router.post('/user-access/ticket-form', upload.array('File_Path'), createTicketUser);
router.post('/helpdesk-access/ticket-form', upload.array('File_Path'), createTicketHelpdesk);

// Ticket withdrawal route
router.put('/withdraw/:ticket_id', withdrawTicket);

// Ticket updates routes
router.get('/admin-access/ticket-updates/:ticket_id', getTicketUpdates);
router.get('/withdrawn-updates/:ticket_id', getWithdrawnUpdates);

// Closed and withdrawn tickets routes
router.get('/closed-and-withdrawn-ticket/admin-access', getClosedAndWithdrawnTicketsAdmin);
router.get('/closed-and-withdrawn-ticket/user-access/:username', getClosedAndWithdrawnTicketsUser);
router.get('/closed-and-withdrawn-ticket/helpdesk-access', getClosedAndWithdrawnTicketsHelpdesk);
router.get('/closed-and-withdrawn-ticket/helpdesk-access/partner/:partnerCode', getClosedAndWithdrawnTicketsHelpdeskVendor);

// New routes
router.get('/assign-staff', getAssignStaff);
router.put('/helpdesk-access/assign-staff/:ticket_id', assignStaffHelpdesk); // No file upload here based on controller
router.put('/admin-access/update/:ticket_id', upload.array('File_Path'), updateTicketAdmin);
router.put('/helpdesk-access/update/:ticket_id', upload.array('File_Path'), updateTicketHelpdesk);
router.get('/admin-access/file/:File_Path', getTicketByFilePathAdmin);
router.get('/helpdesk-access/assigned/:username', getTicketsHelpdeskVendorAssigned);
router.get('/dashboard/stats', verifyToken, getTicketStats);

export default router;