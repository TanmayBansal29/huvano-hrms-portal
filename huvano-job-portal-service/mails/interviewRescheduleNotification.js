exports.interviewRescheduledEmail = (
  candidateName,
  jobTitle,
  companyName,
  previousDateTime,
  newDateTime,
  interviewMode,
  meetingLink = "Not Available"
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Rescheduled</title>
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
      color: #0073e6;
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
    .link {
      color: #0073e6;
      word-break: break-word;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Interview Rescheduled</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We would like to inform you that your interview for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span> has been <strong>rescheduled</strong>.</p>
      
      <p><strong>Previous Schedule:</strong> ${previousDateTime}</p>
      <p><strong>New Schedule:</strong> ${newDateTime}</p>
      <p><strong>Mode:</strong> ${interviewMode}</p>
      <p><strong>Meeting Link:</strong> <a class="link" href="${meetingLink}" target="_blank">${meetingLink}</a></p>

      <p>We apologize for any inconvenience this may cause and appreciate your flexibility.</p>
      <p>If you have any questions, feel free to reply to this email.</p>
    </div>
    <div class="footer">
      <p>Warm regards,<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
