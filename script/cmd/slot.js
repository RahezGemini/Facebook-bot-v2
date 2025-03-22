module.exports = {
config: { 
  name: "slot",
  author: "Rahez", 
  role: 0,
  countdown: 10,
  usage: ""
}, 
  
execute: async function ({ api, event, args, usersData }) {
  try {
     const bet = parseInt(args[0]);
     if (!bet || !isNaN(bet) || bet < 100) {
       return api.sendMessage("❌ The minimum number of bets is 100$", event.threadID);
    }
    
    const a = await usersData.get(event.senderID);
    const balance = a.money
    if (balance < bet) {
      return api.sendMessage(`❌ Your balance is not enough`, event.threadID);
    }
    
    const slots = ["🍎", "🍊", "🍋", "🍏", "🍈", "🍐"];
            const slot1 = slots[Math.floor(Math.random() * slots.length)];
            const slot2 = slots[Math.floor(Math.random() * slots.length)];
            const slot3 = slots[Math.floor(Math.random() * slots.length)];

            let winMultiplier = 0;
            if (slot1 === slot2 && slot2 === slot3) {
                if (slot1 === "🍐") winMultiplier = 5;
                else winMultiplier = 3;
            } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
                winMultiplier = 1.5;
            }
            
            const winAmount = Math.floor(bet * winMultiplier);
            const newBalance = balance - bet + winAmount;
            const { money } = await usersData.get(event.senderID);
            
            let message = ` SLOT MACHINE\n\n`;
            message += `│ ${slot1} │ ${slot2} │ ${slot3} │\n\n`;
            
            if (winMultiplier > 0) {
            await usersData.set(event.senderID, 'money', money + winAmount);
              message += `🎉 You Win ${winAmount}$!\n`;
            } else {
              message += `😢 You Lose ${bet}$!\n`;
            await usersData.set(event.senderID, 'money', money - bet);
            }
            
            const message = `balance: ${money}`
            
            api.sendMessage(message, event.threadID);
  } catch (e) {
    api.sendMessage('Error', e)
  }
 }
};