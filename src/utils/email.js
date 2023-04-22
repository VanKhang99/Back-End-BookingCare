const puppeteer = require("puppeteer");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(
  process.env.GOOGLE_OAUTH2_CLIENT_ID,
  process.env.GOOGLE_OAUTH2_CLIENT_SECRET
);
OAuth2_client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN });

module.exports = class Email {
  constructor(typeEmail, language) {
    this.typeEmail = typeEmail;
    this.language = language;
  }

  newTransport() {
    const accessToken = OAuth2_client.getAccessToken();

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
  }

  // async convertHTMLtoPDF(html) {

  //   return pdf;
  // }

  async send(template, dataEmail, subject, pdf = undefined) {
    // 1.Path file Email
    const pathEmailFile =
      this.language === "vi"
        ? `${__dirname}/../views/emails/${template}Vi.ejs`
        : `${__dirname}/../views/emails/${template}En.ejs`;

    // 2. Render HTML based on a public template
    const markupHTML = await ejs.renderFile(pathEmailFile, dataEmail);

    const mailOptions = {
      from: `BookingCare <${process.env.EMAIL_USER}>`,
      to: dataEmail.email,
      subject: subject,
      text: htmlToText.convert(markupHTML), // plain text body
      html: markupHTML, // html body
      ...(this.typeEmail === "confirmExamComplete" && {
        attachments: [
          {
            // utf-8 string as an attachment
            filename: `${this.language === "vi" ? "Kết quả khám bệnh" : "Examination Result"}.pdf`,
            content: pdf,
          },
        ],
      }),
    };

    // 3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendCreateBooking(dataEmail) {
    const subject =
      this.language === "vi" ? "Thư xác nhận đặt lịch khám bệnh" : "Medical Examination Booking Confirmation";
    await this.send("emailCreateBooking", dataEmail, subject);
  }

  async sendConfirmExamComplete(dataEmail, templatePdf) {
    const subject =
      this.language === "vi"
        ? "Kết quả và hóa đơn sau khi khám bệnh"
        : "Confirm results and invoices after successful medical examination";

    const pathFileResultExam =
      this.language === "vi"
        ? `${__dirname}/../views/emails/${templatePdf}Vi.ejs`
        : `${__dirname}/../views/emails/${templatePdf}En.ejs`;

    const resultExaminationHTML = await ejs.renderFile(pathFileResultExam, {
      patientName: dataEmail?.patientName,
      doctorName: dataEmail?.doctorName,
      examinationResults: dataEmail?.examinationResults,
      invoiceNumber: dataEmail?.invoiceNumber,
      serviceUsed: dataEmail?.serviceUsed,
      totalFee: dataEmail?.totalFee,
      dateBooked: dataEmail?.dateBooked,
    });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(resultExaminationHTML);
    const pdf = await page.pdf({
      format: "A4",
      displayHeaderFooter: false,
      printBackground: true,
      display: "full",
    });
    await browser.close();

    // const pdf = await this.convertHTMLtoPDF(resultExaminationHTML);
    await this.send("emailConfirmExamComplete", dataEmail, subject, pdf);
  }

  async sendConfirmAccount(dataEmail) {
    const subject =
      this.language === "vi" ? "Xác minh tài khoản BookingCare" : "BookingCare account verification";

    await this.send("emailConfirmAccount", dataEmail, subject);
  }

  async sendForgotPassword(dataEmail) {
    const subject =
      this.language === "vi"
        ? "Yêu cầu khôi phục mật khẩu BookingCare"
        : "Request to reset BookingCare password";

    await this.send("emailForgotPassword", dataEmail, subject);
  }

  async sendPasswordChanged(dataEmail) {
    const subject =
      this.language === "vi"
        ? "Mật khẩu BookingCare đã được thay đổi"
        : "BookingCare password has been changed";

    const currentDate = new Date();
    const formatDate = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const formatMonth =
      currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    const formatHour = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

    const timePasswordChanged = `${formatDate} - ${formatMonth} - ${currentDate.getFullYear()} ${
      this.language === "vi" ? "lúc" : "at"
    } ${formatHour} (UTC/GMT +7 hours)`;

    dataEmail = { ...dataEmail, timePasswordChanged };

    await this.send("emailChangePasswordSuccess", dataEmail, subject);
  }
};
