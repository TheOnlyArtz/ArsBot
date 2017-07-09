exports.run = function (client, message) {
    const sql = require('sqlite');
    const Discord = require('discord.js');
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
    if (message.content.startsWith('~economy enable')) {
        if (message.author.id !== message.guild.ownerID) {
            return message.reply('Just the owner can enable Econ mod!');
        }
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    sql.run('INSERT INTO weedbank (userid, guildid, weedamount) VALUES (?, ?, ?)', [message.author.id, message.guild.id, 0]);
                } else {
                    if (`${l[0].agree}` === 'true') {
                        return message.reply('Economy mod already turned on!');
                    }
                    knexDB.update({
                        agree: 'true'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    });

                    message.channel.send('Economy mode is finally enabled have fun start bye typing `~weed bank` and `~help` so you can see economy commands too :leaves:');
                }
            });
        });
    }
    if (message.content.startsWith('~economy disable')) {
        if (message.author.id !== message.guild.ownerID) {
            return message.reply('Just the owner can disable Econ mod!');
        }
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    sql.run('INSERT INTO weedbank (userid, guildid, weedamount) VALUES (?, ?, ?)', [message.author.id, message.guild.id, 0]);
                    message.channel.send('You may do that again cause we registered you inside the database!');
                } else {
                    let guild = message.guild;
                    if (`${l[0].agree}` === 'false') {
                        return message.reply('Economy mod already turned off!');
                    }
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
