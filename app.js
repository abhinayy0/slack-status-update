const { App } = require("@slack/bolt");

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const User = sequelize.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  accessToken: {
    type: Sequelize.STRING,
  },
  teamId: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.STRING,
  },
  installation: {
    type: Sequelize.STRING,
  },
});

sequelize.sync();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "my-state-secret",
  scopes: ["commands", "users:write"],
  installerOptions: {
    userScopes: [
      "channels:write",
      "channels:read",
      "chat:write",
      "im:read",
      "users:write",
      "users.profile:write",
    ],
    directInstall: true,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      // change the line below so it saves to your database
      return await User.create({
        firstName: "janedoe",
        installation: JSON.stringify(installation),
        accessToken: installation.user.token,
        userId: installation.user.id,
        teamId: installation.team.id,
      });
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
(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");

  app.use(async ({ logger, context, next }) => {
    logger.info(context);
    await next();
  });

  /* Add functionality here */

  app.command("/status-update", async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    const user = await User.findOne({
      where: { userId: command.user_id },
    });
    await app.client.users.profile.set({
      token: user.accessToken,
      profile: {
        status_text: command.text,
        status_emoji: ":train:",
        status_expiration: 1532627506,
      },
    });

    await respond("Status updated to " + command.text);
  });
})();
