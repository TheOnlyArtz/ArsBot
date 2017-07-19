const Discord = require('discord.js');

exports.run = (client, message) => {
    let number = message.content.split(' ')[1];
    if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        return message.reply(':lock: **You** must have `ADMINISTRATOR` to use this command!');
    }
    if (!number) {
        return message.reply('How much days of inactivity you want to prune?');
    }
    const filterYes = m => m.content.startsWith('yes');
    const filterNo = m => m.content.startsWith('no');
    message.channel.send('Please this is a command that can make mistakes, please type `yes` If agree Below!\nIf not , just wait 7 seconds');
    message.channel.awaitMessages(filterYes, {max: 1, time: 7000, errors: ['time']})
.then(m => {
    message.channel.send(`Pruning members!`);
    message.guild.pruneMembers(number, true)
     .then(pruned => {
         const embed = new Discord.RichEmbed()
     .setTitle(`Prune by ${message.author.username}`, message.author.displayAvatarURL)
   .setDescription(`Pruned ${pruned} members with the agreement of ${message.author.tag}`);
         client.guilds.get(message.guild.id).channels.find('name', 'mod-log').send({embed})
      .catch(e => logger.error(e));
     })
   .catch(e => {
       console.log(e);
   });
    message.guild.pruneMembers(number);
})
 .catch(e => {
     message.channel.send('__***`Your request has been canceled!`***__');
 });
};
module.exports.help = {
    name: 'prune'
};
