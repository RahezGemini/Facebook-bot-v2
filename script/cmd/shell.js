const { exec } = require("child_process");
module.exports = {
  config: {
    name: "shell",
    countdown: 6,
    role: 2,
    author: "Rahez",
    usage: "<kode>"
  },

  execute: async function({ api, event, args }) {
    if (!args.join(' ')) return api.sendMessage(`You haven't entered the terminal code.`, event.threadID, event.messageID);
    exec(args.join(" "), (error, stdout, stderr) => {
      let kotori = "";
      if (error) {
        kotori = error.message;
      }
      if (stdout) {
        kotori = stdout;
      }
      if (stderr) {
        kotori = stderr;
      }
      api.sendMessage(kotori, event.threadID, event.messageID);
    });
  },
};