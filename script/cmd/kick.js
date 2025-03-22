module.exports = { 
hady: { 
  name: "kick",
  author: "Rahez", 
  countdown: 10,
  role: 1,
  usage: "<id/reply/tag>"
}, 
  
execute: async function ({ api, event, args, lang }) {
if (event.messageReply) return api.removeUserFromGroup(event.messageReply.senderID, event.threadID);
if (args[0]) {
  const { mentions } = event;
	let hadi = ''; 
for (const id in mentions) { 
  mention += `${mentions[id].replace("@", "")}: ${id}\n`;
}
  api.removeUserFromGroup(`${mention || args[0]}`, event.threadID);
return;
} else { 
  api.sendMessage(`You haven't given her id yet.`, event.threadID, event.messageID);
  }
 }
};
