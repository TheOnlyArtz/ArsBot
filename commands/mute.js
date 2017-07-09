const Discord = require('discord.js');
const ms = require('ms');
const sql = require('mysql');

let database = sql.createConnection({
    host: '127.0.0.1',
    user: 'root',
  // Password: "1234561asd",
    database: 'arsbot'
});
exports.run = (client, message) => {
    if (!message.guild.member(message.author).hasPermission('MUTE_MEMBERS')) {
        message.channel.send(':lock: **I** need `MANAGE_ROLES` Permissions to execute `mute`');
        return;
    }

    if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) {
        return message.reply(':lock: **I** need `MANAGE_ROLES` Permissions to execute `mute`').catch(console.error);
    }
    let reason = message.content.split(' ').slice(3).join(' ');
    let time = message.content.split(' ')[2];
    let guild = message.guild;
  // Let adminRole = guild.roles.find("name", "TOA");
    let member = message.guild.member;
    let modlog = message.guild.channels.find('name', 'mod-log');
    let user = message.mentions.users.first();
    let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'muted');
    if (!modlog) {
        return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
    }
    if (message.mentions.users.size < 1) {
        return message.reply('You need to mention someone to Mute him!.');
    }
    if (!time) {
        return message.reply('specify the time for the mute!**Usage:**\`~mute [@mention] [1m] [example]\`');
    }
    if (!time.match(/[1-60][s,m,h,d,w]/g)) {
        return message.reply('I need a valid time ! look at the Usage! right here: **Usage:**\`~mute [@mention] [1m] [example]\`');
    }
    if (!reason) {
        return message.reply('You must give me a reason for Mute **Usage:**\`~mute [@mention] [15m] [example]\`');
    }
    if (reason.time < 1) {
        return message.reply('TIME?').then(message => message.delete(2000));
    }
    if (reason.length < 1) {
        return message.reply('You must give me a reason for Mute');
    }
    message.guild.member(user).addRole(muteRole).catch(console.error);

    setTimeout(() => {
        message.guild.member(user).removeRole(muteRole).catch(console.error);
    }, ms(time));
    message.guild.channels.filter(textchannel => textchannel.type === 'text').forEach(cnl => {
        cnl.overwritePermissions(muteRole, {
            SEND_MESSAGES: false
        });
    });

    const embed = new Discord.RichEmbed()
.setColor(16745560)
.setTimestamp()
.addField('Mute', `**Muted:**${user.username}#${user.discriminator}\n**Moderator:** ${message.author.username}\n**Duration:** ${ms(ms(time), {long: true})}\n**Reason:** ${reason}`);
    modlog.send({embed})
  .catch(console.error);
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
            database.query(`UPDATE bans SET mutecount = ${row[0].mutecount + 1} WHERE userid = "${user.id}" AND guildid = ${message.guild.id}`);
        } else {
            database.query('INSERT INTO bans (userid, mutecount, guildid) VALUES (?, ?, ?)', [user.id, 1, message.guild.id]);
        }
    });
};
module.exports.help = {
    name: 'mute'
};
