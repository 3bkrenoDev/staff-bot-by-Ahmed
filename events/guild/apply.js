const Discord = require('discord.js');
const ModuleApply = require("../../DataBase/models/applying.js")
var guildModel = require("../../DataBase/models/guild.js")
function removeObj(data, obj) {
  data?.applies?.splice(data.applies.indexOf(obj), 1)
  data?.save()
}
module.exports = {
  name: 'interactionCreate',
  run: async (interaction, client) => {
    if (
      !interaction.isButton() ||
      !interaction.customId?.startsWith("accept-") &&
      !interaction.customId?.startsWith("refuse-")
    ) return;
    let data = await ModuleApply.findOne({
      guildID: interaction.guild.id,
    })
    if (!data || !data.admin_role) return interaction.reply({ content: `**🙄 - I can't find the blacklist role in the server, please reset it.**`, ephemeral: true })
    let admin = interaction.member.roles.cache.has(data.admin_role)
    if (!admin) return interaction.reply({ content: `**🙄 - You aren't admin.**`, ephemeral: true })
    let memberId = interaction.customId.split("-")[1]
    let guildData = await guildModel.findOne({
      guildID: interaction.guild.id,
    })
    let role = interaction.guild.roles.cache.get(guildData?.staffRole)
    if (!guildData || !role) return interaction.reply({ content: "**🙄 - I can't find staff role.**", ephemeral: true })
    let member = interaction.guild.members.cache.get(memberId)
    let obj = data.applies.find(c => c === memberId)
    if (!member) {
      if (obj) {
        removeObj(data, obj)
      }
      return interaction.reply({ content: "**🙄 - I can't found the member in the server.**", ephemeral: true })
    }
    if (!data.applies.length) return interaction.reply({ content: "**🙄 - i can't found any members in applies list.**", ephemeral: true })
    if (member.roles.cache.has(role?.id)) {
      if (obj) {
        removeObj(data, obj)
      }
      return interaction.reply({ content: `**🙄 - he is already a staff.**`, ephemeral: true })
    }
    if (!obj) return interaction.reply({ content: "**🙄 - i can't found the member in applies list.**", ephemeral: true })
    if (interaction.customId.startsWith("accept")) {
      if (role.position >= interaction.guild.me.roles.highest.position) return interaction.reply({ content: "**🙄 - Staff role higher than my role.**", ephemeral: true })
      if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: "**🙄 - Staff role higher than my role.**", ephemeral: true })
      member.roles.add(role.id).catch(e => 0)
      removeObj(data, obj)
      send_log("accepted")
      await edit_message(interaction, member, "Accepted")
      return interaction.reply({ content: "**✅ - Done added to staff team.**", ephemeral: true })
    }
    else {
      removeObj(data, obj)
      send_log("refused")
      await edit_message(interaction, member, "Refused")
      return interaction.reply({ content: "**✅ - Done refused.**", ephemeral: true })
    }
    function send_log(type) {
      let log = client.channels.cache.get(data.log_channel)
      if (!log) return;
      let embed = new Discord.MessageEmbed()
        .setTitle(`Apply ${type}`)
        .addField(`Admin`, `${interaction.member} ( ${interaction.member.id} )`)
        .addField(`member`, `${member} ( ${member.id} )`)
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL()
        })
      return log?.send({ embeds: [embed] })
    }
    async function edit_message(interaction, member, type) {
      await interaction.message.edit({
        content: `${member} ${type}!`,
        embeds: interaction.message.embeds,
        components: []
      }).catch(err => 0)
    }
  }
}