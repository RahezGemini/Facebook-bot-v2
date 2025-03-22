module.exports = {
  config: {
    name: "hapus",
    author: "Rahez",
    role: 1,
    countdown: 10,
    usage: ""
  },

  execute: async function({ api, event, args, message }) {
    if (!event.messageReply || event.messageReply.senderID != api.getCurrentUserID())
      return message.reply('reply to the botage bots that you want to delete');
    message.unsend(event.messageReply.messageID);
  }
};