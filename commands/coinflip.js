const Discord =require("discord.js")
exports.run = function(client, message) {
  let answers = ["heads", "tails", "heads", "tails", "heads", "tails", "heads", "tails", "heads", "tails"];
  var embed = new Discord.RichEmbed()
  .addField("CoinFlip", `${answers[~~(Math.random() * answers.length)]}`);
  message.channel.send({embed}).catch(console.error)
};
module.exports.help = {
  name: "coinflip"
}
