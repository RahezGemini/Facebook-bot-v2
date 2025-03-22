module.exports = {
  config: {
    name: "tid",
    author: "Rahez",
    countdown: 10,
    role: 0,
    usage: ""
  },

  execute: async function({ api, event }) {
    api.sendMessage(event.threadID, event.threadID, event.messageID);
  }
};