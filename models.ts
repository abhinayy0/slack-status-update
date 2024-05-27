const { Sequelize, Model, DataTypes } = require("sequelize");

// Initialize Sequelize with SQLite database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

// Define a model
class User extends Model {}
class SlackConnection extends Model {}

User.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

SlackConnection.init(
  {
    slackUserName: {
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
  },
  { sequelize, modelName: "slack_connections" }
);
User.hasMany(SlackConnection, { as: "connections" });
SlackConnection.belongsTo(User);

module.exports = { User, SlackConnection };
