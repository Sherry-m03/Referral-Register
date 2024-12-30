import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

function generateReferralCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referralCode = "";
  for (let i = 0; i < 9; i++) {
    referralCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    if (i === 4) {
      referralCode += "-";
    }
  }
  return referralCode;
}

app.post("/register", async (req, res) => {
  const { email, name, phone, city, rcode, password } = req.body;
  console.log(req.body);

  try {
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      console.log("User exists");
      return res.status(400).json({ error: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user_ref_code = generateReferralCode();

      let referrerId = null;
      if (rcode) {
        const referrer = await db.query(
          "SELECT id FROM users WHERE referral_code = $1",
          [rcode]
        );
        if (referrer.rows.length === 0) {
          return res.status(400).json({ error: "Invalid referral code" });
        }
        referrerId = referrer.rows[0].id;
      }

      const userResult = await db.query(
        "INSERT INTO users (email, name, phone, city, referral_code, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [email, name, phone, city, user_ref_code, hashedPassword]
      );
      const userId = userResult.rows[0].id;

      if (referrerId) {
        await db.query(
          "INSERT INTO referrals (referrer_id, referee_id) VALUES ($1, $2)",
          [referrerId, userId]
        );
      }

      console.log("User registered successfully");
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error("Error in Register:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (userResult.rows.length === 0) {
    console.log("No User Found. Click on Register to create a new account");
    return res.status(404).json({
      error: "No User Found. Click on Register to create a new account",
    });
  } else {
    const user = userResult.rows[0];
    const passwordToMatch = user.password;
    const isMatch = await bcrypt.compare(password, passwordToMatch);

    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({ token });
    } else {
      console.log("Error logging in");
      return res.status(404).json({
        error: "Error logging in",
      });
    }
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }
  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

app.get("/user-profile", authenticateToken, async (req, res) => {
  console.log("Request received for /user-profile");
  const userId = req.user.id;
  try {
    const userResult = await db.query(
      "SELECT r.referee_id, u.name, u.email, u.created_at FROM referrals r JOIN users u ON r.referee_id = u.id WHERE r.referrer_id = $1",
      [userId]
    );
    console.log(userResult.rows);
    return res.status(200).json(userResult.rows);
  } catch (err) {
    console.error("Error fetching user data:", err);
    return res.status(500).json({ error: "Error fetching data" });
  }
});

app.listen(process.env.PORT);
