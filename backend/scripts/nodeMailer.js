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

export const sendContactEmail = (data) => {
	const { name, email, message } = data;
	mailOptions.html = `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Contact</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

    <!-- Header Section -->
    <header style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
        <h1>Website Contact</h1>
    </header>

    <!-- Main Content Section -->
    <section style="padding: 20px; text-align: center;">
        <p style="font-size: 18px; color: #555555;">
            From: ${name}, ${email}
        </p>
        <p style="font-size: 16px; color: #555555;">Message: ${message}</p>
    </section>

    <!-- Footer Section -->
    <footer style="background-color: #3498db; padding: 10px; text-align: center; color: #ffffff;">
        © 2024 louisascraftycorner.com. All rights reserved.
    </footer>

</body>

</html>

        `;

	mailOptions.to = 'louisascraftycorner@gmail.com';
	mailOptions.subject = 'Customer Contact';

	sendEmail();
};

export const sendReceiptEmail = (data) => {
	mailOptions.html = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmed</title>
        </head>

        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">

            <!-- Header Section -->
            <header style="background-color: #3498db; padding: 20px; text-align: center; color: #ffffff;">
                <h1>Purchase was Successful</h1>
            </header>

            <!-- Main Content Section -->
            <section style="padding: 20px; text-align: center;">
                <div style="background-color: #ffffff; padding: 16px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 400px; margin: 40px auto; border: 4px dashed #0066b2;">
                    <div style="grid-template-columns: 1fr 1fr; margin-bottom: 16px; display: grid;">
                        <div>
                            <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">Order Invoice</h1>

                            <div style="margin-bottom: 8px;">
                                <span style="color: #888;">Order Number:</span> ${
																	data.orderId
																}
                            </div>

                            <div style="margin-bottom: 8px;">
                                <span style="color: #888;">Order Date:</span> ${new Date(
																	data.createdAt
																).toLocaleString('en-US', {
																	year: 'numeric',
																	month: 'numeric',
																	day: 'numeric',
																	hour: 'numeric',
																	minute: 'numeric',
																	hour12: true,
																	timeZoneName: 'short',
																})}
                            </div>
                        </div>

                        ${
													data.shipAdd &&
													data.shipAdd.line1 &&
													`
                                                    <div style='text-align: center;'>
                                                    <strong>Ship To: </strong>
                                                    <p style="margin-bottom: 2px;">${
																											data.shipName
																										}</p>
                                                    <p style="margin-bottom: 2px;">${
																											data.shipAdd.line1
																										}</p>
                                                    <p style="margin-bottom: 2px;">${
																											data.shipAdd.line2 || ''
																										}</p>
                                                    <p style="margin-bottom: 2px;">
                                                        ${
																													data.shipAdd.city +
																													', ' +
																													data.shipAdd.state +
																													' ' +
																													data.shipAdd
																														.postal_code
																												}
                                                    </p>
                                                </div>
                                                
													`
												}
                    </div>

                    <table style="width: 100%; margin-bottom: 16px; overflow-x: auto;">
                        <thead>
                            <tr>
                                <th style="text-align: left;">Product</th>
                                <th style="text-align: left;">Quantity</th>
                                <th style="text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.items.map(
															(item, index) => `
															<tr key={${index}}>
																<td style="text-align: left;">${item.productName || 'N/A'}</td>
																<td style="text-align: left;">${item.quantity}</td>
																<td style='text-align: right;'>
																	${'$' + (item.quantity * (item.sale ? item.sale : item.price)).toFixed(2)}
																</td>
															</tr>
														`
														)}
                        </tbody>
                    </table>

                        <div style="display: flex; justify-content: flex-end; margin-bottom: 8px; margin-top: 8px;">
                            <span style="font-weight: bold;">Discounts:</span>
                            <span style="font-size: 16px;">${
															data.prices.discounts
																? ' $' +
																  (data.prices.discounts / 100).toFixed(2)
																: ' $0.00'
														}</span>
                        </div>

                        <div style="display: flex; justify-content: flex-end;">
                            <span style="font-weight: bold;">Subtotal:</span>
                            <span style="font-size: 16px;">${
															' $' + (data.prices.subtotal / 100).toFixed(2)
														}</span>
                        </div>

                        <div style="display: flex; justify-content: flex-end;">
                            <span style="font-weight: bold;">Shipping:</span>
                            <span style="font-size: 16px;">${
															data.prices.shipping
																? ' $' + (data.prices.shipping / 100).toFixed(2)
																: ' $0.00'
														}</span>
                        </div>

                        <div style="display: flex; justify-content: flex-end;">
                            <span style="font-weight: bold;">Subtotal:</span>
                            <span style="font-size: 16px;">${
															data.prices.tax
																? ' $' + (data.prices.tax / 100).toFixed(2)
																: ' $0.00'
														}</span>
                        </div>
                        <!-- Repeat similar styles for other rows -->

                        <div style="display: flex; justify-content: flex-end;">
                            <span style="font-weight: bold;">Total:</span>
                            <span style="font-size: 16px;">${
															' $' + (data.prices.total / 100).toFixed(2)
														}</span>
                        </div>
                        </div>
            </section>

            <!-- Footer Section -->
            <footer style="background-color: #3498db; padding: 10px; text-align: center; color: #ffffff;">
                © 2024 louisascraftycorner.com. All rights reserved.
            </footer>

        </body>

        </html>
    `;

	mailOptions.to = data.email;
	mailOptions.subject = 'Order Confirmation - ' + data.orderId;

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
			console.error('Error sending email:', error);
		} else {
			console.log('Verification email sent:', info.response);
		}
	});
};

export default sendVerificationEmail;
