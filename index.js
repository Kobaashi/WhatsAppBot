import { Currency } from './reqApi.js';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg; 
import qrcode from 'qrcode-terminal';

function generateRandomClientId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

const clientId = generateRandomClientId();

const client = new Client({
    authStrategy: new LocalAuth({ clientId: clientId }),
});

const allowedNumber = '380635747089'; 
const allowedChatId = `${allowedNumber}@c.us`; 
const greetings = ['привіт', 'ку', 'доброго дня'];
let expectingMessage = false;
let isBotMessage = false;

client.on('qr', (qr) => {
    console.log('QR-код згенеровано');
    qrcode.generate(qr, { small: true });
    console.log('Скануйте QR-код для входу.');
});

client.on('ready', async () => {
    console.log('Бот готовий!');

    const message = 'Привіт! Це повідомлення від бота. (Введіть "привіт", щоб продовжити)';
    try {
        await client.sendMessage(allowedChatId, message);
        console.log(`Привітальне повідомлення надіслано на номер ${allowedNumber}`);
    } catch (error) {
        console.error('Не вдалося надіслати повідомлення:', error);
    }
});

client.on('message_create', async (message) => {
    if (isBotMessage) {
        isBotMessage = false;
        return;
    }

    if (greetings.includes(message.body.toLowerCase())) {
        isBotMessage = true;
        message.reply('Введіть щось, щоб розпочати!');
        expectingMessage = true;
    } else if (expectingMessage) {
        isBotMessage = true;
        message.reply('Доступна команда, перегляду всіх курсів валют; Потрібно ввести "хочу дізнатися курс валюти", потім так');
        expectingMessage = false;
    }
});


client.on('message_create',  (message) => {
    
    if (message.from === allowedChatId) {

        if (message.body.toLowerCase() === 'хочу дізнатися курс валюти') {
            message.reply('Якої саме? Валют багато: долар, євро тощо. Чи бажаєте побачити список?');
        }

        else if (message.body.toLowerCase() === 'так') {
            if (Currency && Currency.length > 0) {
                const currencyList = Currency.map(item => `${item.txt}: ${item.rate}`).join('\n');
                message.reply(`Список валют:\n${currencyList}`);
            } else {
                message.reply('Курс валют наразі недоступний.');
            }
        }

        else if (message.body.toLowerCase() === 'яке зараз число?') {
            message.reply('На жаль, я ще на стадії розробки. Спробуйте запитати щось інше.');
        }
    }
});

client.initialize();
