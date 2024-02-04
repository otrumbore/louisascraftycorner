import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app_url = process.env.FRONT_END_URL;
const backend_URL = process.env.BACK_END_URL;

const mailerEmail = process.env.gmail_email;
const mailerPass = process.env.gmail_pass;

let mailOptions = {
	from: 'noreply@louisascraftycorner.com',
	to: '',
	subject: '',
	html: ``,
	//html: `Welcome ${user}, Please click the following link to verify your email: <a href='https://api.louisascraftycorner.com/api/user/verify/${verificationToken}'>Verify Account</a>`,
};

export const sendVerificationEmail = (user, email, verificationToken) => {
	mailOptions.html = `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <!-- Header Section -->
    <header style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
        <h1>Email Verification</h1>
    </header>

    <!-- Main Content Section -->
    <section style="padding: 20px; text-align: center;">
        <p style="font-size: 18px; color: #555555;">
            Hello ${user},

            Thank you for signing up! To complete your registration, please click the button below to verify your email address.
        </p>

        <!-- CTA Button -->
        <a href="${backend_URL}/api/user/verify/${verificationToken}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Verify Email
        </a>
    </section>

    <!-- Footer Section -->
    <footer style="background-color: #3498db; padding: 10px; text-align: center; color: #ffffff;">
        © 2024 louisascraftycorner.com. All rights reserved.
    </footer>

</body>

</html>

        `;

	mailOptions.to = email;
	mailOptions.subject = 'Verify Your Email';

	sendEmail();
};

export const sendForgetUsernameEmail = (email, username) => {
	mailOptions.html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Username</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        header {
            background-color: #0066b2;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }

        section {
            padding: 20px;
            text-align: center;
        }

        footer {
            background-color: #0066b2;
            padding: 10px;
            text-align: center;
            color: #ffffff;
        }

        footer a {
            color: #ffffff;
        }
    </style>
</head>

<body>

    <!-- Main Content Section -->
    <div class="container">
        <!-- Header Section -->
        <header>
            <h1>Forgot Username</h1>
        </header>

        <!-- Content Section -->
        <section>
            <p style="font-size: 18px; color: #555555;">
                Your username is: <strong>${username}</strong>
            </p>
            <a href="${app_url}/login/user/${username}" style="display: inline-block; padding: 10px 20px; background-color: #0066b2; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Go to Login
        </a>
        </section>
    </div>

    <!-- Footer Section -->
    <footer>
        © 2024 louisascraftycorner.com. All rights reserved.
    </footer>

</body>

</html>

    `;
	mailOptions.to = email;
	mailOptions.subject = 'Forgot Username';

	sendEmail();
};

export const sendForgotPasswordEmail = (user, email, verificationToken) => {
	mailOptions.html = `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <!-- Header Section -->
    <header style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
        <h1>Forgot Password</h1>
    </header>

    <!-- Main Content Section -->
    <section style="padding: 20px; text-align: center;">
        <p style="font-size: 18px; color: #555555;">
            Hello ${user},

            You have requested to reset your password. Please use the link below and follow the steps to complete the password reset, this link will expire in 10 minutes. If you did not make this request, please ignore the email and the password reset request will expire.
        </p>

        <!-- CTA Button -->
        <a href="${app_url}/user/reset-password/${verificationToken}" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Reset Password
        </a>
    </section>

    <!-- Footer Section -->
    <footer style="background-color: #3498db; padding: 10px; text-align: center; color: #ffffff;">
        © 2024 louisascraftycorner.com. All rights reserved.
    </footer>

</body>

</html>

        `;

	mailOptions.to = email;
	mailOptions.subject = 'Password Reset';

	sendEmail();
};

export const sendPasswordUpdatedEmail = (user, email) => {
	mailOptions.html = `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Updated</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <!-- Header Section -->
    <header style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
        <h1>Password Updated</h1>
    </header>

    <!-- Main Content Section -->
    <section style="padding: 20px; text-align: center;">
        <p style="font-size: 18px; color: #555555;">
            Hello ${user},

            We have sucessfully updated your password. If you did not make this change, please contact us on the website or reply to this email.
        </p>

        <!-- CTA Button -->
        <a href="${app_url}/login" style="display: inline-block; padding: 10px 20px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
            Login
        </a>
    </section>

    <!-- Footer Section -->
    <footer style="background-color: #3498db; padding: 10px; text-align: center; color: #ffffff;">
        © 2024 louisascraftycorner.com. All rights reserved.
    </footer>

</body>

</html>

        `;

	mailOptions.to = email;
	mailOptions.subject = 'Password Changed';

	sendEmail();
};

// Function to send a verification email
export const sendEmail = () => {
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: mailerEmail,
			pass: mailerPass,
		},
	});

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending verification email:', error);
		} else {
			console.log('Verification email sent:', info.response);
		}
	});
};

export default sendVerificationEmail;
