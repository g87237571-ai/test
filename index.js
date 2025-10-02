const express = require('express');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const token = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(token, { polling: true });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            inline_keyboard: [[
                {
                    text: '🎮 Открыть игру',
                    web_app: { url: `https://your-domain.com/` }
                }
            ]]
        }
    };
    bot.sendMessage(chatId, 'Добро пожаловать в кликер! Нажмите кнопку ниже чтобы начать играть.', options);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});