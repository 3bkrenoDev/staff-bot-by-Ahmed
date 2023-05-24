const Discord = require('discord.js');
const { splitMessage } = require("../../Functions/utils.js");
module.exports = {
  name: `check_levels`,
  description: "show the staff members that haven't required level.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "level",
      type: "INTEGER",
      description: "The required level to show.",
      required: true
    },
  ],
  cooldown: 10,
  onlyAdmins:true,
  run: async (client, interaction, data) => {
    let level = interaction.options.getInteger("level")
    let size = data.staff.filter(c => c.level < level).map((c, i) => `#${++i} - <@!${c.userId}> : ${c.level}`)
    let split = splitMessage(`${size.length ? size.join("\n") : "None."}`, {
      char: "\n",
      maxLength: 1950
    })
    split.map((s, i) => {
      let embed = new Discord.MessageEmbed()
        .setDescription(`**${s}**`)

      i == 0 ? interaction.reply({ embeds: [embed.setTitle(`The staff members that their level less than (${level}):`)] }).catch(err => 0) :
        interaction.channel.send({ embeds: [embed.setTitle(``)] }).catch(err => 0)
    })
  }
}