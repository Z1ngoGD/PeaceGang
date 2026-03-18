const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// 🔐 ADMIN LOGIN
const ADMIN_USER = "Z1ngoGD";
const ADMIN_PASS = "1234";

// 📂 Create file if missing
const filePath = path.join(__dirname, "applications.json");

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]");
}

// 🏠 FIX HOMEPAGE (IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 📝 APPLY
app.post("/apply", (req, res) => {
  const apps = JSON.parse(fs.readFileSync(filePath));

  const newApp = {
    id: Date.now(),
    username: req.body.username,
    email: req.body.email,
    reason: req.body.reason,
    division: req.body.division,
    status: "pending",
    rank: "None"
  };

  apps.push(newApp);

  fs.writeFileSync(filePath, JSON.stringify(apps, null, 2));

  res.send(`
    <h1 style="color:white;background:black;text-align:center;">
      ✅ Application Submitted!
    </h1>
    <div style="text-align:center;">
      <a href="/">⬅️ Go Back</a>
    </div>
  `);
});

// 🔐 GET APPLICATIONS (PROTECTED)
app.get("/applications", (req, res) => {
  const user = req.headers["admin-user"];
  const pass = req.headers["admin-pass"];

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return res.status(403).send("ACCESS DENIED");
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// 🔐 UPDATE APPLICATION
app.post("/update", (req, res) => {
  const user = req.headers["admin-user"];
  const pass = req.headers["admin-pass"];

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return res.status(403).send("ACCESS DENIED");
  }

  let apps = JSON.parse(fs.readFileSync(filePath));

  apps = apps.map(app =>
    app.id == req.body.id
      ? { ...app, status: req.body.status, rank: req.body.rank }
      : app
  );

  fs.writeFileSync(filePath, JSON.stringify(apps, null, 2));

  res.send("Updated!");
});

// 🚀 PORT FIX FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running...");
});