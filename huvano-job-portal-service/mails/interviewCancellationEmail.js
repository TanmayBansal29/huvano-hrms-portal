exports.interviewCancellationEmail = (candidateName, jobTitle, companyName, interviewDateTime, interviewMode, reason = "unforeseen circumstances") => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Cancelled</title>
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
    <div class="header">Interview Cancelled</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We regret to inform you that your interview for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>, originally scheduled on <strong>${interviewDateTime}</strong> via <strong>${interviewMode}</strong>, has been cancelled due to <strong>${reason}</strong>.</p>
      <p>We apologize for the inconvenience and appreciate your understanding.</p>
      <p>A new interview invitation will be sent to you soon with updated details.</p>
      <p>If you have any questions, feel free to reach out by replying to this email.</p>
    </div>
    <div class="footer">
      <p>Warm regards,<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
