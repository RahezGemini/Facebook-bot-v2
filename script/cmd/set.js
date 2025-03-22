module.exports = {
  config: {
    name: "set",
    author: "Rahez",
    role: 2,
    countdown: 10,
    usage: "<exp/dollar> <jumlah>"
  },

  execute: async function({ api, event, args, userData }) {
    try {

      if (args.length < 2) {
        return api.sendMessage("❌ use: set <exp/dollar/level> <amount>", event.threadID, event.messageID);
      }

      const type = args[0].toLowerCase();
      const amount = parseFloat(args[1]);
      const targetID = args[2] || event.senderID || event.messageReply?.senderID
      
      if (isNaN(amount) || amount < 0) {
        return api.sendMessage("❌ the amount should be a positive.", event.threadID, event.messageID);
      }

      const usersData = userData.get(targetID);

      if (!userdData.name) {
        return api.sendMessage("❌ Users are not found in the database.", event.threadID, event.messageID);
      }

      if (type === "exp") {
        await usersData.set(targetID, 'exp', amount);
        return api.sendMessage(`✅ Successfully set Exp ${usedata.name} to ${amount}.`, event.threadID, event.messageID);
      } else if (type === "level") {
        await usersData.set(targetID, "level", amount);
        return api.sendMessage(`✅ Successfully set level ${userData.name} to ${amount}.`, event.threadID, event.messageID);
      } else if (type === "money") {
        await usersData.set(targetID, "money", amount);
        return api.sendMessage(`✅ Successfully set money ${userData.name} to ${amount}.`, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ The valid type is 'Exp' or 'Dollar' and 'Level'.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error in set command:", error);
      return api.sendMessage("❌ An error occurs when running an order.", event.threadID, event.messageID);
    }
  }
};