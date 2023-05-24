const { Schema, model } = require("mongoose")
var fs = require('fs');

const data = new Schema({
  guildID: String,
  applies_channel: {
    type: String,
    defauly: null
  },
  applying_channel: {
    type: String,
    defauly: null
  },
  log_channel: {
    type: String,
    defauly: null
  },
  admin_role: {
    type: String,
    defauly: null
  },
  questions: {
    type: Array,
    defauly: []
  },
  toggle: {
    type: Boolean,
    defauly: false
  },
  applies: {
    type: Array,
    defauly: []
  },
}, { versionKey: false })

module.exports = new model("applying", data)