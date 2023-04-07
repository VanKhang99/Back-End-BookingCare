const puppeteer = require("puppeteer");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

const convertHTMLtoPDF = async (html, pdf) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    pdf = await page.pdf({
      format: "A4",
      displayHeaderFooter: false,
      printBackground: true,
      display: "full",
    });
    await browser.close();
    return pdf;
  } catch (error) {
    console.log(error);
  }
};

const sendEmail = async (data, typeEmail = "createBooking") => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      // host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      service: "gmail",
      // secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let pathEmailFile, markupHTML, subject, pathFileResultExam, resultExaminationHTML, pdf;

    if (typeEmail === "createBooking") {
      pathEmailFile =
        data.language === "vi"
          ? `${__dirname}/../views/emails/emailVi.ejs`
          : `${__dirname}/../views/emails/emailEn.ejs`;

      markupHTML = await ejs.renderFile(pathEmailFile, {
        dateBooked: data?.dateBooked,
        doctorName: data?.doctorName,
        packageName: data?.packageName,
        clinicName: data?.clinicName,
        timeFrame: data?.timeFrame,
        personNameBook: data?.personNameBook,
        URLConfirm: data?.URLConfirm,
        remote: data?.remote,
      });

      subject =
        data.language === "vi"
          ? "Thư xác nhận đặt lịch khám bệnh"
          : "Medical Examination Booking Confirmation";
    } else if (typeEmail === "confirmExamComplete") {
      pathEmailFile =
        data.language === "vi"
          ? `${__dirname}/../views/emails/emailConfirmExamCompleteVi.ejs`
          : `${__dirname}/../views/emails/emailConfirmExamCompleteEn.ejs`;

      markupHTML = await ejs.renderFile(pathEmailFile, {
        patientName: data?.patientName,
        dateBooked: data?.dateBooked,
        timeFrame: data?.timeFrame,
      });

      subject =
        data.language === "vi"
          ? "Kết quả và hóa đơn sau khi khám bệnh"
          : "Confirm results and invoices after successful medical examination";

      pathFileResultExam =
        data.language === "vi"
          ? `${__dirname}/../views/resultExamination/resultExaminationVi.ejs`
          : `${__dirname}/../views/resultExamination/resultExaminationEn.ejs`;

      resultExaminationHTML = await ejs.renderFile(pathFileResultExam, {
        patientName: data?.patientName,
        doctorName: data?.doctorName,
        examinationResults: data?.examinationResults,
        invoiceNumber: data?.invoiceNumber,
        serviceUsed: data?.serviceUsed,
        totalFee: data?.totalFee,
        dateBooked: data?.dateBooked,
      });

      pdf = await convertHTMLtoPDF(resultExaminationHTML, pdf);
    } else if (typeEmail === "confirmAccount") {
      pathEmailFile =
        data.language === "vi"
          ? `${__dirname}/../views/emails/emailConfirmAccountVi.ejs`
          : `${__dirname}/../views/emails/emailConfirmAccountEn.ejs`;

      markupHTML = await ejs.renderFile(pathEmailFile, {
        confirmCode: data?.confirmCode,
      });

      subject =
        data.language === "vi" ? "Xác minh tài khoản BookingCare" : "BookingCare account verification";
    } else if (typeEmail === "forgotPassword") {
      pathEmailFile =
        data.language === "vi"
          ? `${__dirname}/../views/emails/emailForgotPasswordVi.ejs`
          : `${__dirname}/../views/emails/emailForgotPasswordEn.ejs`;

      markupHTML = await ejs.renderFile(pathEmailFile, {
        confirmCode: data?.confirmCode,
      });

      subject =
        data.language === "vi"
          ? "Yêu cầu khôi phục mật khẩu BookingCare"
          : "Request to reset BookingCare password";
    } else if (typeEmail === "passwordChanged") {
      pathEmailFile =
        data.language === "vi"
          ? `${__dirname}/../views/emails/emailChangePasswordSuccessVi.ejs`
          : `${__dirname}/../views/emails/emailChangePasswordSuccessEn.ejs`;

      const currentDate = new Date();
      const formatDate = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
      const formatMonth =
        currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
      const formatHour = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

      const timePasswordChanged = `${formatDate} - ${formatMonth} - ${currentDate.getFullYear()} ${
        data.language === "vi" ? "lúc" : "at"
      } ${formatHour} (UTC/GMT +7 hours)`;

      markupHTML = await ejs.renderFile(pathEmailFile, {
        timePasswordChanged,
      });

      subject =
        data.language === "vi"
          ? "Mật khẩu BookingCare đã được thay đổi"
          : "BookingCare password has been changed";
    }

    const mailOptions = {
      from: `BookingCare <noreply@email.bookingcare.com>`, // sender address
      to: `${data.email}`, // list of receivers
      subject: subject, // Subject line
      text: htmlToText.convert(markupHTML), // plain text body
      html: markupHTML, // html body
      ...(typeEmail === "confirmExamComplete" && {
        attachments: [
          {
            // utf-8 string as an attachment
            filename: `${data.language === "vi" ? "Kết quả khám bệnh" : "Examination Result"}.pdf`,
            content: pdf,
          },
        ],
      }),
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
