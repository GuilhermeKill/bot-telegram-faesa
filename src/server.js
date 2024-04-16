const migrationsRun = require('./database/sqlite/migrations')
const sqliteConnection = require('./database/sqlite')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv/config')
migrationsRun()


const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
let foraDoHorario = false

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  let request = msg
  const tempo = new Date()
  
  async function insert(){
    if(foraDoHorario){
      const database = await sqliteConnection()
      database.run("INSERT INTO users (email) VALUES (?)", [request.text])

      foraDoHorario = false

      return true
    }

    if(tempo.getHours() > 18 || tempo.getHours() < 9) {
      foraDoHorario = true
      
      bot.sendMessage(chatId, 'NO MOMENTO NÃO ESTAMOS ATENDENDO, POR FAVOR DEIXE SEU EMAIL');
      foraDoHorario = true

      return
    } 
    
    else {
      bot.sendMessage(chatId, 'https://faesa.br');
      
      return
    }
  }

  insert()
});


