const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const CHANNEL_ID = '1506426450247680001';
const KEEP_MESSAGE_ID = '1506481437761736789';

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // Startup sweep — delete anything that snuck in while bot was offline
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    const messages = await channel.messages.fetch({ limit: 100 });
    for (const [id, msg] of messages) {
      if (id !== KEEP_MESSAGE_ID) {
        await msg.delete().catch(() => {});
      }
    }
    console.log('Startup sweep complete');
  } catch (err) {
    console.error('Sweep error:', err);
  }
});

client.on('messageCreate', async (message) => {
  if (message.channel.id !== CHANNEL_ID) return;
  if (message.id === KEEP_MESSAGE_ID) return;

  setTimeout(async () => {
    try {
      await message.delete();
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, 1500);
});

client.login(process.env.BOT_TOKEN);