let express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    Admin = mongoose.mongo.Admin,
    dbConnection = mongoose.connection,
    listingsController = require('./controllers/listingController');

// DB connection
const MONGO_URI = 'mongodb+srv://uname:pswd@cluster0-hfmge.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// .then((MongooseNode) => {
//     const nativeConnetion = MongooseNode.connections[0]
//     new Admin(nativeConnetion.db).listDatabases((err, results) => {
//         if (err) console.log('Error listing dbs...', err)
//         console.log('DB : - ', results.databases)
//     });
// })

dbConnection.on('error', (err) => console.error('MongoDB connection error:', err));
dbConnection.once('open', () => console.log('DB is connected now...'));
dbConnection.on('disconnected', () => console.log('DB is disconnected now...'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // http://localhost:5000/api/list?query=Kartik%20Kulkarni
app.use(express.static(`${__dirname}/static`))

// API routes

app.use('/api/v1/listings', listingsController);

// Server start
app.listen(5000, () => console.log('server running on port 5000'));

module.exports = app;