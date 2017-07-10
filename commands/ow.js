const Discord = require('discord.js');

exports.run = (client, message) => {
    let arg = message.content.split(' ').slice(1).join(' ');
    const OWStats = require('overwatch-stats');
    /*
      Checking for username
    */
    if (!arg) {
        return message.reply('Insert your battletag please :wink: `DISCLAMER: case sensitive please insert as it is`');
    }
    /*
      Checking for discriminator
    */
    if (!arg.includes('#')) {
        return message.reply('Invalid battletag');
    }
    /*
    Checking discriminator validation
    */
    if (arg.split('#').length > 6) {
        return message.reply('Bro, I dont think this shit is valid');
    }
    /*
    Loading username stats
    */
    OWStats.load(arg)
    .then(data => {
      /*
        If user is not valid handle the error
      */
        if (!data.body.eu.stats.quickplay.overall_stats.avatar) {
            return message.reply('This battletag **DOESNT** exist!');
        }

        const embed = new Discord.RichEmbed()
      .setAuthor(`stats for ${arg}`, data.body.eu.stats.quickplay.overall_stats.avatar)
      .addField(`quickplay ${arg}`, `**Games played:** ${data.body.eu.stats.quickplay.overall_stats.games}\n\
**wins:** ${data.body.eu.stats.quickplay.overall_stats.wins}\n\
**Losses:** ${data.body.eu.stats.quickplay.overall_stats.losses}\n\
**Tier:** ${data.body.eu.stats.quickplay.overall_stats.tier}\n\
**Prestige:** ${data.body.eu.stats.quickplay.overall_stats.prestige}
`)
      .setThumbnail(data.body.eu.stats.quickplay.overall_stats.avatar);
        message.channel.send({embed}).catch(console.error);
    }).catch(err => {
      /*
      Catching unhalded promise rejection
      */
        message.channel.send('Didnt find you ' + arg);
    });
};
module.exports.help = {
    name: 'ow'
};
