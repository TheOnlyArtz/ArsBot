const mysql = require("mysql");
const sql = require("sqlite");
sql.open("./localDBs/announcehey.sqlite")
exports.run = function(client, message) {
  let heymessage = message.content.split(" ").slice(1).join(" ");
  const database = mysql.createConnection({
    host: "localhost",
    user: "arsbot",
    password: "1234561asd",
    database: "arsbot"
  });
  if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
    return message.reply(":lock: You dont have permissions for that").catch(console.error);
  if(!heymessage)
    return message.reply("You must write an announce msg that appear whenever a new user joins the server")
  var guild = message.guild;
  sql.get(`SELECT * FROM heybye WHERE guildid ="${guild.id}"`).then(row => {
    if (!row) {
      message.channel.send(`You've set **hey** announce messages for ${message.channel} \n Your chosen messasge to display (**${heymessage}**) Have fun!`);
      sql.run("INSERT INTO heybye (guildid, channelid, guildname, heymsg) VALUES (?, ?, ?, ?)", [message.guild.id, message.channel.id, guild.name, `${heymessage}`]);
    } else {
      sql.run(`UPDATE heybye SET channelid = ${message.channel.id} WHERE guildid = ${message.guild.id} AND guildname = "${guild.name}"`);
      sql.run(`UPDATE heybye SET heymsg = ?  WHERE guildid = ? AND guildname = ?`, [heymessage, message.guild.id, guild.name]);
      message.channel.send(`You've set **hey** announce messages for ${message.channel} \n Your chosen messasge to display (**${heymessage}**) Have fun! `);
    }
  }).catch(() => {
    console.error;
    sql.run("CREATE TABLE IF NOT EXISTS heybye (guildid TEXT, channelid TEXT, guildname TEXT, heymsg TEXT)").then(() => {
      sql.run("INSERT INTO heybye (guildid, channelid, guildname, heymsg) VALUES (?, ?, ?, ?)", [message.guild.id, message.channel.id, guild.name, `${heymessage}`]);
    });
  });
};
module.exports.help = {
  name: "announcehey"
}
