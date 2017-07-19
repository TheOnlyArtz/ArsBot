const Discord = require('discord.js');

exports.run = (client, message, args) => {
    if (!message.guild.member(client.user).hasPermission('MANAGE_MESSAGES')) {
        return message.reply(':lock: **I** Need `MANAGE_MESSAGES` Permission to execute `purge`');
    }

    if (!message.guild.member(message.author).hasPermission('MANAGE_MESSAGES')) {
        return message.reply(':lock: **You** Need `MANAGE_MESSAGES` Permission to execute `purge`')
      .catch(e => logger.error(e));
    }
    let messagecount = parseInt(args.join(' '));
 /*
  Check if message is higher or lower then the limits
 */
    if (!messagecount) {
        return message.reply('How many messages?');
    }
    if (messagecount > 100) {
        return message.reply(`Purge has limits: you cant delete 101 messages per purge`);
    }
    /*
    Actual purge
    */
    let ms;
    if (messagecount === 1) {
        ms = 2;
    } else {
        ms = messagecount;
    }
    message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(ms))
  .catch(err => {
      console.error(err, message.channel.send('I cant delete message that are older than a week\
    And nope, The Api will not let any bot doing that!'));
  })
  // Message.reply(`You've succefully deleted \`${messagecount} Messages!\``).then(m => {
  //   m.delete(2000)
  // })
  .catch(e => logger.error(e));
};
module.exports.help = {
    name: 'purge'
};
