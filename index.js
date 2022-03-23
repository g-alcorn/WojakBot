



const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('Client#MessageCreate', (msg) => {
  console.log('message received');

  msg.send('Hello World')
    .then(() => {console.log('message sent')})
    .catch((e) => {console.log(e)})
});

client.login(process.env.TOKEN);
