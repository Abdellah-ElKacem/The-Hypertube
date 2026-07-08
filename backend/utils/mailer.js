const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const baseTemplate = ({ title, previewText, body }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0f14;font-family:Arial,Helvetica,sans-serif;">

  <!-- Preview text (hidden) -->
  <span style="display:none;max-height:0;overflow:hidden;color:#0d0f14;font-size:1px;">${previewText}</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0f14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

          <!-- Header / Logo -->
          <tr>
            <td style="padding-bottom:32px;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:20px;font-weight:bold;color:#EC4949;letter-spacing:-0.3px;">Leet Stream</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="
              background-color:#161a23;
              border-radius:12px;
              border:1px solid #252a36;
              padding:40px 36px;
            ">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:28px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#4a5068;line-height:1.6;">
                You received this email because an account action was initiated on Leet Stream.<br/>
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#2e3347;">
                &copy; ${new Date().getFullYear()} Leet Stream. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

const sendResetEmail = async (toEmail, username, resetUrl) => {
  const transporter = createTransporter();

  const body = `
    <!-- Title -->
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">
      Reset your password
    </h1>
    <p style="margin:0 0 28px;font-size:14px;color:#7a82a0;line-height:1.6;">
      Hi <strong style="color:#c8ccdb;">${username}</strong>, we received a request to reset the password
      for your Leet Stream account.
    </p>

    <!-- Divider -->
    <div style="border-top:1px solid #252a36;margin-bottom:28px;"></div>

    <!-- CTA -->
    <p style="margin:0 0 20px;font-size:14px;color:#7a82a0;">
      Click the button below to choose a new password. This link expires in
      <strong style="color:#c8ccdb;">15 minutes</strong>.
    </p>

    <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr>
        <td style="
          background-color:#EC4949;
          border-radius:8px;
        ">
          <a href="${resetUrl}"
             style="
               display:inline-block;
               padding:14px 32px;
               font-size:15px;
               font-weight:700;
               color:#ffffff;
               text-decoration:none;
               letter-spacing:0.2px;
             ">
            Reset password
          </a>
        </td>
      </tr>
    </table>
  `;

  await transporter.sendMail({
    from: `"Leet Stream" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your Leet Stream password",
    html: baseTemplate({
      title: "Reset your password",
      previewText: `Hi ${username}, here's your password reset link. It expires in 15 minutes.`,
      body,
    }),
  });
};

const sendVerificationEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  const body = `
    <!-- Title -->
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">
      Verify your email
    </h1>
    <p style="margin:0 0 28px;font-size:14px;color:#7a82a0;line-height:1.6;">
      Enter the code below to confirm your email address and activate your Leet Stream account.
    </p>

    <!-- Divider -->
    <div style="border-top:1px solid #252a36;margin-bottom:28px;"></div>

    <!-- OTP digits -->
    <p style="margin:0 0 16px;font-size:12px;font-weight:600;color:#4a5068;letter-spacing:1px;text-transform:uppercase;">
      Verification code
    </p>

    <div style="background-color:#0d0f14;border:2px solid #e8635a;border-radius:20px;padding:10px 20px;text-align:center;margin-bottom:12px;">
      <span style="font-size:36px;font-weight:700;color:#ffffff;letter-spacing:10px;font-family:'Courier New',Courier,monospace;mso-letter-spacing:10px;">
        ${String(otp)}
      </span>
    </div>

    <p style="margin:0 0 10px;font-size:13px;color:#4a5068;">
      This code expires in <strong style="color:#c8ccdb;">10 minutes</strong>.
    </p>
  `;

  await transporter.sendMail({
    from: `"Leet Stream" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Leet Stream verification code",
    html: baseTemplate({
      title: "Verify your email",
      previewText: `Your verification code is ${otp}. It expires in 10 minutes.`,
      body,
    }),
  });
};

module.exports = { sendResetEmail, sendVerificationEmail };