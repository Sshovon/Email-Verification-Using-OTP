const { createTransport } = require("nodemailer");

const mailSender = async (email, otp) => {
  const transport = createTransport({
    service: "gmail",
    auth: {
      user: process.env.mail,
      pass: process.env.pass,
    },
  });

  const mailOptions = {
    from: "SSI4WEB EMAIL VERIFICATION SYSTEM.00@gmail.com>",
    to: `${email}`,
    subject: "OTP",
    html: `Your One time password is ${otp}
        <br> 
        <b>SSI4WEB TEAM.</b>`,
  };
  const result = await transport.sendMail(mailOptions);
  return result;
};

module.exports = mailSender;
