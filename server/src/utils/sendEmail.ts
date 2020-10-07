import nodemailer from "nodemailer";

export async function sendEmail(to: string, html: string) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, //true for 465, false for other
    auth: {
      user: "joaquin50@ethereal.email",
      pass: "4Vf147SAWUkek5njKC",
    },
  });

  let info = await transporter.sendMail({
    from: '"SurveyIT Team <Support@SurveyIT.com">',
    to: to,
    subject: "Change Password",
    html,
  });

  console.log("Message send: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
