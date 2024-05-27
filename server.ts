import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User, SlackConnection } from "./models";
const express = require("express");
const cors = require("cors");

// Initialize Express app
const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Route to get all users

app.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Here you would typically check the username and password against your database
  // For simplicity, let's just assume a scenario where the username and password are both "admin"
  const user = await User.findOne({
    where: { email: email },
  });
  console.log("UUU", user);
  if (user.email === email) {
    bcrypt.compare(password, user.password, function (err, isMatch) {
      if (err) {
        throw err;
      } else if (!isMatch) {
        console.log("Password doesn't match!");
      } else {
        console.log("Password matches!");
        res.json({ success: true, message: "Login successful!" });
      }
    });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

app.get("/api/connections", async (req: Request, res: Response) => {
  const connections = await SlackConnection.findAll()
    .then((connections: SlackConnection) => {
      console.log(connections);
      res.status(200).json(connections);
    })
    .catch((err: Error) => {
      console.error("error:", err);
    });
  res.status(400);
});

app.post("/api/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username already exists", body: existingUser });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    User.create({
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Start the server
app.listen(3000, async () => {
  console.log("Server is running on port 3000");

  // Sync the models
  await sequelize.sync();
});
