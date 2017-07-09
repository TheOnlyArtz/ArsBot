const Discord = require("discord.js")
exports.run = (client, message,args) => {
  if(!message.guild.member(client.user).hasPermission("MANAGE_MESSAGES")) 
  return message.reply(":lock: **I** Need `MANAGE_MESSAGES` Permission to execute `purge`")


  if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGES"))
    return message.reply(":lock: **You** Need `MANAGE_MESSAGES` Permission to execute `purge`")
      .catch(console.error);
  let messagecount = parseInt(args.join(" "));
 /*
  check if message is higher or lower then the limits
 */
  if(!messagecount)
    return message.reply("How many messages?");
  if(messagecount > 100)
    return message.reply(`Purge has limits: you cant delete 101 messages per purge`)
    /*
    actual purge
    */
  let ms;
  if(messagecount == 1) {
    ms = 2
  } else {
    ms = messagecount
  }
  message.channel.fetchMessages({limit : messagecount}).then(messages => message.channel.bulkDelete(ms))
  .catch(function(err){
    console.error(message.channel.send("I cant delete message that are older than a week\
    And nope, The Api will not let any bot doing that!"));
    return;
  })
  // message.reply(`You've succefully deleted \`${messagecount} Messages!\``).then(m => {
  //   m.delete(2000)
  // })
  .catch(console.error);

};
module.exports.help = {
  name: "purge"
}
