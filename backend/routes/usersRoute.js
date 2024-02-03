import express from 'express';
import { User } from '../models/usersModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import sendVerificationEmail, {
	sendForgetUsernameEmail,
} from '../scripts/nodeMailer.js';

import verifyToken from '../middleware/tokenChecks.js';

const router = express.Router();

dotenv.config();

const app_url = process.env.FRONT_END_URL;
const backend_URL = process.env.BACK_END_URL;

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

const generateVerificationToken = () => {
	const token = crypto.randomBytes(32).toString('hex');
	return token;
};

// Creating user
router.post('/register', async (request, response) => {
	try {
		// Generate a verification token (you can use a library like `crypto` for this)
		const verificationToken = generateVerificationToken();

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
			billAddress,
			shipAddress,
			archived,
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
			billAddress: billAddress || {},
			shipAddress: shipAddress || {},
			emailVerificationToken: verificationToken,
			archived,
		});

		// Send a verification email
		sendVerificationEmail(newUser.name, verificationToken, newUser.email);

		return response.status(201).send(newUser);
	} catch (error) {
		console.error(error.message);
		response.status(500).send({ message: 'Server Error' });
	}
});

// Your verification route
router.get('/verify/:token', async (req, res) => {
	try {
		// Extract the verification token from the URL parameters
		const verificationToken = req.params.token;

		// Find the user by the verification token
		const user = await User.findOne({
			emailVerificationToken: verificationToken,
		});

		// Check if the user exists and the token is valid
		if (user) {
			// Update the emailValidated field to true
			user.emailValidated = true;
			await user.save();

			// Redirect the user to a success page
			return res.redirect(`${app_url}/login/verify-success`);
		} else {
			// Token is invalid or user not found
			return (
				res
					//.status(400)
					//.json({ message: 'Invalid verification token' })
					.redirect(`${app_url}/login/verify-fail`)
			);
		}
	} catch (error) {
		console.error('Error during email verification:', error);
		res.status(500).send({ message: 'Server Error' });
	}
});

router.get('/forgot/username/:email', async (request, response) => {
	try {
		const { email } = request.params;

		const user = await User.findOne({ email: email });

		if (user) {
			console.log(user.name, ' found');
			sendForgetUsernameEmail(user.email, user.username);
			return response.status(200).json({ message: 'success found username' });
		} else {
			return response.status(404).json({ message: 'User not found' });
		}
	} catch (error) {}
});

// Express route for handling user logout
router.post('/logout', verifyToken, (req, res) => {
	res.status(200).json({ message: 'Logout successful' });
});

// Login route
router.post('/login', async (request, response) => {
	try {
		const { username, password, lastActivity } = request.body;

		// Find user by username or email
		let user = await User.findOne({
			$or: [{ username: username }, { email: username }],
		});

		if (!user) {
			return response.status(404).json({ message: 'User not found' });
		}

		// Check if the provided password matches the hashed password in the database
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return response.status(401).json({ message: 'Invalid credentials' });
		}

		if (!user.emailValidated) {
			// resend a verification email
			const verificationToken = generateVerificationToken();
			user.emailVerificationToken = verificationToken;
			user.save();
			sendVerificationEmail(user.email, verificationToken, user.name);
			return response.status(403).json({ message: 'emailValidation' });
		}

		const userRole = user.role;

		// Create JWT token
		const token = jwt.sign({ userId: user._id, role: userRole }, JWTToken, {
			expiresIn: '8h',
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

// Get user by username or email
router.get('/getUser/:usernameEmail', async (req, res) => {
	try {
		const { usernameEmail } = req.params;

		// Check if a user with the provided username or email exists
		const user = await User.findOne({
			$or: [{ username: usernameEmail }, { email: usernameEmail }],
		});

		// Send response indicating whether the username or email exists
		res.json({ exists: !!user });
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ message: 'Server Error' });
	}
});

//admin to get all users
router.get('/getUsers', verifyToken, async (req, res) => {
	try {
		//const requesterUserId = req.user.userId;

		// Check if the requester has the appropriate authorization (admin or the user themselves)
		if (
			//requesterUserId !== userIdToUpdate &&
			req.user.role !== 'admin' &&
			req.user.role !== 'moderator'
		) {
			return res
				.status(403)
				.json({ message: 'Unauthorized to update this user' });
		}

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
		const requesterUserId = req.user.userId; // Extract userId from the decoded token
		const userIdToUpdate = req.params.userId; // Extract userId from request parameters
		const updatedUserData = req.body; // New user data to update

		// Check if the requester has the appropriate authorization (admin or the user themselves)
		if (
			requesterUserId !== userIdToUpdate &&
			req.user.role !== 'admin' &&
			req.user.role !== 'moderator'
		) {
			return res
				.status(403)
				.json({ message: 'Unauthorized to update this user' });
		}

		// Find the user by ID and update the user data
		const updatedUser = await User.findByIdAndUpdate(
			userIdToUpdate,
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
