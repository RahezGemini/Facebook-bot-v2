const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
config: { 
  name: "cmd",
  author: "Range", // Rahez (Rebuild)
  role: 2,
  countdown: 10,
  usage: "<instal/unload/load>"
}, 
  
execute: async function ({ api, event, args }) { 
    const folderPath = "./script/cmd";
    const pilih = ["install", "delete", "load", "loadAll"];
    const awal = args[0];
    const namaFile = args[1];
    const link = args[2];
    
    if (awal === pilih[0]) {
      try {
        if (!namaFile || !namaFile.endsWith('.js')) {
          return api.sendMessage("use format: cmd install <file name>.js <link> or cmd install <file name>.js <code>", event.threadID);
        }

        const filePath = path.join(folderPath, namaFile);

        if (link && link.startsWith("http")) {
          const domain = getDomain(link);
          if (!domain) {
            return api.sendMessage("URL invalid", event.threadID);
          }

          if (domain === "pastebin.com") {
            const regex = /https:\/\/pastebin\.com\/(?!raw\/)(.*)/;
            if (link.match(regex)) {
              link = link.replace(regex, "https://pastebin.com/raw/$1");
            }
            if (link.endsWith("/")) {
              link = link.slice(0, -1);
            }
          }

          const response = await axios.get(link, { 
            headers: {
              'Accept': 'application/json',
            }
          });

          if (response.status === 200) {
            fs.writeFileSync(filePath, response.data);
            api.sendMessage(`File ${namefile} successfully downloaded and saved.`, event.threadID);
          } else {
            api.sendMessage(`Failed to download files. Status: ${response.status}`, event.threadID);
          }
        }
        else if (args.slice(2).length > 0) {
          const kodeLangsung = args.slice(2).join(" ");
          fs.writeFileSync(filePath, kodeLangsung);
          api.sendMessage(`File ${namefile} successfully created with a direct code.`, event.threadID);
        } 
        else {
          api.sendMessage("use format: cmd install <file name>.js <link> or cmd install <file name>.js <code>", event.threadID);
        }
      } catch (error) {
        api.sendMessage(`failed download files, status: ${error.message}`, event.threadID);
      }
    }

    else if (awal === pilih[1]) {
      try {
        if (namaFile && namaFile.endsWith('.js')) {
          const filePath = path.join(folderPath, namaFile);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            api.sendMessage(`File ${namaFile} successfully delete.`, event.threadID);
          } else {
            api.sendMessage(`File ${namaFile} not foud.`, event.threadID);
          }
        } else {
          api.sendMessage("use format: cmd delete <file name>.js", event.threadID);
        }
      } catch (error) {
        api.sendMessage(`failed delete files: ${error.message}`, event.threadID);
      }
    }

    else if (awal === pilih[2]) {
      try {
        if (namaFile && namaFile.endsWith('.js')) {
          const filePath = path.resolve(folderPath, namaFile);
          if (fs.existsSync(filePath)) {
            delete require.cache[require.resolve(filePath)];
            require(filePath);
            api.sendMessage(`File ${namaFile} successfully in load.`, event.threadID);
          } else {
            api.sendMessage(`File ${namaFile} not foud.`, event.threadID);
          }
        } else {
          api.sendMessage("use format: cmd load <file name>.js", event.threadID);
        }
      } catch (error) {
        api.sendMessage(`failed load file: ${error.message}`, event.threadID);
      }
    }
      
    else if (awal === pilih[3]) {
  try {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js')); 
    let loadedFiles = [];

    files.forEach(file => { 
      const filePath = path.resolve(folderPath, file);
      console.log(`checking file: ${filePath}`);
      if (fs.existsSync(filePath)) {
        delete require.cache[require.resolve(filePath)];
        require(filePath);
        loadedFiles.push(file);
      } else {
        console.warn(`File ${file} not foud in folder ${folderPath}`);
      }
    });

    if (loadedFiles.length > 0) {
      api.sendMessage(`The file that was successfully loaded: ${loadedFiles.join(', ')}`, event.threadID);
    } else {
      api.sendMessage("No .js file found to be loaded.", event.threadID);
    }
  } catch (error) {
    api.sendMessage(`Failed to load all files: ${error.message}`, event.threadID);
  }
    } else {
      api.sendMessage("Invalid commands. Use one of: install, delete, load, loadall", event.threadID);
    }
 }
};