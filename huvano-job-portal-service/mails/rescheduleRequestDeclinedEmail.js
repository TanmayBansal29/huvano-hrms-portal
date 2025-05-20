exports.rescheduleRequestDeclinedEmail = (
  candidateName,
  jobTitle,
  companyName,
  interviewDateTime,
  declineReason
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reschedule Request Declined</title>
  <style>
    body {
      background-color: #f8f9fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 12px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      color: #d9534f;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .content {
      font-size: 16px;
    }
    .highlight {
      font-weight: bold;
      color: #000;
    }
    .reason-box {
      background-color: #fff3cd;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
      border: 1px solid #ffeeba;
    }
    .footer {
      font-size: 14px;
      color: #777;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Reschedule Request Declined</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We have reviewed your request to reschedule the interview for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      
      <p>Unfortunately, we are unable to accommodate your rescheduling request at this time.</p>

      <div class="reason-box">
        <p><strong>Reason:</strong> ${declineReason}</p>
      </div>

      <p>We kindly request you to attend the interview as originally scheduled:</p>
      <ul>
        <li><strong>🗓️ Date & Time:</strong> ${interviewDateTime}</li>
      </ul>

      <p>Your timely participation is appreciated. Please ensure you're available at the scheduled time.</p>
      <p>If you face any unavoidable circumstances, you may reach out again for assistance.</p>
    </div>

    <div class="footer">
      <p>Thank you,<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
