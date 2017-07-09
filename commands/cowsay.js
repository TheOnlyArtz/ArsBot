const cowsay = require("cowsay");
const cooldown = new Set();
exports.run = (client, message, args) => {

  if (cooldown.has(message.author.id && message.guild.id))
    return message.reply(`This command have a cooldown of 5 **Minutes**`); // this will check if the users is in the cooldown
  cooldown.add(message.author.id && message.guild.id);
  setTimeout(() => {
    cooldown.delete(message.author.id && message.guild.id);
  }, 300000);

  let txt = message.content.split(" ").slice(1).join(" ")
  if(!txt)
    return message.reply("Invalid arguments, what do you want the cow to say?");
  message.author.send(cowsay.say({
    text : txt,
    e : "oO"
  }), {code : "css"})
  message.channel.send(" :inbox_tray: Sent into DM due to anti spam system! :inbox_tray: ")
};

module.exports.help = {
  name: "cowsay"
}
