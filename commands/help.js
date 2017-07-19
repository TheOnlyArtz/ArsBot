const Discord = require('discord.js');
const sql = require('sqlite');

sql.open('./announcehey.sqlite');
const knexDB = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'admin',
        password: '1234561asd',
        database: 'arsbot'
    }
});

exports.run = function (client, message) {
    const embed = new Discord.RichEmbed()
  .setColor(202020)
.addField('Fun commands', '**~8ball** I\'ll predict anything for you!\n\
**~yomama** Give you a random `yomama joke` kek\n\
**~cat** Gives you a random picture of a cat\n\
**~cowsay** What does the cow says?\n\
**~getquote** Gives you a random famous quote!\n\
**~photograph** Gives you a random photograph\n\
**~weather** Check the weather for your chosen City\n\
**~puppy** Gives you a random picture of a puppy\n\
**~trump** What should trump make illegal?\n\
**~ud** Don\'t know a word? use this!\n\
**~twitch** Gives you your favorite streamer\'s stats')
.addField('Utility commands', '**~unshorten** Some one sent you a shorten link by google or bitly? check the full one without risk!\n\
**~botinfo** Gives you my current stats\n\
**~announcebye** Run this command in channel you want, **bye logs** will be there\n\
**~announcehey** Run this command in channel you want, **hey logs** will be there\n\
**~bugreport** Report us a bug and we will reply to you\n\
**~createinvite** Create **Permanent** invite link to this server!\n\
**~donate** may you become a patron?\n\
**~userinfo** Gives you a mentioned user info!\n\
**~ping** I\'ll reply with pong fast as I can!\n\
**~serverlist** Wanna see in how many servers your favorite bot in?\n\
**~info** Gives you the current server stats')
.addField('Moderation commands', '**~ban** Ban a mentioned user\n\
**~history** Check punishment history for a mentioned user **Just for bot\'s punishes**\n\
**~kick** Kicks a mentioned user\n\
**~mute** Mutes a mentioned user\n\
**~warn** Warns a mentioned user and let you ban him after 3 warnings\n\
**~softban** Softban a mentioned user\n\
**~prune** Kick players that are inactive [days you choose]\n\
**~purge** How messages should I delete for you?\n\
**~unmute** Unmutes a mentioned user')
.addField('Game Stats', '**~ow** Check your OverWatch statistics!');
    message.author.send({embed}).catch(e => logger.error(e));

    knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
        if (!l[0]) {
            return;
        }
        if (l[0].agree !== 'false') {
            return;
        }
        if (message.author.id !== message.guild.ownerID) {
            return;
        }
        message.channel.send('Check your :inbox_tray: **Help Options** : Special (economy mode disabled and Owner detected!)');
        const econ = new Discord.RichEmbed()
    .addField('Economy Info!', `Hello there ${message.author.username} We have detected that you are the owner\
    of the server so we decide to send you the more \`Adults only part of the bot\`\n
    ArsBot has economy system about weed , yep sounds funny right? At the moment you have economy mode disabled I guess. Economy mod is all about fun and \`"Growing"\`\
     Every player has weed bank \n
    This weed bank will charge weed whenever a user talk \`Every 30 sec so no need for spam!\`\
     with the weed amount you will be able to \`Trade, Sell, Bet, Smoke\`\
      And more thing since we are developing it\n\
    **IF YOU CHOOSE TO ENABLE THIS MOD YOU WILL TAKE FULL RESPOSIBILTY ABOUT WHAT WILL HAPPEN**`)
    .addField('Economy Commands v1.2.5 UPDATED', '**~economy enable** `Server owner only` enable economy mod!\n\
    **~economy disable** `Server owner only` disable economy mod!\n\
    **~weed bank** Shows you how much weed you have\n\
    **~weed smoke** Smoke some weed for 15 grams\n\
    **~weed bet** Guess number from 1-5 and bet one some weed price = 5x\n\
    **~weed donate** Donate a mentioned user some weed. Poor little guy\n**weed top10** check the leaderboards!');
        message.author.send({embed: econ}).catch(e => logger.error(e));
    });

    knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
        if (!l[0]) {
            return message.reply('Check your :inbox_tray: **Help Options** : Regular (economy mode disabled!)');
        }
        if (l[0].agree === 'false') {
            message.channel.send('Check your :inbox_tray: **Help Options** : Regular (economy mode disabled!)');
        }
    });

    knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
        if (!l[0]) {
            return;
        }
        if (l[0].agree === 'false') {
        } else {
            message.channel.send('Check your :inbox_tray: **Help Options** : With Economy (economy mode enabled)');
            const economy = new Discord.RichEmbed()
      .addField('Economy Commands v1.2.5 UPDATED', '**~economy enable** `Server owner only` Enable economy mode!\n **~economy disable** `Server owner only` Disable economy mode\n**weed top10** check the leaderboards!\n**~weed bank** Shows you how much weed you have\n**~weed smoke** Smoke some weed for 15 grams\n **~weed bet** Guess number from 1-5 and bet one some weed price = 5x\n**~weed donate** Donate a mentioned user some weed. Poor little guy\n **~weed help** Shows you the economy commands')
      .addField('Farm Upgrading Commands v1.2.5 UPDATED', '**~weed upgrade menu** Shows you the `upgrading` menu including price and info\n**~weed upgrade medium** Upgrade to the **medium** farm level\n**~weed upgrade advanced** Upgrade to the **advanced** farm level\n**~weed upgrade smart** Upgrade to the **smart** farm level')
      .setColor(27648);
            message.author.send({embed: economy}).catch(e => logger.error(e));
        }
    });
};
module.exports.help = {
    name: 'help'
};
