const Discord = require('discord.js');
const sql = require('mysql');

let database = sql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'arsbot'
});
exports.run = (client, message, args) => {
    if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
        return message.reply(':lock: You dont have permissions for that').catch(console.error);
    }
    if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) {
        return message.reply(':lock: **I** need `KICK_MEMBERS` Permissions to execute `mute`').catch(console.error);
    }
    let user = message.mentions.users.first();
    let reason = args;
    let guild = message.guild;
    let modlog = message.guild.channels.find('name', 'mod-log');
    let member = message.guild.member;
  // If(!message.member.roles.has(adminRole.id)) return message.reply(":lock: You dont have permissions for that");
    if (!modlog) {
        return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
    }
    if (message.mentions.users.size < 1) {
        return message.reply('You need to mention someone to Kick him!. **Usage:**`~kick [@mention] [example]`');
    }
    if (!reason) {
        return message.reply('You must give me a reason for mute **Usage:**`~kick [@mention] [example]`');
    }
    if (!message.guild.member(user).kickable) {
        return message.reply('This member is above me in the `role chain` Can\'t kick him');
    }
    message.guild.member(user).kick();
    const embed = new Discord.RichEmbed()
    .setColor(10433245)
    .setTimestamp()
    .addField('Kick:', `**Kicked**${user.username}#${user.discriminator}\n**Moderator** ${message.author.username} \n**Reason** ${reason}`);
    modlog.send({embed}).catch(console.error);
    database.query('SELECT * FROM bans WHERE guildid = ? AND userid = ?', [message.guild.id, user.id], (error, row) => {
        if (error) {
            message.channel.send('Something went wrong when quering the database. Unable to process request.');
            console.log(error);
            if (error && error.fatal) {
                database = sql.createConnection({
                    host: '127.0.0.1',
                    user: 'root',
            // Password: "1234561asd",
                    database: 'arsbot'
                });
            }
        } else if (row.length > 0) {
            database.query(`UPDATE bans SET kickcount = ${row[0].kickcount + 1} WHERE userid = "${user.id}" AND guildid = ${message.guild.id}`);
        } else {
            database.query('INSERT INTO bans (userid, kickcount, guildid) VALUES (?, ?, ?)', [user.id, 1, message.guild.id]);
        }
    });
};
module.exports.help = {
    name: 'kick'
};
