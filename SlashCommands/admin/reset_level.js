const Discord = require('discord.js');
module.exports = {
  name: `reset_level`,
  description: 'Reset staff member level.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "user",
      type: "USER",
      description: "Target to reset level.",
      required: true
    },
  ],
  cooldown: 10,
  onlyAdmins:true,
  run: async (client, interaction, data) => {
    let member = interaction.options.getMember("user")
    if (!member) return interaction.reply(`**🙄 - I can't find this member.**`);
    let obj = data.staff.find(c => c.userId === member.id)
    if (!obj) return interaction.reply(`**🙄 - I can't find this member in my database.**`);
    data.staff.splice(data.staff.indexOf(obj), 1)
    data.save()
    interaction.reply(`**✅ - Reseted the level for ${member}.**`)
  }
}