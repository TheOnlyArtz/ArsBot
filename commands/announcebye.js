const mysql = require('mysql');
const sql = require('sqlite');

  /*
    Connect to the sqlite local database
  */

sql.open('./localDBs/announcehey.sqlite');
exports.run = function (client, message) {
    let heymessage = message.content.split(' ').slice(1).join(' ');
    const database = mysql.createConnection({
        host: 'localhost',
        user: 'arsbot',
        password: '1234561asd',
        database: 'arsbot'
    });
    /*
    Checks if author has permissions
    */
    if (!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        return message.reply(':lock: You dont have permissions for that').catch(e => logger.error(e))
    }
    /*
    Checks if message was supplied
    */
    if (!heymessage) {
        return message.reply('You must write an announce msg that appear whenever a new user leaves the server');
    }
    let guild = message.guild;
    sql.get(`SELECT * FROM byehey WHERE guildid ="${guild.id}"`).then(row => {
      /*
      If row is not there handle that and insert to the database
      */
        if (!row) {
            message.channel.send(`You've set **bye** announce messages for ${message.channel} \n Your chosen messasge to display (**${heymessage}**) Have fun!`);
            sql.run('INSERT INTO byehey (guildid, channelid, guildname, bye) VALUES (?, ?, ?, ?)', [message.guild.id, message.channel.id, guild.name, `${heymessage}`]);
        } else {
          /*
          If row is there update to the database
          */
            sql.run(`UPDATE byehey SET channelid = ${message.channel.id} WHERE guildid = ${message.guild.id} AND guildname = "${guild.name}"`);
            sql.run(`UPDATE byehey SET bye = ?  WHERE guildid = ? AND guildname = ?`, [heymessage, message.guild.id, guild.name]);
            message.channel.send(`You've set **bye** announce messages for ${message.channel} \n Your chosen messasge to display (**${heymessage}**) Have fun! `);
        }
    }).catch(() => {
      /*
      Catch any error prevent from crashing
      */
        console.error();
        sql.run('CREATE TABLE IF NOT EXISTS byehey (guildid TEXT, channelid TEXT, guildname TEXT, bye TEXT)').then(() => {
            sql.run('INSERT INTO byehey (guildid, channelid, guildname, bye) VALUES (?, ?, ?, ?)', [message.guild.id, message.channel.id, guild.name, `${heymessage}`]);
        });
    });
};

module.exports.help = {
    name: 'announcebye'
};
