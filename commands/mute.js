const Discord = require('discord.js');
const ms = require('ms');
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

exports.run = (client, message) => {
    if (!message.guild.member(message.author).hasPermission('MUTE_MEMBERS')) {
        message.channel.send(':lock: **I** need `MANAGE_ROLES` Permissions to execute `mute`');
        return;
    }

    if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES')) {
        return message.reply(':lock: **I** need `MANAGE_ROLES` Permissions to execute `mute`').catch(e => logger.error(e));
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

    if (!muteRole) {
        return message.reply('`Please create a role called "muted"`');
    }

    if (message.mentions.users.size < 1) {
        return message.reply('You need to mention someone to Mute him!.');
    }
    if (message.author.id === user.id) {
        return message.reply('You cant punish yourself :wink:');
    }
    if (!time) {
        return message.reply('specify the time for the mute!**Usage:**`~mute [@mention] [1m] [example]`');
    }
    if (!time.match(/[1-60][s,m,h,d,w]/g)) {
        return message.reply('I need a valid time ! look at the Usage! right here: **Usage:**`~mute [@mention] [1m] [example]`');
    }
    if (!reason) {
        return message.reply('You must give me a reason for Mute **Usage:**`~mute [@mention] [15m] [example]`');
    }
    if (reason.time < 1) {
        return message.reply('TIME?').then(message => message.delete(2000));
    }
    if (reason.length < 1) {
        return message.reply('You must give me a reason for Mute');
    }
    message.guild.member(user).addRole(muteRole).catch(e => logger.error(e));

    setTimeout(() => {
        message.guild.member(user).removeRole(muteRole).catch(e => logger.error(e));
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
  .catch(e => logger.error(e));

    knexDB.from('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(count => {
        if (count.length > 0) {
            knexDB.update({
                mutecount: parseInt(count[0].mutecount, 10) + 1
            }).into('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(() => {

            })
            .catch(e => logger.error(e));
        } else {
            knexDB.insert({
                userid: user.id,
                guildid: message.guild.id,
                mutecount: 1
            }).into('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(() => {

            })
              .catch(e => logger.error(e));
        }
    });
};
module.exports.help = {
    name: 'mute'
};
