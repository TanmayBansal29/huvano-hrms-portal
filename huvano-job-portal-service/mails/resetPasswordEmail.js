exports.resetPasswordTemplate = (name, resetLink) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Password Reset Request</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }

            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }

            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
            }

            .button {
                display: inline-block;
                background-color: #007BFF;
                color: #ffffff;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 10px;
            }

            .thanks {
                font-size: 14px;
                color: #333333;
                margin-top: 30px;
                text-align: left;
            }

            .team {
                font-size: 14px;
                font-weight: bold;
                color: #333333;
                text-align: left;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <div class="message">Password Reset Request</div>
            <div class="body">
                <p>Hi ${name},</p>
                <p>We received a request to reset the password for your account. If you made this request, click the button below to reset your password:</p>
                <a href="${resetLink}" class="button">Reset Password</a>
                <p>If you did not request this, please ignore this email or contact us to secure your account.</p>
                <p>This link will expire in 10 minutes for your security.</p>
            </div>
            <div class="support">If you have any questions or need further assistance, please feel free to reach out to us at
                <a href="mailto:info@huvanohrms.com">info@huvanohrms.com</a>. We're happy to help!
            </div>

            <div class="thanks">
                <p>Thanks,<br>
                <span class="team">Huvano HRMS Team</span></p>
            </div>
        </div>
    </body>
    
    </html>`;
};
