exports.applicationRejected = (candidateName, jobTitle, companyName) => {
	return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Application Update</title>
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
                color: #e60000;
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
            <div class="message">Application Status: Rejected</div>
            <div class="body">
                <p>Hi ${candidateName},</p>
                <p>We appreciate your interest in the <span class="highlight">${jobTitle}</span> role at <span class="highlight">${companyName}</span>.</p>
                <p>After careful consideration, we regret to inform you that your profile has not been shortlisted for the next round.</p>
                <p>We encourage you to apply for other opportunities with us in the future.</p>
            </div>
            <div class="support">
                If you have any questions, feel free to reach out to us at 
                <a href="mailto:info@huvanohrms.com">info@huvanohrms.com</a>. We're here to help!
            </div>
            <div class="thanks">
                <p>Best wishes,<br>
                <span class="team">Huvano HRMS Team</span></p>
            </div>
        </div>
    </body>
    
    </html>`;
};
