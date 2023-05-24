const Discord = require('discord.js');
var guildModel = require("../../DataBase/models/guild.js")
const cooldowns = new Discord.Collection();

module.exports = {
  name: 'interactionCreate',
  run: async (interaction, client) => {
    let globalBot = client.config.globalBot
    let ID = client.config.guildID
    if (interaction.user.bot || (!globalBot && interaction.guild.id !== ID)) return;
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd || !interaction.channel) return;
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      if (cmd.cooldown && cmd.cooldown !== 0) {
        if (!cooldowns.has(cmd.name)) {
          cooldowns.set(cmd.name, new Discord.Collection());
        }
        const now = Date.now();
        const timestamps = cooldowns.get(cmd.name);
        const cooldownAmount = (cmd.cooldown) * 1000;
        if (timestamps.has(interaction.user.id)) {
          const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
          if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            if (timeLeft < 1) return;
            return interaction.reply({ content: `**${interaction.user.username}**, Cool down (**${Math.floor(timeLeft)} seconds** left)`, ephemeral: true });
          }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      }
      let guildData = await guildModel.findOne({
        guildID: interaction.guild.id,
      })
      if (!guildData) {
        guildData = await new guildModel({
          guildID: interaction.guild.id,
        }).save()
      }
      let validRoles = interaction.member.roles.cache.filter(c => guildData.adminsRole.includes(c.id)).map(c => c.id)
      if (cmd.onlyAdmins && interaction.user.id !== interaction.guild.ownerId && !validRoles.length) return;
      if (cmd.onlyStaff && interaction.user.id !== interaction.guild.ownerId && !interaction.member.roles.cache.has(guildData.staffRole)) return;
      if (cmd.onlyShip && interaction.user.id !== interaction.guild.ownerId) return interaction.reply({
        content: `**🙄 - You Aren't the ship of server.**`, ephemeral: true
      });
      if (cmd.userPermissions) {
        if (!interaction.member.permissions.has(cmd.userPermissions)) {
          return interaction.reply({ content: `**🙄 - You don't have permissions\nneeded: \`[${cmd.userPermissions}]\`` })
        }
      }
      if (cmd.botPermissions) {
        let botPerms = interaction.channel.permissionsFor(client.user);
        if (!botPerms || !botPerms.has(cmd.botPermissions) || !interaction.guild.me.permissions.has(cmd.botPermissions)) {
          return interaction.reply({ content: `**🙄 - I don't have permissions\nneeded: \`[${cmd.botPermissions}]\`` })
        }
      }
      cmd.run(client, interaction, guildData);
    }
  }
}