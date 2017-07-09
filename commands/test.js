module.exports.run = (client, message) => {
    const knexDB = require('knex')({
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'roosdgt',
            database: 'arsbot'
        }
    });
    console.log(knexDB);
};
module.exports.help = {
    name: 'test'
};
