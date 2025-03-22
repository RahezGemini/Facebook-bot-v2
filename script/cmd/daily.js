module.exports = {
  config: { 
    name: "daily", 
    author: "Rahez", 
    countdown: 10,
    role: 0,
    usage: ""
  }, 
  
  execute: async function ({ api, event, usersData }) {
  const { money, exp, daily } = usersData.get(event.senderID);
    if (daily == null || daily !== global.Akari.tanggal) { 
  userData.set(event.senderID, 'money', money + 2000);
  userData.set(event.senderID, 'exp', exp + 1000);
  userData.set(event.senderID, 'data', 'daily', global.Akari.tanggal);
    api.sendMessage("You managed to claim 2000 dollars and 1000 exp", event.threadID, event.messageID);
    } else {
    api.sendMessage('You have claimed a daily prize.', event.threadID, event.messageID);
  }
 }
};
