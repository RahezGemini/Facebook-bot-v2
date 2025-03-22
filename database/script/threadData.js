const fs = require('fs');
const path = require('path');
const { log, info } = global.Akari;

let threadsData = {};
const threadDbPath = path.resolve('./data/thread.db');
if (fs.existsSync(threadDbPath)) {
  try {
    threadsData = JSON.parse(fs.readFileSync(threadDbPath, 'utf-8'));
  } catch (error) {
    console.log(log.error + 'Gagal membaca thread.db: ', error);
    threadsData = {};
  }
} else {
  fs.writeFileSync(threadDbPath, JSON.stringify({}, null, 2));
}

module.exports = async function(api, event) {

  async function create(threadID) {
    if (!isNaN(threadID)) {
      return api.sendMessage(`Invalid ID ${threadID}`, event.threadID)
      console.log(info('DATABASE') + `ThreadID ${threadID} Invalid ID`)
    }
    
    const threadInfo = await new Promise((resolve, reject) => {
      api.getThreadInfo(threadID, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
    
    const threadCreate = {
      name: threadInfo.name || 'Thread Name',
      tid: threadID,
      emoji: threadInfo.emoji,
      imageSrc: threadInfo.imageSrc,
      member: threadInfo.participantIDs.length,
      admin: threadInfo.adminIDs ? threadInfo.adminIDs.length : 0,
      messageCount: threadInfo.messageCount,
      ban: {
        status: false,
        reason: 'no reason'
      }
    };

    threadsData[threadID] = threadCreate;
    fs.writeFile(threadDbPath, JSON.stringify(threadsData, null, 2), err => {
      if (err) console.log(log.error + "Terjadi kesalahan pada thread db: ", err);
    });
  }

  function get(threadID) {
    return threadsData[threadID] || create(threadID)
  }

  function getAll() {
    return threadsData;
  }

  function set(id, item, value) {
    if (['name', 'ban'].includes(item)) {
      threadsData[id][item] = value;
    } else if (['member', 'admin'].includes(item)) {
      if (typeof value === 'number') {
        threadsData[id][item] = value;
      } else {
        console.log(log.info + 'Nilai untuk ' + item + ' harus berupa angka.');
        return;
      }
    }
    fs.writeFile(threadDbPath, JSON.stringify(threadsData, null, 2), err => {
      if (err) console.log(log.error + "Terjadi kesalahan pada thread db: ", err);
    });
    console.log(log.info + 'Pembaruan berhasil.');
  }

  return {
    set,
    get,
    getAll,
    create
  }
}