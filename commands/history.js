const Discord = require("discord.js");
// const sql = require("sqlite");
const sql = require("mysql");
const database = sql.createConnection({
  host: "localhost",
  user: "root",
  database: "arsbot"
});
exports.run = (client, message) => {
  let user = message.mentions.users.first();
  if(!user)
    return message.reply("Please specify the user by mentioning him, thanks!")
  database.query("SELECT * FROM bans WHERE guildid = ? AND userid = ?", [message.guild.id, user.id], (error, row) => {
    if (error) {
      message.channel.send("OOPS didnt find anything :thinking:")
    } // something happened, handle it.
      if (row.length > 0) {
        const embed1 = new Discord.RichEmbed()
        .addField(`History for ${user.username} inside ${message.guild.name}`, `bans: **${row[0].bancount}**\nkicks: **${row[0].kickcount}**\nmutes: **${row[0].mutecount}**\nsoftbans: **${row[0].softcount}**\nwarns: **${row[0].warncount}**`);
        message.channel.send({embed: embed1})
      } else {
        const embed = new Discord.RichEmbed()
        .addField(`History for ${user.username} inside ${message.guild.name}`, "bans: 0\nkicks: 0\nmutes: 0\nsoftbans: 0\nwarns : 0")
        message.channel.send({embed})
        .catch(console.error)
      }
  })
};
module.exports.help = {
  name: "history"
}
