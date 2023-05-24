const Discord = require('discord.js');
const Module = require("../../DataBase/models/guild.js")
module.exports = {
  name: `add_level`,
  description: 'Add Level/Xp to staff.',
  type: 'CHAT_INPUT',
  cooldown: 10,
  options: [
    {
      name: "user",
      type: "USER",
      description: "target to add Level/Xp to.",
      required: true
    },
    {
      name: "level",
      type: "INTEGER",
      description: "Level to add.",
      required: false
    },
    {
      name: "xp",
      type: "INTEGER",
      description: "Xp to add.",
      required: false
    },
  ],
  onlyAdmins:true,
  run: async (client, interaction, data) => {
    let member = interaction.options.getMember("user")
    let level = interaction.options.getInteger("level")
    let xp = interaction.options.getInteger("xp")
    if (!member) return interaction.reply(`**🙄 - I can't find this member.**`);
    let staffRole = member.roles.cache.find(c => c.id === data.staffRole)
    if (!staffRole) return interaction.reply({ content: "**🙄 - This Member isn't staff**", ephemeral: true })
    if (!level && !xp) return interaction.reply({ content: "**🙄 - You must type anything at least.**", ephemeral: true })
    let userData = data.staff.find(c => c.userId === member.id)
    if (!userData) {
      userData = {
        userId: member.id,
        level: level || 1,
        xp: xp || 0
      }
      data.staff.push(userData)
      data.save()
    }
    else {
      if (level) userData.level = level
      if (xp) userData.xp = xp
      data.staff[data.staff.indexOf(userData)] = userData
      await Module.findOneAndUpdate(
        { guildID: interaction.guild.id },
        { staff: data.staff }
      )
    }
    return interaction.reply(`**✅ - @${member.user.username}\nnow level: ${userData.level}\nXp: ${userData.xp}.**`)
  }
}