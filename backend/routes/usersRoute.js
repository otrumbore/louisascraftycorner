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

// Creating user
router.post('/register', async (request, response) => {
	try {
		const {
			name,
			username,
			password,
			email,
			phoneNumber,
			role,
			emailMarketing,
			emailValidated,
			lastActivity,
			isActive,
			enabled,
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
			role,
			emailMarketing,
			emailValidated,
			lastActivity,
			isActive,
			enabled,
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
		const { username, password, lastActivity } = request.body;

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

		const userRole = user.role;

		// Create JWT token
		const token = jwt.sign({ userId: user._id, role: userRole }, JWTToken, {
			expiresIn: '24h',
		});

		user.lastActivity = lastActivity;
		await user.save();

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

router.get('/getUsers', async (req, res) => {
	try {
		const users = await User.find({});
		return res.status(200).json({
			count: users.length,
			data: users,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ message: 'Server Error' });
	}
});

// Update user data route
router.put('/updateUser/:userId', verifyToken, async (req, res) => {
	try {
		const userId = req.params.userId; // Extract userId from request parameters
		const updatedUserData = req.body; // New user data to update

		// Find the user by ID and update the user data
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ $set: updatedUserData },
			{ new: true } // Return the updated document
		);

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error('User data update error:', error.message);
		res.status(500).json({ message: 'Server Error' });
	}
});

export default router;
