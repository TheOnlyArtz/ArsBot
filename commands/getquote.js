const Discord = require('discord.js');

exports.run = function (client, message) {
    const fetch = require('snekfetch');
    fetch.get('http://api.forismatic.com/api/1.0/?method=getQuote&key=457653&format=json&lang=en').then(quote => {
        if (quote.body.quoteText === undefined) {
            return message.reply('Something is messing up the API try again please!');
        }
        const embed = new Discord.RichEmbed()
    .setAuthor('A smart guy said once:', 'http://pngimages.net/sites/default/files/right-double-quotation-mark-png-image-80280.png')
    .addField('Quote With Source', `"${quote.body.quoteText}"\n**Author:** ${quote.body.quoteAuthor}\n**Source:** ${quote.body.quoteLink}`);
        message.channel.send({embed}).catch(e => logger.error(e));
    }).catch(err => {
        if (err) {
            message.channel.send('OOPS... something went wrong');
        }
    });
};
module.exports.help = {
    name: 'getquote'
};
