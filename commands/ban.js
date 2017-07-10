const Discord = require('discord.js');
const ms = require('ms');
const sql = require('mysql');

/*
  Connect into mariaDB
*/

let database = sql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'arsbot'
});
exports.run = (client, message) => {
    let reason = message.content.split(' ').slice(3).join(' ');
    let time = message.content.split(' ')[2];
    let guild = message.guild;
    let modlog = message.guild.channels.find('name', 'mod-log');
    let user = message.mentions.users.first();
    /*
      Checks for author's permissions
    */

    if (!message.guild.member(message.author).hasPermission('BAN_MEMBERS')) {
        return message.reply(':lock: **You** need `BAN_MEMBERS` Permissions to execute `mute`').catch(console.error);
    }
    /*
      Checks for the bot's permissions
    */
    if (!message.guild.member(client.user).hasPermission('BAN_MEMBERS')) {
        return message.reply(':lock: **I** need `BAN_MEMBERS` Permissions to execute `mute`').catch(console.error);
    }
    /*
      Checks if modlog channel exists
    */
    if (!modlog) {
        return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
    }
    /*
      Check if a mention found
    */
    if (message.mentions.users.size < 1) {
        return message.reply('You need to mention someone to Ban him!.');
    }
    /*
      Checks if time was supplied
    */
    if (!time) {
        return message.reply(`How much time ? **Usage:**\`~ban [@mention] [1d] [example]\``);
    }
    /*
      Checking if the time is valid
    */
    if (!time.match(/[1-7][s,m,h,d,w]/g)) {
        return message.reply('I need a valid time ! look at the Usage! right here: **Usage:**`~mute [@mention] [1m] [example]`');
    }
    /*
      Checking if reason was supplied
    */
    if (!reason) {
        return message.reply(`You must give me a reason for the ban **Usage:**\`~ban [@mention] [1d] [example]\``);
    }
    /*
      Checks if user is bannable
    */

    if (!message.guild.member(user).bannable) {
        return message.reply('This member is above me in the `role chain` Can\'t ban him');
    }
    /*
      Sends a DM to the user who's getting banned
    */
    user.send(`You've just got banned from ${guild.name}  \n State reason: **${reason}** \n **Disclamer**: If the ban is not timed and Permanent you may not appeal the **BAN**!`).catch(console.error);
    message.guild.ban(user, 7);
    setTimeout(() => {
        message.guild.unban(user.id);
    }, ms(time));
    console.log(`${user.username} has been banned by ${message.author.username} for ${reason} in ${guild.name}`);
    const embed = new Discord.RichEmbed()
    .setColor(0x73FE43)
    .setTimestamp()
    .addField('Ban:', `**Banned:** ${user.username}#${user.discriminator}\n**Moderator** ${message.author.username} \n**Duration** ${ms(ms(time), {long: true})} \n**Reason** ${reason}`);
    modlog.send({
        embed
    }).catch(console.error);
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
            database.query(`UPDATE bans SET bancount = ${row[0].bancount + 1} WHERE userid = "${user.id}" AND guildid = ${message.guild.id}`);
        } else {
            database.query('INSERT INTO bans (userid, bancount, guildid) VALUES (?, ?, ?)', [user.id, 1, message.guild.id]);
        }
    });
};

module.exports.help = {
    name: 'ban'
};
