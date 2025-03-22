const fs = require('fs/promises');
const path = require('path');

module.exports = {
  config: {
    name: "menu",
    author: "Hady Zen", // modifed by Range, Rahez (Rebuild)
    role: 0,
    countdown: 10,
    usage: "<cmd/kosong>"
  },
    
  execute: async function ({ api, event, args }) {
    const files = await fs.readdir(path.join('./cmd'));
    const jsFiles = files.filter(file => path.extname(file) === '.js');
    jsFiles.sort();

    const commandList = { user: [], adminGroups: [], adminBot: [] };
    const commandInfo = {};

    for (const file of jsFiles) {
      const filePath = path.join(path.join('./cmd'), file);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      let configMatch = fileContent.match(/const\s*hady\s*=\s*{[^}]*name\s*:\s*"([^"]+)"/);
      if (!configMatch) {
        configMatch = fileContent.match(/hady\s*:\s*{[^}]*name\s*:\s*"([^"]+)"/);
      }

      if (configMatch) {
        const commandName = configMatch[1];

        let configObj = fileContent.match(/const\s+hady\s*=\s*{([^}]+)}/);
        if (!configObj) {
          configObj = fileContent.match(/hady\s*:\s*{([^}]+)}/);
        }

        if (configObj) {
          const configData = configObj[1].split(',').reduce((acc, line) => {
            const [key, value] = line.split(':').map(str => str.trim().replace(/"/g, ''));
            acc[key] = value;
            return acc;
          }, {});

          if (args[0] && args[0] === commandName) {
            commandInfo[commandName] = configData;
            break;
          }

          const role = parseInt(configData.role, 10);
          if (role === 0) {
            commandList.user.push(commandName);
          } else if (role === 1) {
            commandList.adminGroups.push(commandName);
          } else if (role === 2) {
            commandList.adminBot.push(commandName);
          }
        }
      }
    }

    if (args[0] && commandInfo[args[0]]) {
      const info = commandInfo[args[0]];
      api.sendMessage(`🜲 𝗜𝗻𝗳𝗼 𝗽𝗲𝗿𝗶𝗻𝘁𝗮𝗵
      
- Name: ${info.name}
- author: ${info.author}
- Role: ${hihi(role)}
- Kuldown: ${info.countdown}s
- Tutorial: ${info.usage}`, event.threadID, event.messageID);

    } else if (args[0] && !commandInfo[args[0]]) {
      api.sendMessage(`command ${args[0]} not foud.`, event.threadID, event.messageID);
    } else if (!args[0]) {
      const description = `use ${global.Akari.config.prefix}Menu <command or empy> for more info.`;
      const message = `𝗨𝗦𝗘𝗥\n${commandList.user.join(', ') || 'Tidak ada perintah.'}\n\n𝗔𝗗𝗠𝗜𝗡 𝗚𝗥𝗨𝗣\n${commandList.adminGroups.join(', ') || 'Tidak ada perintah.'}\n\n𝗔𝗗𝗠𝗜𝗡 𝗕𝗢𝗧\n${commandList.adminBot.join(', ') || 'Tidak ada perintah.'}\n\n\n${description}`;
      api.sendMessage(message, event.threadID, event.messageID);
    }
    function hihi(role) {
      if (role === 0) {
        return 'user'
      } else if (role === 1) {
        return 'admin grup'
      } else if (role === 2) {
        return 'admin bot'
      } else if (role !== NaN) {
        return 'unknown'
      } else {
        return 'unknown'
      }
    }
  }
};