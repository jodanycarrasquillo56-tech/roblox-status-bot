require("dotenv").config();

const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const CHANNEL_ID = "1440278213720018945";
const UNIVERSE_ID = "9181902659";

let messageId = null;

async function updateStatus() {
  try {
    const res = await axios.get(
      `https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID}`
    );

    const game = res.data.data[0];
    if (!game) {
      console.log("❌ No se encontró el juego");
      return;
    }

const embed = new EmbedBuilder()
  .setColor(0x00ff00)
  .setTitle("🌴 Roblox Game Status 🌴")
  .setDescription("**💥 OG Puerto Rico RP 💥**")
  .setThumbnail("https://cdn.discordapp.com/attachments/1368012469473247315/1480058487194259619/content.png?ex=69ae4b61&is=69acf9e1&hm=8d2e10fe828a85d200f945998cb8a96810164b383ca5aec948671b3f1e0ab198&")
  .addFields(
    { name: "👤 Activos", value: String(game.playing), inline: true },
    { name: "👁️ Visitas", value: String(game.visits), inline: true },
    { name: "🧍 Máx jugadores", value: String(game.maxPlayers), inline: true }
  )
  .setFooter({ text: "⏱️ Actualizado automáticamente" });


    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!messageId) {
      const msg = await channel.send({ embeds: [embed] });
      messageId = msg.id;
    } else {
      const msg = await channel.messages.fetch(messageId);
      await msg.edit({ embeds: [embed] });
    }

    console.log("📊 Status actualizado");
  } catch (err) {
    console.log("❌ ERROR ROBLOX:", err.message);
  }
}

client.once("ready", () => {
  console.log("🤖 Bot listo");
  updateStatus();
  setInterval(updateStatus, 30000);
});

client.login(process.env.TOKEN);
