const Discord = require("discord.js");
const client = new Discord.Client()
const fs = require("fs");
const moment = require("moment");
const ms = require("ms");
const chalk = require('chalk');
const time = moment().format(`YYYY-MM-DD HH:mm:ss`);
const settings = require("./config/settings.json");
const err = require("./ErrorsPerms/errors.json");
const perms = require("./ErrorsPerms/perms.json")
const ytdl = require("ytdl-core");
const package = require("./package.json")
const mysql = require("mysql");
const fetch = require("snekfetch");
const sql = require("sqlite");
const winstonLogger = require('./classes/logger.js')

const winstonClass = new winstonLogger
global.logger = winstonClass.logger

sql.open("./localDBs/announcehey.sqlite")
const cooldown = new Set();
const maintance = {
  "on": false,
  "time": "30 Minutes"
}
const knexDB = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'admin',
    password: "1234561asd",
    database: 'arsbot'
  }
});

client.on("ready", () => {
  var database = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "arsbot"
  });
  setInterval(() => {
    knexDB.from('weedbank').where("agree", "true").then(async err => {

    })
    .catch(e => {
      logger.error(e)
    })
  }, 8000);
  setInterval(() => {
    var answers = [
      `${client.guilds.size} Servers`,
      `${client.users.size} Users`,
      `~help`,
      `http://arsbot.xyz`
    ];

    /*
    Set the the bot to stream
    on a valid URI
    */
    client.user.setGame(
      `${answers[~~(Math.random() * answers.length)]}`,
      "https://www.twitch.tv/theonlyartz"
    );

  }, (100000))
  const snekfetch = require('snekfetch')
  logger.verbose(`${client.user.username} Is up and ready to work`);
  logger.verbose(`Connected as: ${client.user.tag}`)
  logger.verbose(`Client ID: ${client.user.id}`)
  logger.verbose(`====================================`)
});

/*

Basic command handler to seperate the commands
To different files

*/

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) logger.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) {
    logger.info("No commands to load!");
    return;
  }
  logger.info(`Loading ${jsfiles.length} commands!`);


  //Loop through all the files and load them
  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    logger.info(`${i + 1}: ${f} loaded`);
    client.commands.set(props.help.name, props)
  });
});


client.on("guildCreate", guild => {
  //Whenever a guild adds the Bot create a channel called mod-log
  //And disable the ability to write there (for @everyone role)
  client.channels.get("315129822571528193").edit({
      name: `${client.guilds.size}-Servers`
    })
    .catch(e => {
      logger.error(e)
    })
  guild.createChannel("mod-log", "text").then(channel => channel.overwritePermissions(guild.id, {
      SEND_MESSAGES: false
    }))
    .catch(e => {
      logger.error(e)
    })
  /*
  Sends a "greeting" message that explains quickly on the bot
  */
  guild.defaultChannel.send(`I have joined **${guild.name}** \n so let me introduce my self, my name is **ArsBot** \n Im for cool servers only, My developer is a guy called **TheOnlyArtz** \n for the help command be sure to write \`~help\`\n If you didnt notice I've added text channel \`mod-log\` so you can log all the ban/kicks/mutes \n And I've created \`muted\` role so you can use \`~mute\``);
  /*
  Send a "server-log" message to ArsBot offical server
  */
  guild.defaultChannel.createInvite({
      maxAge: 0
    }).then((invite) => {
      const cnl = client.channels.get("315129822571528193");
      const embed = new Discord.RichEmbed()
        .addField("ServerName:", `${guild.name}`, true)
        .addField("Members", `${guild.memberCount}`, true)
        .addField('Invite link:', `http://discord.gg/${invite.code}`, true)
        .addField("Channels", `${guild.channels.size}`, true)
        .addField("Owner", `${guild.owner}`, true)
        .setThumbnail(guild.iconURL())
        .setTimestamp();
      cnl.send({
        embed
      }).catch(e => {
        logger.error(e)
      })

    })
    .catch(e => {
      logger.error(e)
    })

  //Create a role called "muted" for the "mute" command
  guild.createRole({
      data: {
        name: 'muted',
        color: 'BLUE',
        permissions: ["USE_VAD", "ADD_REACTIONS", "READ_MESSAGE_HISTORY", "CREATE_INSTANT_INVITE", "READ_MESSAGES"]
      },
      reason: 'we needed a role for muted',
    })

    .then(role => logger.info(`Created role ${role}`))
    .catch(e => {
      logger.error(e)
    })
  //Post the serverAmount inside discordbots.org/api/bots/ID/stats
  fetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set('Authorization', settings.dbotsAPI)
    .send({
      server_count: client.guilds.size
    })
    .then(logger.info('Updated dbots.org status.'));
});

client.on("guildDelete", guild => {
  client.channels.get("315129822571528193").edit({
      name: `${client.guilds.size}-Servers`
    })
  //Whenever a guild remove the bot send a message to the "server-log"
  const cnl = client.channels.get("315129822571528193");
  cnl.send(`**I've left ${guild.name} :rofl:**`);
  logger.info(`I have left ${guild.name} at ${new Date()}`);
});

