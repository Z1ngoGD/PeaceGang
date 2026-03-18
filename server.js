const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// 🔐 ADMIN LOGIN
const ADMIN_USER = "Z1ngoGD";
const ADMIN_PASS = "1234";

// 📂 Ensure file exists
if (!fs.existsSync("applications.json")) {
  fs.writeFileSync("applications.json", "[]");
}

// 📝 APPLY
app.post("/apply", (req, res) => {
  const apps = JSON.parse(fs.readFileSync("applications.json"));

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

  fs.writeFileSync("applications.json", JSON.stringify(apps, null, 2));

  res.send("Application submitted!");
});

// 🔐 GET APPLICATIONS (PROTECTED)
app.get("/applications", (req, res) => {
  const user = req.headers["admin-user"];
  const pass = req.headers["admin-pass"];

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return res.status(403).send("ACCESS DENIED");
  }

  const data = JSON.parse(fs.readFileSync("applications.json"));
  res.json(data);
});

// 🔐 UPDATE APPLICATION (PROTECTED)
app.post("/update", (req, res) => {
  const user = req.headers["admin-user"];
  const pass = req.headers["admin-pass"];

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return res.status(403).send("ACCESS DENIED");
  }

  let apps = JSON.parse(fs.readFileSync("applications.json"));

  apps = apps.map(app =>
    app.id == req.body.id
      ? { ...app, status: req.body.status, rank: req.body.rank }
      : app
  );

  fs.writeFileSync("applications.json", JSON.stringify(apps, null, 2));

  res.send("Updated!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running");
});