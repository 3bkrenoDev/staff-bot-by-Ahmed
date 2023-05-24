const { MessageEmbed } = require("discord.js")

module.exports = {
  name: `ping`,
  description: 'Test the bots response time.',
  type: 'CHAT_INPUT',
  cooldown: 10,
  run: async (client, interaction) => {
    interaction.reply({
      content: `Websocket: \`${client.ws.ping}\`ms`
    }).catch(err => 0)
  }
}