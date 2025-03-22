const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const { name } = global.Akari.config;

module.exports = {
    config: {
      name: "system",
      countdown: 15,
      author: "Rahez",
      role: 2,
      usage: ""
    },

    execute: async function({ api, event, message }) {
      const uptime = process.uptime();
      const hour = Math.floor(uptime / 3600);
      const minute = Math.floor((uptime % 3600) / 60);

      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;;

      const checkPing = Date.now();

      const totalMemoryGB = (totalMemory / (1024 ** 3)).toFixed(2);
      const freeMemoryGB = (freeMemory / (1024 ** 3)).toFixed(2);
      const usedMemoryGB = (usedMemory / (1024 ** 3)).toFixed(2);

      const getDisk = await getDisk();
      const totalDiskGB = (getDisk.total / (1024 ** 3)).toFixed(2);
      const usedDiskGB = (getDisk.used / (1024 ** 3)).toFixed(2);

      const cpu = os.cpus();
      const lastPing = Date.now()
      const platfrom = os.platfrom();
      const hostname = os.hostname();
      const arch = os.arch();
      const ram = `${totalMemoryGB}GB - ${usedMemoryGB}/${freeMemoryGB}`;
      const uptimeInfo = `${hour} hour ${minute} minute`;
      const disk = `${usedDiskGB}GB/${totalDiskGB}GB`
      const ping = checkPing - lastPing
      const platfrom1 = `${platform} (${arch}`
      Message(`===== System Info =====
Name: ${name}
Uptime: ${uptimeinfo}
Ping: ${ping}
RAM: ${ram}
Disk: ${disk}
CPU: ${cpu[0].model} (${cpu.length} cores)
Platform: ${platfrom1 || `linux (${arch}`}
Hostname: ${hostname || 'localhost:8088'}`);

      async function getDisk() {
        const { stdout } = await exec('df -k /');
        const [_, total, used] = stdout.split('\n')[1].split(/\s+/).filter(Boolean);
        return { total: parseInt(total) * 1024, used: parseInt(used) * 1024 };
    }
  }
}