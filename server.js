const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password"
  }
});

app.post("/apply", (req, res) => {
  const { username, reason, email, division, rank } = req.body;

  const mailOptions = {
    from: email,
    to: ["yourgmail@gmail.com"],
    subject: "Peace Gang Application",
    text: `
Username: ${username}
Division: ${division}
Rank: ${rank}
Reason: ${reason}
Email: ${email}
`
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.send("Error sending");
    res.send("Application Sent!");
  });
});

app.listen(3000, () => console.log("Running on port 3000"));