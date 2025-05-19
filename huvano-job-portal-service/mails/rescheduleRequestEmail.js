exports.rescheduleRequestEmail = (
  candidateName,
  jobTitle,
  companyName,
  requestedDateTime,
  requestedReason
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reschedule Request Received</title>
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
    <div class="header">Reschedule Request Received</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We have received your request to reschedule your interview for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      <p><strong>Your Requested Slot:</strong></p>
      <ul>
        <li><strong>Date & Time:</strong> ${requestedDateTime}</li>
        <li><strong>Reason:</strong> ${requestedReason}</li>
      </ul>
      <p>Our HR team will review your request and get back to you shortly with a new confirmed schedule.</p>
      <p>Thank you for your flexibility and we look forward to speaking with you soon.</p>
    </div>
    <div class="footer">
      <p>Warm regards,<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
