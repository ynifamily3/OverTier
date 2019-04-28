const TelegramBot = require('node-telegram-bot-api');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const fetch = require("node-fetch");
const request = require('request');

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
    const $ = cheerio.load(text);
    let playerInfo = {
        profilePhoto: $('img.player-portrait').attr('src'),
        playerName: $('h1.header-masthead').text(),
        numberOfWins: $('p.masthead-detail.h4 span').text(),
        platform,
        playerlevel: $('div.u-vertical-center').first().text(),
        playerRecommandLevel: $('div.u-center').first().text(),
        playerRating: $('div.u-align-center.h5').first().text()
    };

    return playerInfo;
}

bot.onText(/\/showMyInfo/, async (msg, match) => {
    const chatId = msg.chat.id;
    const fullText = await getPlayerInfo(url);
    const playerInfo = parsePlayerInfo(fullText);
    const pic_stream = request.get(playerInfo.profilePhoto).on('error', function(err) { console.log(err); });
    bot.sendPhoto(chatId, pic_stream, {
        caption: platform +' 플레이어 ' + playerInfo.playerName + '\n'
    + playerInfo.numberOfWins
    + '\n플레이어 레벨 ' + playerInfo.playerlevel
    + '\n경쟁전 점수 ' + playerInfo.playerRating
    + '\n추천 레벨 ' + playerInfo.playerRecommandLevel
    });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // console.log(msg.chat.text + '입력함');
    // bot.sendMessage(chatId, "이게 아니야 바보야");
});