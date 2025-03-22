module.exports = {
  config: {
    name: "add",
    author: "Rahez",
    role: 0,
    countdown: 10,
    usage: "<uid>"
  },

  execute: async function({ api, event, args }) {
    if (!args[0]) return api.sendMessage(`You haven't given her id yet.`, event.threadID, event.messageID);
    if (!isNaN(args[0])) {
      return api.sendMessage('Invalid uid', event.threadID)
    }
    if (event.isGroup !== true) {
      return api.sendMessage('This command cannot be used in private chat', event.threadID)
    }
    try {
      const userInfo = await api.getUserInfo(args[0]);
      api.addUserToGroup(args[0], event.threadID);
      api.sendMessage(`Successfully adding ${userInfo.name} to the group`)
    } catch (e) {
      api.sendMessage('failed to add users to the group', event.threadID);
      console.log(`Error: ${e}`)
    }
  }
};