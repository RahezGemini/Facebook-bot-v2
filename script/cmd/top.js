module.exports = {
config: { 
  name: "",
  author: "Rahez", 
  role: 0,
  countdown: 10,
  usage: ""
}, 
  
  
execute: async function ({ api, event, args, userData }) {
  
  const cmd = args[0];
  if (cmd === 'money') {
    const allUsers = await userData.getAll();
    
    const topUsers = allUsers.sort((a, b) => b.money - a.money).slice(0, 10);
    
    const topUsersList = topUsers.map((user, index) => `${index + 1}. ${user.name}: ${user.money}`);
    
    const messageText = `10 users with the most money\n\n${topUsersList.join('\n')}`;
    
    api.sendMessage(messageText, event.threadID)
  } else if (cmd === 'level') {
    const alluser = await userData.getAll();
    
    const topuser = alluser.sort((a, b) => b.level - a.level).slice(0, 10);
    
    const topuserlist = topuser.map((user, index) => `${index + 1}. ${user.name}: ${user.money}`);
    
    const message = `10 Users with the highest level\n\n${topUsersList.join('\n')}`;
    
    api.sendMessage(message, event.threadID);
  } else {
    api.sendMessage('use: top <money/level>', event.threadID)
  }
 }
};