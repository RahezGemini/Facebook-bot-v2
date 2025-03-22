const axios = require('axios')

module.exports = {
config: { 
  name: "translate",
  author: "Rahez", 
  role: 0,
  countdown: 10,
  usage: "translate <language> <text>"
}, 
  
execute: async function ({ api, event, args }) { 
 if (args.join(' ')) {
   const lang = args[0];
   const text = args.slice(1).join(' ');
   const respon = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
   api.sendMessage(`# Translate\n\n${respon.data[0].map(item => item[0]).join('')}`, event.threadID, event.messageID);
 } else {
   return api.sendMessage(`haven't given her a language or text yet.`, event.threadID, event.messageID);
  }
 }
}