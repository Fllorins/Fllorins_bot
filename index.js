const TelegramApi = require('node-telegram-bot-api');

const { gameOptions, againOptions } = require('./options');

const token = '6622006182:AAF6xaGlKWenqWvsl6XbZC-X6ofANSuQSUc';

const bot = new TelegramApi(token, { polling: true });

const chat = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'сейчас я загадаю число от 0 до 9, а ты попробуй его отгадать'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chat[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветсвие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'игра угадай число' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/2.webp'
      );
      return bot.sendMessage(chatId, 'Добро пожаловать!!');
    }
    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === chat[chatId]) {
      bot.sendMessage(chatId, `Ты отгадал цифру ${chat[chatId]}`, againOptions);
    } else {
      bot.sendMessage(
        chatId,
        `К сожалению ты не отгадал, бот загадал число ${chat[chatId]}`,
        againOptions
      );
    }
  });
};

start();
