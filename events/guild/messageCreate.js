const Discord = require('discord.js');
var Module = require("../../DataBase/models/guild.js")
module.exports = {
  name: 'messageCreate',
  run: async (message, client) => {
    if (message.author.bot || message.webhookId || !message.guild) return;
    let guildData = await Module.findOne({ GuildID: message.guild.id })
    if (!guildData) return;
    let blacklist = message.member.roles.cache.find(c => c.id === guildData.blacklistRole)
    let staff = message.member.roles.cache.find(c => c.id === guildData.staffRole)
    if (blacklist || !staff) return;
    let data = guildData.staff.find(c => c.userId === message.author.id)
    if (!data) {
      data = {
        userId: message.author.id,
        xp: 0,
        level: 1
      }
      guildData.staff.push(data)
    }
    let randomXp = Math.floor(Math.random() * guildData.xpPerMessage);
    data.xp += randomXp
    let xpNeed = data.level * guildData.xpPerLevel;
    var _0xe8ae = ["\x78\x70", "\x6C\x65\x76\x65\x6C", "\x75\x70\x67\x72\x61\x64\x65\x52\x6F\x6C\x65\x73", "\x63\x68\x61\x6E\x6E\x65\x6C", "\x63\x6F\x6E\x67\x72\x61\x74\x75\x6C\x61\x74\x69\x6F\x6E", "\x67\x65\x74", "\x63\x61\x63\x68\x65", "\x63\x68\x61\x6E\x6E\x65\x6C\x73", "\x67\x75\x69\x6C\x64", "\x66\x69\x6C\x74\x65\x72", "\x6C\x65\x6E\x67\x74\x68", "\x72\x6F\x6C\x65\x73", "\x63\x61\x74\x63\x68", "\x61\x64\x64", "\x6D\x65\x6D\x62\x65\x72", "\x66\x6F\x72\x45\x61\x63\x68", "\x5C\x60", "\x6E\x61\x6D\x65", "\x6D\x61\x70", "\x6C\x69\x6E\x65", "\x73\x65\x6E\x64", "\x74\x68\x65\x6E", "\x5B\x72\x6F\x6C\x65\x73\x5D", "\x2C\x20", "\x6A\x6F\x69\x6E", "\x72\x65\x70\x6C\x61\x63\x65", "\x5B\x6C\x65\x76\x65\x6C\x5D", "\x5B\x75\x73\x65\x72\x6E\x61\x6D\x65\x5D", "\x75\x73\x65\x72\x6E\x61\x6D\x65", "\x61\x75\x74\x68\x6F\x72", "\x5B\x75\x73\x65\x72\x5D", "\x6D\x65\x73\x73\x61\x67\x65", "\x6C\x65\x76\x65\x6C\x55\x70"]; if (xpNeed <= data[_0xe8ae[0]]) { data[_0xe8ae[0]] -= xpNeed; data[_0xe8ae[1]] += 1; let test = guildData[_0xe8ae[2]]; if (test) { let chhannel = message[_0xe8ae[8]][_0xe8ae[7]][_0xe8ae[6]][_0xe8ae[5]](guildData[_0xe8ae[4]][_0xe8ae[3]]); let upgradedRole = test[_0xe8ae[9]]((_0x848ax4) => { return _0x848ax4[_0xe8ae[1]] <= data[_0xe8ae[1]] && _0x848ax4[_0xe8ae[1]] > data[_0xe8ae[1]] - 1 }); if (upgradedRole[_0xe8ae[10]]) { upgradedRole[_0xe8ae[15]]((_0x848ax5) => { _0x848ax5[_0xe8ae[11]] = _0x848ax5[_0xe8ae[11]][_0xe8ae[9]]((_0x848ax4) => { return message[_0xe8ae[8]][_0xe8ae[11]][_0xe8ae[6]][_0xe8ae[5]](_0x848ax4) }); _0x848ax5[_0xe8ae[11]][_0xe8ae[15]]((_0x848ax6) => { message[_0xe8ae[14]][_0xe8ae[11]][_0xe8ae[13]](_0x848ax6)[_0xe8ae[12]]((_0x848ax7) => { return 0 }) }) }); let upgraded = upgradedRole[upgradedRole[_0xe8ae[10]] - 1][_0xe8ae[11]][_0xe8ae[18]]((_0x848ax4) => { return `${_0xe8ae[16]}${message[_0xe8ae[8]][_0xe8ae[11]][_0xe8ae[6]][_0xe8ae[5]](_0x848ax4)[_0xe8ae[17]]}${_0xe8ae[16]}` }); if (chhannel) { await chhannel[_0xe8ae[20]](guildData[_0xe8ae[4]][_0xe8ae[31]][_0xe8ae[25]](_0xe8ae[30], message[_0xe8ae[29]])[_0xe8ae[25]](_0xe8ae[27], message[_0xe8ae[29]][_0xe8ae[28]])[_0xe8ae[25]](_0xe8ae[26], data[_0xe8ae[1]])[_0xe8ae[25]](_0xe8ae[22], upgraded[_0xe8ae[24]](_0xe8ae[23])))[_0xe8ae[21]]((_0x848ax4) => { chhannel[_0xe8ae[20]](guildData[_0xe8ae[19]])[_0xe8ae[12]]((_0x848ax7) => { return 0 }) }) } } }; let channel = message[_0xe8ae[8]][_0xe8ae[7]][_0xe8ae[6]][_0xe8ae[5]](guildData[_0xe8ae[32]][_0xe8ae[3]]); if (channel) { await channel[_0xe8ae[20]](guildData[_0xe8ae[32]][_0xe8ae[31]][_0xe8ae[25]](_0xe8ae[30], message[_0xe8ae[29]])[_0xe8ae[25]](_0xe8ae[27], message[_0xe8ae[29]][_0xe8ae[28]])[_0xe8ae[25]](_0xe8ae[26], data[_0xe8ae[1]])) } }
    guildData.staff[guildData.staff.indexOf(data)] = data
    await Module.findOneAndUpdate(
      { GuildID: message.guild.id }, { staff: guildData.staff }
    )

  }
}