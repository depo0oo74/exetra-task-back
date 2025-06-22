import nodemailer from 'nodemailer';

// Vars
const emailService: string | any = process.env.EMAIL_SERVICE;
const emailUser: string | any = process.env.EMAIL_USER;
const emailPass: number | any = process.env.EMAIL_PASS;
const environment: string | any = process.env.NODE_ENV;

const sendEmail = async ({ to, subject, text }: { to: string, subject: string, text: string }) => {
  const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
        rejectUnauthorized: environment == 'production' ? true : false,
    },
  });

  await transporter.sendMail({
    from: emailUser,
    to,
    subject,
    text,
  });
};

export default sendEmail;
