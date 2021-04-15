module.exports = {
    name: "seek",
    description: "Lets you seek trough the current song!",
    category: "music",
    usage: '<second>'
}

const prettyMS = require('pretty-ms');

module.exports.run = async (bot, msg) => {
    if(!bot.music.isPlaying(msg)) throw new Error('Not playing');
    const input = parseInt(msg.cmdContent);
    if(isNaN(input) || input < 0) return bot.cmdError('Input is not a number.');
    const time = input * 1000;
    await bot.music.seek(msg, time);
    return bot.cmdSuccess(`Successfully seeked to ${prettyMS(time)}.`);
}
