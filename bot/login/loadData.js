const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { log, info } = global.Akari

function checkAndInstallModules(missingModules) {
  missingModules.forEach(module => {
    console.log(log.warn + `Modul ${module} tidak ditemukan`);

    const response = prompt(`Apakah Anda ingin menginstall modul ${module}? (yas/no)`);

    if (response.toLowerCase() === 'yes') {
      try {
        console.log(info('NPM') + `Meminstall modul ${module}...`);
        execSync(`npm install ${module}`, { stdio: 'inherit' });
        console.log(info('NPM') + `Modul ${module} berhasil diinstall.`);
      } catch (error) {
        console.error(log.error + `Error menginstall modul ${module}:`, error.message);
      }
    } else {
      return
    }
  });
}

function getRequiredModules() {
  const packageJsonPath = path.resolve(__dirname, './', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
}

function isModuleInstalled(module) {
  try {
    require(module);
    return true;
  } catch (error) {
    return false;
  }
}

function main() {
  const requiredModules = getRequiredModules();

  const missingModules = requiredModules.filter(module => !isModuleInstalled(module));

  if (missingModules.length > 0) {
    checkAndInstallModules(missingModules);
  } else {
    console.log(info('NPM') + 'Semua modul yang dibutuhkan sudah terinstall.');
  }
}

function prompt(question) {
  return require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).question(question);
}

main();