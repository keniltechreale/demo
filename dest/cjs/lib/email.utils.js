"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCareerApplicationMail = exports.sendCashOutRequest = exports.sendRideCompletionMail = exports.sendContactUsMail = exports.sendDocumentVerificationMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_config_1 = __importDefault(require("../config/email.config"));
const logger_1 = __importDefault(require("./logger"));
const generatePDF_utils_1 = require("./generatePDF.utils");
const logoUrl = 'https://piupiu-storage.s3.us-west-2.amazonaws.com/image/images/logo-text.svg';
function sendDocumentVerificationMail(user, verificationStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporterOptions = {
            host: email_config_1.default.emailHost,
            port: Number(email_config_1.default.emailPort),
            secure: email_config_1.default.emailSecure === 'true', // false for STARTTLS
            auth: {
                user: email_config_1.default.emailUser,
                pass: email_config_1.default.emailpassword,
            },
        };
        const transporter = nodemailer_1.default.createTransport(transporterOptions);
        let rejectedKey;
        let reason;
        if (verificationStatus.status === 'rejected') {
            rejectedKey = Object.keys(verificationStatus.rejectedKeys)[0];
            reason = verificationStatus.rejectedKeys[rejectedKey];
        }
        let statusMessage;
        let statusColor;
        let message;
        switch (verificationStatus.status) {
            case 'approved':
                statusMessage = 'Your documents have been verified successfully.';
                statusColor = '#28a745';
                message =
                    'We glad to inform you that your driver profile is active now, The documents are successfully verified. Thank you for your patience';
                break;
            case 'rejected':
                statusMessage = 'Your documents have been rejected.';
                statusColor = '#dc3545';
                message = ` <div style="background-color: ${statusColor}; color: #ffffff; padding: 10px; border-radius: 5px; display: inline-block; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
      <strong>Reason : ${reason}</strong>
    </div> <br>For driver request in PiuPiu your ${rejectedKey} are rejected from admin. Please upload again the requested file to continue you driver activation profile on our website, For more details, please contact support.`;
                break;
            case 'pending':
                statusMessage = 'Your documents verification is pending.';
                statusColor = '#ffc107';
                message =
                    'Thank you for choosing PiuPiu, You documents verification are under process, For more details, please contact support.';
                break;
            default:
                statusMessage = 'Unknown status';
                statusColor = '#6c757d';
                message = '';
        }
        const content = `
    <p style="font-size: 15px;">Hello, ${user.name}</p>
    <p style="font-size: 13px;">${statusMessage}</p>
    <div style="background-color: ${statusColor}; color: #ffffff; padding: 10px; border-radius: 5px; display: inline-block; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
      <strong>Status:  ${verificationStatus.status.charAt(0).toUpperCase() + verificationStatus.status.slice(1)}</strong>
    </div>
    <p style="font-size: 13px;">${message}</p>
  `;
        const mailOptions = {
            from: email_config_1.default.emailUser,
            to: user.email,
            replyTo: 'noreply@example.com',
            subject: 'Document Verification Status',
            html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EmailTemplate</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #eaeaea;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              padding: 20px;
              text-align: center;
              background-color: #ffffff;
              border-bottom: 1px solid #eaeaea;
              border-radius: 10px 10px 0 0;
              background-color: #000000
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              border-top: 0.5px solid #eaeaea;
              box-shadow: 0px 5px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .otp-box {
              background-color: #007bff;
              color: #ffffff;
              padding: 10px;
              border-radius: 5px;
              display: inline-block;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .policy {
              font-size: 12px;
              padding: 20px;
              border-top: 1px solid #eaeaea;
              box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
              background-color: #ffffff;
            }
            .logo {
              width: 45px; /* Adjust the width as needed */
              filter: grayscale(100%); /* Convert the image to black and white */
              -webkit-filter: grayscale(100%); /* For webkit browsers */
              filter: gray; /* For IE 6-9 */
              filter: grayscale(1); /* For other browsers */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logoImage" alt="Your Logo" width="38%">
            </div>
            <div class="content">
              ${content}
            </div>
             <div class="policy">
              <p>This email was sent to you as part of your account security measures. Please do not reply to this email. For assistance or inquiries, please contact our support team.</p>
              <a href="https://www.PiuPiu.com/privacy-policy">Privacy Policy</a> 
              <p style="font-size: 11px;">Best regards,</p>
              <img class="logo" src="cid:logoImage" alt="Your Black and White Logo">
              <p style="font-size: 10px;"> ✉️ support@goridesnigeria.com</p>
              <p style="font-size: 10px;"> © 2024 PiuPiu Hub GUAke Road, Eliozu New Airport Road, Opp White Jade Event Center Aligbolu Port Harcourt, River State. , Eliozu, Nigeria, 500102</p>
            </div>
          </div>
        </body>
      </html>
    `,
            attachments: [
                {
                    filename: 'logo-text.svg', // Attach the file with its name
                    path: logoUrl, // Path to your image (S3 URL)
                    cid: 'logoImage', // This CID will be used to reference the image in the email HTML
                },
            ],
        };
        try {
            yield transporter.sendMail(mailOptions);
        }
        catch (error) {
            logger_1.default.error('Error sending email:', error);
        }
    });
}
exports.sendDocumentVerificationMail = sendDocumentVerificationMail;
function sendContactUsMail(email, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporterOptions = {
            host: email_config_1.default.emailHost,
            port: Number(email_config_1.default.emailPort),
            secure: email_config_1.default.emailSecure === 'true', // false for STARTTLS
            auth: {
                user: email_config_1.default.emailUser,
                pass: email_config_1.default.emailpassword,
            },
        };
        const transporter = nodemailer_1.default.createTransport(transporterOptions);
        const mailOptions = {
            from: email_config_1.default.emailUser,
            to: email,
            replyTo: 'noreply@example.com',
            subject: 'PiuPiu',
            html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EmailTemplate</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #eaeaea;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              padding: 20px;
              text-align: center;
              background-color: #000000;
              border-bottom: 1px solid #eaeaea;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              border-top: 0.5px solid #eaeaea;
              box-shadow: 0px 5px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .otp-box {
              background-color: #007bff;
              color: #ffffff;
              padding: 10px;
              border-radius: 5px;
              display: inline-block;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .policy {
              font-size: 12px;
              padding: 20px;
              border-top: 1px solid #eaeaea;
              box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
              background-color: #ffffff;
            }
            .logo {
              background-color: #000000;
              width: 45px; /* Adjust the width as needed */
              filter: grayscale(100%); /* Convert the image to black and white */
              -webkit-filter: grayscale(100%); /* For webkit browsers */
              filter: gray; /* For IE 6-9 */
              filter: grayscale(1); /* For other browsers */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logoImage" alt="Your Logo" width="38%">
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="policy">
              <p>This email was sent to you as part of your account security measures. Please do not reply to this email. For assistance or inquiries, please contact our support team.</p>
              <a href="https://www.PiuPiu.com/privacy-policy">Privacy Policy</a> 
              <p style="font-size: 11px;">Best regards,</p>
              <img class="logo" src="cid:logoImage" alt="Your Black and White Logo">
              <p style="font-size: 10px;"> ✉️ support@goridesnigeria.com</p>
              <p style="font-size: 10px;"> © 2024 PiuPiu Hub GUAke Road, Eliozu New Airport Road, Opp White Jade Event Center Aligbolu Port Harcourt, River State. , Eliozu, Nigeria, 500102</p>
            </div>
          </div>
        </body>
      </html>
    `,
            attachments: [
                {
                    filename: 'logo-text.svg', // Attach the file with its name
                    path: logoUrl, // Path to your image (S3 URL)
                    cid: 'logoImage', // This CID will be used to reference the image in the email HTML
                },
            ],
        };
        try {
            yield transporter.sendMail(mailOptions);
            logger_1.default.info('Mail sended successfully');
        }
        catch (error) {
            logger_1.default.error('Error sending email:', error);
        }
    });
}
exports.sendContactUsMail = sendContactUsMail;
function sendRideCompletionMail(user, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporterOptions = {
            host: email_config_1.default.emailHost,
            port: Number(email_config_1.default.emailPort),
            secure: email_config_1.default.emailSecure === 'true', // false for STARTTLS
            auth: {
                user: email_config_1.default.emailUser,
                pass: email_config_1.default.emailpassword,
            },
        };
        const pdfBuffer = yield (0, generatePDF_utils_1.createRideEmailPdf)(user, content);
        const transporter = nodemailer_1.default.createTransport(transporterOptions);
        const mailOptions = {
            from: email_config_1.default.emailUser,
            to: user.email,
            replyTo: 'noreply@example.com',
            subject: 'Your Ride Details - PiuPiu',
            html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ride Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background-color: #000000;
              text-align: center;
              padding: 20px;
              border-bottom: 2px solid #eaeaea;
            }
            .header img {
              width: 120px;
            }
            .content {
              padding: 20px;
            }
            .main-content h1 {
              font-size: 24px;
              color: #333;
              margin-bottom: 10px;
            }
            .main-content p {
              font-size: 16px;
              color: #555;
            }
            .fare-details, .locations {
              margin-top: 20px;
              border-top: 1px solid #eaeaea;
              padding-top: 20px;
            }
            .fare-details table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .fare-details table th,
            .fare-details table td {
              padding: 10px;
              font-size: 16px;
              border-bottom: 1px solid #eaeaea;
            }
            .fare-details .total {
              font-size: 20px;
              font-weight: bold;
              color: #27ae60;
            }
            .locations .location-row {
              display: flex;
              justify-content: space-between;
              font-size: 15px;
              padding: 5px 0;
            }
            .map {
              text-align: center;
              margin-top: 20px;
            }
            .map img {
              width: 150px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              margin-top: 30px;
            }
            .footer a {
              font-size: 16px;
              text-decoration: none;
              padding: 10px 20px;
              background-color: #3498db;
              color: white;
              border-radius: 5px;
            }
            .policy {
              font-size: 12px;
              text-align: center;
              padding: 15px;
              border-top: 1px solid #eaeaea;
              background-color: #ffffff;
              margin-top: 20px;
            }
            .policy p {
              margin: 0;
            }
            .policy a {
              color: #007bff;
              text-decoration: none;
            }
            .logo {
              width: 50px;
              margin: 10px auto;
              display: block;
              filter: grayscale(100%);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <img src="cid:logoImage" alt="PiuPiu Logo" />
            </div>
  
            <!-- Main Content -->
            <div class="content">
              <div class="main-content">
                <h1>Thanks for riding, ${content.passenger.name.toUpperCase()}</h1>
                <p>We hope you enjoyed your ride today.</p>
              </div>
  
              <!-- Fare Details -->
              <div class="fare-details">
                <table>
                  <tr>
                    <th>Total</th>
                    <td class="total">$${content.finalAmount}</td>
                  </tr>
                  <tr>
                    <th>Base Fare</th>
                    <td>$${content.fare.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <th>Distance</th>
                    <td>${content.distanceInkm.toFixed(2)} km</td>
                  </tr>
                  <tr>
                    <th>Tip</th>
                    <td>$${content.driversTip}</td>
                  </tr>
                  <tr>
                    <th>Driver Commission</th>
                    <td>$${content.driverCommissionAmount.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
  
              <!-- Locations -->
              <div class="locations">
                <div class="location-row">
                  <span style='font-weight:bold'>Origin: </span>
                  <span style='color:blue'>${content.origin}</span>
                </div>
                <div class="location-row">
                  <span style='font-weight:bold'>Destination:</span>
                  <span style='color:blue'>${content.destination}</span>
                </div>
              </div>
  
              <!-- Footer Section -->
              <div class="footer">
                <!-- Contact Us Section -->
                <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
                <a href="https://www.PiuPiu.com/contact">Contact Us</a>
                
                <!-- Rate Driver Section -->
                <p>Don't forget to rate your driver. Your feedback helps us improve!</p>
                <a href="https://customer.PiuPiu.com">Rate or tip your driver</a>
              </div>
  
              <!-- Map Image -->
              <div class="map">
                <img src="https://piupiu-storage.s3.us-west-2.amazonaws.com/assets/images/959d2257-d2ca-4c56-b403-959fdcbb032f.png" alt="Map" />
              </div>
            </div>
  
            <!-- Policy Section -->
            <div class="policy">
              <p>This is not a payment receipt. For assistance, contact our support team.</p>
              <p><a href="https://www.PiuPiu.com/privacy-policy">Privacy Policy</a></p>
              <img class="logo" src="cid:logoImage" alt="PiuPiu Logo" />
              <p>Best regards, PiuPiu Support</p>
              <p>support@goridesnigeria.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
            attachments: [
                {
                    filename: 'ride_receipt.pdf',
                    content: pdfBuffer,
                    encoding: 'base64',
                },
                {
                    filename: 'logo-text.svg', // Attach the file with its name
                    path: logoUrl, // Path to your image (S3 URL)
                    cid: 'logoImage', // This CID will be used to reference the image in the email HTML
                },
            ],
        };
        try {
            yield transporter.sendMail(mailOptions);
            logger_1.default.info('Mail sent successfully');
        }
        catch (error) {
            logger_1.default.error('Error sending email:', error);
        }
    });
}
exports.sendRideCompletionMail = sendRideCompletionMail;
function sendCashOutRequest(email, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporterOptions = {
            host: email_config_1.default.emailHost,
            port: Number(email_config_1.default.emailPort),
            secure: email_config_1.default.emailSecure === 'true', // false for STARTTLS
            auth: {
                user: email_config_1.default.emailUser,
                pass: email_config_1.default.emailpassword,
            },
        };
        const isImage = /\.(jpeg|jpg|gif|png)$/.test(content.payment_proof);
        const isPdf = /\.pdf$/.test(content.payment_proof);
        // Set dynamic content based on the status of the cashout request
        let dynamicContent;
        if (content.status === 'approved') {
            dynamicContent = `
      <h2 style="color: #28a745;">Cashout Approved</h2>
      <p style="font-size: 16px;">Dear User,</p>
      <p style="font-size: 16px;">We are pleased to inform you that your cashout request of <strong>${content.amount} units</strong> has been <strong>approved</strong>.</p>
      <p style="font-size: 16px;">Please find your payment proof below:</p>
      ${isImage
                ? `<img src="${content.payment_proof}" alt="Payment Proof" style="max-width: 100%; border: 1px solid #eaeaea; border-radius: 10px; margin-top: 20px;" />`
                : isPdf
                    ? `<a href="${content.payment_proof}" target="_blank" style="color: #007bff;">View Payment Proof (PDF)</a>`
                    : `<p>Payment proof is available but could not be displayed.</p>`}
      <p style="font-size: 16px; margin-top: 20px;">If you have any further questions, feel free to contact our support team.</p>
    `;
        }
        else if (content.status === 'rejected') {
            dynamicContent = `
    <h2 style="color: #dc3545;">Cashout Rejected</h2>
    <p style="font-size: 16px;">Dear User,</p>
    <p style="font-size: 16px;">Unfortunately, your cashout request for <strong>${content.amount} units</strong> has been <strong>rejected</strong>.</p>
    <p style="font-size: 16px;">Reason for rejection: <em>${content.message}</em></p>
    <p style="font-size: 16px; margin-top: 20px;">For further clarification, feel free to reach out to our support team.</p>
    `;
        }
        const transporter = nodemailer_1.default.createTransport(transporterOptions);
        const mailOptions = {
            from: email_config_1.default.emailUser,
            to: email,
            replyTo: 'noreply@example.com',
            subject: 'CashOut Requests',
            html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EmailTemplate</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              border: 1px solid #eaeaea;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              padding: 20px;
              text-align: center;
              background-color: #28a745;
              border-bottom: 1px solid #eaeaea;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              border-top: 0.5px solid #eaeaea;
              box-shadow: 0px 5px 0px 10px rgba(0, 0, 0, 0.1);
            }
            .otp-box {
              background-color: #007bff;
              color: #ffffff;
              padding: 10px;
              border-radius: 5px;
              display: inline-block;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .policy {
              font-size: 12px;
              padding: 20px;
              border-top: 1px solid #eaeaea;
              box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
              background-color: #ffffff;
            }
            .logo {
              background-color: #000000;
              width: 45px; /* Adjust the width as needed */
              filter: grayscale(100%); /* Convert the image to black and white */
              -webkit-filter: grayscale(100%); /* For webkit browsers */
              filter: gray; /* For IE 6-9 */
              filter: grayscale(1); /* For other browsers */
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logoImage" alt="Your Logo" width="38%">
            </div>
            <div class="content">
               ${dynamicContent}
            </div>
            <div class="policy">
              <p>This email was sent to you as part of your account security measures. Please do not reply to this email. For assistance or inquiries, please contact our support team.</p>
              <a href="https://www.PiuPiu.com/privacy-policy">Privacy Policy</a> 
              <p style="font-size: 11px;">Best regards,</p>
              <img class="logo" src="cid:logoImage" alt="Your Black and White Logo">
              <p style="font-size: 10px;"> ✉️ support@goridesnigeria.com</p>
              <p style="font-size: 10px;"> © 2024 PiuPiu Hub GUAke Road, Eliozu New Airport Road, Opp White Jade Event Center Aligbolu Port Harcourt, River State. , Eliozu, Nigeria, 500102</p>
            </div>
          </div>
        </body>
      </html>
    `,
            attachments: [
                {
                    filename: 'logo-text.svg', // Attach the file with its name
                    path: logoUrl, // Path to your image (S3 URL)
                    cid: 'logoImage', // This CID will be used to reference the image in the email HTML
                },
            ],
        };
        try {
            yield transporter.sendMail(mailOptions);
            logger_1.default.info('Mail sended successfully');
        }
        catch (error) {
            logger_1.default.error('Error sending email:', error);
        }
    });
}
exports.sendCashOutRequest = sendCashOutRequest;
function sendCareerApplicationMail(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const transporterOptions = {
            host: email_config_1.default.emailHost,
            port: Number(email_config_1.default.emailPort),
            secure: email_config_1.default.emailSecure === 'true',
            auth: {
                user: email_config_1.default.emailUser,
                pass: email_config_1.default.emailpassword,
            },
        };
        const transporter = nodemailer_1.default.createTransport(transporterOptions);
        // Safely extract values from args
        const email = typeof args['email'] === 'string' ? args['email'] : '';
        const name = typeof args['name'] === 'string' ? args['name'] : 'Applicant';
        const mailOptions = {
            from: email_config_1.default.emailUser,
            to: email, // applicant’s email
            subject: 'Thank you for your career application',
            html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Career Application Reply</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; border: 1px solid #ffffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);}
            .header { padding: 20px; text-align: center; background-color: #000; border-radius: 10px 10px 0 0;}
            .content { background-color: #fff; padding: 20px; border-radius: 0 0 10px 10px;}
            .footer { font-size: 12px; color: #ffffffff; text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="cid:logoImage" alt="PiuPiu Logo" style="max-width: 200px;">
            </div>
            <div class="content">
              <h2>Thank you for your response!</h2>
              <p>Dear ${name},</p>
              <p>
                Thank you for applying for a career opportunity with PiuPiu.<br>
                Your application has been received and noted. Our team will review your details and get back to you as soon as possible.
              </p>
              <p>
                If you have any questions, feel free to reply to this email.<br>
                <br>
                Best regards,<br>
                PiuPiu Team
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} PiuPiu. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
            attachments: [
                {
                    filename: 'logo-text.svg',
                    path: logoUrl,
                    cid: 'logoImage',
                },
            ],
        };
        try {
            yield transporter.sendMail(mailOptions);
            logger_1.default.info('Career application reply mail sent successfully');
        }
        catch (error) {
            logger_1.default.error('Error sending career application reply mail:', error);
        }
    });
}
exports.sendCareerApplicationMail = sendCareerApplicationMail;
//# sourceMappingURL=email.utils.js.map