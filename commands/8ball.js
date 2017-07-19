const Discord = require('discord.js');

exports.run = (client, message, args) => {
    let question = message.content.split(' ').slice(1).join(' ');
    /*
    List of answers that the bot can randomize
    */
    const answers = [
        'As I See It Yes',
        'Ask Again Later',
        'Better Not Tell You Now',
        'Cannot Predict Now',
        'Concentrate and Ask Again',
        'Don\'t Count On It',
        'It Is Certain', 'It Is Decidely So',
        'Most Likely',
        'My Reply Is No',
        'My Sources Say No',
        'Outlook Good',
        'Outlook Not So Good',
        'Reply Hazy Try Again',
        'Signs Point to Yes',
        'Very Doubtful',
        'Without A Doubt',
        'Yes',
        'Yes - Definitely'
    ];
    /*
    If author didn't ask a question return
    */
    if (!question) {
        return message.reply('What question should I answer on? **Usage:** `~8ball is TheOnlyArtz sexy?`');
    }
    const embed = new Discord.RichEmbed()
  .setAuthor(`8ball`, 'http://8ballsportsbar.com/wp-content/uploads/2016/02/2000px-8_ball_icon.svg_.png')
  .addField('Info:', `**Your Question:** ${args}\n**My Prediction:** ${answers[~~(Math.random() * answers.length)]}`);
    message.channel.send({embed}).catch(e => logger.error(e))
};
module.exports.help = {
    name: '8ball'
};
