exports.run = (client, message) => {
    message.channel.send('Pinging...').then(sent => {
        sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms`);
    })
  .catch(console.error);
};
module.exports.help = {
    name: 'ping'
};
