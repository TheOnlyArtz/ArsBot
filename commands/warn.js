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
    if (!message.guild.member(message.author).hasPermission('MANAGE_NICKNAMES')) {
        return message.reply(':lock: You need to have `MANAGE_NICKNAMES` Permission to execute `warn`').catch(e => logger.error(e));
    }

    if (!message.guild.member(client.user).hasPermission('MANAGE_NICKNAMES')) {
        return message.reply(':lock: **I** need `MANAGE_NICKNAMES` Permissions to execute `warn`').catch(e => logger.error(e));
    }
    let user = message.mentions.users.first();
    let reason = message.content.split(' ').slice(1).join(' ').replace(/<@!?\d+>/, '');
    let modlog = message.guild.channels.find('name', 'mod-log');
    if (!modlog) {
        return message.reply('I need a text channel named `mod-log` to print my ban/kick logs in, please create one');
    }
    if (message.author.id === user.id) {
        return message.reply('You cant punish yourself :wink:');
    }
    if (!user) {
        return message.reply('You must mention someone to warn him. **Usage:**`~warn [@mention] [example]`');
    }
    if (!reason) {
        return message.reply('You must give me a reason for warning **Usage:**`~warn [@mention] [example]`');
    }
    message.guild.fetchMember(user).then(member => {
        if (!member.nickname || (!member.nickname.includes('(1)') && !member.nickname.includes('(2)') && !member.nickname.includes('(3)'))) {
            member.setNickname(`${user.username}(1)`);
            const embed = new Discord.RichEmbed()
        .setColor(0x00FE86)
        .setTimestamp()
        .addField('Action Warn #1:', `**User:** ${user.tag}\n**Reason:** ${reason}`);
            modlog.send({embed})
      .catch(e => logger.error(e));
            member.send(`You've got warned **Once** \n State Reason: ${reason}`)
            .catch(e => logger.error(e));
        } else if (member.nickname.includes('(1)')) {
            const embed = new Discord.RichEmbed()
        .setColor(0x00FE86)
        .setTimestamp()
        .addField('Action Warn #2:', `**User:** ${user.tag}\n**Reason:** ${reason}`);
            modlog.send({embed})
      .catch(e => logger.error(e));
            member.setNickname(`${user.username}(2)`);
            member.send(`You've got warned **Twice** next time **BAN** \n State Reason: ${reason}`)
            .catch(e => logger.error(e));
        } else if (member.nickname.includes('(2)')) {
      // Message.guild.member(user).addRole(muteRole).then(() =>{
            member.setNickname(`${user.username}(BanQueue)`);
            member.send('You will get banned soon with the reason, thank you!');
            message.author.send('The member has been already warned 2 times, and cannot get another warn I have to ban them')
            .catch(e => logger.error(e));
            const embed = new Discord.RichEmbed()
        .setColor(0x00FE86)
        .setTimestamp()
        .addField('Action Warn #3:', `**User:** ${user.tag}\n**Reason:** ${reason}`);
            modlog.send({embed})
      .catch(e => logger.error(e));
            message.guild.member(user).ban(user, 7)
      .catch(e => logger.error(e));
        }

        knexDB.from('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(count => {
            if (count.length > 0) {
                knexDB.update({
                    warncount: parseInt(count[0].warncount, 10) + 1
                }).into('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(() => {

                })
                .catch(e => logger.error(e));
            } else {
                knexDB.insert({
                    userid: user.id,
                    guildid: message.guild.id,
                    warncount: 1
                }).into('bans').where('guildid', message.guild.id).andWhere('userid', user.id).then(() => {

                })
                  .catch(e => logger.error(e));
            }
        });
    });
};
module.exports.help = {
    name: 'warn'
};
