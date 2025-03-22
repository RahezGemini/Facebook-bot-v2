const dir = process.cwd();
const login = require(`${dir}/fb-chat-api`);
const { message: funcMessage, getStream, getStreamsFromAttachment } = global.utils;
const fs = require("fs");
const path = require("path");
const { log, port, host, serverPort, tanggal, waktu, web, warna, kuldown, date, info } = global.Akari;
const { prefix, name, adminID, onlyAdmin, language, setting, version } = global.Akari.config;
const proxy = { host: host, port: port };

console.log(info('NAME') + `${name || 'Facebook-bot'}`);
console.log(info('PREFIX') + `${prefix}`);
console.log(info('PROJECT VERSION') + `${version}.`);
console.log(info('NODE VERSION') + `${process.version}.`);
console.log(info('LANGUAGE') + `${language}.`);
console.log(info('ADMIN ID') + `${adminID}.`);

fs.readdir('./script/cmd', (err, files) => {
    if (err) {
        console.log(log.error + `Error reading command directory: ${err}`);
        return;
    }
    const commands = files.map(file => path.parse(file).name);
    console.log(info('CMD') + `${commands}.`);
});

const akun = fs.readFileSync('./account.txt', 'utf8');
if (!akun || akun.length < 0) {
    console.log(log.error + 'Harap masukkan cookie terlebih dahulu.');
    process.exit()
}

require(`${dir}/deshboard/app.js`);

login({ appState: JSON.parse(akun), proxy }, setting, (err, api) => {
    if (err) {
        return console.log(log.error + `Terjadi kesalahan saat login: ${err}`);
    }

    api.listenMqtt(async (err, event) => {
        if (err) {
            console.log(log.error + `${err.message || err.error}`);
            process.exit();
        }

        const message = funcMessage(api, event);
        const userData = require(`${process.cwd()}/database/script/user.js`)(api, event)
        const threadData = require(`${process.cwd()}/database/script/thread.js`)(api, event)

        await require("./custom.js")({ api, threadData, userData, message, event });

        const body = event.body;
        if (!body || (global.Akari.config.onlyAdmin === true && !adminID.includes(event.senderID)) || (event.isGroup === false && !adminID.includes(event.senderID))) return;

        const cmd = body.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();

        if (!body.startsWith(prefix)) {
            if (body.toLowerCase() === "prefix") return api.sendMessage(`Prefix ${name}: [ ${prefix} ]`, event.threadID, event.messageID);
            await userData.create(event.senderID);
        }

        if (body.trim() === prefix) {
            api.sendMessage(`Hello use ${prefix} menu to view command lists`, event.threadID, event.messageID);
        }

        const thread = threadData.get(event.threadID);

        if (thread && thread.ban.status === true) {
            if (event.isGroup === true) {
                setTimeout(() => {
                    api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
                }, 2000);
            }
        }

        if (userData && userData.ban.status === true) {
            if (body.startsWith(prefix)) {
                api.sendMessage(`You have been banned for the following reason: ${userData.ban.reason}`, event.threadID);
            } else {
                return; // No Reply User Banned
            }
        }

        async function cmds(cmd, api, event) {
            const args = body?.replace(`${prefix}${cmd}`, "")?.trim().split(' ');

            try {
                const threadInfo = await new Promise((resolve, reject) => {
                    api.getThreadInfo(event.threadID, (err, info) => {
                        if (err) reject(err);
                        else resolve(info);
                    });
                });

                const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
                const files = fs.readdirSync(path.join(__dirname, './script', 'cmd'));
                let commandFound = false;

                for (const file of files) {
                    if (file.endsWith('.js')) {
                        const commandPath = path.join(path.join(__dirname, './script', 'cmd'), file);
                        const { config, execute, bahasa } = require(commandPath);

                        if (config && config.name === cmd && typeof execute === 'function') {
                            commandFound = true;
                            console.log(log.cmds + `Running command: ${config.name}.`);
                            const lang = veng => bahasa[languages][veng];

                            if (kuldown(event.senderID, config.name, config.countdowm) === 'date') {
                                if (config.role === 0 || !config.role) {
                                    await execute({ api, event, args, lang, getStream, userData, threadData, message, getStreamsFromAttachment });
                                    return;
                                }
                                if ((config.role === 2 || config.role === 1) && adminID.includes(event.senderID) || config.role === 0) {
                                    await execute({ api, event, args, lang, getStream, userData, threadData, message, getStreamsFromAttachment });
                                    return;
                                } else if (config.role === 1 && adminIDs.includes(event.senderID) || config.role === 0) {
                                    await execute({ api, event, args, lang, getStream, userData, threadData, message, getStreamsFromAttachment });
                                    return;
                                } else {
                                    api.setMessageReaction("❗", event.messageID);
                                }
                            } else {
                                api.setMessageReaction('⌛', event.messageID);
                            }
                        }
                    }
                }

                if (!commandFound) {
                    return api.sendMessage(`Perintah ${cmd} Tidak di Temukan`);
                }
            } catch (error) {
                console.log(log.error + 'Perintah error: ' + error.message);
                api.sendMessage(`Error: ${error.message}`, event.threadID);
            }
        }

        await cmds(cmd, api, event);
    });

    api.listen((err, message) => {
        if (err) {
            console.log(log.error + `Error listening to messages: ${err}`);
            return;
        }
        const text = message.body;
        console.log(info(message.senderID) + text);
    });
});