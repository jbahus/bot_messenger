const http = require('http')
const Bot = require('messenger-bot')
const apiai = require("api.ai");

require('./config.js')

const nlp = new apiai({
    token: '52f7b8697cd04be3888a507e66653cf2',
    session: 'test'
})

const bot = new Bot({
    token: process.env.ACCESS_TOKEN,
    verify: process.env.VERIFY_TOKEN
})

bot.on('error', (err) => {
    console.log(err.message)
})



bot.on('message', (payload, reply, actions) => {
    nlp.text(payload.message.text, {sessionId: 'test'})
    .then(function(res){
        bot.getProfile(payload.sender.id, function(err, profile){
            //console.log(res);
            reply({ text: res.result.fulfillment.speech/*'bonjour '+profile.first_name+' '+profile.last_name+", je suis un bot créé par Jules et je vais vous trouver l'ordinateur idéal."*/}, (err, info) => {
                console.log(info);
        })
        })
    })
    .error(function(err) {
        console.log(err);
    })
})

http.createServer(bot.middleware()).listen(5000)
console.log('Echo bot server running at port 5000.')