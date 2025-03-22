module.exports = {
  hady: { 
    name: "uid", 
    author: "Rahez", 
    countdown: 10,
    role: 0,
    usage: "<empy/reply/tag>"
  }, 
  
  execute: async function ({ api, event, args }) {
if (event.messageReply) return api.sendMessage(event.messageReply.senderID, event.threadID, event.messageID);
if (!args[0]) return api.sendMessage(event.senderID, event.threadID, event.messageID);
if (args[0]) {
  const { mentions } = event;
	let ah = ''; 
for (const id in mentions) { 
  ah += `${mentions[id].replace("@", "")}: ${id}\n`;
}
  api.sendMessage(ah, event.threadID, event.messageID);
return;
}
 }
};
