const fs = require('fs');
const logFilePath = './logs.json';

module.exports = {
  name: "resend",
  hasPermission: "members",
  prefix: "disable",
  Programmer: "Jonell Magallanes",
  info: "Resends messages that were unsent by a user",
  category: "Utility",
  usages: "N/A",
  cooldowns: 5,

  noPrefix({ api, event }) {
    if (event.type === "message_unsend") {
      // Read the existing chat logs
      let chatLogs = {};
      if (fs.existsSync(logFilePath)) {
        chatLogs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
      }

      // Check if there are logs for the thread
      if (chatLogs[event.threadID]) {
        // Find the unsent message
        const unsentMessage = chatLogs[event.threadID].find(m => m.messageID === event.messageID);
        if (unsentMessage) {
          // Resend the unsent message
          api.sendMessage(unsentMessage.body, event.threadID);
        }
      }
    } else {
      // Save the message to logs
      let chatLogs = {};
      if (fs.existsSync(logFilePath)) {
        chatLogs = JSON.parse(fs.readFileSync(logFilePath, 'utf8'));
      }

      // Initialize thread log if not present
      if (!chatLogs[event.threadID]) {
        chatLogs[event.threadID] = [];
      }

      // Append the new message to the thread log
      chatLogs[event.threadID].push({
        messageID: event.messageID,
        body: event.body,
        senderID: event.senderID,
        timestamp: event.timestamp
      });

      // Write the updated logs to file
      fs.writeFileSync(logFilePath, JSON.stringify(chatLogs, null, 2));
    }
  },
  letStart: ({}) => {
  }
  };