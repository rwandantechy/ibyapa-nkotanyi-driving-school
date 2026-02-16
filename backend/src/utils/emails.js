import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailer = async (info, action, token, success) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SEND_MAIL,
      pass: process.env.PASS_MAIL,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  let subject, composition, emailto;
  switch (action) {
    case "signup":
      subject = "Welcome to our platform";
      emailto = info.email;
      composition = ` <h1> Welcome to our platform</h1> 
      <p> Hi ${info.name}, thank you for joining TRAFFIC SIGNS PLATFORM.
        Your account has been created successfully!</p>
        <a href="https://aquamarine-puffer-boot.cyclic.app/api/user/verifyemail/${info.emailToken}" target="_blank">Click here to verify your email.</a>
      `;
      break;
    case "reset":
      subject = "Password reset";
      emailto = info.email;
      composition = success
        ? `<h1>Password reset successful</h1><p>Your password has been successfully reset.</p>`
        : `<h1>Password reset</h1><p>Click the following link to reset your password:</p><a href="https://aquamarine-puffer-boot.cyclic.app/api/user/reset-password/${token}" target="_blank">Reset Password</a>`;
      break;
    default:
      subject = "";
      break;
  }

  const mailOptions = {
    from: `TRAFFIC SIGNS PLATFORM ${process.env.SEND_MAIL}`,
    to: emailto,
    subject,
    html: composition,
  };

  try {
    const sendMail = transporter.sendMail(mailOptions, (error, info) => {
      // console.log(error);
      // console.log(info);
      return sendMail;
    });
  } catch (error) {
    console.log("error");
    return error;
  }
};

export default mailer;
