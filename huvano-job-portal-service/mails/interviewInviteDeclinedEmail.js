exports.interviewDeclinedEmail = (
  candidateName,
  jobTitle,
  companyName
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Declined Confirmation</title>
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
      color: #dc3545;
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
    <div class="header">Interview Declined</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We’ve received your response declining the interview for the role of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>

      <p>If this was unintentional or you change your mind, feel free to reach out to us. We’re happy to assist with rescheduling if needed.</p>

      <p>Thank you for keeping us informed.</p>
    </div>
    <div class="footer">
      <p>Warm regards,<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
