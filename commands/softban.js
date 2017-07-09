const Discord = require("discord.js");
const ms = require("ms");
const sql = require("mysql");
let database = sql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "arsbot"
});
exports.run = (client, message, args) => {
  let reason = message.content.split(" ").slice(3).join(" ");
  let time = message.content.split(" ")[2];
  let guild = message.guild;
  let modlog = message.guild.channels.find ("name", "mod-log");
  let user = message.mentions.users.first();
  if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS"))
    return message.reply(":lock: You need to have `BAN_MEMBERS` Permission to execute `SoftBan`").catch(console.error);
  if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS"))
    return message.reply(":lock: I need to have `BAN_MEMBERS` Permission to execute `SoftBan`").catch(console.error);
  if(!modlog)
    return message.reply("I need a text channel named `mod-log` to print my ban/kick logs in, please create one");
  if(message.mentions.users.size < 1)
    return message.reply("You need to mention someone to SoftBan him!.").then(message => message.delete(2000));
  if(!reason)return message.reply(`You must give me a reason for the ban **Usage:**\`~softban [@mention] [example]\``);
  user.send(`You've just got softbanned from ${guild.name}  \n State reason: **${reason}** \n **Disclamer**: In a softban you can come back straight away, we just got your messages deleted`);
  console.log(`${user.username} has been softbanned by ${message.author.username} for ${reason} in ${guild.name}`);
  message.guild.ban(user, 2).catch(console.error)
  setTimeout(() => {
    message.guild.unban(user.id);
  }, 0);
  const embed = new Discord.RichEmbed()
.setColor(0x18FE26)
.setTimestamp()
.addField("SoftBan:", `**Softbanned:** ${user.username}#${user.discriminator}\n**Moderator:** ${message.author.username}\n**Reason:** ${reason}`)
  modlog.send({embed})
  .catch(console.error)
  database.query("SELECT * FROM bans WHERE guildid = ? AND userid = ?", [message.guild.id, user.id], (error, row) => {
    if (error) {
      message.channel.send("Something went wrong when quering the database. Unable to process request.");
      console.log(error);
      if (error && error.fatal) database = sql.createConnection({
        host: "127.0.0.1",
        user: "root",
            // password: "1234561asd",
        database: "arsbot"
      });
    } else {
      if (row.length > 0) {
        database.query(`UPDATE bans SET softcount = ${row[0].softcount + 1} WHERE userid = "${user.id}" AND guildid = ${message.guild.id}`);
      } else {
        database.query("INSERT INTO bans (userid, softcount, guildid) VALUES (?, ?, ?)", [user.id, 1, message.guild.id]);
      }
    }
  });
};
module.exports.help = {
  name: "softban"
}
