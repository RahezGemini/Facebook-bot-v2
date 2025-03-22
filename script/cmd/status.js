const adminID = global.Akari.config.AdminID;

module.exports = {
  hady: {
    name: "status",
    author: "Rahez",
    countdown: 10,
    role: 0,
    usage: ""
  },

  exexute: async function ({ api, event, userData }) {
    const { name, userID, level, exp, money } = userData.get(event.senderID);

    let role = 'user';

    if (adminID.includes(event.senderID)) {
      role = 'Admin';
    }

    const message = `
# STATS
Name: ${name}
ID: ${userID}
Money: ${money}$
Level: ${level}
Rank: ${rank(level)}
Role: ${role}`;

    function rank(level) {
      if (level < 10) {
        return "Bronze";
      } else if (level < 20) {
        return "Silver"
      } else if (level < 30) {
        return "Gold"
      } else if (level < 40) {
        return "Platinum"
      } else if (level < 50) {
        return "Diamond"
      } else if (level < 60) {
        return "Master"
      } else if (level < 70) {
        return "Grand Master"
      } else if (level < 80) {
        return "Mythic"
      } else if (level < 90) {
        return "Honor"
      } else if (level < 100) {
        return "Imortal"
      } else if (level < 9999999999) {
        return "Impossible"
      } else {
        return "Impossible"
      }
    }
    api.sendMessage(message, event.threadID);
  }
};