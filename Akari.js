const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const axios = require('axios');
const { prefix, name, language, admin, config: a, host, port, serverPort, onlyAdmin, timezone, userAgent, antiinbox, setting } = require('./config');
const { version } = require('./package.json');
const now = moment.tz(timezone);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const { kuldown } = require('./logger/cooldown');
const { date } = require('./logger/time');
const utils = require('./utils.js');
const { warna, log, info } = require("./logger/log");
const { execSync } = require('child_process');

global.Akari = {
  config: {
    prefix: prefix,
    version: version,
    name: name,
    adminID: admin,
    onlyAdmin: onlyAdmin,
    language: language,
    antiinbox: antiinbox,
    setting
  },
  log: log,
  info: info,
  warna: warna,
  host: host,
  port: port,
  kuldown: kuldown,
  date: date,
  serverPort: serverPort,
  web: a.url || `http://localhost:${serverPort}`,
  tanggal: tanggal,
  waktu: waktu,
  startTime: Date.now() - process.uptime() * 1000,
  fcaApi: null,
  botID: null
};

global.db = {
  allThreadData: [],
  allUserData: [],
  threadData: null,
  userData: null,
  receivedTheFirstMessage: {}
};

global.utils = utils;


process.on('unhandledRejection', (reason, promise) => {
  console.log(global.Akari.log.error + 'Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.log(global.Akari.log.error + 'Uncaught exception:', err);
});

function validJSON(pathDir) {
  try {
    if (!fs.existsSync(pathDir))
      throw new Error(`File "${pathDir}" not found`);
    execSync(`npx jsonlint "${pathDir}"`, { stdio: 'pipe' });
    return true;
  } catch (err) {
    let msgError = err.message;
    msgError = msgError.split("\n").slice(1).join("\n");
    const indexPos = msgError.indexOf("    at");
    msgError = msgError.slice(0, indexPos != -1 ? indexPos - 1 : msgError.length);
    throw new Error(msgError);
  }
}

const { NODE_ENV } = process.env;
const dirConfig = path.normalize(`${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirAccount = path.normalize(`${__dirname}/account${['production', 'development'].includes(NODE_ENV) ? '.dev.txt' : '.txt'}`);

for (const pathDir of [dirConfig]) {
  try {
    validJSON(pathDir);
  } catch (err) {
    console.log(global.Akari.log.error + "CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message.split("\n").map(line => `  ${line}`).join("\n")}\nPlease fix it and restart bot`);
    process.exit(0);
  }
}

const config = require(dirConfig);

Object.assign(global.Akari, {
  web: a.url || `http://localhost:${serverPort}`,
  startTime: Date.now() - process.uptime() * 1000
});

async function checkVersion() {
  try {
    const { data: { version } } = await axios.get("https://raw.githubusercontent.com/RahezGemini/facebook-bot-v2/main/package.json");
    const currentVersion = require("./package.json").version;
    if (compareVersion(version, currentVersion) === 1)
      console.log(global.Akari.log.info + "NEW VERSION",
        "Facebook-Bot",
        colors.gray(currentVersion),
        colors.hex("#eb6a07", version),
        colors.hex("#eb6a07", "node update")
      );
  } catch (err) {
    console.log(global.Akari.log.error + "VERSION CHECK", `Failed to check version: ${err.message}`);
  }
}

function compareVersion(version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  for (let i = 0; i < 3; i++) {
    if (parseInt(v1[i]) > parseInt(v2[i]))
      return 1;
    if (parseInt(v1[i]) < parseInt(v2[i]))
      return -1;
  }
  return 0;
}

checkVersion();

require(`./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`);