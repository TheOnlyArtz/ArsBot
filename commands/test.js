module.exports.run = (client, message) => {
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) {
        return message.reply('You must type the name of the crew');
    }
    console.log(args);
};
module.exports.help = {
    name: 'test'
};
