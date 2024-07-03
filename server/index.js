import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

let registrations = [];

app.get("/", (req, res) => {
  res.send({ success: true });
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  logger: false,
  secureConnection: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendEmail(name, email, mobile, service) {
  console.log("Process to send email");
  const mailOption = {
    from: process.env.GMAIL_USER,
    to: [`digitalithubpy@gmail.com`],
    subject: "Registration ",
    html: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>
                    @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Inter', sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 10px 0;
                        background-color: #A259FF;
                        color: #ffffff;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        background-color: #f3f4f6;
                        border-bottom-left-radius: 10px;
                        border-bottom-right-radius: 10px;
                        color: #6b7280;
                    }
                    // .button {
                    //     display: inline-block;
                    //     padding: 10px 20px;
                    //     background-color: #FFFFF;
                    //     color: #ffffff;
                    //     border-radius: 5px;
                    //     text-decoration: none;
                    //     font-weight: bold;
                    //     margin-top: 20px;
                    // }
                    .img-style{
                        height : 50px;
                        weight : 50px;
                    }
                </style>
            </head>
            <body class="bg-gray-100">
                <div class="container">
                    <div class="header" style="display: flex; justify-content: center; align-items: center; text-align: center;">
                        <div class="text-xl font-bold" style="display: flex; flex-direction: row; gap: 10px; align-items: center;">
                            <img src="https://ik.imagekit.io/pa8uzidr4/msg1603122132-8636.jpg?updatedAt=1719341527805" alt="" style="height: 60px; width: 60px; border-radius: 100%;" />
                            <h1 style="font-size : 25px">Digital IT Hub</h1>
                        </div>
                    </div>
                    <div class="content">
                        <p class="text-lg">Hello Digital It Hub,</p>
                        <p class="mt-4 text-gray-600"> New Registration on Your Digital IT Hub</p>
                        <p class="mt-4 text-gray-600">Here are the details user provided:</p>
                        <ul class="mt-2 text-gray-600">
                            <li><strong>Name:</strong> ${name}</li>
                            <li><strong>Email:</strong> ${email}</li>
                            <li><strong>Mobile:</strong> ${mobile}</li>
                            <li><strong>Service:</strong> ${service}</li>
                        </ul>
                        <p class="mt-4 text-gray-600">If you have any further deatils want, please check registration page.</p>
                      <a
          href="https://digitalithub.in/registrationdetails"
          style="
            background-color: #a259ff;
            display: inline-block;
            padding: 10px 20px;
            font: 600;
            border-radius: 5px;
            margin-top: 20px;
          "
          >Check Registration Details</a
        >
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Digital IT Hub. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
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

app.post("/api/send-email", async (req, res) => {
  const { name, email, mobile, service } = req.body;
  if (!name || !email || !mobile || !service) {
    return res.send({ success: false, message: "Enter valid data" });
  }

  const response = await sendEmail(name, email, mobile, service);
  if (response) {
    const newRegistration = { id: uuidv4(), name, email, mobile, service };
    registrations.push(newRegistration);
    res.send({
      success: true,
      message: "Email sent successfully",
      registration: newRegistration,
    });
  } else {
    res.send({ success: false, message: "Failed to send email" });
  }
});

app.get("/api/get-registrations", (req, res) => {
  res.send(registrations);
});

app.delete("/api/delete-registration/:id", (req, res) => {
  const { id } = req.params;
  registrations = registrations.filter((reg) => reg.id !== id);
  res.send({ success: true, message: "Registration deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
