const http = require('http');
const Bot = require('messenger-bot');
const apiai = require("api.ai");
const MongoClient = require('mongodb').MongoClient;
const controller = require('./controller/Controller.js');
var assert = require('assert');
var url = 'mongodb://localhost:27017/computerDB';

require('./config/config.js');

const nlp = new apiai({
    token: process.env.APIAI_TOKEN,
    session: 'test'
});

const bot = new Bot({
    token: process.env.ACCESS_TOKEN,
    verify: process.env.VERIFY_TOKEN
});

bot.on('error', function(err){
    console.log(err.message)
});

bot.on('message', function(payload, reply, actions) {
    nlp.text(payload.message.text, {sessionId: 'test'})
        .then(function (res) {
            var param = res.result.parameters;
            console.log(param);
            var str = res.result.fulfillment.speech;
            if (param.type_pc || param.price || param.ram || param.memory) {
                MongoClient.connect(url, function(err, db) {
                    assert.equal(null, err);
                    console.log('Connected to database');
                    var cursor =  db.collection('computer').find({type: param.type_pc});
                    var price = 1;
                    var ram = 1;
                    if (param.price === '+')
                        price = -1;
                    if (param.ram === 'max ram')
                        ram = -1;
                    var arr = cursor.sort({ram: ram, prix: price}).toArray();
                    if (arr.length > 0) {
                        console.log(arr);
                        str = str + ' ' + arr[0].name
                            + ' avec une memoire vive de ' + arr[0].ram + ' Go, un disque dur de '
                            + arr[0].memoire + ' Go et pour un prix de '
                            + arr[0].prix + ' euros.';
                    }
                    reply({text: str}, function(err, info) {
                        if (err)
                            console.log('info:' + info);
                    })
                        db.close();
                        console.log('database closed');
                })
            }
            else{
                str = res.result.fulfillment.speech;
            }
        })
        .error(function(err) {
            console.log(err);
        })
})

http.createServer(bot.middleware()).listen(5000);
console.log('Echo bot server running at port 5000.');