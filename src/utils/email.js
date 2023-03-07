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
    }

    const mailOptions = {
      from: ` BookingCare <${process.env.EMAIL_FROM}>`, // sender address
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
