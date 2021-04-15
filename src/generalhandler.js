const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = async (bot) => {
    function load(handlers){
        for(let handler of handlers){

            const log = bot.log || console.log;

            let loading = `\n\nLoading ${handler.toUpperCase()}!\n`;

            if('_'.dependency){
                loading = loading.dependency;
            }

            log(loading);

            try{
                (bot.require||require)(join(process.cwd(),'handlers',handler))(bot);
            }catch(err){
                log(`handler\t${handler}`.toUpperCase().error);
                log("FATAL ERROR ON HANDLERS".fatal);
                log(err);
                process.exit(1);
            }
        }
    }

    const priority = [
        "dependencies",
        "languages",
        "botcache",
        "modules",
        "botfunctions",
        "missingdirectories",
        "missingfiles",
        "config",
        "prototypes",
        "templates",
        "music",
        "events",
    ];

    load(priority);

    load(
        [
            ...readdirSync(join(process.cwd(),'handlers')).map(v => priority && v.match(bot.supportedFiles).length > 0 && !priority.includes(v.replace(bot.supportedFiles,'')) ? v.replace(bot.supportedFiles,'') : null).clean()
        ]
    );
}
