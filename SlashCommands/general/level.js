const Discord = require('discord.js');
const Canvas = require('canvas');
const editor = require("editor-canvas");
const { createLevelCanvas } = require('../../Functions/utils.js')
module.exports = {
  name: `level`,
  description: 'See your/member level.',
  type: 'CHAT_INPUT',
  options: [
    {
      name: "user",
      type: "USER",
      description: "Target to see level",
    },
  ],
  cooldown: 10,
  onlyStaff:true,
  run: async (client, interaction, data) => {
    let member = interaction.options.getMember("user") || interaction.member
    let staffRole = member.roles.cache.find(c => c.id === data.staffRole)
    if (!staffRole) return interaction.reply({ content: `**🙄 - ${member.id === interaction.user.id ? `You aren't staff` : "This Member isn't staff"}**`, ephemeral: true })
    let userData = data.staff.find(c => c.userId === member.id)
    if (!userData) return interaction.reply(`**🙄 - I can't find ${member.id === interaction.user.id ? "you" : "this member"} in my database.**`);
    let level = userData.level
    let xp = userData.xp
    let xpNeed = level * data.xpPerLevel;
    let xpNeeed = xpNeed - xp
    let levelImage = await createLevelCanvas(member, xp, xpNeed, level, xpNeeed)
    let attachment = new Discord.MessageAttachment(levelImage.toBuffer(), 'profile-image.png');
    interaction.reply({ files: [attachment] })
  }
}