const Discord = require('discord.js');
module.exports = {
  name: `blacklist`,
  description: 'Blacklist staff team.',
  type: 'CHAT_INPUT',
  cooldown: 10,
  options: [
    {
      name: "user",
      type: "USER",
      description: "target to blacklist.",
      required: true
    },
  ],
  onlyAdmins:true,
  run: async (client, interaction, data) => {
    let role = interaction.guild.roles.cache.get(data.blacklistRole)
    if (!role) return interaction.reply(`**🙄 - I can't find the blacklist role in the server, please reset it.**`)
    let member = interaction.options.getMember("user")
    if (!member) return interaction.reply(`**🙄 - I can't find this member.**`);
    let staffRole = member.roles.cache.find(c => c.id === data.staffRole)
    if (!staffRole) return interaction.reply({ content: "**🙄 - This Member isn't staff**", ephemeral: true })
    member.roles.cache.filter(r => !r.managed
      && r.position < member.guild.me.roles.highest.position
      && r.id !== member.guild.id
    ).forEach(role => {
      member.roles.remove(role).catch(_ => 0)
    })
    member.roles
      .add(data.blacklistedRole).then(_ => {
        interaction.reply(`**✅ - Added blacklist role to @${member.user.username} and i removed all roles that i can to remove from him .**`).catch(_ => 0)
      }).catch(_ => {
        interaction.reply(`**🙄 - i can't add blacklist role to @${member.user.username}.**`).catch(_ => 0)
      })

  }
}