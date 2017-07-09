exports.run = (client, message) => {
  let guild = message.guild;
  message.delete();
  if(!message.guild.member(message.author).hasPermission("CREATE_INSTANT_INVITE"))
    return message.reply("OOPS you need permissions to `CREATE_INVITE`").catch(console.error);
  guild.defaultChannel.createInvite({
    maxAge: 0
  }).then((invite) => {
    message.channel.send(`**PERMANT LINK** \n http://discord.gg/${invite.code}`);
  });
};
module.exports.help = {
  name: "createinvite"
}
