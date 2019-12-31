const { RichEmbed } = require('discord.js')

module.exports.run = async (bot, msg, args, config) => {
    let discriminator = msg.author.discriminator.padStart(4,"0");
    if(args[0]){
        if(!isNaN(args[0])){
            discriminator = args[0].padStart(4,"0")
        }
    }
    var discrims = [];
    bot.users.forEach(user => {
        if(discrims.length < 10){
            if(discriminator == user.discriminator && msg.author.username != user.username){
                discrims.push(user.tag)
            }
        }
    })
    const embed = new RichEmbed()
        .setColor('#FF00AA')
        .setTitle(`#${msg.author.discriminator}`)
        .setDescription(discrims.length ? discrims.join(`\n`) : 'No user found')
    msg.channel.send(embed);
};

module.exports.config = {
    name: "discrim",
	description: "You want to change your discriminator without Nitro?",
    usage: ``,
    category: `utilities`,
	accessableby: "Members",
    aliases: ["discrims","discriminator","discriminators","discrimin","discrimins"]
}
