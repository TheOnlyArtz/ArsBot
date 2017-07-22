const sql = require('sqlite');
const Discord = require('discord.js');
const chalk = require('chalk')

sql.open('./localDBs/announcehey.sqlite');
const knexDB = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'admin',
        password: '1234561asd',
        database: 'arsbot'
    }
});

exports.run = async (client, message, args) => {
  // Weed upgrade menu.
    let price;

    if (message.content === '~weed upgrade menu' || message.content === '~weed upgrading menu' || message.content === '~weed upgrade') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(row => {
                if (!l[0]) {
                    return message.reply('Econ mod is not enabled for this server!');
                }
                if (l[0].agree === 'false') {
                    return message.reply('Econ mod is not enabled for this server!');
                }

                if (!row[0]) {
                    return;
                }
                let gram;
                if (row[0].weedamount > 999) {
                    gram = `${(row[0].weedamount / 1000)} **KG**`;
                } else {
                    gram = `${row[0].weedamount} **Grams**`;
                }
                message.reply('What do you want to upgrade too? this is the menu + price tags\nTo upgrade your farm simply type `~weed upgrade FarmName`');
                let upgradembed = new Discord.RichEmbed()
        .addField('Current level and Weed', `You are in the **${row[0].level}** weed farm level!\nWith ${gram} Of fresh ${row[0].level} weed!`)
        .addField(
          'Upgrading Price',
        'Parmater __Indica__:\n\
        1.**BlueCheese** Price = 2,000$\n\
        2.**BlueBerry** Price = 2,500$\n\
        3.**PurpleKush** Price = 3,000$\n\
    Parmater __Hybrid__:\n\
        4.**BlueDream** Price = 7,500$\n\
        5.**OG Kush** Price = 10,000$\n\
    Parmater __Stavia__:\n\
        6.**greenCrack** Price = 17,500$\n\
        7.**sourDiesel** Price = 20,000$\n\
        8.**jackHerer** Price = 25,000$\n\
        9.**lemonHaze** Price = 30,000$\n\
        ')
        .addField('How to Upgrade:',
        'To actually upgrade your farm type\n\
        `~weed upgrade <farmname>`\n\
        And No dont type the name inside <> cause it wont work');
                message.channel.send({embed: upgradembed})
        .catch(e => logger.error(e));
            }).catch(err => {
                logger.error(err);
            });
        }).catch(err => {
            logger.error(err);
        });
    }
  // BlueCheese
    if (message.content === '~weed upgrade BlueCheese' || message.content === '~weed upgrade bluecheese') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 2000) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 2000`);
                } else if (row[0].level === 'BlueCheese') {
                    await message.reply('You already have the BlueCheese farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to **BlueCheese** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 2000),
                        level: 'BlueCheese'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    })
                    .catch(e => logger.error(e));
                }
            });
        });
    }
// BlueBerry
    if (message.content === '~weed upgrade BlueBerry' || message.content === '~weed upgrade blueberry') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 2500) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 2500`);
                } else if (row[0].level === 'BlueBerry') {
                    await message.reply('You already have the BlueBerry farm!');
                } else if (row[0].level === 'PurpleKush' ||
      row[0].level === 'BlueDream' ||
       row[0].level === 'OgKush' ||
     row[0].level === 'greenCrack' ||
     row[0].level === 'sourDiesel' ||
    row[0].level === 'jackHerer' ||
    row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to **BlueBerry** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 2500),
                        level: 'BlueBerry'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    }).catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

// PurpleKush

    if (message.content === '~weed upgrade PurpleKush' || message.content === '~weed upgrade purplekush') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 3000) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 3000`);
                } else if (
      row[0].level === 'BlueDream' ||
       row[0].level === 'OgKush' ||
     row[0].level === 'greenCrack' ||
     row[0].level === 'sourDiesel' ||
    row[0].level === 'jackHerer' ||
    row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **PurpleKush** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 3000),
                        level: 'PurpleKush'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    }).catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
          .catch(e => logger.error(e));
    }

// BlueDream

    if (message.content === '~weed upgrade BlueDream' || message.content === '~weed upgrade bluedream') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 7500) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 7500`);
                } else if (
       row[0].level === 'OgKush' ||
     row[0].level === 'greenCrack' ||
     row[0].level === 'sourDiesel' ||
    row[0].level === 'jackHerer' ||
    row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **BlueDream** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 7500),
                        level: 'BlueDream'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    }).catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

