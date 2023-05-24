const { Schema, model } = require("mongoose")
var fs = require('fs');

const data = new Schema({
  guildID: String,
  adminsRole: {
    type: Array,
    default: []
  },
  upgradeRoles: {
    type: Array,
    default: []
  },
  xpPerMessage: {
    type: Number,
    default: 10
  },
  xpPerLevel: {
    type: Number,
    default: 300
  },
  staffRole: {
    type: String,
    default: null
  },
  staff: {
    type: Array,
    default: []
  },
  levelUp: {
    channel: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: `[user] [username] [level]`
    },
  },
  congratulation: {
    channel: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: "[user] [username] [level] [roles]"
    },
  },
  blacklistRole: {
    type: String,
    default: null
  },
  line: {
    type: String,
    default: null
  },
}, { versionKey: false })

module.exports = new model("guild", data)