const { Client, Intents, ChannelManager } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const BOT_INTENTS = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_WEBHOOKS
]);
const client = new Client({ intents: BOT_INTENTS });
//const channelMgr = new ChannelManager();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  // const channel = await (client.channels.cache.get(process.env.GUILD_ID));
  // //console.log(channel)
  // //await channel.send('content');  
  // const user = await client.users.fetch('id');
  // user.send('content');
  //console.log(client.channels.cache)
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'wojak') {
    await interaction.reply('yo!');
    interaction.followUp('asdf')
    await interaction.user.send('hello')
  } else {
    await interaction.reply(`Sorry, didn't understand that`);
  }
  

});

client.on('messageCreate', async (msg) => {
  await msg.reply({ content: 'content', allowedMentions: { repliedUser: false }})
  //msg.channel.send('response');
  console.log('msg received');
});

client.login(process.env.TOKEN);
