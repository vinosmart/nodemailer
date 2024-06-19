import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();


const app = express();
app.use(bodyParser.json());
app.use(cors())
const port = 5000;

app.get('/', (req, res) => {
    res.send({ success: true })
})
let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    logger: false,
    secureConnection: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    }
});


async function sendEmail(name, email, mobile, service) {
    console.log("Process to send email");
    const mailOption = {
        from: process.env.GMAIL_USER,
        to: [`digitalithubpy@gmail.com`],
        subject: "Registration ",
        html:
            `
            <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        /* Import Tailwind CSS */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
        /* Ensure the email renders properly in different email clients */
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
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #A259FF;
            color: #ffffff;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }
            .img-style{
            height : 50px;
            weight : 50px;
            }
    </style>
</head>
<body class="bg-gray-100">
    <div class="container">
        <div class="header">
            <h1 class="text-xl font-bold">
            Digital IT Hub
            </h1>
        </div>
        <div class="content">
            <p class="text-lg">Hello Digital It Hub,</p>
            <p class="mt-4 text-gray-600"> New Registration on Your Digital IT Hub</p>
            <p class="mt-4 text-gray-600">Here are the details you provided:</p>
            <ul class="mt-2 text-gray-600">
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Mobile:</strong> ${mobile}</li>
                <li><strong>Service:</strong> ${service}</li>
            </ul>
            <p class="mt-4 text-gray-600">If you have any further questions, please feel free to reply to this email.</p>
            <a href="https://digitalithub.in/registrationdetails" class="button">Visit our Website</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `

    };

    try {
        await transporter.sendMail(mailOption);
        console.log("Mail sent successfully");
        return true
    } catch (err) {
        console.log(err);
        return false
    }
}


app.post('/api/send-email', async (req, res) => {
    const { name, email, mobile, service } = req.body
    if (email == undefined || email == '') {
        return res.send({ success: false, message: "Enter the Valid Data" })
    }
    if (name == undefined || name == '') {
        return res.send({ success: false, message: "Enter the Valid Data" })
    }
    if (mobile == undefined || mobile == '') {
        return res.send({ success: false, message: "Enter the Valid Data" })
    }
    if (service == undefined || service == '') {
        return res.send({ success: false, message: "Enter the Valid Data" })
    }
    const response = await sendEmail(name, email, mobile, service)
    console.log(response, 'response log')
    if (response) {
        res.send({ success: true, message: 'Email send Successfully' })
    } else {
        res.send({ success: false, message: "Failed to send Email" })
    }
});

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
