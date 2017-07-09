const cooldown = new Set();
exports.run = (client, message, args) => {
  const settings = require("./config/settings.json")
  let apiKey = settings.twitchAPI;
  const Discord = require ("discord.js");
  const fetch = require ("node-fetch");
  let arg = message.content.split(" ")[1]
  if (!arg)return message.reply("You must give me a twitch channel for stats");
  fetch("https://api.twitch.tv/kraken/users/" + arg + "?client_id=" + apiKey)
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      fetch("https://api.twitch.tv/kraken/channels/" + arg + "?client_id=" + apiKey)
          .then(function(res) {
            return res.json();
          }).then(function(json2) {
            if (json.status == 404) return message.reply("Channel: " + arg + "**does not exist**.").catch(console.error);
            const embed = new Discord.RichEmbed()
              .addField("Name", json.name, true)
              .addField("Since", json.created_at, true)
              .addField("Total followers", json2.followers, true)
              .addField("Total views", json2.views, true)
              .addField("Channel link", json2.url, true)
              .addField("**Has partner?**", json2.partner, true)
              .setColor(5754551)
              .setThumbnail(json.logo);

            message.channel.send({embed})
            .catch(console.error)

          }).catch(function(err) {
            if(err) {
              console.log(err);
            }
          })
    }).catch(function(err) {
      if(err) {
        console.log(err);
      }
    })
};
module.exports.help = {
  name: "twitch"
}
