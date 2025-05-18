exports.applicationShortlisted = (candidateName, jobTitle, companyName) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Shortlisted for Interview</title>
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
            .message {
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #28a745;
            }
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .highlight {
                font-weight: bold;
                color: #000000;
            }
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
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
            <div class="message">You've Been Shortlisted!</div>
            <div class="body">
                <p>Hi ${candidateName},</p>
                <p>Congratulations! You've been shortlisted for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
                <p>We were impressed with your profile and will be sharing the interview details with you shortly.</p>
                <p>Stay tuned and keep an eye on your email for further communication.</p>
            </div>
            <div class="support">
                If you have any questions, feel free to reach out to us at 
                <a href="mailto:info@huvanohrms.com">info@huvanohrms.com</a>. We're here to help!
            </div>
            <div class="thanks">
                <p>Best regards,<br>
                <span class="team">Huvano HRMS Team</span></p>
            </div>
        </div>
    </body>
    
    </html>`;
};
