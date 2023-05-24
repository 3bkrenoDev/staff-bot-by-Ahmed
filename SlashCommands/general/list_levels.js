const { MessageEmbed } = require("discord.js")
let { splitMessage } = require("../../Functions/utils.js")

module.exports = {
  name: `list_levels`,
  description: `See server's levels.`,
  type: 'CHAT_INPUT',
  cooldown: 10,
  onlyStaff:true,
  run: async (client, interaction, data) => {
    let test = data.upgradeRoles
    let forSave = []
    test.forEach(c => {
      let roles = c.roles.filter(c => interaction.guild.roles.cache.get(c))
      forSave.push({ level: c.level, roles: roles })
    })
    data.upgradeRoles = forSave
    await data.save()
    forSave = forSave.map(m => {
      let roles = m.roles.filter(c => interaction.guild.roles.cache.get(c)).map(c => `\`${interaction.guild.roles.cache.get(c).name}\``)
      return `Level required: ${m.level}\n For Role: ${roles.join(", ")}`
    })
    let split = splitMessage(`${forSave.length ? forSave.join("\n") : "None."}`, {
      char: "\n",
      maxLength: 1950
    })
    split.map((s, i) => {
      let embed = new MessageEmbed()
        .setDescription(`**${s}**`)
      i == 0 ? interaction.reply({
        embeds: [embed.setTitle(`The levels in this server (${forSave.length}):`)]
      }).catch(err => 0) :
        interaction.channel.send({ embeds: [embed.setTitle(``)] }).catch(err => 0)
    })
  }
}