const Discord = require('discord.js');
const fs = require('fs');

exports.run = (client, message) => {
    if (message.author.id !== '208936898566160384') {
        return message.channel.send(`\`📛\` ${message.author} You don't have permissions to execute that command.`);
    }

    function clean(text) {
        if (typeof (text) === 'string') {
            return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
        }
        return text;
    }
    let args = message.content.split(' ').slice(1);
    let cont = message.content.split(' ').slice(1).join(' ');
    const up = client.emojis.get('231822389183381506');
    const heart = client.emojis.get(`244906721741504522`);
    const down = client.emojis.get('233238290868862976');
    message.channel.send('Evaluating...').then(msg => {
        try {
            let code = args.join(' ');
            let evaled = eval(code);

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled);
            }
            if (evaled.length > 2000) {
                try {
                    let evalcode1 = new Discord.RichEmbed()
            .setAuthor(`Eval by ${message.author.tag}`, `https://cdn.discordapp.com/emojis/314405560701419520.png`)
            .setDescription(`**${up}Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
            .addField(`\u200b`, `**${heart}Output:**\n\n\`\`\`Output too long, logged to ${__dirname}\\eval.txt\`\`\``, true)
            .setColor(0x00FF00)
            .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms`, `https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwczovL2Euc2FmZS5tb2UvVUJFVWwucG5nIn0.LbWCXwiUul3udoS7s20IJYW8xus`);
                    msg.edit({
                        embed: evalcode1
                    });
                    return fs.writeFile(`eval.txt`, `${clean(evaled)}`);
                } catch (err) {
                    let errorcode1 = new Discord.RichEmbed()
            .setAuthor(`Eval by ${message.author.tag}`, `https://cdn.discordapp.com/emojis/314405560701419520.png`)
            .setDescription(`**${up}Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
            .addField(`\u200b`, `**${down}Output:**\n\n\`\`\`js\nOutput too long, logged to ${__dirname}\\eval.txt\`\`\``, true)
            .setColor(0xFF0000)
            .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms `, `https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwczovL2Euc2FmZS5tb2UvVUJFVWwucG5nIn0.LbWCXwiUul3udoS7s20IJYW8xus`);
                    msg.edit({
                        embed: errorcode1
                    });
                    return fs.writeFile(`eval.txt`, `${clean(err)}`);
                }
            }
            let evalcode = new Discord.RichEmbed()
        .setAuthor(`Eval by ${message.author.tag}`, `https://cdn.discordapp.com/emojis/314405560701419520.png`)
        .setDescription(`**:rofl: Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
        .addField(`\u200b`, `** :rofl: Output:**\n\n\`\`\`js\n${clean(evaled)}\`\`\``, true)
        .setColor(0x00FF00)
        .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms`, `https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwczovL2Euc2FmZS5tb2UvVUJFVWwucG5nIn0.LbWCXwiUul3udoS7s20IJYW8xus`);
            msg.edit({
                embed: evalcode
            }).catch(console.error);
        } catch (err) {
            let errorcode = new Discord.RichEmbed()
        .setAuthor(`Eval by ${message.author.tag}`, `https://cdn.discordapp.com/emojis/314405560701419520.png`)
        .setDescription(`**:rofl: Input:**\n\n\`\`\`js\n${cont}\`\`\``, true)
        .addField(`\u200b`, `**:rofl:Output:**\`\`\`js\n${clean(err)}\`\`\``, true)
        .setColor(0xFF0000)
        .setFooter(`Node.js - Time taken: ${Date.now() - message.createdTimestamp} `, `https://images-ext-2.discordapp.net/eyJ1cmwiOiJodHRwczovL2Euc2FmZS5tb2UvVUJFVWwucG5nIn0.LbWCXwiUul3udoS7s20IJYW8xus`);
            msg.edit({
                embed: errorcode
            }).catch(console.error);
        }
    });
};

module.exports.help = {
    name: 'eval'
};
