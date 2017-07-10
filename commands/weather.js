const Discord = require('discord.js');
const settings = require('../config/settings.json');

exports.run = (client, message) => {
    let apiKey = settings.weatherAPI;
    const fetch = require('node-fetch');
    let arg = message.content.split(' ').join(' ').slice(8);
    if (!arg) {
        return message.reply('I need a city to check :wink:');
    }
    fetch('http://api.openweathermap.org/data/2.5/weather?q=' + arg + '&APPID=' + apiKey + '&units=metric')
        .then(res => {
            return res.json();
        }).then(json => {
            if (json.main === undefined) {
                return message.reply(`**${arg}** Isnt inside my query, please check again`);
            }
            let rise = json.sys.sunrise;
            let date = new Date(rise * 1000);
            let timestr = date.toLocaleTimeString();
            let set = json.sys.sunset;
            let setdate = new Date(set * 1000);
            let timesstr = setdate.toLocaleTimeString();
            const embed = new Discord.RichEmbed()
          .setColor(26368)
          .setTitle(`This is the weather for :flag_${json.sys.country.toLowerCase()}: **${json.name}**`)
          .addField('Info:', `**Temp:** ${json.main.temp}°C\n**WindSpeed:** ${json.wind.speed}m/s\n**Humidity:** ${json.main.humidity}%\n**Sunrise:** ${timestr}\n**Sunset:** ${timesstr}`);
            message.channel.send({embed})
          .catch(console.error);
        }).catch(err => {
            if (err) {
                message.channel.send('Something went wrong while checking the query!');
            }
        });
};
module.exports.help = {
    name: 'weather'
};
