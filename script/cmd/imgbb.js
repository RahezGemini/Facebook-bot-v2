module.exports = {
config: { 
  name: "imgbb",
  author: "Rahez", 
  role: 0,
  countdown: 10,
  usage: "Reply photo"
},

execute: async function ({ api, event, args, message }) {
  try { 
    const a = event.messageReply.attachments[0].url;
    const b = await global.utils.uploadImgbb(a);
    const c = b.image.url;
   message.reply(c);
   
} catch (error) {
   message.reply('Reply to the photo or video you want to use as a link')
}
 }
};