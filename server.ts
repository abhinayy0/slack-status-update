import { Request, Response } from "express";
import bcrypt from "bcrypt";
const { App, ExpressReceiver } = require("@slack/bolt");
import { User, SlackConnection, sequelize } from "./models";
const { WebClient } = require("@slack/web-api");
const express = require("express");
const cors = require("cors");

// Create a Bolt Receiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-secret",
  scopes: ["commands", "users:write"],
  installerOptions: {
    userScopes: [
      "channels:write",
      "channels:read",
      "chat:write",
      "im:read",
      "users:write",
      "users.profile:write",
      "users:read.email",
      "users:read",
    ],
  },
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      // const web = new WebClient(installation.token);
      console.log("Till token", installation);
      const web = new WebClient(installation.user.token);
      const res = await web.users.info({
        user: installation.user.id,
      });
      console.log("Token read failed");
      const user = await User.findOne({
        where: { email: res.user.profile.email },
        include: [
          {
            model: SlackConnection,
            as: "connections",
          },
        ],
      });
      console.log("user", user);
      if (user) {
        if (user.connections) {
        } else {
          const connection = await SlackConnection.create({
            slackUserName: res.user.name,
            accessToken: installation.user.token,
            teamId: installation.team.id,
            userId: installation.user.id,
          });
          user.connections;
        }
      } else {
        console.log("user doesn't exist skipping installayion");
      }
    },
    fetchInstallation: async (installQuery) => {
      // change the line below so it fetches from your database
      const user = await User.findOne({
        where: { userId: installQuery.userId },
      });
      let jsonObject = JSON.parse(user.installation);
      return jsonObject;
    },
  },
});

receiver.router.use(express.json());
receiver.router.use(cors());

// Create the Bolt App, using the receiver
const app = new App({
  receiver,
});

// Middleware to parse JSON bodies
receiver.router.use(express.json());

// Route to get all users

receiver.router.post("/api/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Here you would typically check the username and password against your database
  // For simplicity, let's just assume a scenario where the username and password are both "admin"
  const user = await User.findOne({
    where: { email: email },
  });
  console.log("UUU", user);

  const usert = await User.findOne({
    where: { email: email },
    include: [
      {
        model: SlackConnection,
        as: "connections",
      },
    ],
  });
  const connection = await SlackConnection.create({
    slackUserName: "res.user.name",
    accessToken: "installation.user.token",
    teamId: "installation.team.id",
    userId: "installation.user.id",
    installation: "advfvvdf",
  });
  console.log("user", usert);
  usert.updateAttributes(connection);
  console.log("user", usert);
  console.log("user", usert.connections);
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

receiver.router.get("/api/connections", async (req: Request, res: Response) => {
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

receiver.router.post("/api/signup", async (req: Request, res: Response) => {
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

receiver.router.get("/api/test", async (req: Request, res: Response) => {
  res.status(200).json({ message: "Slack Status Updater Test" });
});

(async () => {
  await app.start(3000);
  console.log("app is running");
  await sequelize.sync();
})();
