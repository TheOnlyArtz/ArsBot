const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const moment = require('moment');

exports.run = (client, message) => {
    let platform = message.content.split(' ')[1];
    let unshortLink = message.content.split(' ').slice(2).join(' ');
    let googleapikey = 'AIzaSyANFFVT9cYHNf6ZjLh6U9YndD-46dH9bCI';
    if (!platform) {
        return message.reply('You must enter a platform example: `google / bitly`');
    }
    if (platform !== 'google' && platform !== 'bitly') {
        return message.reply('Please enter a valid short link from `google / bitly`');
    }
    if (!unshortLink) {
        return message.reply('You must give a shorten link so the bot can fetch the information\n and the originl LINK!');
    }
    if (!unshortLink.includes('https://goo.gl') && !unshortLink.includes('http://bit.ly') && !unshortLink.includes('http://goo.gl')) {
        return message.reply(`Did not detect a ${platform} link!`);
    }
    if (message.content.startsWith('~unshorten ' + 'google')) {
        snekfetch.get('https://www.googleapis.com/urlshortener/v1/url?key=' + googleapikey + '&shortUrl=' + unshortLink + '&projection=FULL').then(link => {
      // If (link.body.error.code === 400) return message.channel.send("Nope")
            const google = new Discord.RichEmbed()
      .setAuthor(`ArsBot: The unshortLink system!`, 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png')
        .addField(`Unshort info:`, `**Provider:** ${platform}\n**Original shortUrl:** ${link.body.id}\n**Link Status:** ${link.body.status}\n**Created At:** ${moment(link.body.created).format('MMMM Do YYYY, h:mm:ss a')}`)
        .addField(`Short url stats:`, `**Overall clicks:** ${parseInt(link.body.analytics.allTime.shortUrlClicks) + parseInt(link.body.analytics.allTime.longUrlClicks)}\n**Short Url clicks:** ${link.body.analytics.allTime.shortUrlClicks}\n**Long Url clicks:** ${link.body.analytics.allTime.longUrlClicks}`)
        .addField(`Final part: The actual link!`, `__***This is the original link, Enjoy and always check link that you are suspect in!***__\n__**LINK**__: ${link.body.longUrl}`);
            message.channel.send({
                embed: google
            })
      .catch(e => logger.error(e));
        }).catch(err => {
            console.error(err);
        });
    }
    if (message.content.startsWith('~unshorten ' + 'bitly')) {
        snekfetch.get('https://api-ssl.bitly.com/v3/user/link_lookup?link=' + unshortLink + '&access_token=e09419bc18813385b61da33807bc1955570cd28f').then(link => {
            let rise = link.body.data.link_lookup[0].created_at;
            let date = new Date(rise * 1000);
            const bitly = new Discord.RichEmbed()
        .setAuthor('ArsBot: The unshortLink system!', 'http://www.dmuth.org/files/bitly-logo.jpg')
        .addField('Unshort info:', `**Provider:** ${platform}\n**Original shortUrl:** ${unshortLink}\n**Link Status:** ${link.body.status_txt}`)
        // .addField(`Short url stats:`, `**Overall clicks:** ${parseInt(link.body.analytics.allTime.shortUrlClicks) + parseInt(link.body.analytics.allTime.longUrlClicks)}\n**Short Url clicks:** ${link.body.analytics.allTime.shortUrlClicks}\n**Long Url clicks:** ${link.body.analytics.allTime.longUrlClicks}`)
        .addField(`Final part: The actual link!`, `__***This is the original link, Enjoy and always check link that you are suspect in!***__\n__**LINK**__: ${link.body.data.link_lookup[0].url}`);
            message.channel.send({
                embed: bitly
            })
      .catch(e => logger.error(e));
        }).catch(err => {
            console.error(err);
        });
    }
};
module.exports.help = {
    name: 'unshorten'
};
