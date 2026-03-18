const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

/* FILES */
const APPS_FILE = "applications.json";
const ADMINS_FILE = "admins.json";

if (!fs.existsSync(APPS_FILE)) fs.writeFileSync(APPS_FILE, "[]");
if (!fs.existsSync(ADMINS_FILE)) {
  fs.writeFileSync(ADMINS_FILE, JSON.stringify([
    { username: "Z1ngoGD", password: "1234" }
  ]));
}

/* EMAIL */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "z1ng0gd@gmail.com",
    pass: "your_app_password"
  }
});

/* APPLY */
app.post("/apply", (req, res) => {
  const { username, reason, email, division } = req.body;

  const apps = JSON.parse(fs.readFileSync(APPS_FILE));

  const newApp = {
    id: Date.now().toString(),
    username,
    reason,
    email,
    division,
    rank: "Not Assigned ❌",
    status: "pending"
  };

  apps.push(newApp);
  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));

  transporter.sendMail({
    from: "z1ng0gd@gmail.com",
    to: "z1ng0gd@gmail.com",
    subject: "New Application",
    text: `${username} applied for ${division}`
  });

  res.send("Application Sent ✅");
});

/* LOGIN */
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const admins = JSON.parse(fs.readFileSync(ADMINS_FILE));

  const valid = admins.find(
    a => a.username === username && a.password === password
  );

  res.json({ success: !!valid });
});

/* GET APPS */
app.get("/applications", (req, res) => {
  const user = req.headers["admin-user"];
  const pass = req.headers["admin-pass"];

  const admins = JSON.parse(fs.readFileSync(ADMINS_FILE));

  const valid = admins.find(
    a => a.username === user && a.password === pass
  );

  if (!valid) return res.status(403).send("Forbidden");

  res.json(JSON.parse(fs.readFileSync(APPS_FILE)));
});

/* UPDATE */
app.post("/update", (req, res) => {
  const user = req.headers["admin-user"];
  const pass = req.headers["admin-pass"];

  const admins = JSON.parse(fs.readFileSync(ADMINS_FILE));

  const valid = admins.find(
    a => a.username === user && a.password === pass
  );

  if (!valid) return res.status(403).send("Forbidden");

  const { id, status, rank } = req.body;

  let apps = JSON.parse(fs.readFileSync(APPS_FILE));

  apps = apps.map(app =>
    app.id === id ? { ...app, status, rank } : app
  );

  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2));

  res.send("Updated ✅");
});

/* START */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});