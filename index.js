const http = require('http');
const Bot = require('messenger-bot');
const apiai = require("api.ai");
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/computerDB';

var db = require("./config/dbConfig");
var textBack = require("./textBack");

const nlp = new apiai({
    token: process.env.APIAI_TOKEN,
    session: "test"
});

const bot = new Bot({
    token: process.env.ACCESS_TOKEN,
    verify: process.env.VERIFY_TOKEN
});

bot.on('error', function(err){
    console.log(err.message)
});

bot.on('message', function(payload, reply, actions) {
    nlp.text(payload.message.text, {sessionId: "test"})
        .then(function (res) {
            var speech = res.result.fulfillment.speech
            var param = res.result.parameters
            console.log(param);
            if (param.type_pc || param.sup_inf || param.tech)
                textBack.pcSearch(param, db.collection, speech, reply);
            else
                textBack.speech(reply, speech);
        })
        .error(function (err) {
            if (err) throw err;
        })
})

http.createServer(bot.middleware()).listen(5000);
console.log('Echo bot server running at port 5000.');