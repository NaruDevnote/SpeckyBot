module.exports = {
    name: "levelnamegenerator",
    description: "Generates a name for your Geometry Dash Level!",
    category: "misc",
    usage: "[name]",
    flags: ['huge','svg','nocase'],
    aliases: ['lng']
}

const fetch = require('node-fetch');
const Canvas = require('canvas');
const { join } = require('path');
const save = global.modules.saveAsset;

const listURL = "https://gdcolon.com/tools/gdname/list";
const cornerURL = "https://gdbrowser.com/assets/corner.png";
const refreshURL = "https://gdbrowser.com/assets/refresh.png";
const pusabURL = "https://gdcolon.com/assets/Pusab.ttf";

const promises = [
    [cornerURL,'corner.png'],
    [refreshURL,'refresh.png'],
    [pusabURL,'pusab.ttf']
].map(save);

Promise.all(promises)
.then(()=>Canvas.registerFont(join(process.cwd(),'assets','pusab.ttf'),{family: 'Pusab'}))
.catch(()=>{});

module.exports.run = async (bot, msg) => {
    await Promise.all(promises);

    let { list, corner, refresh } = this;

    if(!list)
        await fetch(listURL)
        .then(d => d.json())
        .then(l => list = l)
        .catch(()=>{});

    if(!list) return bot.cmdError('Unexpected error happened');

    let name;

    if(msg.cmdContent){
        // CONTENT
        name = msg.cmdContent
    }else{
        // ACTUAL NAME
        name = list.combos
        .pick()
        .split(' ')
        .map(c => {
            switch(c){
                case 'N':
                    const noun = list.nouns.pick();
                    return noun+(!Math.floor(Math.random()*4) && !['s','x'].includes(noun[noun.length-1])?'s':'');
                case 'A':
                    return list.adjs.pick();
                case 'V':
                    return list.verbs.pick().replace(/~[a-z]+$/,'');
                case 'VER':
                    return list.verbs.pick().replace(/(~([a-z]+)|e?)$/,'$2er');
                case 'VNG':
                    return list.verbs.pick().replace(/(~([a-z]+)|(?<!e))$/,'$2er').replace(/(~([a-z]+)|e)$/,'$2ing');
            }
            return c;
        })
        .join(' ');

        // THE / AN / A / V2 etc
        name = `${(()=>{
            if(name.length < 15){
                const seed = Math.floor(Math.random()*15);
                if (seed == 0) return 'the';
                if (seed == 1) return name.match(/^[aeiou]/i) ? 'an' : 'a';
            }
            return '';
        })()} ${name} ${(()=>{
            if(name.length < 15){
                const [seed,seed2,num] = [Math.floor(Math.random()*7),Math.floor(Math.random()*3),Math.ceil(Math.random()*5+2)];
                if(!seed) return seed2 ? num.toString() : `v${num}`;
            }
            return '';
        })()}`;
    }

    // MESSAGE FLAGS
    const huge = msg.flag('huge');
    const svg = msg.flag('svg');
    const nocase = msg.flag('nocase');
    const canvasSetup = huge ? [7680,4320] : [1280,720];
    if(svg) canvasSetup.push('svg');

    // TRIM AND RANDOM CASE
    name = name.trim().replace(bot.regex.spaces,' ')
    if(!nocase) name = name.randomCase();

    // CANVAS SETUP
    const canvas = Canvas.createCanvas(...canvasSetup);
    const ctx = canvas.getContext('2d');

    // BACKGROUND
    const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
    gradient.addColorStop(0, 'rgb(0,100,255)');
    gradient.addColorStop(1, 'rgb(0,45,115)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // MINOR UTILITIES
    const min = Math.min(canvas.height,canvas.width);
    ctx.imageSmoothingQuality = 'high';
    ctx.imageSmoothingEnabled = true;
    const CScaleRatio = 600;
    const RScaleRatio = 600;

    // CORNERS
    if(!corner) corner = await Canvas.loadImage(global.assets.corner);
    const CWidth = corner.width * min / CScaleRatio;
    const CHeight = corner.height * min / CScaleRatio;
    ctx.drawImage(
        corner,
        0,
        canvas.height-CHeight,
        CWidth, CHeight
    );
    ctx.scale(-1,1);
    ctx.drawImage(
        corner,
        -canvas.width,
        canvas.height-CHeight,
        CWidth, CHeight
    );
    ctx.scale(-1,1);

    // REFRESH
    if(!refresh) refresh = await Canvas.loadImage(global.assets.refresh);
    const RWidth = refresh.width * min / RScaleRatio;
    const RHeight = refresh.height * min / RScaleRatio;
    ctx.drawImage(
        refresh,
        canvas.width/2 - RWidth/2,
        canvas.height * 0.5,
        RWidth, RHeight
    );

    // TEXT
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgb(0,0,0)';
    const lng = "Level name generator!";
    const pos1 = [canvas.width/2,canvas.height*0.2];
    const pos2 = [canvas.width/2,canvas.height*0.4];
    const size1 = 16;
    const size2 = 14;
    const mlt = 8;

    ctx.font = `${Math.ceil(canvas.width/size1)}px Pusab`;
    ctx.lineWidth = canvas.width/(size1*mlt);
    ctx.strokeText(lng,...pos1,canvas.width);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillText(lng,...pos1,canvas.width);

    ctx.font = `${Math.ceil(canvas.width/size2)}px Pusab`;
    ctx.lineWidth = canvas.width/(size2*mlt);
    ctx.strokeText(name,...pos2,canvas.width);
    ctx.fillStyle = 'rgb(255,200,0)';
    ctx.fillText(name,...pos2,canvas.width);

    return msg.channel.send(canvas.toBuffer().toAttachment(`levelname.${svg?'svg':'png'}`));
}
