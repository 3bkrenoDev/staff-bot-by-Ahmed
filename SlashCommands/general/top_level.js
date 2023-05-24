const { MessageEmbed } = require("discord.js")

module.exports = {
  name: `top_level`,
  description: 'See top 10 in levels in the server.',
  type: 'CHAT_INPUT',
  cooldown: 10,
  onlyStaff:true,
  run: async (client, interaction, data) => {
    let sorted = data.staff.sort((a, b) => b.level - a.level || b.xp - a.xp).slice(0, 10).map((c, i) => `#${++i} I <@!${c.userId}> level [\`${c.level}\`] xp [\`${c.xp}\`] ${i === 1 ? " 🎖️" : ""}`);
    let embed = new MessageEmbed()
      .setAuthor({
        name: `Top 10 in levels in the server`
      })
      .setDescription(`**${sorted.join("\n")}**`)
      .setColor("BLACK")
      .setFooter({
        text: client.user.username,
        iconURL: client.user.avatarURL()
      })
    return interaction.reply({ embeds: [embed] })
  }
}