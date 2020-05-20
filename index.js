let express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    dbConnection = mongoose.connection;

// DB connection
const MONGO_URI = 'mongodb+srv://uname:pswd@cluster0-hfmge.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

dbConnection.on('error', (err) => console.error('MongoDB connection error:', err));
dbConnection.on('connected', () => console.log('DB is connected now...'));
dbConnection.on('disconnected', () => console.log('DB is disconnected now...'));
process.on('SIGINT', () => {
    dbConnection.close(() => {
        console.log('Mongoose default connection is disconnected due to application termination');
        process.exit(0);
    });
});

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// API routes
app.post('/infy-post', (req, res) => {
    console.log('post http req', req.body, req.query)
    res.status(200).send({message: 'post http request'})
})

app.get('/infy-get/:id?', (req, res) => {
    console.log('get http req', req.params)
    res.status(200).send({message: 'get http request'})
})

app.put('/infy-put', (req, res) => {
    console.log('put http req')
    res.status(200).send({message: 'put http request'})
})

app.delete('/infy-delete', (req, res) => {
    console.log('delete http req')
    res.status(204).send({message: 'delete http request'})
})

// Server start
app.listen(5000, () => console.log('server running on port 5000'));