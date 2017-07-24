var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/computerDB';

MongoClient.connect(url, function(err, db){
            if (err)
                console.log(err)
            else
                console.log('Connected to database')
            exports.collection = db.collection('computer');
        })