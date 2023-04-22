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

  async send(template, dataEmail, subject) {
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
    };

    // 3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendCreateBooking(dataEmail) {
    const subject =
      this.language === "vi" ? "Thư xác nhận đặt lịch khám bệnh" : "Medical Examination Booking Confirmation";
    await this.send("emailCreateBooking", dataEmail, subject);
  }

  async sendConfirmExamComplete(dataEmail) {
    const subject =
      this.language === "vi"
        ? "Xác nhận hoàn thành khám bệnh tại bệnh viện (phòng khám)"
        : "Confirmation of completion of medical examination at the hospital (clinic)";

    // const pdf = await this.convertHTMLtoPDF(resultExaminationHTML);
    await this.send("emailConfirmExamComplete", dataEmail, subject);
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
