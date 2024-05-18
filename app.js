const { App } = require("@slack/bolt");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

/* Add functionality here */

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");

  app.use(async ({ logger, context, next }) => {
    logger.info(context);
    await next();
  });

  app.command("/status-update", async ({ command, ack, respond }) => {
    // Acknowledge command request
    await ack();
    console.log("acknowledgement", command);
    let reply = command.text;
    await app.client.users.profile.set({
      token: process.env.SLACK_BOT_TOKEN,

      profile: {
        status_text: "riding a train",
        status_emoji: ":train:",
        status_expiration: 1532627506,
      },
    });

    await respond(reply);
  });
})();
