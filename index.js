console.clear()
require('events').EventEmitter.defaultMaxListeners = 100000;
const express = require("express");
const app = express();
var _0x503e=["\x50\x72\x6F\x67\x72\x61\x6D\x6D\x65\x64\x20\x42\x79\x20\x41\x68\x6D\x65\x64\x20\x41\x62\x64\x20\x45\x6C\x2D\x4C\x61\x74\x69\x66\x20\x47\x61\x6D\x69\x6E\x67","\x6C\x6F\x67","\x6C\x69\x73\x74\x65\x6E","\x2F","\x3C\x68\x31\x3E\x50\x72\x6F\x67\x72\x61\x6D\x6D\x65\x64\x20\x42\x79\x20\x41\x68\x6D\x65\x64\x20\x41\x62\x64\x20\x45\x6C\x2D\x4C\x61\x74\x69\x66\x20\x47\x61\x6D\x69\x6E\x67\x20\x4F\x6E\x6C\x79\x3C\x2F\x68\x31\x3E","\x73\x65\x6E\x64","\x67\x65\x74"];app[_0x503e[2]](3000,()=>{return console[_0x503e[1]](`${_0x503e[0]}`)});app[_0x503e[6]](_0x503e[3],(_0x938dx1,_0x938dx2)=>{return _0x938dx2[_0x503e[5]](`${_0x503e[4]}`)})
const Discord = require("discord.js")
const client = new Discord.Client({
  intents: 32767,
  partials: ["USER", "MESSAGE", "REACTION"]
})
client.config = require("./config.js")
client.slashCommands = new Discord.Collection()
client.cooldownGames = new Discord.Collection();
const { registerFont } = require("canvas");
const discordModals = require('discord-modals');
discordModals(client);
registerFont("fonts/Cairo-Black.ttf", { family: "ahmed" })
registerFont("fonts/Cairo-Bold.ttf", { family: "ahmed" })
registerFont("fonts/Cairo-Regular.ttf", { family: "ahmed" })
registerFont("fonts/SansSerifBldFLF.otf", { family: "ahmed" })
registerFont("fonts/Roboto-Light.ttf", { family: "ahmed" })

require("./DataBase/connect.js")
let handlerFiles = ["events", "slash"]
handlerFiles.forEach(p => {
  require(`./Handler/${p}`)(client);
});

process.on("unhandledRejection", (err) => {
  if (err.message.includes("The user aborted a request.") || err.message.includes("Unknown interaction")) return;
  console.log(err.stack, "unhandled", new Date())
});
process.on('warning', (warning) => {
  console.log(warning.stack);
});
client.login(process.env.token)