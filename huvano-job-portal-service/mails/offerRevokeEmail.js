exports.revokeOfferEmail = (
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
  <title>Offer Letter Revoked</title>
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
      color: #d32f2f;
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
      color: #555555;
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
    <div class="header">Offer Letter Revoked</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We regret to inform you that the offer for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>, which was previously extended to you, has been officially <strong>revoked</strong>.</p>
      <p>This decision was made after thorough consideration. We understand this news may be disappointing, and we appreciate your interest in our organization.</p>
      <p>If you have any questions or need further information, please feel free to contact us at <a href="mailto:${hrEmail}">${hrEmail}</a>.</p>
      <p>We wish you the very best in your future endeavors.</p>
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
