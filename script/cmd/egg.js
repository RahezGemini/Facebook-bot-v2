module.exports = {
  config: {
    name: "egg",
    author: "Rahez",
    role: 0,
    countdown: 10,
    usage: ""
  },


  execute: async function({ api, event, args }) {
    api.sendMessage(`module.exports = {
config: { 
  name: "",
  author: "Rahez", 
  role: 0,
  countdown: 10,
  usage: ""
}, 
  
  
execute: async function ({ api, event, args }) { 
 }
};`, event.threadID, event.messageID)
  }
};