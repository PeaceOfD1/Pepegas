const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "pepegas-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)
`);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing username or password"
    });
  }

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (username,password) VALUES (?,?)",
    [username, hash],
    function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }

      res.json({
        success: true
      });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=?",
    [username],
    async (err, user) => {
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found"
        });
      }

      const ok = await bcrypt.compare(
        password,
        user.password
      );

      if (!ok) {
        return res.status(400).json({
          success: false,
          message: "Wrong password"
        });
      }

      req.session.userId = user.id;
      req.session.username = user.username;

      res.json({
        success: true,
        username: user.username
      });
    }
  );
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

app.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.json({
      loggedIn: false
    });
  }

  res.json({
    loggedIn: true,
    username: req.session.username
  });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});