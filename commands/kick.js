const Discord = require('discord.js');
const sql = require('mysql');

const knexDB = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'admin',
        password: '1234561asd',
        database: 'arsbot'
    },
    pool: {min: 0, max: 6}
});

exports.run = (client, message, args) => {
    if (!message.guild.member(message.author).hasPermission('KICK_MEMBERS')) {
        return message.reply(':lock: You dont have permissions for that').catch(e => logger.error(e));
    }
    if (!message.guild.member(client.user).hasPermission('KICK_MEMBERS')) {
        return message.reply(':lock: **I** need `KICK_MEMBERS` Permissions to execute `mute`').catch(e => logger.error(e));
    }
    let user = message.mentions.users.first();
    let reason = message.content.split(' ').slice(2).join(' ');
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
    modlog.send({embed}).catch(e => logger.error(e));

    knexDB.from('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(count => {
        if (count.length > 0) {
            knexDB.update({
                kickcount: parseInt(count[0].kickcount, 10) + 1
            }).into('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(() => {

            })
            .catch(e => logger.error(e));
        } else {
            knexDB.insert({
                userid: user.id,
                guildid: message.guild.id,
                kickcount: 1
            }).into('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(() => {

            })
              .catch(e => logger.error(e));
        }
    });
};
module.exports.help = {
    name: 'kick'
};
