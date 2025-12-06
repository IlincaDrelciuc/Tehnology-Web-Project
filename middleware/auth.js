const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

const JWT_SECRET = process.env.JWT_SECRET; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Login required to view this resource.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token. Please log in again.' });
        }
        
        req.user = decoded; 
        next(); 
    });
}

module.exports = authenticateToken;