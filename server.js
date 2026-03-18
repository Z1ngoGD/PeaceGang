const express = require("express");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "z1ng0gd@gmail.com",
    pass: "your_app_password"
  }
});

app.post("/apply", (req, res) => {
  const { username, reason, email, division, rank } = req.body;

  const mailOptions = {
    from: "yourgmail@gmail.com",
    replyTo: email,
    to: ["z1ng0gd@gmail.com"],
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
    if (err) return res.send("Error ❌");
    res.send("Application Sent ✅");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});