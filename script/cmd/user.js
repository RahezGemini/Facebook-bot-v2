const fs = require('fs');
const path = require('path');

const banDBPath = path.resolve('./database/data/ban.db');

function readBanDB() {
  if (!fs.existsSync(banDBPath)) {
    fs.writeFileSync(banDBPath, JSON.stringify([]));
    return [];
  }

  try {
    const data = fs.readFileSync(banDBPath, 'utf-8');
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ban database:', error);
    return [];
  }
}

function writeBanDB(data) {
  try {
    fs.writeFileSync(banDBPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to ban database:', error);
  }
}

module.exports = {
  config: {
    name: "user",
    author: "Rahez",
    countdown: 10,
    role: 0,
    usage: "<ban/unban/banlist>"
  },

  execute: async function({ args, api, event, usersData }) {
    if (!args.join(' ')) {
      return api.sendMessage('use <ban/unban/banlist>', event.threadID, event.messageID);
    }
    const userID = args[1] || event.messageReply.senderID
    const reason = args[2] || 'No Reason'
    
    if (args[0] === "ban") {
      if(!isNaN(userID)) {
        return api.sendMessage('Enter valid ID', event.threadID)
      }
      const banList = readBanDB();
      await usersData.set(userID, 'ban', 'status', 'true');
      await usersData.set(userID, 'ban', 'reason', reason)
      if (!banList.includes(userID)) {
        banList.push(userID);
        writeBanDB(banList);
        api.sendMessage(`UserID: ${UserID} successfully bother with the reason ${reason}`, event.threadID);
      } else {
        api.sendMessage(`UserID: ${userid} is already ban.`, event.threadID);
      }
    } else if (args[0] === "unban") {
  if (!isNaN(userID)) {
    return api.sendMessage('enter valid ID', event.threadID)
  }
      usersData.set(userID, 'ban', 'status',  false);
      usersData.set(userID, 'ban', 'reason', 'Tidak di banned')
      const banList = readBanDB();
      if (banList.includes(userID)) {
        const newBanList = banList.filter(id => id !== userID);
        writeBanDB(newBanList);
        api.sendMessage(`UserID: ${userID1} berhasil di-unban.`, event.threadID);
      } else {
        api.sendMessage(`UserID: ${userID} Not found in the tire list.`, event.threadID);
      }
    } else if (args[0] === "banlist") {
      const banList = readBanDB();
      if (banList.length > 0) {
        api.sendMessage(`list user ban:\n${banList.join('\n')}`, event.threadID);
      } else {
        api.sendMessage("No user is bothering.", event.threadID);
      }
    } else {
      api.sendMessage("Invalid commands. Use tires, unban, or banlist.", event.threadID);
    }
  }
};