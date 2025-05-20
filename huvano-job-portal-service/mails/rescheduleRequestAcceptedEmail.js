exports.rescheduleRequestAcceptedEmail = (
  candidateName,
  jobTitle,
  companyName,
  scheduledDateTime,
  mode,
  linkOrLocation
) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Reschedule Confirmation</title>
  <style>
    body {
      background-color: #f4f4f4;
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
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      color: #0A66C2;
      font-size: 24px;
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
    .details {
      background-color: #f0f8ff;
      padding: 15px;
      border-radius: 8px;
      margin-top: 15px;
    }
    .footer {
      font-size: 14px;
      color: #666;
      margin-top: 30px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Interview Reschedule Confirmed</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>Your request to reschedule the interview for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span> has been <span class="highlight">accepted</span>.</p>
      <p>Below are the updated interview details:</p>

      <div class="details">
        <p><strong>📅 New Date & Time:</strong> ${scheduledDateTime}</p>
        <p><strong>🎯 Mode:</strong> ${mode}</p>
        <p><strong>📍 ${mode === "Online" ? "Meeting Link" : "Location"}:</strong> ${linkOrLocation}</p>
      </div>

      <p>We look forward to speaking with you at the updated schedule. Please ensure you're prepared and join on time.</p>
      <p>If you have any further concerns, feel free to reach out.</p>
    </div>

    <div class="footer">
      <p>Warm regards,<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
