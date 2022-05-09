const { Client, Intents, ChannelManager } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

//Bot and client data setup
const BOT_COMMANDS = JSON.parse(fs.readFileSync('commands.json'));
const BOT_HELP = fs.readFileSync('help.txt').toString();
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
    await interaction.reply(BOT_COMMANDS.wojak.default);
  } else {
    return;
  }
});

// Event listener for messages sent within server
client.on('messageCreate', async (msg) => {
  if (!isBotMessage(msg)) {
    await validateMessage(msg)
      .then((data) => {
        // Executed when valid command has been sent
        // data is the image URL

        // Manage help requests
        if(data === 'help') {
          msg.author.send(BOT_HELP);
        } else if (data) {
          // Serve the meme
          msg.reply({ content: data});
        }
      })
      .catch((e) => {
        console.log(`invalid command received: ${e.message}`);
      });
  }
});

const isBotMessage = (msg) => {
  // Returns true when message is sent by a bot
  // Returns false when message is sent by a human
  if (msg.webhookId || msg.author.bot) 
    return true;
  else
    return false;
}

const validateMessage = async (msg) => {
  //Returns true when command is correctly formatted
  if (msg.content.startsWith(BOT_PREFIX)) {
    //Command initiator is correct; let's check what type of wojak to send
    const options = msg.content.split(' ');
    
    if (options.length > 3) {
      throw new Error('Too many options selected')
    } else if (options.length === 1) {
      // Default selected
      return validateCommand('default');
    } else if (options.length === 2 && options[1] !== 'help') {
      // Category chosen but not subcategory
      return validateCommand(options[1].toLowerCase());
    } else if (options.length === 2 && options[1] === 'help') {
      // Help message selected
      return options[1];
    } else if (options.length === 3) {
      // Category and subcategory chosen
      return validateCommand([options[1].toLowerCase(), options[2].toLowerCase()]);
    }
  } else {
    // Message was not a command
    return false;
  }
}

const validateCommand = async (command) => {
  if(Array.isArray(command) && command.length === 2 && BOT_COMMANDS[command[0]]) {
    // Category and subcategory are chosen
    if (BOT_COMMANDS[command[0]][command[1]]) {
      return BOT_COMMANDS[command[0]][command[1]];
    } else {
      throw new Error(`Not found on the command list.`)
    }
  } else if (BOT_COMMANDS[command]) {
    // Category is chosen but not subcategory - send default for category
    return BOT_COMMANDS[command].default;
  } else if (command === 'default') {
    // No category is chosen - send global default
    return BOT_COMMANDS.wojak.default;
  } else
    throw new Error(`Not found on the command list.`)
}
