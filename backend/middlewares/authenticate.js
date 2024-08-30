import jwt from 'jsonwebtoken';

const jwtSecret = 'your_jwt_secret';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach the decoded token to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (ex) {
        res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

export default verifyToken