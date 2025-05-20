exports.interviewReminderEmail = (candidateName, jobTitle, scheduledTime, label) => {
  const readableTime = new Date(scheduledTime).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Reminder</title>
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Interview Reminder - ${label}</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>This is a reminder that your interview for the position of <span class="highlight">${jobTitle}</span> is scheduled at:</p>
      <ul>
        <li><strong>Date & Time:</strong> ${readableTime}</li>
      </ul>
      <p>Please ensure you're prepared and available at the scheduled time.</p>
    </div>
    <div class="footer">
      <p>Warm regards,<br><strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
