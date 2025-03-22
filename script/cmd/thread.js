module.exports = {
  config: {
    name: "thread",
    author: "Rahez",
    role: 2,
    countdown: 10,
    usage: ""
  },

  execute: async function ({ api, event, args, threadData }) {
    const type = args[0];

    switch (type) {
      case '-i':
      case 'info':
        try {
          if (isNaN(args[1])) {
            return api.sendMessage('Invalid ThreadID', event.threadID);
          }
          const threadID = args[1];
          const threadInfo = await api.getThreadInfo(threadID);
          const gender = threadInfo.userData?.filter(user => user.gender);
          const totalBoy = gender.filter(item => item.gender === "MALE").length;
          const totalGirl = gender.filter(item => item.gender === "FEMALE").length;
          const allMember = threadInfo.participantIDs.length;
          const admin = threadInfo.adminIDs ? threadInfo.adminIDs.length : 0;
          const messageCount = threadInfo.messageCount;
          const message = `
Name: ${threadInfo.name || 'Thread Name'}
ThreadID: ${threadID}
Total Boys: ${totalBoy}
Total Girls: ${totalGirl}
All Members: ${allMember}
Message Count: ${messageCount}
Approval: ${threadInfo.approval}
Invite Link: ${threadInfo.inviteLink ? threadInfo.inviteLink.link : 'None'}`;
          api.sendMessage(message, event.threadID);
        } catch (error) {
          api.sendMessage('Error getting thread info', event.threadID);
          console.error(error);
        }
        break;

      case 'list':
      case '-l':
        try {
          let nextPageStart = 0;
          const itemsPerPage = 30;
          let nextPageEnd = nextPageStart + itemsPerPage;

          while (true) {
            const groupList = await api.getThreadList(itemsPerPage, nextPageStart, ['INBOX']);
            const filteredList = groupList.filter(group => group.threadName !== null);

            if (nextPageEnd >= filteredList.length) {
              api.sendMessage('End of list reached.', event.threadID);
              return;
            }

            const currentList = filteredList.slice(nextPageStart, nextPageEnd).map((group, index) =>
              `${nextPageStart + index + 1}. ${group.threadID}: ${group.name}`
            );

            const message = `╭─╮\n│𝐋𝐢𝐬𝐭 𝐨𝐟 𝐠𝐫𝐨𝐮𝐩 𝐜𝐡𝐚𝐭𝐬:\n${currentList.join("\n")}\n╰───────────ꔪ`;

            api.sendMessage(message, event.threadID);

            nextPageStart += itemsPerPage;
            nextPageEnd = nextPageStart + itemsPerPage;
          }
        } catch (err) {
          api.sendMessage('Error getting list of groups', event.threadID);
          console.error(err);
        }
        break;

      case 'ban':
        try {
          const threadID = args[0];
          const threadsData = await threadData.get(threadID);
          if (!threadsData) {
            return api.sendMessage('Thread not found in the database', event.threadID);
          }
          if(threadsData.ban.status === true) {
            api.sendMessage('This group has been banned', event.threadID)
          }
          await threadData.set(threadID, 'ban', 'status', true);
          await threadData.set(threadID, 'ban', 'reason', args[1] || 'No Reason');
          api.sendMessage(`Thread ${threadID} has been banned. Reason: ${args[1] || 'No Reason'}`, event.threadID);
        } catch (error) {
          api.sendMessage('Error banning the thread', event.threadID);
          console.error(error);
        }
        break;
        
        case 'join':
          case '-j':
          try {
            const tid = args[0];
            if (!tid || isNaN(tid)) {
              return api.sendMessage('Invalid TID. Please provide a valid Thread ID.', event.threadID);
            }
          
            const threadsInfo = await api.getThreadInfo(tid);
            if (!threadsInfo) {
              return api.sendMessage('Thread not found.', event.threadID);
            }
          
            if (!threadsInfo.isGroup) {
              return api.sendMessage('TID is not a group.', event.threadID);
            }
          
            const groupList = await api.getThreadList(100, null, ['INBOX']);
            const existingGroup = groupList.find(group => group.threadID === tid);
          
            if (!existingGroup) {
              return api.sendMessage('Group not found in bot list.', event.threadID);
            }
          
            if (threadsInfo.approval) {
              api.sendMessage('Approval is on. Waiting for admin to accept.', event.threadID);
              await api.addUserToGroup(event.senderID, tid);
            } else {
              await api.addUserToGroup(event.senderID, tid);
              api.sendMessage('You have been added to the group.', event.threadID);
            }
          } catch (error) {
            api.sendMessage('Error joining the group.', event.threadID);
            console.error(error);
          }
          break;
        
      default:
        api.sendMessage('Invalid command. Use -i or info for thread info, and -l or list for group list.', event.threadID);
    }
  }
};