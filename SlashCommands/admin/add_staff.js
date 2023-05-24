const Discord = require('discord.js');
module.exports = {
  name: `add_staff`,
  description: 'Add member to staff team.',
  type: 'CHAT_INPUT',
  cooldown: 10,
  options: [
    {
      name: "user",
      type: "USER",
      description: "target to add to staff team",
      required: true
    },
  ],
  onlyAdmins:true,
  run: async (client, interaction, data) => {
    let role = interaction.guild.roles.cache.get(data?.staffRole)
    if (!role) return;
    let member = interaction.options.getMember("user")
    if (!member) return interaction.reply(`**🙄 - I can't find this member.**`);
    let staffRole = member.roles.cache.find(c => c.id === role?.id)
    if (staffRole) return interaction.reply({ content: `**🙄 - Member has the staff role already.**`, ephemeral: true })
    member.roles.add(role.id).catch(err => 0)
    interaction.reply(`**✅ - added staff role to @${member.user.username}.**`)
  }
}