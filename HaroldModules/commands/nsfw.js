const fs = require("fs");
const path = require("path");

module.exports = {
  name: "nsfw",
  hasPermission: "members",
  prefix: "enable",
  Programmer: "Your Name",
  info: "Switch NSFW commands on or off for a thread",
  category: "nsfw",
  usages: "nsfw on|off",
  cooldowns: 5,

  letStart: async function ({ api, event, target }) {
    const nsfwDataFile = path.join(__dirname, 'nsfwSettings.json');
    let nsfwSettings = JSON.parse(fs.readFileSync(nsfwDataFile, { encoding: 'utf8' }));

    const threadId = event.threadID;
    const isAdmin = event.isAdmin;

    if (!isAdmin) {
      return api.sendMessage("Only admins can toggle NSFW settings.", threadId);
    }

    const command = target[0];
    if (command === "on" || command === "off") {
      nsfwSettings[threadId] = command === "on";
      fs.writeFileSync(nsfwDataFile, JSON.stringify(nsfwSettings, null, 2));
      api.sendMessage(
        `NSFW is now ${command === "on" ? "activated" : "deactivated"} for this thread.`,
        threadId
      );
    } else {
      api.sendMessage(
        "Invalid command. Use 'nsfw on' to activate or 'nsfw off' to deactivate.",
        threadId
      );
    }
  }
};