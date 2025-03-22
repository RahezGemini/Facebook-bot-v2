const axios = require('axios');
const { log, info, config } = global.Akari;
const { url, serverPort } = config; 

const PORT = serverPort || (!isNaN(config.port) && config.port) || 3001;

let myUrl = url || `https://${process.env.REPL_OWNER
	? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
	: process.env.API_SERVER_EXTERNAL == "https://api.glitch.com"
		? `${process.env.PROJECT_DOMAIN}.glitch.me`
		: `localhost:${PORT}`}`;
myUrl.includes('localhost') && (myUrl = myUrl.replace('https', 'http'));
myUrl += '/uptime';

let status = 'ok';
setTimeout(async function autoUptime() {
	try {
		await axios.get(myUrl);
		if (status != 'ok') {
			status = 'ok';
			log.info("Bot is online");
		}
	}
	catch (e) {
		const err = e.response?.data || e;
		if (status != 'ok')
			return;
		status = 'failed';

		if (err.statusAccountBot == "can't login") {
			log.login("Can't login account bot");
		}
		else if (err.statusAccountBot == "block spam") {
			log.login("Your account is blocked");
		}
	}
	global.timeOutUptime = setInterval(autoUptime, 180);
}, (config.autoUptime.timeInterval || 180) * 1000);
console.log(info("UPTIME") + "uptime aktif di url: ", myUrl);
