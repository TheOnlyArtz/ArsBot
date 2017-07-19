exports.run = function (client, message) {
    const Discord = require('discord.js');
    /*
      Connect to the database using KnexJS
    */
    const knexDB = require('knex')({
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'admin',
            password: '1234561asd',
            database: 'arsbot'
        }
    });
    /*
      Start a sub command to enable econoy mode
    */
    if (message.content.startsWith('~economy enable')) {
      /*
        Check if the author is the owner
      */
        if (message.author.id !== message.guild.ownerID) {
            return message.reply('Just the owner can enable Econ mod!');
        }
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                  /*
                    If row is not there insert into the database
                  */
                    knexDB.insert({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        weedamount: 0
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    })
                    .catch(e => logger.error(e))
                } else {
                  /*
                    If mode is already on, return.
                  */
                    if (`${l[0].agree}` === 'true') {
                        return message.reply('Economy mod already turned on!');
                    }
                    /*
                      Else, update the database with "agree: true"
                    */
                    knexDB.update({
                        agree: 'true'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    })
                    .catch(e => logger.error(e))

                    message.channel.send('Economy mode is finally enabled have fun start by typing `~weed help` and `~bank` so you can see economy bank too :leaves:');
                }
            });
        });
    }
    /*
      Start a new sub command to disable economy mode
    */

    if (message.content.startsWith('~economy disable')) {
      /*
        Check if author is the owner
      */
        if (message.author.id !== message.guild.ownerID) {
            return message.reply('Just the owner can disable Econ mod!');
        }
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                  /*
                    If row is not there , Insert it into the database
                  */
                    knexDB.insert({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        weedamount: 0
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    });
                    message.channel.send('You may do that again cause we registered you inside the database!');
                } else {
                  /*
                    If economy is already off, return.
                  */
                    let guild = message.guild;
                    if (`${l[0].agree}` === 'false') {
                        return message.reply('Economy mod already turned off!');
                    }
                    /*
                      Else, Update the database to agree : "false"
                    */
                    knexDB.update({
                        agree: 'false'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    });
                    message.channel.send(`Economy mode is disabled for ${guild.name}`);
                }
            });
        });
    }
};
module.exports.help = {
    name: 'economy'
};
