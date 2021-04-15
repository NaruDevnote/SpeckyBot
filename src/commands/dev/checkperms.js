module.exports = {
    name: "checkperms",
    description: "Checks the permissions of the user in a specific channel!",
    usage: `@[User] #[Channel]`,
    category: "dev",
    aliases: ["checkpermissions","checkp","cp"]
}

module.exports.run = async (bot, msg) => {
    let member, channel;

    member = msg.member;
    channel = msg.channel;

    if(msg.mentions.members.size > 0){
        member = msg.mentions.members.first();
    }

    if(msg.mentions.channels.size > 0){
        channel = msg.mentions.channels.first();
    }

    const embed = bot.membed()
    .setTitle(`Permissions of ${member.user.username} in #${channel.name}`)
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(member.displayHexColor)
    .addField(`Permissions:`, member.permissionsIn(channel).toArray().join('\n').code())

    msg.channel.send(embed);
}
