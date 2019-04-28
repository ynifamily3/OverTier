const TelegramBot = require('node-telegram-bot-api');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const fetch = require("node-fetch");

dotenv.config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const prefix = 'https://playoverwatch.com';
const area = 'ko-kr';
const platform = 'pc';
const battleTag = '나마스떼-31604';

let join_url = new Array(prefix, area, 'career', platform, battleTag);
const url = join_url.join('/');
console.log(url);

async function getPlayerInfo(url) {
    try {
        const resp = await fetch(encodeURI(url));
        const text = await resp.text();
        return text;
    } catch (err) {
        console.log('fetch faiiled', err);
        return 0;
    }
}

function parsePlayerInfo(text) {
    let playerInfo = {
        profilePhoto:'',
        playerName:'',
        numberOfWins:'',
        platform:platform,
        playerlevel:0,
        playerRecommandLevel:0,
        playerRating:500
    };

    //<h1 class="header-masthead">나마스떼</h1>
    //console.log(text);
    //<div class="u-vertical-center">
    //const {playerlevel, playerRating} = playerinfo
    const $ = cheerio.load(text);
    playerInfo.profilePhoto = $('img.player-portrait').attr('src');
    playerInfo.playerName = $('h1.header-masthead').text();
    playerInfo.numberOfWins = $('p.masthead-detail.h4 span').text();
    playerInfo.playerlevel = $('div.u-vertical-center').first().text();
    playerInfo.playerRecommandLevel = $('div.u-center').first().text();
    playerInfo.playerRating = $('div.u-align-center.h5').first().text();

    return playerInfo;
}

bot.onText(/\/showMyInfo/, async (msg, match) => {
    const chatId = msg.chat.id;
    const fullText = await getPlayerInfo(url);
    const playerInfo = parsePlayerInfo(fullText);
    bot.sendMessage(chatId, '플레이어 : ' + playerInfo.playerName + '\n' + playerInfo.numberOfWins + '\nlevel : ' + playerInfo.playerlevel + '\n경쟁전 점수 : ' + playerInfo.playerRating);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // console.log(msg.chat.text + '입력함');
    // bot.sendMessage(chatId, "이게 아니야 바보야");
});