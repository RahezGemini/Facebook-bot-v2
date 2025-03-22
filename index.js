const { warna, log } = require('./logger/log')
const { spawn } = require('child_process');
const { version } = require('./package.json');

function start() {
  const child = spawn("node Akari.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
});

  child.on("close", (code) => {
    if (code == 2) {
      start(); 
  }
 });
 console.log(warna.biru + `███████╗ █████╗ ██╗      ██████╗  ██████╗  ██████╗ 
  ██╔════╝██╔══██╗██║      ██╔══██╗██╔════╝ ██╔══██╗
  █████╗  ███████║██║      ██████╔╝██║  ███╗██║  ██║
  ██╔══╝  ██╔══██║██║      ██╔═══╝ ██║   ██║██║  ██║
  ██║     ██║  ██║███████╗ ██║     ╚██████╔╝██████╔╝
  ╚═╝     ╚═╝  ╚═╝╚══════╝ ╚═╝      ╚═════╝ ╚═════╝\nFacebook bot v2 (${version}\n`);
 console.log(log.info + "Facebook chatbot messenger by Rahez.");
};
start();