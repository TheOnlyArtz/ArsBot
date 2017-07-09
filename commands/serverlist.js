exports.run = function(client, message) {
  var Table = require(`cli-table`); var table = new Table({head: [`ID`, `Name`, `Users`, `Bots`, `Total`], colWidths: [30, 50, 10, 10, 10]}); client.guilds.map(g => table.push([g.id, g.name, g.members.filter(u => !u.user.bot).size, g.members.filter(u => u.user.bot).size, g.members.size])); require(`snekfetch`).post(`https://hastebin.com/documents`).set(`Content-Type`, `application/raw`).send(table.toString()).then(r => message.channel.send(`Im inside these servers! http://hastebin.com/`+r.body.key))

};
module.exports.help = {
  name: "serverlist"
}
