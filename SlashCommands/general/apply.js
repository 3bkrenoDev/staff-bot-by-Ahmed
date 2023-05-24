const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/applying.js")
const { Modal, TextInputComponent, showModal, SelectMenuComponent } = require('discord-modals');
module.exports = {
  name: `apply`,
  description: 'Apply for staff role',
  type: 'CHAT_INPUT',
  botperms: ["EMBED_LINKS"],
  // cooldown:5,
  run: async (client, interaction, guildData) => {
    if (interaction.member.roles.cache.has(guildData.staffRole)) return interaction.reply(`**🙄 - You are already a staff.**`)
    let data = await Module.findOne({
      guildID: interaction.guild.id,
    })
    if (!data) return;
    if (!data.toggle) return interaction.reply(`**🙄 - The applying is closed.**`);
    if (data.applies.includes(interaction.user.id)) return interaction.reply(`**🙄 - You already have a applied.**`);
    let arr = data.questions;
    var _0x7156 = ["\x73\x65\x74\x52\x65\x71\x75\x69\x72\x65\x64", "\x61\x6E\x73\x77\x65\x72", "\x73\x65\x74\x50\x6C\x61\x63\x65\x68\x6F\x6C\x64\x65\x72", "\x73\x65\x74\x4D\x61\x78\x4C\x65\x6E\x67\x74\x68", "\x53\x48\x4F\x52\x54", "\x73\x65\x74\x53\x74\x79\x6C\x65", "\x73\x65\x74\x4C\x61\x62\x65\x6C", "\x73\x65\x74\x43\x75\x73\x74\x6F\x6D\x49\x64", "\x6D\x61\x70", "\x61\x64\x64\x43\x6F\x6D\x70\x6F\x6E\x65\x6E\x74\x73", "\x61\x70\x70\x6C\x79", "\x73\x65\x74\x54\x69\x74\x6C\x65"]; let components = arr[_0x7156[8]]((_0xe4b2x2, _0xe4b2x3) => { return new TextInputComponent()[_0x7156[7]](_0xe4b2x3.toString())[_0x7156[6]](_0xe4b2x2)[_0x7156[5]](_0x7156[4])[_0x7156[3]](100)[_0x7156[2]](_0x7156[1])[_0x7156[0]](true) }); const modal = new Modal()[_0x7156[7]](_0x7156[10])[_0x7156[11]](_0x7156[10])[_0x7156[9]](components); showModal(modal, { client, interaction })
  }
}