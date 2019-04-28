const TelegramBot = require('node-telegram-bot-api');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config()

const token = process.env.TELEGRAM_TOKEN

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/showMyInfo/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "퐁퐁");
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "이게 아니야 바보야");
});