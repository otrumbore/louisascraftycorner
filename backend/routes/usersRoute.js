import express from 'express';
import { User } from '../modals/usersModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

const JWTToken = process.env.JWT_SECRET_TOKEN;

// Middleware function to check if the user has admin privileges
// const isAdmin = (req, res, next) => {
// 	// Check if the user is an admin based on the authenticated user's role or any other criteria
// 	if (/* Check admin role */) {
// 	  next(); // Allow the request to proceed
// 	} else {
// 	  res.status(403).json({ message: 'Access denied. Requires admin privileges.' });
// 	}
//   };

// Creating a product
router.post('/register', async (request, response) => {
	try {
		const {
			name,
			username,
			password,
			email,
			phoneNumber,
			roles,
			emailMarketing,
			lastActivity,
			isActive,
			profilePicture,
			dateOfBirth,
			address,
		} = request.body;

		// Hash the password before saving it to the database
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			name,
			username,
			password: hashedPassword,
			email,
			phoneNumber,
			roles,
			emailMarketing,
			lastActivity,
			isActive,
			profilePicture,
			dateOfBirth,
			address: address || {},
		});

		return response.status(201).send(newUser);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Login route
router.post('/login', async (request, response) => {
	try {
		const { username, password } = request.body;

		// Find user by username
		const user = await User.findOne({ username });

		if (!user) {
			return response.status(404).json({ message: 'User not found' });
		}

		// Check if the provided password matches the hashed password in the database
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return response.status(401).json({ message: 'Invalid credentials' });
		}

		// Create JWT token
		const token = jwt.sign({ userId: user._id }, JWTToken, {
			expiresIn: '1h',
		});

		// Send the token in the response
		response.status(200).json({ token });
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

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
		next();
	});
};

// Assuming you have an endpoint to fetch user data after successful login
router.get('/getUser', verifyToken, async (req, res) => {
	try {
		const userId = req.user.userId; // Assuming 'userId' is the key used in the token payload

		// Find the user in the database by user ID
		const userData = await User.findById(userId).lean(); // Use lean() to get a plain JavaScript object

		if (!userData) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Return the user data found by user ID
		res.status(200).json(userData);
	} catch (error) {
		console.error('User data retrieval error:', error.message);
		res.status(500).json({ message: 'Server Error' });
	}
});

export default router;
