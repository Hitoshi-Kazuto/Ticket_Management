import multer from 'multer';
import path from 'path';
import slugify from 'slugify';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = new Date() + '-' + Math.round(Math.random() * 1E9);
        const finalFileName = `${uniqueSuffix}-${file.originalname}`;
        const sanitizedFileName = slugify(finalFileName, { replacement: '-', remove: /[*+~()'"!:@]/g });
        cb(null, sanitizedFileName);
    }
});

const upload = multer({ storage });


// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images, pdf, and doc files are allowed'));
//     }
// };

export default upload;