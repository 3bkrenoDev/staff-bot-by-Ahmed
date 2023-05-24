const fs = require("fs")
module.exports = async (client) => {
  fs.readdirSync("./events/").forEach(dir => {
    const events = fs.readdirSync(`./events/${dir}/`).filter(file => file.endsWith(".js"));
    for (const file of events) {
      const event = require(`../events/${dir}/${file}`)
      if (event.name) {
        try {
          client.on(event.name, (...args) => event.run(...args, client));
        } catch (err) {
          console.log("error on " + event.name)
        }
      }
    }
  })
}