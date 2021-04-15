module.exports = {
    name: 'database',
    description: 'Gives you the entire database!',
    category: 'owner',
    flags: ['file'],
    aliases: ['db']
}

const db = require('quick.db');
const { promises: { readFile } } = require('fs');
const { join } = require('path');

module.exports.run = async (bot, msg) => {
    if(msg.flag('file')){
        const name = 'json.sqlite';
        const file = await readFile(join(process.cwd(),name));
        return msg.channel.send(file.toAttachment(name));
    }
    const databases = [
        ['General',''],
        ['Economy','economy'],
        ['User Settings','usersettings'],
        ['Speedrun Profiles','speedrun'],
        ['Math Scopes','mathscopes']
    ].map(([name,path])=>{
        const database = path ? new db.table(path) : db;
        const json = {}
        database.all().map(data => json[data.ID] = data.data);
        return `${name}\n${JSON.stringify(json,null,2).code('json')}\u200b`
    })

    return msg.channel.send(databases.join('\n'),{split: {char:'\u200b\n'}});
}
