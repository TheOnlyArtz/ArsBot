const ms = require('ms');

exports.run = (client, message) => {
    const Discord = require('discord.js');
    const cooldown = new Set();
    message.delete(3000);
    if (cooldown.has(message.author.id && message.guild.id)) {
        return message.reply('**[COOLDOWN]** Info command has **10 Minutes** Cooldown!');
    }
    cooldown.add(message.author.id && message.guild.id);

    setTimeout(() => {
        cooldown.delete(message.author.id && message.guild.id);
    }, 600000);
    const embed = new Discord.RichEmbed()
      .addField(`Info for ${message.guild.name}`,
        `**Overall Channels:** ${message.guild.channels.size}\n**Overall Members:** ${message.guild.memberCount}\n**Server Owner:** ${message.guild.owner}\n**Region:** ${message.guild.region}\n**Server Image** [click here](${message.guild.iconURL()})\n**verificationLevel:** ${message.guild.verificationLevel}\n**Roles:** [${message.guild.roles.size}]`)
        .setTimestamp()
        .setColor(3118751)
        .setThumbnail(message.guild.iconURL());
      // .addField("Channels", message.guild.channels.size, true)
      // .addField("Members", message.guild.memberCount, true)
      // .addField("Channels Overall", client.channels.size, true)
      // .addField("Guilds Overall", client.guilds.size, true)
      // .setAuthor(message.guild.name, message.guild.iconURL())
      // .addField("Owner", message.guild.owner, true)
      // .addField("Region", message.guild.region, true)
      // .addField("Server Icon", "[click here](" + message.guild.iconURL() + ")", true)
      // .addField("Security", message.guild.verificationLevel, true)
      // .addField("Roles", message.guild.roles.map(r => r.size));
    message.channel.send({embed}).catch(e => logger.error(e));
};
module.exports.help = {
    name: 'info'
};
