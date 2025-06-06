const otpVerification = (otp) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification Email</title>
        <style>
            body{
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding:0;
            }
            
            .container{
                max-width:600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
                
            .logo{
                max-width: 200px;
                margin-bottom: 20px;
            }
                
            .message{
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
                
            .body{
                font-size: 16px;
				margin-bottom: 20px;
            }

            h2.highlight {
                font-weight: bold;
                margin: 20px 0;
                font-size: 28px;
                color: #000;
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
            <div class="message">OTP Verification Email</div>
            <div class="body">
                <p>Dear User,</p>
                <p>Thank you for registering with Huvano. To complete your registration, please use the following OTP
                    (One Time Password) to verify your account:</p>
                <h2 class="highlight">${otp}</h2>
                <p>The OTP is valid for 5 minutes. If you did not request this verification, Please discard this email
                Once your account is Verified, you will have access to your Candidate Dashboard</p>
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
    
    </html>`
}

module.exports = otpVerification