exports.interviewInvitationEmail = (candidateName, jobTitle, companyName, interviewDateTime, interviewMode, interviewLink) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Invitation</title>
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
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #0073e6;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">You're Invited for an Interview!</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We’re excited to inform you that you’ve been shortlisted for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      <p>We would like to invite you for an interview as per the following details:</p>
      <ul>
        <li><strong>Date & Time:</strong> ${interviewDateTime}</li>
        <li><strong>Mode:</strong> ${interviewMode}</li>
        ${interviewLink ? `<li><strong>Link:</strong> <a href="${interviewLink}">${interviewLink}</a></li>` : ''}
      </ul>
      <p>Please reply to this email to confirm your availability or suggest a reschedule if needed.</p>
      <a class="button" href="mailto:info@huvanohrms.com?subject=Interview Confirmation - ${jobTitle}">Confirm Attendance</a>
    </div>
    <div class="footer">
      <p>Best of luck!<br>
      <strong>Huvano HRMS Team</strong></p>
    </div>
  </div>
</body>
</html>`;
};
