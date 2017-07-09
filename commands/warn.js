const Discord = require("discord.js");
const sql = require("mysql");
var database = sql.createConnection({
  host: "127.0.0.1",
  user: "root",
  database: "arsbot"
});
exports.run = (client, message, args) => {
  if(!message.guild.member(message.author).hasPermission("MANAGE_NICKNAMES"))
    return message.reply(":lock: You need to have `MANAGE_NICKNAMES` Permission to execute `warn`").catch(console.error);
  if(!message.guild.member(client.user).hasPermission("MANAGE_NICKNAMES"))
    return message.reply(":lock: **I** need `MANAGE_NICKNAMES` Permissions to execute `warn`").catch(console.error);
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(1).join(" ").replace(/<@!?\d+>/, "");
  let modlog = message.guild.channels.find ("name", "mod-log");
  if(!modlog) return message.reply("I need a text channel named `mod-log` to print my ban/kick logs in, please create one");
  if(!user) return message.reply("You must mention someone to warn him. **Usage:**`~warn [@mention] [example]`");
  if (!reason) return message.reply("You must give me a reason for warning **Usage:**`~warn [@mention] [example]`");
  message.guild.fetchMember(user).then(member => {
    if(!member.nickname || (!member.nickname.includes("(1)") && !member.nickname.includes("(2)") && !member.nickname.includes("(3)"))) {
      member.setNickname(`${user.username}(1)`);
      const embed = new Discord.RichEmbed()
        .setColor(0x00FE86)
        .setTimestamp()
        .addField("Action Warn #1:", `**User:** ${user.tag}\n**Reason:** ${reason}`)
      modlog.send({embed})
      .catch(console.error)
      member.send(`You've got warned **Once** \n State Reason: ${reason}`);
    } else if(member.nickname.includes("(1)")) {
      const embed = new Discord.RichEmbed()
        .setColor(0x00FE86)
        .setTimestamp()
        .addField("Action Warn #2:", `**User:** ${user.tag}\n**Reason:** ${reason}`)
      modlog.send({embed})
      .catch(console.error)
      member.setNickname(`${user.username}(2)`);
      member.send(`You've got warned **Twice** next time **BAN** \n State Reason: ${reason}`);
    } else if(member.nickname.includes("(2)")) {
      // message.guild.member(user).addRole(muteRole).then(() =>{
      member.setNickname(`${user.username}(BanQueue)`);
      member.send("You will get banned soon with the reason, thank you!");
      message.author.send("The member has been already warned 2 times, and cannot get another warn I have to ban them");
      const embed = new Discord.RichEmbed()
        .setColor(0x00FE86)
        .setTimestamp()
        .addField("Action Warn #3:", `**User:** ${user.tag}\n**Reason:** ${reason}`)
      modlog.send({embed})
      .catch(console.error)
      message.guild.member(user).ban(user, 7)
      .catch(console.error)
    }
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
          database.query(`UPDATE bans SET warncount = ${row[0].warncount + 1} WHERE userid = "${user.id}" AND guildid = ${message.guild.id}`);
        } else {
          database.query("INSERT INTO bans (userid, warncount, guildid) VALUES (?, ?, ?)", [user.id, 1, message.guild.id]);
        }
      }
    });
  });
};
module.exports.help = {
  name: "warn"
}
