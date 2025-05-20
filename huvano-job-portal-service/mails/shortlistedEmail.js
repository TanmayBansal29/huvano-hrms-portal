exports.resultShortlistedEmail = (candidateName, jobTitle, companyName) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Result: Shortlisted</title>
  <style>
    body { background-color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { font-size: 24px; font-weight: bold; color: #ffc107; text-align: center; margin-bottom: 20px; }
    .content { font-size: 16px; }
    .highlight { font-weight: bold; color: #000000; }
    .footer { font-size: 14px; color: #777777; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">You're Shortlisted!</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We are pleased to inform you that you have been <span class="highlight">shortlisted</span> for the next round of the selection process for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      <p><strong>Interview details will be shared with you shortly.</strong></p>
      <p>Please stay tuned and keep an eye on your inbox.</p>
    </div>
    <div class="footer">
      Warm regards,<br>
      <strong>Huvano HRMS Team</strong>
    </div>
  </div>
</body>
</html>`;
};
