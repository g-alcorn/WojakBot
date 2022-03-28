const { Client, Intents, ChannelManager } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

//Bot and client data setup
const BOT_COMMANDS = JSON.parse(fs.readFileSync('commands.json'));
const BOT_PREFIX = '!wojak';
const VALID_LIST = `Valid commands are 'wojak', 'soy', 'doomer', 'gigachad', 'chad', 'virgin'`;
const BOT_INTENTS = new Intents([
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_WEBHOOKS
]);

//Client setup and login
const client = new Client({ intents: BOT_INTENTS });
client.login(process.env.TOKEN);

//Confirm login on console
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag} at ${Date()}`);
});

//Respond to slash command
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) 
    return;
  if (interaction.commandName === 'wojak') {
    await interaction.reply('yo!');
  } else {
    return;
  }  
});

//Event listener for messages sent within server
client.on('messageCreate', async (msg) => {
  if (!isBotMessage(msg)) {
    console.log('human msg received');
    await validateMessage(msg)
      .then((data) => {
        console.log(`data: ${data}`)
        console.log('valid command received')    
        msg.reply({ content: 'valid command received'});
      })
      .catch((e) => {
        console.log(`invalid command received: ${e.message}`);
      });
  }
});

const isBotMessage = (msg) => {
  //Returns false when message is sent by human
  if (msg.webhookId || msg.author.bot) 
    return true;
  else
    return false;
}

const validateMessage = async (msg) => {
  //Returns true when command is correctly formatted
  if (msg.content.startsWith(BOT_PREFIX)) {
    //Command initiator is correct; let's check what type of wojak to send
    const options = msg.content.split(' ')

    if (options.length > 2) {
      throw new Error('Too many options selected')
    } else if ( options[1] === 'help'){
      return VALID_LIST;
    } else {
      return validateCommand(options[1].toLowerCase());
    }
    
  } else {
    throw new Error('Message did not start with !wojak');
  }
}

const validateCommand = async (command) => {
  if(BOT_COMMANDS[command]) {
    return command;
  } else
    throw new Error(`Not found on the command list. \n${VALID_LIST}`)
}
