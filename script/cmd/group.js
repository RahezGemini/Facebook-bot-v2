module.exports = {
  config: {
    name: "group",
    author: "Rahez",
    role: 1,
    countdown: 10,
    usage: "admin <add/delete> [userID] image <url> emoji <emoji>"
  },

  execute: async function ({ api, event, args }) {
    const { threadID } = event;

    if (args.length === 0) {
      return api.sendMessage("Usage: admin <add/delete> [userID] name <name> image <url> emoji <emoji>", event.threadID);
    }

    const command = args[0].toLowerCase();

    if (command === "admin") {
      const subCommand = args[1].toLowerCase();
      const adminIDs = args.slice(2).map(id => parseInt(id));

      if (subCommand === "add") {
        if (adminIDs.length === 0) {
          return api.sendMessage("Please provide user IDs to add as admins.", threadID);
        }
        try {
          await api.changeAdminStatus(threadID, adminIDs, true);
          api.sendMessage(`Added admins with IDs: ${adminIDs.join(', ')}`, threadID);
        } catch (error) {
          console.error(error);
          api.sendMessage("Failed to add to an admin, or the bot has not yet been an admin.", threadID);
        }
      } else if (subCommand === "delete") {
        if (adminIDs.length === 0) {
          return api.sendMessage("Please provide user IDs to remove as admins.", threadID);
        }
        try {
          await api.changeAdminStatus(threadID, adminIDs, false);
          api.sendMessage(`Removed admins with IDs: ${adminIDs.join(', ')}`, threadID);
        } catch (error) {
          console.error(error);
          api.sendMessage("Failed to remove to an admins, or the bot has not yet been an admin.", threadID);
        }
      } else {
        api.sendMessage("Invalid sub-command. Use 'add' or 'delete'.", threadID);
      }
    } else if (command === "image") {
      const imageUrl = args.slice(1).join(" ");
      try {
        await api.changeGroupImage(imageUrl, threadID);
        api.sendMessage("Group profile picture updated successfully.", threadID);
      } catch (error) {
        console.error(error);
        api.sendMessage("Failed to update the group profile picture. Please try again.", threadID);
      }
    } else if (command === "emoji") {
      const emoji = args.slice(1).join(" ");
      try {
        await api.changeThreadEmoji(threadID, emoji);
        api.sendMessage(`Group emoji changed to: ${emoji}`, threadID);
      } catch (error) {
        console.error(error);
        api.sendMessage("Failed to change the group emoji. Please try again.", threadID);
      }
    } else {
      api.sendMessage("Invalid command. Use 'admin', 'name', 'image', or 'emoji'.", threadID);
    }
  }
};