// OG kush

    if (message.content === '~weed upgrade OgKush' || message.content === '~weed upgrade ogkush' || message.content === '~weed upgrade og kush') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 10000) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 10,000`);
                } else if (
     row[0].level === 'greenCrack' ||
     row[0].level === 'sourDiesel' ||
    row[0].level === 'jackHerer' ||
    row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **OgKush** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 10000),
                        level: 'OgKush'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    }).catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

// GreenCrack

    if (message.content === '~weed upgrade greenCrack' || message.content === '~weed upgrade green crack' || message.content === '~weed upgrade greencrack') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 17500) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 17,500`);
                } else if (
   row[0].level === 'sourDiesel' ||
  row[0].level === 'jackHerer' ||
  row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **greenCrack** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 17500),
                        level: 'greenCrack'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    }).catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

// SourDiesel

    if (message.content === '~weed upgrade sourDiesel' || message.content === '~weed upgrade sour diesel' || message.content === '~weed upgrade sourdiesel') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 20000) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 20,000`);
                } else if (
  row[0].level === 'jackHerer' ||
  row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **sourDiesel** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 20000),
                        level: 'sourDiesel'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    })
                    .catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

// JackHerer

    if (message.content === '~weed upgrade jackHerer' || message.content === '~weed upgrade jackherer' || message.content === '~weed upgrade jack herer') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l[0]) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            if (l[0].agree === 'false') {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 25000) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 25,000`);
                } else if (
  row[0].level === 'lemonHaze') {
                    message.reply('You cant upgrade to a lower farm!');
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **jackHerer** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 25000),
                        level: 'jackHerer'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    })
                    .catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

