const mysql = require('mysql');
const sql = require('sqlite');
/*
  Connect to the local database
*/

sql.open('./localDBs/announcehey.sqlite');
exports.run = function (client, message) {
    let heymessage = message.content.split(' ').slice(1).join(' ');

    /*
      Checking for permissions (author permissions)
    */

    if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        return message.reply(':lock: You dont have permissions for that').catch(console.error);
    }
    /*
      Checking if message was supplied
    */

    if (!heymessage) {
        return message.reply('You must write an announce msg that appear whenever a new user joins the server');
    }
    let guild = message.guild;
    sql.get(`SELECT * FROM heybye WHERE guildid ="${guild.id}"`).then(row => {
        if (!row) {
          /*
            If row is not there insert to the database
          */
            message.channel.send(`You've set **hey** announce messages for ${message.channel} \n Your chosen messasge to display (**${heymessage}**) Have fun!`);
            sql.run('INSERT INTO heybye (guildid, channelid, guildname, heymsg) VALUES (?, ?, ?, ?)', [message.guild.id, message.channel.id, guild.name, `${heymessage}`]);
        } else {
          /*
            Other than that, update the database
          */

            sql.run(`UPDATE heybye SET channelid = ${message.channel.id} WHERE guildid = ${message.guild.id} AND guildname = "${guild.name}"`);
            sql.run(`UPDATE heybye SET heymsg = ?  WHERE guildid = ? AND guildname = ?`, [heymessage, message.guild.id, guild.name]);
            message.channel.send(`You've set **hey** announce messages for ${message.channel} \n Your chosen messasge to display (**${heymessage}**) Have fun! `);
        }
    }).catch(() => {
      /*
        Handle any error and act
      */

        console.error();
        sql.run('CREATE TABLE IF NOT EXISTS heybye (guildid TEXT, channelid TEXT, guildname TEXT, heymsg TEXT)').then(() => {
            sql.run('INSERT INTO heybye (guildid, channelid, guildname, heymsg) VALUES (?, ?, ?, ?)', [message.guild.id, message.channel.id, guild.name, `${heymessage}`]);
        });
    });
};
module.exports.help = {
    name: 'announcehey'
};
