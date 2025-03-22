module.exports = {
  config: {
    name: "pay",
    author: "Rahez",
    countdown: 10,
    role: 0,
    usage: "pay <UID> <AMOUNT>"
  },

  execute: async function ({ api, event, args, usersData }) {
    try {
      const { senderID } = event;

    const recipientID = args[0];
    const amount = parseInt(args[1]); 

    if (isNaN(amount) || amount <= 0) {
      return api.sendMessage("tolong masukan uid dan jumlah yang benar", event.threadID);
    }

    if (userData[senderID].money < amount) {
      return api.sendMessage("uang anda tidak cukup", event.threadID);
    }

    let tax = 0;
    if (amount <= 100) {
      tax = 0.05 * amount;
    } else if (amount <= 500) {
      tax = 0.1 * amount; 
    } else {
      tax = 0.15 * amount; 
    }

    const totalAmount = amount - tax;

    const recipientData = await usersData.get(recipientID);
    if(!recipientData) {
      api.sendMessage(`userID ${recipientID} Tidak ada atau belum terdaftar oleh bot`)
    }
    const recipientName = recipientData.name;
    await usersData.set(senderID, 'money', usersData[senderID].money - totalAmount);
    await usersData.set(recipientID, 'money', recipientData.money + totalAmount);

    api.sendMessage(`kamu berhasil mengirim uang pada jumlah ${totalAmount} kepada ${recipientName}.\n bunga seharga ${tax} telah di terapkan.`, event.threadID);
    } catch (error) {
      console.error("Terjadi kesalahan dalam proses pembayaran:", error.message);
      return api.sendMessage(
        "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi nanti.",
        event.threadID,
        event.messageID
      );
    }
  }
};