client.on("guildMemberAdd", member => {
  let guild = member.guild
  //connnect to the DataBase and fetch the custom
  // announcemessage whenever a new user comes to the server
  //If set.
  sql.get(`SELECT * FROM heybye WHERE guildid ="${guild.id}"`).then(row => {
    if (!row) {

    }
    if (row) {
      client.channels.get(`${row.channelid}`).send(`**${member.user}** ${row.heymsg}`);
    }
  }).catch(function(err) {
    if (err) {
      logger.error(err);
    }
  })
});

client.on("guildMemberRemove", member => {
  let guild = member.guild
  //connnect to the DataBase and fetch the custom
  //announcemessage whenever a new user leaves the server
  //If set.

  sql.get(`SELECT * FROM byehey WHERE guildid ="${guild.id}"`).then(row => {
    if (!row) {

    }
    if (row) {
      client.channels.get(`${row.channelid}`).send(`**${member.user.username}** ${row.bye}`);
    }

  }).catch(function(err) {
    if (err) {
      logger.error(err);
    }
  })
});

process.on('unhaldedRejection', (reason, p) => {
  logger.error(reason)
});


let servers = {};
var prefix = "~"
let blocked = new Array(
  "yolooo",
  "wellp",
  "fuckyou"
)
client.on("message", async(message) => {
  blocked.forEach(function(word) {
    if (message.content.includes(word)) {
      message.delete();
    }
  });
  if (message.author.bot) return; //Ingore bots
  if (message.channel.type === "dm") return; // Ignore DM channels
  if (maintance.on == true && message.content.startsWith(prefix))
  return message.channel.send(`We are down for maintance amd we will be back in ${maintance.time}\n
      What will we do? Our Database system are getting very stuck and causing lots of bugs so we will move to other module`);


  knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async(l) => {
    //Connect to the Sqlite and fetch the economy system stats
    knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async(row) => {
      if (!row[0]) {
        knexDB.insert({
          userid: message.author.id,
          guildid: message.guild.id,
          weedamount: 0
        }).into('weedbank').where('guildid', message.guild.id).andWhere("userid", message.author.id).then(() => {

        })
        .catch(e => {
          logger.error(`Common knexError not important`)
        })

      } else {
        if (!l[0]) return;
        if (!l[0].level == "false") return;
        let weedmont;
        if (!row[0]) {
          weedmont = (Math.random() * (50 - 20) + 51.2).toFixed(2);
        } else
        if (row[0].level == "BlueBerry") {
          weedmont = (Math.random() * (59 - 20) + 51.2).toFixed(2);
        } else
        if (row[0].level == "BlueCheese") {
          weedmont = (Math.random() * (59 - 20) + 51.2).toFixed(2);
        } else
        if (row[0].level == "BubbaKush") {
          weedmont = (Math.random() * (60 - 20) + 51.2).toFixed(2);
        } else
        if (row[0].level == "BlueDream") {
          weedmont = (Math.random() * (80 - 30.5) + 30.2).toFixed(2);
        } else
        if (row[0].level == "OgKush") {
          weedmont = (Math.random() * (75 - 30.5) + 30.2).toFixed(2);
        } else
        if (row[0].level == "greenCrack") {
          weedmont = (Math.random() * (50 - 20.61) + 20.2).toFixed(2)
        } else
        if (row[0].level == "sourDiesel") {
          weedmont = (Math.random() * (45 - 20.61) + 20.2).toFixed(2)
        } else
        if (row[0].level == "jackHerer") {
          weedmont = (Math.random() * (40 - 20.61) + 20.2).toFixed(2)
        } else
        if (row[0].level == "lemonHaze") {
          weedmont = (Math.random() * (50 - 20.61) + 20.2).toFixed(2)
        };
        //Checking if the server is allowing economy system and if not , return;
        // if(`${row.userid.message.guild.owner}` === "false") return;
        if (cooldown.has(message.author.id && message.guild.id)) return;
        cooldown.add(message.author.id && message.guild.id);
        //Sets a cooldown for the economy system, 20seconds
        setTimeout(() => {
          cooldown.delete(message.author.id && message.guild.id);
        }, 78000);
        knexDB.update({
          weedamount: parseInt(row[0].weedamount) + parseInt(weedmont)
        }).into('weedbank').where('guildid', message.guild.id).andWhere("userid", message.author.id).then(() => {

        })
        .catch(e => {
          logger.error(`Common knexError not important`)
        })



      }
    }).catch(function(err) {
      //handle any error and deal with it
      logger.error(err);
    })
  }).catch(function(err) {
    //handle any error and deal with it
    logger.error(err);
  });


  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0];
  if (!command.startsWith(prefix)) return;
  let cmd = client.commands.get(command.slice(prefix.length));
  //runs the command handler
  if (cmd)
  try {
    cmd.run(client, message, args);
    logger.info(`${chalk.cyan(cmd.help.name)} just been executed by ${chalk.magenta(message.author.username)} inside ${chalk.yellow(message.guild.name)}`)
  } catch (e) {
    logger.error(e);
  }
});

client.login(settings.token);
