module.exports = {
    name: "radio",
    description: "Puts a playlist into the queue!",
    category: "music",
}

const radios = [
    // EDM/DUBSTEP/TECHNO/TRAP/ETC
    {
        name: 'Muse',
        url: "https://youtube.com/playlist?list=PLTpHAWOyakLaaSnO1SyJor4r0y_ZmYwHg",
        from: 'Ranger',
    },
    {
        name: 'Black Wolf',
        url: "https://youtube.com/playlist?list=PLNiLQueObdrT1TeviIQ7xJNqElO-55WRT",
        from: 'Black Wolf',
    },
    {
        name: 'NCS',
        url: "https://youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq",
        from: 'Specky',
    },
    {
        name: 'Trap Nation',
        url: "https://youtube.com/playlist?list=PLC1og_v3eb4hrv4wsqG1G5dsNZh9bIscJ",
        from: 'Melvin',
    },

    // VARIOUS
    {
        name: 'osu!',
        url: "https://youtube.com/playlist?list=PLt2s8p17wbVywg7bINV9nj7GPG5Oj0B4W",
        from: 'Specky',
    },

    // CLASSICAL MUSIC
    {
        name: 'BombSquad',
        url: "https://youtube.com/playlist?list=PLmjn_XKBcplZObP4r1jksIIr5nmO4dANf",
        from: 'Specky',
    },
    {
        name: 'RCT',
        url: "https://youtube.com/playlist?list=PLxt6cj1N5f6A3Ag0NF5Ew1l0QdcfMyckB",
        from: 'Specky',
    },

    // GAMES
    {
        name: 'Celeste',
        url: "https://youtube.com/playlist?list=PL1eFjFaZ9VkyDcVnvJyEC3P8tCFpZpRoU",
        from: 'Specky',
    },
];

const { compareTwoStrings } = require('string-similarity');

module.exports.run = async (bot, msg) => {
    if(!msg.cmdContent) return msg.channel.send(embed(bot));

    const playlist =
        radios.map(r => ({
            value: compareTwoStrings(
                msg.cmdContent.toLowerCase(),
                r.name.toLowerCase(),
            ),
            radio: r,
        }))
        .sort((a,b) => b.value-a.value)[0].radio;

    if(bot.music.isPlaying(msg)) bot.music.stop(msg);
    await bot.music.playlist(msg, {
        search: playlist.url,
        requestedBy: msg.author.tag,
        maxSongs: 500,
    });
    bot.music.toggleQueueLoop(msg);
    bot.music.shuffle(msg);
    bot.music.skip(msg);
    return msg.channel.send(embed(bot, playlist))
}

function embed(bot, playlist){
    const emb =
        bot.embed()
        .setDescription(`Available radio stations:\n${
            radios.map(radio => `+ ${radio.name}`).join('\n').code('diff')
        }`);

    if(playlist)
        emb
        .setTitle(`Now Playing "${playlist.name}"`)
        .setURL(playlist.url)
        .setFooter(`From: ${playlist.from}`);

    return emb;
}
