const express = require("express");
const cors = require("cors");
const { Sequelize, Model, DataTypes } = require("sequelize");

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define a model
class User extends Model {}

User.init(
  {
    username: DataTypes.STRING,
    birthday: DataTypes.DATE,
  },
  { sequelize, modelName: "user" }
);

// Initialize Express app
const app = express();
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a user
app.post("/users", async (req, res) => {
  const { username, birthday } = req.body;

  try {
    const user = await User.create({ username, birthday: new Date(birthday) });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Here you would typically check the username and password against your database
  // For simplicity, let's just assume a scenario where the username and password are both "admin"

  if (email === "admin" && password === "admin") {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }
});

// Start the server
app.listen(3000, async () => {
  console.log("Server is running on port 3000");

  // Sync the models
  await sequelize.sync({ force: true });
});
