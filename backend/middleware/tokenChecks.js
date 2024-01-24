import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWTToken = process.env.JWT_SECRET_TOKEN;

// Middleware to verify JWT token and extract user details
const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, JWTToken, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' });
		}
		req.user = decoded; // Attach user details to request object
		//console.log(decoded);
		next();
	});
};

export default verifyToken;
