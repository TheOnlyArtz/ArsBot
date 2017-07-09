exports.run = (client, message) => {
    let Discord = require('discord.js');
    let target = message.mentions.users.first();

    if (message.mentions.users.size === 0) {
        return;
    }
    const embed = new Discord.RichEmbed()
    .setAuthor(`${target.username}`, `${target.displayAvatarURL}`)

    .setColor(0xC1C1C1)
    .setThumbnail(`${target.displayAvatarURL}`)

    .setTimestamp(new Date().toLocaleString())
    .addField('Full username',
      `${target.tag}`)
    .addField('When user was created ', `${target.createdAt}`, true)
    .addField('Users presense status ', `${target.presence.status}`, true)
    .addField('Users nickname', `${target}`, true)
    .addField('Is a bot ', `${target.bot}`, true)
    .addField('Last message sent by user', `${target.lastMessage}`, true);

    message.channel.send({embed})
    .catch(console.error);
};
module.exports.help = {
    name: 'test'
};
