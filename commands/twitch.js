const cooldown = new Set();
const settings = require('../config/settings.json');

exports.run = (client, message, args) => {
    let apiKey = settings.twitchAPI;
    const Discord = require('discord.js');
    const fetch = require('node-fetch');
    let arg = message.content.split(' ')[1];
    if (!arg) {
        return message.reply('You must give me a twitch channel for stats');
    }
    fetch('https://api.twitch.tv/kraken/users/' + arg + '?client_id=' + apiKey)
    .then(res => {
        return res.json();
    }).then(json => {
        fetch('https://api.twitch.tv/kraken/channels/' + arg + '?client_id=' + apiKey)
          .then(res => {
              return res.json();
          }).then(json2 => {
              if (json.status === 404) {
                  return message.reply('Channel: ' + arg + '**does not exist**.').catch(e => logger.error(e));
              }
              const embed = new Discord.RichEmbed()
              .addField('Name', json.name, true)
              .addField('Since', json.created_at, true)
              .addField('Total followers', json2.followers, true)
              .addField('Total views', json2.views, true)
              .addField('Channel link', json2.url, true)
              .addField('**Has partner?**', json2.partner, true)
              .setColor(5754551)
              .setThumbnail(json.logo);

              message.channel.send({embed})
            .catch(e => logger.error(e));
          }).catch(err => {
              if (err) {
                  console.log(err);
              }
          });
    }).catch(err => {
        if (err) {
            console.log(err);
        }
    });
};
module.exports.help = {
    name: 'twitch'
};
