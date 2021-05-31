const { Collection } = require('discord.js');

module.exports = (bot) => {
    bot.setMaxListeners(100);

    bot.stats = {};
    bot.stats.commandsExecuted = 0;

    bot.cache = {};
    bot.cache.lastImage = {};
    bot.cache.console = {};
    bot.cache.console.debug = false;
    bot.cache.chatbot = {};
    bot.cache.cooldown = new Collection();
    bot.cache.runningcmds = [];
    bot.cache.globalchat = new Collection();
    bot.cache.globalchatsent = [];
    bot.cache.gcmessages = new Collection();
    bot.cache.schedules = [];
    bot.cache.statuses = [];
    bot.cache.streaming = [];
    bot.cache.gcminmembers = 10;

    bot.globalchats = new Collection();

}
