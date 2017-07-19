const cooldown = new Set();
const Discord = require("discord.js");
const package = require("../package.json")
exports.run = (client, message) => {
  let guild = message.guild;
  // message.delete(3000);
  var bpmb = client.ping;
  var bpm = bpmb.toFixed()
  let os = require("os");
  var usageMb = process.memoryUsage().heapUsed / 1024 / 1024;
  var usage = usageMb.toFixed(2);

/*
  Cooldown for the command
*/
  if (cooldown.has(message.author.id && message.guild.id))
    return message.reply(`This command have a cooldown of 5 **Minutes**`); // this will check if the users is in the cooldown
  cooldown.add(message.author.id && message.guild.id);
  setTimeout(() => {
    cooldown.delete(message.author.id && message.guild.id);
  }, 300000);

  /*
    Fetch the client info and parse it into an embed
  */
  const embed = new Discord.RichEmbed()
    .setAuthor(`${client.user.username} Info Below`, client.user.displayAvatarURL)
    .addField(":heart: BPM", bpm, true)
    .setThumbnail(client.user.displayAvatarURL)
    .setColor(3118751)
    .addField("MB usage", `${usage}MB`, true)
    .addField("Discord.js", `${Discord.version}`, true)
    .addField("ArsBot", `${package.version}`, true)
    .addField("npm", `${process.version}`, true)
    .addField("Users", `${client.users.size.toLocaleString()}`, true)
    // .addField("Bot Platforn:", os.process.platform(), true)
    .addField("Click the emoji", `[🤖](https://discordapp.com/oauth2/authorize?permissions=8&scope=bot&client_id=315038560300433410)`, true)
    .addField("Channels Overall", client.channels.size, true)
    .addField("Guilds Overall", client.guilds.size, true);
  message.channel.send({
    embed
  }).catch(e => logger.error(e))
};

module.exports.help = {
  name: "botinfo"
}
