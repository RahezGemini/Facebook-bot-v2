const { date } = require('./time')

const font = {
  bold: `\x1b[1m`,
  italic: `\x1b[3m`
}
const warna = {
  reset: `\x1b[0m`, 
  hitam: `\x1b[30m`,
  merah: `\x1b[31m`,
  hijau: `\x1b[32m`,
  kuning: `\x1b[33m`,
  biru: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  putih: `\x1b[37m`
};

const log = {
  error: `${warna.merah}${date}${font.bold} ERROR: ${warna.reset}`, 
  login: `${warna.hijau}${date}${font.bold} LOGIN: ${warna.reset}`, 
  info: `${warna.cyan}${date}${font.bold} INFO: ${warna.reset}`, 
  akun: `${warna.magenta}${date}${font.bold} AKUN: ${warna.reset}`, 
  pesan: `${warna.kuning}${date}${font.bold} PESAN: ${warna.reset}`,
  warn: `${warna.kuning}${date}${font.bold} WARN: ${warna.reset}`,
  cmds: `${warna.biru}${date}${font.bold} CMD: ${warna.reset}`
}

function info(name) {
  return `${warna.hitam}${date}${warna.reset} ${warna.biru}${font.bold} ${name.toUpperCase()}: ${warna.reset}`;
};

module.exports = { warna, font, log, info };