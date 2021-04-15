module.exports = {
    name: "membersid",
    description: "Turns all user IDs into a txt file!",
    category: "dev",
    aliases: ['membersids','memberids','memberid']
}

module.exports.run = async (bot, msg) => {
    const members = [];
    msg.guild.members.cache.forEach(member => {
        members.push(member.user.id)
    })
    const att = Buffer.from(members.join('\n'),'ascii').toAttachment("members.txt")
    return msg.channel.send(att);
}
