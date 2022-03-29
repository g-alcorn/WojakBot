const { Client, Intents, ChannelManager } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

//Bot and client data setup
const BOT_COMMANDS = JSON.parse(fs.readFileSync('commands.json'));
const BOT_PREFIX = '!wojak';
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
    await validateMessage(msg)
      .then((data) => {
        console.log(`data: ${data}`)
        console.log('Command is valid, sending data')
        msg.reply({ content: data});
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

    if (options.length > 3) {
      throw new Error('Too many options selected')
    } else if (options.length === 1) {
      console.log('default option')
      return validateCommand('default');
    } else if(options.length === 2) {
      console.log('1 option')
      return validateCommand(options[1].toLowerCase());
    } else if ( options[1] === 'help') {
      //return a help message
    } else {
      return validateCommand([options[1].toLowerCase(), options[2].toLowerCase()]);
    }
    
  } else {
    throw new Error('Message did not start with !wojak');
  }
}

const validateCommand = async (command) => {
  if(Array.isArray(command) && command.length === 2 && BOT_COMMANDS[command[0]]) {
    console.log('response category and subcategory chosen')
    if(BOT_COMMANDS[command[0]][command[1]]) {
      return BOT_COMMANDS[command[0]][command[1]];
    } else {
      throw new Error(`Not found on the command list.`)
    }
  } else if(BOT_COMMANDS[command]) {
    console.log('response category chosen')
    return BOT_COMMANDS[command].default;
  } else if(command === 'default') {
    console.log('no category chosen, sending default')
    return BOT_COMMANDS.wojak.default;
  } else
    throw new Error(`Not found on the command list.`)
}
