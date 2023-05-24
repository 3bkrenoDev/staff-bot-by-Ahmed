const Discord = require('discord.js');
const ModuleApply = require("../../DataBase/models/applying.js")
module.exports = {
  name: 'modalSubmit',
  run: async (modal, client) => {
    if (modal.customId === 'apply') {
      let data = await ModuleApply.findOne({
        guildID: modal.guildId,
      })
      let applies_channel = client.channels.cache.get(data?.applies_channel)
      if (!data || !data.toggle || !applies_channel) return modal.reply(`**🙄 - The applying is closed.**`);
      let embed = new Discord.MessageEmbed()
        .setAuthor({
          name: modal.member.guild.name,
          iconURL: modal.member.guild.iconURL()
        })
        .setFooter({
          text: modal.user.username,
          iconURL: modal.user.avatarURL()
        })
      modal.components.forEach((c, i) => {
        embed.addField(data.questions
        [Number(c.components[0].customId)],
          c.components[0].value, true)
      })
      modal.reply(`**✅ - Your apply has been sent.**`);
      let button = new Discord.MessageActionRow()
        .addComponents(
          new Discord.MessageButton()
            .setCustomId('accept-' + modal.user.id)
            .setStyle('SUCCESS')
            .setLabel('accept'),
          new Discord.MessageButton()
            .setCustomId('refuse-' + modal.user.id)
            .setStyle('DANGER')
            .setLabel('refuse'),
        );
      data.applies.push(modal.user.id)
      data.save()
      applies_channel?.send({
        content: `${modal.user}`,
        embeds: [embed],
        components: [button]
      }).catch(e => 0)
    }
  }
}