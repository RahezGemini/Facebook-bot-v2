const fs = require('fs');
const path = require('path');
const axios = require('axios')
const { info, log, tanggal } = global.Akari;

let user = {};
const dbPath = path.resolve('./data/user.db');
if (fs.existsSync(dbPath)) {
  try {
    user = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    console.log(log.error + 'Gagal membaca user.db: ', error);
    user = {};
  }
} else {
  fs.writeFileSync(dbPath, JSON.stringify({}, null, 2));
}
module.exports = async function(api, event) {
 async function create(userID) {
  if (!isNaN(userID)) {
    return api.sendMessage(`Invalid ID ${userID}`, event.threadID)
    console.log(info('DATABASE') + `${userID} Invalid ID`)
  }

  const userInfo = await api.getUserInfo(userID);
  const userName = userInfo[userID]?.name || 'Facebook User';

  const userCreate = {
    'name': userName,
    'userID': userID,
    'money': 0,
    'gender': userinfo[userID]?.gender,
    'exp': 0,
    'level': 1,
    'ban': {
      'status': false,
      'reason': 'No Reason'
    },
    'data': {
      'createAt': tanggal,
      'daily': null
    }
  };

  user[userID] = userCreate;
  fs.writeFile(dbPath, JSON.stringify(user, null, 2), err => {
    if (err) console.log(log.error + "Terjadi kesalahan pada user db: ", err);
  });
}

function set(userID, item, value) {
  if (['name', 'ban', 'data'].includes(item)) {
    user[userID][item] = value;
  } else if (['money', 'exp', 'level'].includes(item)) {
    if (typeof value === 'number') {
      user[userID][item] = value;
    } else {
      console.log(info('database') + 'Nilai untuk ' + item + ' harus berupa angka.');
      return;
    }
  }
  console.log(info('database') + 'Pembaruan berhasil.');
  fs.writeFile(dbPath, JSON.stringify(user, null, 2), err => {
    if (err) console.log(logo.error + "Terjadi kesalahan pada db: ", err);
  });
}

function get(userID) {
  if (!isNaN(userID)) {
    api.sendMessage('Invalid ID', event.threadID);
  }
  return user[userID] || create(userID)
}

async function getAvatarUrl(id) {
  if (isNaN(id)) {
   console.log(log.error + `userID ${id} Invalid`)
  }
  try {
    const user = await axios.post(`https://www.facebook.com/api/graphql/`, null, {
      params: {
        doc_id: "5341536295888250",
        variables: JSON.stringify({ height: 500, scale: 1, id, width: 500 })
      }
    });
    return user.data.data.profile.profile_picture.uri;
  }
  catch (err) {
    return "https://i.ibb.co/bBSpr5v/143086968-2856368904622192-1959732218791162458-n.png";
  }
}

function getAll() {
  return data;
}

 return {
   set, 
   get,
   getAvatarUrl, 
   getAll, 
   create
 }
}