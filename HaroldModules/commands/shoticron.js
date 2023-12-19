const fs = require('fs');
const axios = require('axios');
const cron = require('node-cron');
const request = require('request');

// JSON file to store the active threads
const activeThreadsPath = './HaroldModules/commands/activeThreads.json';
let activeThreads = {};

// Load active threads from JSON file
try {
  activeThreads = JSON.parse(fs.readFileSync(activeThreadsPath));
} catch (error) {
  console.error('Failed to load active threads:', error);
}

// Save active threads to JSON file
function saveActiveThreads() {
  fs.writeFileSync(activeThreadsPath, JSON.stringify(activeThreads, null, 2));
}

module.exports = {
  name: "shoticron",
  hasPermission: "members",
  Programmer: "Jonell Magallanes",
  info: "Automaticaly send shoti with on and off",
  prefix: "enable",
  category: "shoti cron",
  usages: "[on/off]",
  cooldowns: 5,

  letStart: async function({api, event}) {
    const target = event.body.split(" ");
    const threadID = event.threadID;

    if (target[1] === "on") {
      if (!activeThreads[threadID]) {
        activeThreads[threadID] = true;
        saveActiveThreads();
        api.sendMessage(`Automatic sending of videos is now enable.`, event.threadID, (err, info) =>
         setTimeout(() => {
          api.unsendMessage(info.messageID) } , 20000),event.messageID);

        cron.schedule('*/2 * * * *', async () => {
          try {
           if (activeThreads[threadID]) { 
             let response = await axios.post(
             "https://api--v1-shoti.vercel.app/api/v1/get",
             {
              apikey: "$shoti-1hfdaljvdsfauofg7j",
             },
               );
            var file = fs.createWriteStream(__dirname + "/cache/shoti.mp4");
             const userInfo = response.data.data.user;
                  const username = userInfo.username;
                  const nickname = userInfo.nickname;
          const tid = event.threadID
            var rqs = request(encodeURI(response.data.data.url));
            rqs.pipe(file);
            file.on('finish', () => {
              api.sendMessage(
                          {
                    body: `Username: @${username}\nNickname: ${nickname}\nTid: ${tid}`,
               attachment: fs.createReadStream(__dirname + '/cache/shoti.mp4')
              }, threadID, (error, info) => {
               if (!error) {
                fs.unlinkSync(__dirname + '/cache/shoti.mp4');
               }
              });
            });
           }
          } catch (error) {
           console.error('Error:', error);
          }
        });
      } else {
api.sendMessage("Automatic sending of videos is already ON in this thread.", threadID);      }
    } else if (target[1] === "off") {
      if (activeThreads[threadID]) {
        activeThreads[threadID] = false;
        saveActiveThreads();
api.sendMessage(`Automatic sending of videos is now disable.`, threadID);
      } else {
api.sendMessage("Automatic sending of videos is already OFF in this thread.", threadID);
      }
    }
  }
};