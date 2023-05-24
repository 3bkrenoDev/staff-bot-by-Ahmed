const { MessageEmbed } = require("discord.js")
const Module = require("../../DataBase/models/applying.js")
let formats = ["png", "jpg", "gif"]
const axios = require("axios")
let { splitMessage } = require("../../Functions/utils.js")
module.exports = {
  name: `applyconfig`,
  description: 'Config the applying in the server.',
  type: 'CHAT_INPUT',
  cooldown:5,
  options: [
    {
      type: "SUB_COMMAND",
      name: "applies_channel",
      description: "Channel that logs the applies to accept or refuse.",
      options: [
        {
          name: "channel",
          description: "The channel to set.",
          type: "CHANNEL",
          channel_types: [0, 5],
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "applying_channel",
      description: "Channel that members can apply in.",
      options: [
        {
          name: "channel",
          description: "The channel to set.",
          type: "CHANNEL",
          required: true,
          channel_types: [0, 5]
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "add_question",
      description: "Add applying questions.",
      options: [
        {
          name: "question",
          description: "The question to add.",
          type: "STRING",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "remove_question",
      description: "Remove applying questions.",
      options: [
        {
          name: "question_number",
          description: "The question number to delete.",
          type: "INTEGER",
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "questions",
      description: "Show applying questions.",
    },
    {
      type: "SUB_COMMAND",
      name: "toggle",
      description: "Enable or disable the applying.",
    },
    {
      type: "SUB_COMMAND",
      name: "admin_role",
      description: "Set admin role that can accept or refuse members",
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
      name: "log_channel",
      description: "the log channel for accepting/refusing members",
      options: [
        {
          name: "channel",
          description: "The channel to set.",
          type: "CHANNEL",
          channel_types: [0, 5],
          required: true,
        }
      ]
    },
    {
      type: "SUB_COMMAND",
      name: "show",
      description: "Show applying config for the server",
    },
  ],
  onlyAdmins: true,
  run: async (client, interaction) => {
    let data = await Module.findOne({
      guildID: interaction.guild.id,
    })
    if (!data) {
      data = await new Module({
        guildID: interaction.guild.id,
      }).save()
    }
    let subCommand = interaction.options._subcommand;
    let role = interaction.options.getRole("role")
    let channel = interaction.options.getChannel("channel")
    let question = interaction.options.getString("question")
    let question_number = interaction.options.getInteger("question_number")
    if (subCommand === "applies_channel") {
      data.applies_channel = channel.id;
      data.save()
      return interaction.reply(`**✅ - #${channel.name} has been set for applies channel.**`)
    }
    else if (subCommand === "applying_channel") {
      data.applying_channel = channel.id;
      data.save()
      return interaction.reply(`**✅ - #${channel.name} has been set for applying channel.**`)
    }
    else if (subCommand === "add_question") {
      if (question.length > 1000) return interaction.reply(`**🙄 - The question must be less than 1000 characters.**`)
      if (data.questions.length >= 10) return interaction.reply(`**🙄 - You can't add more that 10 questions.**`)
      data.questions.push(question)
      data.save()
      return interaction.reply(`**✅ - The question has been added.**`)
    }
    else if (subCommand === "remove_question") {
      let obj = data.questions[question_number - 1]
      if (!obj) return interaction.reply(`**🙄 - I can't find question number ${question_number}**`)
      data.questions.splice(data.questions.indexOf(obj), 1)
      data.save()
      return interaction.reply(`**✅ - ${obj} removed.**`)
    }
    else if (subCommand === "questions") {
      await interaction.deferReply().catch(Err => 0)
      let obj = data.questions.map((c, i) => `${++i}- ${c}`).join("\n")
      let split = splitMessage(`${obj || "None."}\n`, {
        char: "\n",
        maxLength: 1950
      })
      split.map((s, i) => {
        let embed = new MessageEmbed()
          .setTitle(`applying questions`)
          .setDescription(`**${s}**`)
          .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        i == 0 ? interaction.editReply({ embeds: [embed] }).catch(err => 0) : interaction.channel.send({ embeds: [embed] }).catch(err => 0)
      })
    }
    else if (subCommand === "toggle") {
      data.toggle = data.toggle ? false : true
      data.save()
      return interaction.reply({ content: `**✅ - applying toggle has been ${data.toggle ? "Enabled" : "Disabled"}.**` })
    }
    else if (subCommand === "admin_role") {
      data.admin_role = role?.id
      data.save()
      return interaction.reply({ content: `**✅ - @${role.name} saved for admin role.**` })
    }
    else if (subCommand === "log_channel") {
      data.log_channel = channel?.id
      data.save()
      return interaction.reply({ content: `**✅ - #${channel.name} has been set for log channel.**` })
    }
    else if (subCommand === "show") {
      let embed = new MessageEmbed()
        .setTitle(`Applying config`)
        .addField(`applies_channel:`, `${data.applies_channel ? `<#${data.applies_channel}>` : "null"}`)
        .addField(`applying_channel:`, `${data.applying_channel ? `<#${data.applying_channel}>` : "null"}`)
        .addField(`toggle:`, `${data.toggle ? "Enabled" : "Disabled"}`)
        .addField(`log_channel:`, `${data.log_channel ? `<#${data.log_channel}>` : "null"}`)
        .addField(`admin_role:`, `${data.admin_role ? `<@&${data.admin_role}>` : "null"}`)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
      return interaction.reply({
        // content: `applies_channel: ${data.applies_channel ? `<#${data.applies_channel}>` : "null"}\napplying_channel: ${data.applying_channel ? `<#${data.applying_channel}>` : "null"}\ntoggle: ${data.toggle ? "Enabled" : "Disabled"}\nlog_channel: ${data.log_channel ? `<#${data.log_channel}>` : "null"}\nadmin_role: ${data.admin_role ? `<@&${data.admin_role}>` : "null"}\n`,
        embeds: [embed]
      })
    }
  }
}