exports.resultSelectedEmail = (candidateName, jobTitle, companyName) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Interview Result: Selected</title>
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
        color: #28a745; 
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
    <div class="header">Congratulations! You've Been Selected</div>
    <div class="content">
      <p>Hi ${candidateName},</p>
      <p>We are excited to inform you that you have been <span class="highlight">selected</span> for the position of <span class="highlight">${jobTitle}</span> at <span class="highlight">${companyName}</span>.</p>
      <p>Your performance throughout the interview process has been commendable.</p>
      <p><strong>Your offer letter will be released soon.</strong> Please keep an eye on your email for the next steps.</p>
      <p>We look forward to welcoming you aboard!</p>
    </div>
    <div class="footer">
      Warm regards,<br>
      <strong>Huvano HRMS Team</strong>
    </div>
  </div>
</body>
</html>`;
};
