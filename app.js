const Discord = require("discord.js");
const client = new Discord.Client()
const moment = require("moment");
const ms = require("ms");
const chalk = require('chalk');
const time = moment().format(`YYYY-MM-DD HH:mm:ss`);
const settings = require("./config/settings.json");
const err = require("./ErrorsPerms/errors.json");
const perms = require("./ErrorsPerms/perms.json")
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwODkzNjg5ODU2NjE2MDM4NCIsImlhdCI6MTQ5NTczMDQ5NH0.JZ0B0MIonQxAnLkwtoMd1ymj8Xt547IM4nowH5nTuSY"
const ytdl = require("ytdl-core");
const package = require("./package.json")
const mysql = require("mysql");
const fetch = require("snekfetch");
const sql = require("sqlite");
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
// let muteRole = client.guilds.get(message.guild.id).roles.find("name", "muted");
// const ddiff = require ("return-deep-diff");
const fs = require("fs");
client.on("ready", () => {
  var database = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    database: "arsbot"
  });
  setInterval(() => {
    database.query("SELECT 1", (error) => {
      if (error && error.fatal) database = sql.createConnection({
          host: "127.0.0.1",
          user: "root",
          database: "arsbot"
        })
        .catch(console.error)
    })
  }, 8000);
  console.log(chalk.gray.underline.bold(`[${time}] - {${__filename}}: `));
  setInterval(() => {
    var answers = [
      `${client.guilds.size} Servers`,
      `${client.users.size} Users`,
      `${client.channels.size} Channels`,
      `http://arsbot.xyz`,
      `TheOnlyArtz`,
      `Ronen`
    ];

    /*
    Set the the bot to stream
    on a valid URI
    */
    client.user.setGame(
      `~help |` + `${answers[~~(Math.random() * answers.length)]}`,
      "https://www.twitch.tv/theonlyartz"
    );
  }, (100000))
  const snekfetch = require('snekfetch')
  console.log("I\'m Online!");
});

/*

Basic command handler to seperate the commands
To different files

*/

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if (jsfiles.length <= 0) {
    console.log("No commands to load!");
    return;
  }
  console.log(`Loading ${jsfiles.length} commands!`);


  //Loop through all the files and load them
  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded`);
    client.commands.set(props.help.name, props)
  });
});

// client.on("messageReactionRemove", async(messageReaction, user) => {
//   console.log(messageReaction);
//   client.channels.get("326760892970827778").send(`**Emoji:** ` +  messageReaction.Message.count + " just been moved by " + user.username)
// });

client.on("guildCreate", guild => {
  //Whenever a guild adds the Bot create a channel called mod-log
  //And disable the ability to write there (for @everyone role)
  client.channels.get("315129822571528193").edit({
      name: `${client.guilds.size}-Servers`
    })
    .catch(console.error);
  guild.createChannel("mod-log", "text").then(channel => channel.overwritePermissions(guild.id, {
      SEND_MESSAGES: false
    }))
    .catch(console.error)
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
      }).catch(console.error)
    })
    .catch(console.error)
  //Create a role called "muted" for the "mute" command
  guild.createRole({
      data: {
        name: 'muted',
        color: 'BLUE',
        permissions: ["USE_VAD", "ADD_REACTIONS", "READ_MESSAGE_HISTORY", "CREATE_INSTANT_INVITE", "READ_MESSAGES"]
      },
      reason: 'we needed a role for muted',
    })

    .then(role => console.log(`Created role ${role}`))
    .catch(console.error)
  //Post the serverAmount inside discordbots.org/api/bots/ID/stats
  fetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwODkzNjg5ODU2NjE2MDM4NCIsImlhdCI6MTQ5NTczMDg4N30.sdmEgx6mT8HATbAYxhTDFhP9VSk6SjaYBOR0D3ujSt4')
    .send({
      server_count: client.guilds.size
    })
    .then(console.log('Updated dbots.org status.'));
});

client.on("guildDelete", guild => {
  //Whenever a guild remove the bot send a message to the "server-log"
  const cnl = client.channels.get("315129822571528193");
  cnl.send(`**I've left ${guild.name} :rofl:**`);
  console.log(`I have left ${guild.name} at ${new Date()}`);
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
      console.log(err);
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
      console.log(err);
    }
  })
});

process.on('unhaldedRejection', (reason, p) => {
  console.error()
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
  if (maintance.on == true && message.content.startsWith(prefix)) return message.channel.send(`We are down for maintance amd we will be back in ${maintance.time}\n
      What will we do? Our Database system are getting very stuck and causing lots of bugs so we will move to other module`);


  knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async(l) => {
    //Connect to the Sqlite and fetch the economy system stats
    knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async(row) => {
      if (!row[0]) {
        knexDB.insert({
          userid: message.author.id,
          guildid: message.guild.id,
          weedamount: 0
        }).into('weedbank').where('guildid', message.guild.id).andWhere("userid", message.author.id).then(() => {}).catch()

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

        });



      }
    }).catch(function(err) {
      //handle any error and deal with it
      console.error(err);
    })
  }).catch(function(err) {
    //handle any error and deal with it
    console.error(err);
  });


  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0];
  if (!command.startsWith(prefix)) return;
  let cmd = client.commands.get(command.slice(prefix.length));
  //runs the command handler
  if (cmd) cmd.run(client, message, args);
});

client.login(settings.token);
