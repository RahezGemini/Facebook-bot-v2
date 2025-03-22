const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const https = require("https");
const agent = new https.Agent({
  rejectUnauthorized: false
});
const moment = require("moment-timezone");
const mimeDB = require("mime-db");
const _ = require("lodash");
const { google } = require("googleapis");
const ora = require("ora");
const regCheckURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

class CustomError extends Error {
  constructor(obj) {
    if (typeof obj === 'string')
      obj = { message: obj };
    if (typeof obj !== 'object' || obj === null)
      throw new TypeError('Object required');
    obj.message ? super(obj.message) : super();
    Object.assign(this, obj);
  }
}

function setErrorUptime() {
  global.statusAccountBot = 'block spam';
  global.responseUptimeCurrent = 'Error';
}
const defaultStderrClearLine = process.stderr.clearLine;

function message(api, event) {
	async function sendMessageError(err) {
		if (typeof err === "object" && !err.stack)
			err = utils.removeHomeDir(JSON.stringify(err, null, 2));
		else
			err = utils.removeHomeDir(`${err.name || err.error}: ${err.message}`);
		return await api.sendMessage("Error", "errorOccurred", err, event.threadID, event.messageID);
	}
	return {
		send: async (form, callback) => {
			try {
				global.statusAccountBot = 'good';
				return await api.sendMessage(form, event.threadID, callback);
			}
			catch (err) {
				if (JSON.stringify(err).includes('spam')) {
					setErrorUptime();
					throw err;
				}
			}
		},
		reply: async (form, callback) => {
			try {
				global.statusAccountBot = 'good';
				return await api.sendMessage(form, event.threadID, callback, event.messageID);
			}
			catch (err) {
				if (JSON.stringify(err).includes('spam')) {
					setErrorUptime();
					throw err;
				}
			}
		},
		unsend: async (messageID, callback) => await api.unsendMessage(messageID, callback),
		reaction: async (emoji, messageID, callback) => {
			try {
				global.statusAccountBot = 'good';
				return await api.setMessageReaction(emoji, messageID, callback, true);
			}
			catch (err) {
				if (JSON.stringify(err).includes('spam')) {
					setErrorUptime();
					throw err;
				}
			}
		},
		err: async (err) => await sendMessageError(err),
		error: async (err) => await sendMessageError(err)
	};
}

function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

async function getStreamsFromAttachment(attachments) {
  const streams = [];
  for (const attachment of attachments) {
    const url = attachment.url;
    const ext = utils.getExtFromUrl(url);
    const fileName = `${utils.randomString(10)}.${ext}`;
    streams.push({
      pending: axios({
        url,
        method: "GET",
        responseType: "stream"
      }),
      fileName
    });
  }
  for (let i = 0; i < streams.length; i++) {
    const stream = await streams[i].pending;
    stream.data.path = streams[i].fileName;
    streams[i] = stream.data;
  }
  return streams;
}

async function getStreamFromURL(url = "", pathName = "", options = {}) {
  if (!options && typeof pathName === "object") {
    options = pathName;
    pathName = "";
  }
  try {
    if (!url || typeof url !== "string")
      console.log(log.error + `The first argument (url) must be a string`);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      ...options
    });
    if (!pathName)
      pathName = utils.randomString(10) + (response.headers["content-type"] ? '.' + utils.getExtFromMimeType(response.headers["content-type"]) : ".noext");
    response.data.path = pathName;
    return response.data;
  }
  catch (err) {
    throw err;
  }
}

function getExtFromAttachmentType(type) {
	switch (type) {
		case "photo":
			return 'png';
		case "animated_image":
			return "gif";
		case "video":
			return "mp4";
		case "audio":
			return "mp3";
		default:
			return "txt";
	}
}

function getExtFromUrl(url = "") {
  if (!url || typeof url !== "string")
    console.log(log.error + 'The first argument (url) must be a string');
  const reg = /(?<=https:\/\/cdn.fbsbx.com\/v\/.*?\/|https:\/\/video.xx.fbcdn.net\/v\/.*?\/|https:\/\/scontent.xx.fbcdn.net\/v\/.*?\/).*?(\/|\?)/g;
  const fileName = url.match(reg)[0].slice(0, -1);
  return fileName.slice(fileName.lastIndexOf(".") + 1);
}

function randomString(max, onlyOnce = false, possible) {
  if (!max || isNaN(max))
    max = 10;
  let text = "";
  possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < max; i++) {
    let random = Math.floor(Math.random() * possible.length);
    if (onlyOnce) {
      while (text.includes(possible[random]))
        random = Math.floor(Math.random() * possible.length);
    }
    text += possible[random];
  }
  return text;
}

function randomNumber(min, max) {
  if (!max) {
    max = min;
    min = 0;
  }
  if (min == null || min == undefined || isNaN(min))
   console.log(log.error + 'The first argument (min) must be a number');
  if (max == null || max == undefined || isNaN(max))
    console.log(log.error + 'The second argument (max) must be a number');
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function uploadImgbb(file) {
  let type = "file";
  try {
    if (!file)
      console.log(log.error + 'The first argument (file) must be a stream or a image url');
    if (regCheckURL.test(file) == true)
      type = "url";
    if (
      (type != "url" && (!(typeof file._read === 'function' && typeof file._readableState === 'object'))) ||
      (type == "url" && !regCheckURL.test(file))
    )
      throw new Error('The first argument (file) must be a stream or an image URL');

    const res_ = await axios({
      method: 'GET',
      url: 'https://imgbb.com'
    });

    const auth_token = res_.data.match(/auth_token="([^"]+)"/)[1];
    const timestamp = Date.now();

    const res = await axios({
      method: 'POST',
      url: 'https://imgbb.com/json',
      headers: {
        "content-type": "multipart/form-data"
      },
      data: {
        source: file,
        type: type,
        action: 'upload',
        timestamp: timestamp,
        auth_token: auth_token
      }
    });

    return res.data;
  }
  catch (err) {
    throw new CustomError(err.response ? err.response.data : err);
  }
}

function removeHomeDir(fullPath) {
  if (!fullPath || typeof fullPath !== "string")
    throw new Error('The first argument (fullPath) must be a string');
  while (fullPath.includes(process.cwd()))
    fullPath = fullPath.replace(process.cwd(), "");
  return fullPath;
}

function getExtFromMimeType(mimeType = "") {
	return mimeDB[mimeType] ? (mimeDB[mimeType].extensions || [])[0] || "unknow" : "unknow";
}

function getStream(url, filename) {
  try {
    const response = axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filePath = path.join(__dirname, 'cache', filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    throw error;
  }
}

const utils = {
  CustomError,
  
  message,
  getStreamFromURL: getStreamFromURL,
  getStreamFromURL,
  getStreamsFromAttachment,
  randomNumber,
  randomString,
  getExtFromUrl,
  getExtFromAttachmentType,
  getExtFromMimeType,
  uploadImgbb,
  removeHomeDir,
  getStream,
  getExtFromMimeType
}

module.exports = { utils };