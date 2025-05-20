exports.resultRejectedEmail = (candidateName, jobTitle, companyName) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Result: Not Selected</title>
  <style>
    body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { font-size: 24px; font-weight: bold; color: #dc3545; text-align: center; margin-bottom: 20px; }
    .content { font-size: 16px; }
    .highlight { font-weight: bold; color: #000000; }
    .footer { font-size: 14px; color: #777777; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Interview Result: Not Selected</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>Thank you for taking the time to interview for the role of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      <p>We regret to inform you that you have not been selected for the position at this time.</p>
      <p>We truly appreciate your interest and effort, and we encourage you to apply again in the future.</p>
      <p>Wishing you the very best in your career journey.</p>
    </div>
    <div class="footer">
      Warm regards,<br>
      <strong>Huvano HRMS Team</strong>
    </div>
  </div>
</body>
</html>`;
};