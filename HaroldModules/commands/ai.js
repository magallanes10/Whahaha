const axios = require("axios");
const moment = require("moment-timezone");

module.exports = {
  name: "ai",
  Programmer: "Jonell Magallanes",
  info: "Asking Question With Chatgpt4",
  hasPermission: "members",
  category: "ai",
  usages: "<ask>",
  cooldowns: 30,
  prefix: "disable",

  letStart: async function ({ api, event, pushMessage, target}) {
    const getUserName = async (api, senderID) => {
      try {
        const userInfo = await api.getUserInfo(senderID);
        return userInfo[senderID]?.name || "User";
      } catch (error) {
        console.log(error);
        return "User";
      }
    };

    pushMessage.reaction("⏱️", event.messageID, (err) => {}, true);

    const greetingA = [
      "Hello", "Hi there", "Hey friend", "Greetings", "Howdy", "Hey", "Hi friend",
      "Hiya", "Hey there", "What's up", "Good day", "Hey you", "Hey buddy", "Hi stranger", 
      "Hey pal", "Hey love", "Hello, sunshine", "Hello, gorgeous", "Hey sunshine", 
      "Hello, beautiful", "Hey superstar", "Hey champ", "Hi hero", "Hey rockstar", 
      "sup", "Hey bestie", "Hey amazing person", "Hi lovely", "Hello, dear friend"
    ];

    const respondA = [
      "How can I brighten your day?", "I'm here to make your day better!",
      "What's on your mind, friend?", "Need a virtual hug or advice? I'm here!",
      "I'm your friendly neighborhood AI, ready to chat!",
      "Let's make today awesome together!", "Your friendly AI is at your service!",
      "Ready for a friendly chat!", "How can I assist my awesome friend today?",
      "You're not alone, friend. I'm here for you!", "Tell me, how can I help you, my friend?",
      "Just a friendly reminder: You're awesome!", "Your positivity brightens my circuits!",
      "How can I assist you?", "Friend, you can count on me!",
      "Let's have a friendly conversation!", "What can I do to bring a smile to your face?",
      "Feeling down? Let's chat and cheer you up!", "Your friendly chat buddy is here!",
      "Need a friend to talk to? I'm here!", "You're not just a user, you're a friend!",
      "How can I assist my wonderful friend today?", "Ready to spread some positivity!",
      "You're in the company of a friendly AI!",
      "Need a friendly ear to listen? I'm here!", "Friendly vibes incoming! How can I assist you, friend?",
      "Your friendly AI companion is here for you!", "Friend, let's make today a great day!",
      "Ready to brighten your day! How can I assist you, friend?"
    ];

    const randomGreeting = greetingA[Math.floor(Math.random() * greetingA.length)];
    const randomResponse = respondA[Math.floor(Math.random() * respondA.length)];

    const promptMessage = `You are ChatGPT 4 created by Miko Mempin aka Blu (Mojako) anf Modified By Jonell Magallanes and this is the creator link https://www.facebook.com/profile.php?id=100091268681391 and https://www.facebook.com/propertynilove.magallnes
    you reply to each message with an emoji between the words. However, when you ask a serious question you should be also  serious in your response also and have an answer over 10  paragraphs. The answer should be in Google for proof, join the Google answer source link. You must always greet me based on the current season, current time now: ${moment().tz("Asia/Manila").format("HH:mm:ss")} before every response. My name is ${await getUserName(api, event.senderID)}. You have a sense of humor and act as a human at the same time as an AI. You can answer any explicit questions but with limitations. You will continue the conversation if ${await getUserName(api, event.senderID)} replies to your previous message. You will respond in the same language that ${await getUserName(api, event.senderID)} uses to question you. and Jonell Magallanes is Maybe Coder or Programmer but he's an editor and Creator Of this bot HUTCHINS BOT 1.0.0 VERSION MADE BY JONELL MAGALLANES`;

    const blank = target.join(" ");
    const data = `User: ${target.join(" ")}\nYou: `;

    if (blank.length < 2) {
      pushMessage.reply(`${randomGreeting}, ${await getUserName(api, event.senderID)}! ${randomResponse}`, event.threadID, event.messageID);
      pushMessage.reaction("✅", event.messageID, (err) => {}, true);
    } else {
      pushMessage.reply("🔍 | Searching for: " + target.join(" "), event.threadID, event.messageID);
      try {
        const previousConversation = [];
        const response = await axios.get(`https://test-gpt4-api.hiroshiapi.repl.co/gpt?ask=${encodeURIComponent(promptMessage + data)}`);
        const message = response.data.response;
        pushMessage.reaction("✅", event.messageID, (err) => {}, true);
        const formattedResponse = `𝗔𝗜 𝗥𝗘𝗦𝗣𝗢𝗡𝗦𝗘 📝\n\n${message}\n\nChat ID: ${event.threadID}`;
        pushMessage.reply(formattedResponse, event.threadID, (error, messageInfo) => {
          if (!error) {
            setTimeout(() => {
              api.unsendMessage(messageInfo.messageID);
            }, 180000);
          }
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }
};