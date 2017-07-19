const Discord = require('discord.js');

const cooldown = new Set();
exports.run = function (client, message) {
    const fetch = require('snekfetch');
    fetch.get('http://www.splashbase.co/api/v1/images/random').then(photo => {
        const embed = new Discord.RichEmbed()
    .setImage(`${photo.body.url}`);
        message.channel.send({embed})
    .catch(e => logger.error(e));
    }).catch(err => {
        if (err) {
            message.channel.send('OOPS... something went wrong');
        }
    });
};
module.exports.help = {
    name: 'photograph'
};
