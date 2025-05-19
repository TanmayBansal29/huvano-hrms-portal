exports.interviewDeclinedEmail = (
  candidateName,
  jobTitle,
  companyName
) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Interview Invite Auto Declined</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        color: #e60000;
        text-align: center;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
      }
      .highlight {
        font-weight: bold;
        color: #000000;
      }
      .footer {
        font-size: 14px;
        color: #777777;
        margin-top: 30px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">Interview Invite Auto Declined</div>
      <div class="content">
        <p>Hi ${candidateName},</p>
        <p>We noticed that you did not respond to the interview invite for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span> within 48 hours.</p>

        <p>As a result, the interview invite has been <strong>automatically declined</strong>.</p>

        <p>If this was a mistake or you'd still like to proceed, please reach out to us as soon as possible so we can assist you further.</p>

        <p>Thank you for your time and interest.</p>
      </div>
      <div class="footer">
        <p>Warm regards,<br>
        <strong>${companyName} Team</strong></p>
      </div>
    </div>
  </body>
  </html>`;
};
