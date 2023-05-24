const Discord = require('discord.js');
const { splitMessage } = require("../../Functions/utils.js");
module.exports = {
  name: `check_online`,
  description: "show the staff members that online right now",
  type: 'CHAT_INPUT',
  cooldown: 10,
  onlyAdmins:true,
  run: async (client, interaction, data) => {
    let role = interaction.guild.roles.cache.get(data.staffRole)
    if (!role) return interaction.reply(`**🙄 - I can't find the staff role in the server, please reset it.**`);
    let size = role.members.filter(c => c.presence?.status && c.presence?.status !== "offline").map(c => c).map((c, i) => `${++i} - ${c}`)
    let split = splitMessage(`${size.length ? size.join("\n") : "None."}`, {
      char: "\n",
      maxLength: 1950
    })
    split.map((s, i) => {
      let embed = new Discord.MessageEmbed()
        .setDescription(`**${s}**`)
      i == 0 ? interaction.reply({
        embeds: [embed.setTitle(`The staff members that online right now (${size.length}):`)]
      }).catch(err => 0) :
        interaction.channel.send({ embeds: [embed.setTitle(``)] }).catch(err => 0)
    })
  }
}