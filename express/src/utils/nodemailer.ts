import  fs  from "fs/promises";
import nodemailer from "nodemailer"
import handlebars from "handlebars";

export const sendEmail = async (
  email: string,
  subject: string,
  text: string
  ) => {
console.log(subject,">>>>>>>>>>>>>>>>")
    const dynamicData = {
      link: text,
    }
 const content= await fs.readFile(process.cwd()+"/src/utils/html/index.html",'utf-8')
 const emailTemplate = handlebars.compile(content);
const emailHtml = emailTemplate(dynamicData); 
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html:emailHtml ,
  }).then((data)=>console.log(data));
};
