require('dotenv/config')

const migrationsRun = require('./database/sqlite/migrations')
const sqliteConnection = require('./database/sqlite')
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const validator = require("email-validator");
let foraDoHorario = false
migrationsRun()

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  let request = msg
  let time = new Date().getHours()

  time = 4

  async function insert(){
    if(foraDoHorario){
      while (foraDoHorario){
        if(validator.validate(msg.text)){
          const database = await sqliteConnection()
          await database.run("INSERT INTO users (email) VALUES (?)", [request.text])

          bot.sendMessage(chatId, 'Cadastramos seu email, entraremos em contato');
          foraDoHorario = false 

          return
        }
        else {
          bot.sendMessage(chatId, 'Por favor, insira um email válido');
          foraDoHorario = false
        }
      }
    }

    if(time > 9 && time < 18) {
      bot.sendMessage(chatId, 'https://faesa.br');

      return
    } 

    bot.sendMessage(chatId, 'NO MOMENTO NÃO ESTAMOS ATENDENDO, POR FAVOR DEIXE SEU EMAIL');
    foraDoHorario = true
  }

  insert()
});


