exports.sendOfferLetterEmail = (
  candidateName,
  jobTitle,
  companyName,
  hrName,
  hrEmail
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Offer Letter Issued</title>
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
      color: #2e7d32;
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
    .notes {
      font-style: italic;
      color: #d32f2f;
      margin-top: 10px;
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
    <div class="header">🎉 Congratulations, ${candidateName}!</div>
    <div class="content">
      <p>We are thrilled to offer you the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      
      <p>Your offer letter has been generated and shared with you on your candidate dashboard by our HR team. You can access the same by logging in to your candidate dashboard. Please expect further communication shortly.</p>

      <p><strong>Important:</strong> You are required to accept the offer within <strong>3 days</strong>. If we do not receive your confirmation within this period, the offer will be <span class="highlight">automatically revoked</span>.</p>

      <p>We look forward to welcoming you aboard. If you have any questions, feel free to reach out to <a href="mailto:${hrEmail}">${hrEmail}</a>.</p>
    </div>
    <div class="footer">
      <p>Warm regards,<br>
      <strong>${hrName}</strong><br>
      HR Department, ${companyName}</p>
    </div>
  </div>
</body>
</html>`;
};
