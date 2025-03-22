const fs = require('fs');  
const path = require('path');
module.exports = {
  config: { 
    name: "file", 
    author: "Rahez", 
    role: 2,
    countdown: 6,
    usage: "<name file>"
  }, 
  
  execute: async function ({ api, event, args }) {
    if (!args.join(' ')) return api.sendMessage(`You haven't given her a file name yet`, event.threadID, event.messageID);
    const direk = path.join('cmd', `${args[0]}.js`);
    const reps = fs.readFileSync(direk, 'utf8');
    if (!reps || reps.length < 0) { 
return api.sendMessage('The file you asked for does not exist.', event.threadID, event.messageID);
    } else { 
       api.sendMessage(reps, event.threadID, event.messageID);  
  }
 }
};