// LemonHaze

    if (message.content === '~weed upgrade lemonHaze' || message.content === '~weed upgrade lemonhaze' || message.content === '~weed upgrade lemon haze') {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            if (!l) {
                return message.reply('Econ mod is not enabled for this server!');
            }
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!row[0]) {
                    await message.reply('You cant upgrade since you dont even have weed **YET**');
                } else if (row[0].money < 30000) {
                    await message.reply(`You do not have enough grams of weed **avaliable money:** ${row[0].money}$ / 30,000`);
                } else {
                    await message.reply(`**[UPGRADE]** Congrats ${message.author.username} You have just upgraded to the **lemonHaze** farm`);
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        money: (row[0].money - 25000),
                        level: 'lemonHaze'
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {

                    }).catch(e => logger.error(e));
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

  // Bank command.

    if (message.content.startsWith('~weed bank')) {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!l[0]) {
                    return message.reply('Econ mod is not enabled for this server!');
                }
                if (`${l[0].agree}` === 'false') {
                    return message.reply('Econ mode is not enabled for this server!');
                }
                if (!row[0]) {
                    message.reply('Hey you just started a bank account :leaves:');
                } else {
                    let gram;
                    if (row[0].weedamount > 999) {
                        gram = `${(row[0].weedamount / 1000)} **KG**`;
                    } else {
                        gram = `${row[0].weedamount} **Grams**`;
                    }
                    let smoke;
                    if (row[0].smokes === null) {
                        smoke = 0;
                    } else {
                        smoke = row[0].smokes;
                    }
                    let donations;
                    if (row[0].donations === null) {
                        donations = 0;
                    } else {
                        donations = row[0].donations;
                    }
                    if (row[0].level === 'PurpleKush') {
                        price = 3;
                    } else
                  if (row[0].level === 'BlueBerry') {
                      price = 4;
                  } else
                  if (row[0].level === 'BlueCheese') {
                      price = 2;
                  } else
                  if (row[0].level === 'BubbaKush') {
                      price = 1;
                  } else
                  if (row[0].level === 'BlueDream') {
                      price = 5;
                  } else
                  if (row[0].level === 'OgKush') {
                      price = 6;
                  } else
                  if (row[0].level === 'greenCrack') {
                      price = 12;
                  } else
                  if (row[0].level === 'sourDiesel') {
                      price = 20;
                  } else
                  if (row[0].level === 'jackHerer') {
                      price = 25;
                  } else
                  if (row[0].level === 'lemonHaze') {
                      price = 30;
                  }

                    const embed = new Discord.RichEmbed()
          .setAuthor(`💸${message.author.username}💸 Bank account inside ${message.guild.name}`)
          .addField('Bank info', `**Farm Level:** ${row[0].level}\n**Money:** ${row[0].money}$\n**Price per 1 gram** ${price}$\n**Weed:** ${gram}\n**Purchases:** SOON :tm:\n**Donations:** ${donations} Times!\n**Smokes:** ${smoke} Times`);
                    await message.channel.send({embed}).then(m => {
                        m.react('💸');
                        m.react('💰');
                        m.react('🤑');
                    }).catch(err => {
                        console.error(err);
                    });
                }
            }).catch(err => {
                console.error(err);
            });
        }).catch(err => {
            console.error(err);
        });
    }

  // Smoke command.

    if (message.content.startsWith('~weed smoke')) {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!l[0]) {
                    return message.reply('Econ mod is not enabled for this server!');
                }
                if (`${l[0].agree}` === 'false') {
                    return message.reply('Econ mode is not enabled for this server!');
                }
                if (`${row[0].weedamount}` < 15) {
                    await message.reply(`You dont have enough weed (Grams) to smoke! You need more ${15 - row[0].weedamount}Grams of weed! :leaves:`);
                } else {
                    await message.channel.send(`${message.author.username} Bought a cigarette -15 grams of weed`).then(msg => {
                        setTimeout(() => {
                            msg.edit('🚬');
                        }, 500);
                        setTimeout(() => {
                            msg.edit('🚬 ☁ ');
                        }, 1000);
                        setTimeout(() => {
                            msg.edit('🚬 ☁☁ ');
                        }, 1500);
                        setTimeout(() => {
                            msg.edit('🚬 ☁☁☁ ');
                        }, 2000);
                        setTimeout(() => {
                            msg.edit('🚬 ☁☁');
                        }, 2500);
                        setTimeout(() => {
                            msg.edit('🚬 ☁');
                        }, 3000);
                        setTimeout(() => {
                            msg.edit('🚬 ');
                        }, 3500);
                        setTimeout(() => {
                            msg.edit(`${message.author.username} Finished smoking`);
                        }, 4000);
                    });
                    knexDB.update({
                        userid: message.author.id,
                        guildid: message.guild.id,
                        smokes: (row[0].smokes + 1),
                        weedamount: (row[0].weedamount - 15)
                    }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {
                        logger.info(`${chalk.blue(message.author.username)}, Just bought a cigarette`);
                    });
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

  // Bet command

    if (message.content.startsWith('~weed bet')) {
        let num = Math.floor((Math.random() * 5) + 1);
        let final = num;
        let guess = message.content.split(' ')[2];
        let deposit = message.content.split(' ')[3];
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async l => {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (!l[0]) {
                    return message.reply('Econ mod is not enabled for this server!');
                }
                if (`${l[0].agree}` === 'false') {
                    return message.reply('Econ mode is not enabled for this server!');
                }
                if (!row[0]) {
                    message.reply('Hey, you dont even have weed to bet on!');
                } else {
                    if (!guess) {
                        return message.reply('Put a guessing number to bet on please! `EXAMPLE: ~betweed <1-5> <deposit amount>`');
                    }
                    if (isNaN(guess)) {
                        return message.reply('You must enter an actual guessing number `EXAMPLE: ~betweed <guessnumber> <deposit amount>`');
                    }
                    if (Number(guess) > 5) {
                        return message.reply('The number of the guess must be lower than 5. `EXAMPLE: ~betweed <guessnumber> <deposit amount>`');
                    }
                    if (Number(guess) < 1) {
                        return message.reply('The number of the guess must be greater than 1. `EXAMPLE: ~betweed <guessnumber> <deposit amount>`');
                    }
          // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (!deposit) {
                        return message.reply(`Put some weed grams to bet on please! avaliable weed: ${row[0].weedamount} Grams \`EXAMPLE: ~betweed <guessnumber> <deposit amount>\``);
                    }
                    if (deposit > row[0].weedamount) {
                        return message.reply(`You dont have ${deposit} Grams of weed`);
                    }
                    if (isNaN(deposit)) {
                        return message.reply('You must enter an actual number of weed `EXAMPLE: ~betweed <guessnumber> <deposit amount>`');
                    }
                    if (Number(guess) !== final) {
                        const embed = new Discord.RichEmbed()
            .addField('Bet Info:', `**Amount:** ${deposit} Grams\n**Multiplier:** 5x\n*BetStatus:* **[LOST]**\n**To The Bank:** **-**${deposit} Grams of weed!`);
                        await message.channel.send({embed}).then(m => m.react('❌')).catch(e => logger.error(e));
                        knexDB.update({
                            weedamount: (row[0].weedamount - deposit)
                        }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {
                        });
                    } else {
                        const embed = new Discord.RichEmbed()
            .addField('Bet Info:', `**Amount:** ${deposit} Grams\n**Multiplier:** 5x\n*BetStatus:* **[WIN]**\n**To The Bank:** **+**${deposit * 5} Grams of weed!`);
                        await message.channel.send({embed})
            .then(m => m.react('🏆'))
            .catch(e => logger.error(e));
                        knexDB.update({
                            weedamount: (row[0].weedamount + (5 * deposit))
                        }).into('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(() => {
                        });
            // Message.reply(`**[WIN]** GG I thought the house always wins... You just won ${deposit * 2} Grams of fresh WEED :leaves:`)
                    }
                }
            })
            .catch(e => logger.error(e));
        })
        .catch(e => logger.error(e));
    }

  // Donate command
  // TODO: return if row.level doesnt like the targets

  // if (message.content.startsWith("~weed donate")) {
  //   knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async(owner) => {
  //     let donateamount = message.content.split(" ")[3];
  //     let user = message.mentions.users.first();
  //     if (!owner[0]) return message.reply("Econ mode is not enable for this server!")
  //     if (owner[0].agree == "false") return message.reply("Econ mode is not enable for this server!")
  //
  //     knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async(l) => {
  //       if (`${owner[0].agree}` === "false") return message.reply("Econ mode is not enabled for this server!")
  //       if(!user) return message.reply("You must type the guy you want to donate to! `EXAMPLE: ~weed donate @theonlyartz#5743 15`");
  //         knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', user.id).then(async(row) => {
  //         if(!row[0]) return message.reply("The mentioned user doesnt have a bank account")
  //         if (!row[0]) return message.reply("The selected user do not have a bank account so it is impossible to donate him weed :leaves: he might do `~weed bank`");
  //         if (row[0].level != l[0].level) return message.reply("You do not have the same type of weed so you cant donate to each other");
  //         if (!l[0]) return message.reply("You dont have weed to donate, legit 0 weed!")
  //         if(donateamount > l[0].weedamount) return message.reply(`You dont have ${donateamount} weed in grams! Your weed = ${l[0].weedamount}Grams`);
  //         if(!donateamount) return message.reply(`How much Grams you want to donate to ${user.username}? \`EXAMPLE: ~weed donate @theonlyartz#5743 15\``);
  //         if (!l[0]) {
  //           knexDB.insert({
  //             guildid: message.guild.id,
  //             userid: message.author.id,
  //             weedamount: 0
  //           }).into('weedbank').where('guildid', message.guild.id).andWhere("userid", message.author.id).then(() => {
  //             console.log(`${message.author.username}, Just bought BlueCheese`);
  //           });
  //         } else {
  //           knexDB.update({
  //             weedamount: row[0].weedamount + donateamount
  //           }).into('weedbank').where('guildid', message.guild.id).andWhere("userid", user.id).then(() => {
  //             console.log(`${row[0].weedamount} total in ${user.username} account`);
  //           });
  //           knexDB.update({
  //             weedamount: l[0].weedamount - donateamount,
  //             donations: l[0].donations + 1
  //           }).into('weedbank').where('guildid', message.guild.id).andWhere("userid", message.author.id).then(() => {
  //             console.log(`${donateamount} was donated`);
  //           });
  //
  //           const embed = new Discord.RichEmbed()
  //           .addField("Donation Has Been made", `**Donator:** ${message.author.username}\n**Reciever:** ${user.username}\n**Amount:** **${donateamount}** Grams of weed!`);
  //           await message.channel.send({embed}).catch(console.error)
  //
  //         }
  //       });
  //     });
  //   });
  // }

  // top10 command

    if (message.content.startsWith('~weed top10')) {
        if (!message.content.split(' ').slice(1).join(' ').includes('global') && !message.content.split(' ').slice(1).join(' ').includes('server')) {
            return message.reply('Invalid arguement! Thats how to use TOP10: `~weed top10 server`\
       or replace server in `global` to see the global top10');
        }
        let stat;
        if (message.author.presence.status === 'offline') {
            stat = 0x000000;
        } else if (message.author.presence.status === 'online') {
            stat = 0x00AA4C;
        } else if (message.author.presence.status === 'dnd') {
            stat = 0x9C0000;
        } else if (message.author.presence.status === 'idle') {
            stat = 0xF7C035;
        }
        if (message.content.startsWith('~weed top10 server')) {
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async owner => {
                let co = 1;
                if (!owner[0]) {
                    return message.reply('Econ mode is not enable for this server!');
                }
                if (`${owner[0].agree}` === 'false') {
                    return message.reply('Econ mode is not enabled for this server!');
                }
                knexDB.from('weedbank').orderBy('weedamount', 'DESC').where('guildid', message.guild.id).limit(10).then(async top => {
                    const embed = new Discord.RichEmbed()
           .setTitle(`ArsBot official Economy system 2017 TOP 10 [10/${message.guild.memberCount}]`, client.user.DisplayAvatarURL)
           .setDescription(`
           ${top.map(c => `**${co++}.:leaves:${client.users.get(c.userid).username}** - **Farm Level:** ${c.level} - **Weed Amount:** ${c.weedamount.toFixed(2)}`).join('\n')}
           `)
           .setColor(stat)
           .setFooter(`TOP 10 for ${message.guild.name}`, message.guild.iconURL());
                    await message.channel.send({embed})
           .catch(e => logger.error(e));
                });
            });
        } else {
            knexDB.from('weedbank').orderBy('weedamount', 'DESC').limit(10).then(async o => {
               //
                let co = 1;
                const embed = new Discord.RichEmbed()
             .setTitle(`ArsBot official Economy system 2017 TOP 10 [10/10]`, client.user.DisplayAvatarURL)
             .setDescription(`
             ${o.map(c => `**${co++}.:leaves:${client.users.get(c.userid).username}** - **Farm Level:** ${c.level} - **Weed Amount:** ${c.weedamount.toFixed(2)}`).join('\n')}
             `)
             .setColor(stat)
             .setFooter(`TOP 10 globally`, client.user.DisplayAvatarURL);
                await message.channel.send({embed}).catch(e => logger.error(e));
            });
        }
    }

  // Help command

    if (message.content.startsWith('~weed help')) {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async owner => {
            if (!owner[0]) {
                return message.reply('Econ mode is not enable for this server!');
            }
            if (`${owner[0].agree}` === 'false') {
                return message.reply('Econ mode is not enabled for this server!');
            }
            await message.channel.send('Check your :inbox_tray: **Help Options** : WEEEEEEED');
            const economy = new Discord.RichEmbed()
     .addField('Economy Commands v5.1.5 UPDATED', '**~economy enable** `Server owner only` Enable economy mode!\n **~economy disable** `Server owner only` Disable economy mode\n**~weed sell** Sell your weed for money and buy new farms!\n**~weed bank** Shows you how much weed you have\n**~weed smoke** Smoke some weed for 15 grams\n **~weed bet** Guess number from 1-5 and bet one some weed price = 5x\n**~weed donate** Donate a mentioned user some weed. Poor little guy\n **~weed help** Shows you the economy commands')
     .addField('Farm Upgrading Commands v5.6.1 UPDATED', '**~weed upgrade menu** Shows you the `upgrading` menu including price and info\n**~weed upgrade <farmname>** Upgrade your farm to whatever you want')
     .setColor(27648);
            await message.author.send({embed: economy}).catch(e => logger.error(e));
        });
    }

  // Weed sell

    if (message.content.startsWith('~weed sell')) {
        knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.guild.ownerID).then(async owner => {
            if (!owner[0]) {
                return message.reply('Econ mode is not enabled for this server');
            }
            if (owner[0].agree === 'false') {
                return message.reply('Econ mode is not enabled for this server');
            }
            let amount = message.content.split(' ')[2];
            knexDB.from('weedbank').where('guildid', message.guild.id).andWhere('userid', message.author.id).then(async row => {
                if (row[0].level === 'PurpleKush') {
                    price = 3;
                } else
                if (row[0].level === 'BlueBerry') {
                    price = 2;
                } else
                if (row[0].level === 'BlueCheese') {
                    price = 1.5;
                } else
                if (row[0].level === 'BubbaKush') {
                    price = 0.5;
                } else
                if (row[0].level === 'BlueDream') {
                    price = 5;
                } else
                if (row[0].level === 'OgKush') {
                    price = 6;
                } else
                if (row[0].level === 'greenCrack') {
                    price = 12;
                } else
                if (row[0].level === 'sourDiesel') {
                    price = 20;
                } else
                if (row[0].level === 'jackHerer') {
                    price = 25;
                } else
                if (row[0].level === 'lemonHaze') {
                    price = 30;
                }

                if (!row[0]) {
                    return message.reply('We have opened you a bank account');
                }
                if (!amount) {
                    return message.reply('You must type weed amount to sell');
                }
                if (amount > row[0].weedamount) {
                    return message.reply(`You dont have that much weed, avaliable weed: ${row[0].weedamount} (grams)`);
                }
                knexDB.update({
                    weedamount: (row[0].weedamount - parseInt(amount, 10)),
                    money: row[0].money + (amount * price)
                }).into('weedbank').where('userid', message.author.id).andWhere('guildid', message.guild.id).then(() => {
                    const embed = new Discord.RichEmbed()
         .addField('Sell has beed made',
       `**amount of weed sold (grams):** ${amount}\n**Convert to money:** ${amount * price}$`);
                    message.channel.send({embed});
                });
            });
        });
    }
};
module.exports.help = {
    name: 'weed'
};
