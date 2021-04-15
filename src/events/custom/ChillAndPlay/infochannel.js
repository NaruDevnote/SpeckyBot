module.exports = {
    event: "* * * * *",
    call: async (bot) => {
        const guild = bot.guilds.cache.get('265505748413448193');
        if(!guild) return;

        function update(it=[],ch){
            Promise.all([...it])
            .then(inf => {
                const string = `│🌍${inf.map(v=>[v.size,v.length,v,0].find(w=>typeof w==='number')).join('-')}`;
                const channel = bot.channels.cache.get(ch);
                if(!channel) return;
                if(channel.name !== string){
                    channel.setName(string).catch(()=>{})
                }
            })
        }

        update([
            guild.fetchBans(),
            guild.fetchInvites(),
            guild.emojis.cache.filter(e => !e.animated),
            guild.emojis.cache.filter(e => e.animated)
        ], '714465197032734760');

    }
}
