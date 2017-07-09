const Discord = require('discord.js');

exports.run = (client, message) => {
    let arg = message.content.split(' ').slice(1).join(' ');
    const OWStats = require('overwatch-stats');
    if (!arg) {
        return message.reply('Insert your battletag please :wink: `DISCLAMER: case sensitive please insert as it is`');
    }
    if (!arg.includes('#')) {
        return message.reply('Invalid battletag');
    }
    if (arg.split('#').length > 6) {
        return message.reply('Bro, I dont think this shit is valid');
    }
    OWStats.load(arg)
    .then(data => {
        if (!data.body.eu.stats.quickplay.overall_stats.avatar) {
            return message.reply('This battletag **DOESNT** exist!');
        }
        const embed = new Discord.RichEmbed()
      .setAuthor(`stats for ${arg}`, data.body.eu.stats.quickplay.overall_stats.avatar)
      .addField(`quickplay ${arg}`, `**Games played:** ${data.body.eu.stats.quickplay.overall_stats.games}\n**wins:** ${data.body.eu.stats.quickplay.overall_stats.wins}\n**Losses:** ${data.body.eu.stats.quickplay.overall_stats.losses}\n**Tier:** ${data.body.eu.stats.quickplay.overall_stats.tier}\n**Prestige:** ${data.body.eu.stats.quickplay.overall_stats.prestige}`)
      .setThumbnail(data.body.eu.stats.quickplay.overall_stats.avatar);
        message.channel.send({embed}).catch(console.error);
      // Stats Object available for use
    }).catch(err => {
        message.channel.send('Didnt find you ' + arg);
    });
};
module.exports.help = {
    name: 'ow'
};
