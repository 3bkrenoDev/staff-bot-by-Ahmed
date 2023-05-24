const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/guild.js")
let formats = ["png", "jpg", "gif"]
const axios = require("axios")
let { splitMessage } = require("../../Functions/utils.js")
module.exports = {
  name: `config`,
  description: 'Config the server.',
  type: 'CHAT_INPUT',
  cooldown: 5,
  options: [
    {
      type: "SUB_COMMAND",
      name: "staff",
      description: "The staff role in the server.",
      options: [
        {
          name: "role",
          description: "The role to set.",
          type: "ROLE",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "xp_per_message",
      description: "The Xp that staff member get per one message",
      options: [
        {
          name: "xp",
          description: "The xp to set.",
          type: "INTEGER",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "xp_per_level",
      description: "The Xp multiply the current level to reach the next level.",
      options: [
        {
          name: "xp",
          description: "The xp to set.",
          type: "INTEGER",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "add_level",
      description: "Add new level to the server levels.",
      options: [
        {
          name: "level",
          description: "The level to add.",
          type: "INTEGER",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "remove_level",
      description: "Remove levels from the server levels.",
      options: [
        {
          name: "level",
          description: "The level to remove.",
          type: "INTEGER",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "add_role_to_level",
      description: "Add roles to get when staff member reach the required level.",
      options: [
        {
          name: "level",
          description: "The level to add role to.",
          type: "INTEGER",
          required: true,
        },
        {
          name: "role",
          description: "The role to add.",
          type: "ROLE",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "remove_role_from_level",
      description: "Remove roles from levels.",
      options: [
        {
          name: "level",
          description: "The level to remove from.",
          type: "INTEGER",
          required: true,
        },
        {
          name: "role",
          description: "The role to remove.",
          type: "ROLE",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "congratulation",
      description: "Config congratulation when staff member reach the next level with roles.",
      options: [
        {
          name: "channel",
          description: "The channel to set.",
          type: "CHANNEL",
          required: false,
          channel_types: [0, 5]
        },
        {
          name: "message",
          description: "[user] = userMention - [username] = username - [level] = level - [roles] = roles.",
          type: "STRING",
          required: false,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "level_up",
      description: "Config level up when staff member reach the next level.",
      options: [
        {
          name: "channel",
          description: "The channel to set.",
          type: "CHANNEL",
          required: false,
          channel_types: [0, 5]
        },
        {
          name: "message",
          description: "[user] = userMention - [username] = username - [level] = level.",
          type: "STRING",
          required: false,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "blacklist",
      description: "The blacklist role in the server.",
      options: [
        {
          name: "role",
          description: "The role to set.",
          type: "ROLE",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "add_admins_role",
      description: "Add Admin roles to config the server.",
      options: [
        {
          name: "role",
          description: "The role to add.",
          type: "ROLE",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "remove_admins_role",
      description: "Remove Admin roles from config the server.",
      options: [
        {
          name: "role",
          description: "The role to remove.",
          type: "ROLE",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "list_admins",
      description: "Show admin roles in the server.",
    },
    {
      type: "SUB_COMMAND",
      name: "line",
      description: "The line image after sending congratulation/level_up message.",
      options: [
        {
          name: "line",
          description: "The line image to set.",
          type: "ATTACHMENT",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "remove_line",
      description: "Remove the line image from the server.",
    },
  ],
  onlyAdmins: true,
  run: async (client, interaction, data) => {
    let subCommand = interaction.options._subcommand;
    let role = interaction.options.getRole("role")
    let channel = interaction.options.getChannel("channel")
    let message = interaction.options.getString("message")
    if (message?.length > 1000) return interaction.reply(`can' choose message more than 1000 character `)
    let xp = interaction.options.getInteger("xp")
    let level = interaction.options.getInteger("level")
    let line = interaction.options.getAttachment("line")
    if (subCommand === "staff") {
      data.staffRole = role?.id
      data.save()
      return interaction.reply({ content: `**✅ - @${role.name} saved for staff role.**` })
    }
    else if (subCommand === "xp_per_message") {
      data.xpPerMessage = xp
      data.save()
      return interaction.reply(`**✅ - The changes have been saved**`)
    }
    else if (subCommand === "xp_per_level") {
      data.xpPerLevel = xp
      data.save()
      return interaction.reply(`**✅ - The changes have been saved**`)
    }
    else if (subCommand === "add_level") {
      if (level <= 1) return interaction.reply({ content: `**🙄 - You can't choose this level.**` })
      let obj = data.upgradeRoles.find(c => c.level === level)
      if (obj) return interaction.reply({ content: `**🙄 - \`${level}\` is already saved before.**` })
      let filter = {
        level: level,
        roles: []
      }
      data.upgradeRoles.push(filter)
      data.save()
      return interaction.reply({
        content: `**✅ - The level added, now you can add some roles.**`
      })
    }
    else if (subCommand === "remove_level") {
      let obj = data.upgradeRoles.find(c => c.level === level)
      if (!obj) return interaction.reply({ content: `**🙄 - I can't find \`${level}\` in the saved levels.**` })

      data.upgradeRoles.splice(
        data.upgradeRoles.indexOf(obj), 1)
      await data.save()
      return interaction.reply({
        content: `**✅ - \`${level}\` removed from the saved levels.**`
      })
    }
    else if (subCommand === "add_role_to_level") {
      let levelData = data.upgradeRoles.find(c => c.level === level)
      if (!levelData) return interaction.reply({ content: `**🙄 - I can't find \`${level}\` in the saved levels.**` })
      let obj = levelData.roles.find(c => c === role?.id)
      if (obj) return interaction.reply({ content: `**🙄 - @${role?.name} is already saved.**` })
      levelData.roles.push(role.id)
      data.upgradeRoles[
        data.upgradeRoles.indexOf(levelData)
      ] = levelData
      await Module.findOneAndUpdate(
        { GuildID: interaction.guild.id },
        { upgradeRoles: data.upgradeRoles }
      )
      return interaction.reply({ content: `**✅ - @${role?.name} added to \`${level}\` level.**` })
    }
    else if (subCommand === "remove_role_from_level") {
      let levelData = data.upgradeRoles.find(c => c.level === level)
      if (!levelData) return interaction.reply({ content: `**🙄 - I can't find \`${level}\` in the saved levels.**` })
      let obj = levelData.roles.find(c => c === role.id)
      if (!obj) return interaction.reply(`**🙄 - I can't find @${role?.name} in the saved roles for \`${level}\`.**`)
      levelData.roles.splice(
        levelData.roles.indexOf(obj),
        1)
      if (levelData.roles.length) {
        data.upgradeRoles[
          data.upgradeRoles.indexOf(levelData)
        ] = levelData
      } else {
        data.upgradeRoles.splice(
          data.upgradeRoles.indexOf(levelData),
          1)
      }
      await Module.findOneAndUpdate(
        { GuildID: interaction.guild.id },
        { upgradeRoles: data.upgradeRoles }
      )
      return interaction.reply({ content: `**✅ - @${role?.name} removed from \`${level}\` level.**` })
    }
    else if (subCommand === "congratulation") {
      if (!channel && !message) return interaction.reply({ content: `**🙄 - You must type anything at least.**` });
      if (channel) data.congratulation.channel = channel?.id
      if (message) data.congratulation.message = message;
      data.save()
      return interaction.reply(`**✅ - The changes have been saved**`)
    }
    else if (subCommand === "level_up") {
      if (!channel && !message) return interaction.reply({ content: `**🙄 - You must type anything at least.**` });
      if (channel) data.levelUp.channel = channel?.id
      if (message) data.levelUp.message = message;
      data.save()
      return interaction.reply(`**✅ - The changes have been saved**`)
    }
    else if (subCommand === "blacklist") {
      data.blacklistRole = role?.id
      data.save()
      return interaction.reply({ content: `**✅ - @${role.name} saved for blacklist role.**` })
    }
    else if (subCommand === "add_admins_role") {
      if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply(`**🙄 - You aren't ownerShip.**`)
      let obj = data.adminsRole.find(c => c === role.id)
      if (obj) return interaction.reply({ content: `**🙄 - @${role?.name} is already saved.**` })
      data.adminsRole.push(role.id)
      data.save()
      return interaction.reply({ content: `**✅ - @${role?.name} added to admin roles.**` })
    }
    else if (subCommand === "remove_admins_role") {
      if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply(`**🙄 - You aren't ownerShip.**`)
      let obj = data.adminsRole.find(c => c === role.id)
      if (!obj) return interaction.reply(`**🙄 - I can't find @${role?.name} in the saved roles.**`)
      data.adminsRole.splice(
        data.adminsRole.indexOf(obj), 1)
      data.save()
      return interaction.reply({
        content: `**✅ - @${role?.name} removed from the saved roles.**`
      })
    }
    else if (subCommand === "list_admins") {
      let database = data.adminsRole
      database = database.filter(c => interaction.guild.roles.cache.get(c));
      data.adminsRole = database
      data.save();
      database = database.map((c, i) => `${++i}- \`${interaction.guild.roles.cache.get(c)?.name}\``)
      let split = splitMessage(`${database ? database.join("\n") : "None."}`, {
        char: "\n",
        maxLength: 1950
      })
      split.map((s, i) => {
        let embed = new Discord.MessageEmbed()
          .setDescription(`**${s}**`)
        i == 0 ? interaction.reply({ embeds: [embed.setTitle(`The admins roles (${database.length}):`)] }).catch(err => 0) :
          interaction.channel.send({ embeds: [embed.setTitle(``)] }).catch(err => 0)
      })
    }
    else if (subCommand === "line") {
      let nameArray = line.name.split('.');
      let attEx = nameArray[nameArray.length - 1]
      if (!formats.includes(attEx)) return interaction.reply(`**🙄 - You can only upload files of this type ${formats}**`);
      if (line.size > 2000000) return interaction.reply(`**🙄 - You can't upload files more than 2MB**`);
      let url = line.url
      let pics = await axios({ url, responseType: "arraybuffer" }).then((res) => Buffer.from(res.data, "binary").toString("base64"))
      data.line = pics
      data.save()
      interaction.reply({ content: `**✅ - The line image has been set.**`, files: [line] })
    }
    else if (subCommand === "remove_line") {
      data.line = null;
      data.save();
      interaction.reply({ content: `**✅ - The line image has been removed.** ` })
    }
  }
}