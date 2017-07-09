const Discord = require('discord.js');

exports.run = (client, message) => {
    let finalImage = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/` + message.content.slice(7).toUpperCase() + `.gif`;
    if (!message.content.slice(7)) {
        return message.reply('specify a thing that trump will make illegal');
    }
    if (message.content.slice(7).length > 11) {
        return message.reply('Max letters/numbers = 10 sorry..');
    }
  // Const embed = new Discord.RichEmbed()
  // .setAuthor("Trump", "https://is2-ssl.mzstatic.com/image/thumb/Purple111/v4/7d/a4/55/7da455f6-b1f7-be48-7649-bbf90c1a0be1/source/256x256bb.jpg")
  // .setImage(finalImage);
  // message.channel.send({embed});
    message.channel.send(`https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/` + message.content.slice(7).toUpperCase() + `.gif`);
};
module.exports.help = {
    name: 'trump'
};
