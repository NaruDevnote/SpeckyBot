module.exports = {
    startMessage: 'send me a direct message (DM)!',
    defTime: 20000,
    name: 'writeDM',
    run: async function (channel, players, time, bot, info) {

        // when time is up
        const settings = info.settings

        // making a bunch of collectors
        const collectors = []
        for(const player of players){
            await player.createDM()
            const dmCollector = player.dmChannel.awaitMessages(() => true, { max: 1, time: time })
            collectors.push(dmCollector)
        }

        // when time is up
        await bot.sleep(time)
        if (settings.opposite_day) await channel.send('Alright time\'s up!')
        else await channel.send('Simon says time\'s up!')

        await Promise.all(collectors)
        let messages = []

        for(const collected of collectors){
            const rCollected = await collected
            messages = messages.concat(rCollected.array())
        }


        const out = []
        const outIndex = []
        // check each player to see if they are out
        players.forEach((player, i) => {
            // check each message
            let sentMessage = false
            for (const message of messages) {
                if (message.author == player) {
                    // if simon didnt say, the player is out
                    if (!info.simonSaid) {
                        out.push(player)
                        outIndex.push(i)
                    } else {
                        sentMessage = true
                    }
                    break
                }
            }
            if (info.simonSaid && !sentMessage) {
                out.push(player)
                outIndex.push(i)
            }
        })
        const newPlayers = players.filter( ( el ) => !out.includes( el ) )
        return ({
            playersOut: out,
            playersLeft: newPlayers,
            settingsOut: settings
        })
    }
}
