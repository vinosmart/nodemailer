import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import multer from "multer";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const upload = multer(); // Using multer for file uploads
const port = 5000;

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// URL of the logo image
const logoUrl =
  "https://ik.imagekit.io/pa8uzidr4/msg1603122132-8636.jpg?updatedAt=1719341527805"; // Replace with the URL to your logo image

async function sendEmail(name, email, mobile, service, position, resumeFile) {
  console.log("Process to send email");

  // Determine email subject based on whether position and resume are provided
  const emailSubject =
    position || resumeFile ? "New Job Application" : "New Enquiry";

  const mailOption = {
    from: process.env.GMAIL_USER,
    to: [`vinothkumar05031996@gmail.com`],
    subject: emailSubject,
    html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header {
            background-color: #041C54;
            padding: 20px;
            text-align: center;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .header img {
            max-width: 80px; /* Adjusted to be smaller */
            border-radius: 50%; /* Circular logo */
            height: auto;
            margin-right: 10px; /* Space between logo and title */
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            margin-top: 20px; /* Adjusted to be centered */

          }
          .content {
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          .content p {
            margin: 10px 0;
            font-size: 16px;
          }
          .content ul {
            list-style: none;
            padding: 0;
          }
          .content ul li {
            background-color: #f9f9f9;
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 5px;
          }
          .content ul li strong {
            color: #041C54;
          }
          .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Email Header -->
          <div class="header">
            <img src="${logoUrl}" alt="Company Logo" />
            <h1>${emailSubject}</h1>
          </div>

          <!-- Email Content -->
          <div class="content">
            <p><strong>Hello,</strong></p>
            <p>A ${emailSubject.toLowerCase()} has been received. Here are the details:</p>

            <ul>
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Mobile:</strong> ${mobile}</li>
              ${
                service
                  ? `<li><strong>Service Interested In:</strong> ${service}</li>`
                  : ""
              }
              ${
                position
                  ? `<li><strong>Position Applied For:</strong> ${position}</li>`
                  : ""
              }
            </ul>

            <p>${resumeFile ? "Attached is the candidate's resume." : ""}</p>
          </div>

          <!-- Email Footer -->
          <div class="footer">
            <p>&copy; 2024 Digital IT Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: resumeFile
      ? [
          {
            filename: resumeFile.originalname,
            content: resumeFile.buffer,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOption);
    console.log("Mail sent successfully");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

app.post("/api/send-email", upload.single("resume"), async (req, res) => {
  const { name, email, mobile, service, position } = req.body;
  const resumeFile = req.file;

  if (!name || !email || !mobile) {
    return res.send({
      success: false,
      message: "Enter valid data.",
    });
  }

  const response = await sendEmail(
    name,
    email,
    mobile,
    service,
    position,
    resumeFile
  );
  if (response) {
    res.send({ success: true, message: "Email sent successfully" });
  } else {
    res.send({ success: false, message: "Failed to send email" });
  }
});

// Route to handle the root URL
app.get("/", (req, res) => {
  res.send("Server is running and the root route is working!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
