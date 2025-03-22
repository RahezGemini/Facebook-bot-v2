let time = new Date();

time.setHours(time.getHours() + 7);
const jam = time.getHours();
const menit = time.getMinutes();
const detik = time.getSeconds();
const tahun = time.getFullYear();
const tanggal = time.getDate();
bulan = time.getMonth() + 1;

let date = `${jam.toString().padStart(2, '0')}:${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')} ${tanggal.toString().padStart(2, '0')}/${bulan.toString().padStart(2, '0')}/${tahun}`;

module.exports = { date };