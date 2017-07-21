const MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/computerDB';

MongoClient.connect(url, function(err, db){
    console.log('Connected to database');
    db.collection('computer').insertMany([
        {name: 'Trident 3 7RB-074EU', type: 'gaming', ram: 8, memoire: 1000, prix: 950},
        {name: 'Asus ROG G752VS', type: 'gaming', ram: 16, memoire: 256, prix: 2500},
        {name: 'iMac 21,5 pouces', type: 'bureautique', ram: 8, memoire: 1000, prix: 1300},
        {name: 'HP ENVY 17-3015EF', type: 'bureautique', ram: 8, memoire: 1000, prix: 760},
        {name: 'Asus N76VZ-V2G-T1144H', type: 'video', ram: 8, memoire: 1000, prix: 680},
        {name: 'HP ENVY 17-3015EF', type: 'video', ram: 8, memoire: 1000, prix: 760}
        ]);
    db.close();
    console.log('Connection end');
});