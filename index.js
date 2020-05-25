let express = require('express'),
    app = express(),
    { MongoClient } = require('mongodb'),
    mongoose = require('mongoose'),
    // Admin = mongoose.mongo.Admin,
    // dbConnection = mongoose.connection,
    userController = require('./controllers/userController');

// DB connection
const MONGO_URI = 'mongodb+srv://uname:pswd@cluster0-hfmge.mongodb.net/test?retryWrites=true&w=majority';
let client;

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((MongooseNode) => {

//         /* Used the default nativeConnection object since connection object uses a single hostname
//          and port. Iterate here if you work with multiple hostnames in the connection object */
//         const nativeConnetion = MongooseNode.connections[0]

//         // now call the list databases function
//         new Admin(nativeConnetion.db).listDatabases((err, results) => {
//             if (err) console.log('Error listing dbs...', err)
//             console.log('DB : - ', results.databases)
//         });
//     })

// dbConnection.on('error', (err) => console.error('MongoDB connection error:', err));
// dbConnection.on('connected', () => console.log('DB is connected now...'));
// dbConnection.on('disconnected', () => console.log('DB is disconnected now...'));
// process.on('SIGINT', () => {
//     dbConnection.close(() => {
//         console.log('Mongoose default connection is disconnected due to application termination');
//         process.exit(0);
//     });
// });

async function main() {
    client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect()
            .then(() => console.log('Connected...'))

        await listDatabases(client);

        await createCollection(client.db('sample_airbnb'))
            .then((response) => {
                console.log('Collection created')
            })
            .catch((err3) => {
                console.log('Error creating collection', err3)
            })

    } catch (e) {
        console.error('Error connecting to db...', e);
    }
    // finally {
    //     await client.close();
    // }
}

main().catch(console.error);

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function createCollection(db) {
    return new Promise((resolve, reject) => {
        db.createCollection("contacts",
            {
                'validator': {
                    '$or':
                        [
                            { 'phone': { '$type': "string" } },
                            { 'email': { '$regex': /@mongodb\.com$/ } },
                            { 'status': { '$in': ["Unknown", "Incomplete"] } }
                        ]
                }
            },
            function (err, results) {
                if (err) {
                    reject(0)
                }
                if (results) {
                    resolve(1)
                }
            }
        );
    })
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // http://localhost:5000/api/list?query=Kartik%20Kulkarni


// API routes

app.get('/listings', async (req, res) => {
    // let nameOfListing = req.params.nameOfListing;
    // let nameOfListing = "Infinite Views";
    let nameOfListing = "Ribeira Charming Duplex";
    let result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .findOne({ name: nameOfListing })

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        res.status(200).send({ data: result, message: `Found a listing in the collection with the name '${nameOfListing}':` })
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
        res.status(200).send({ data: null, message: `No listings found with the name '${nameOfListing}'` })
    }
});

app.post('/listings', async (req, res) => {
    let newListing = req.body;
    await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing)
        .then(result => {
            console.log(`New listing created with the following id: ${result.insertedId}`);
            res.status(200).send({ message: `Successfully inserted '${result.insertedId}'` })
        })
        .catch(err => {
            console.log('Error while creating object', err);
            res.status(500).send({ message: `Error during insertion '${err}'` })
        })
});

app.delete('/listings/:name?', async (req, res) => {
    let nameOfListing = req.params.name;
    // let nameOfListing = "Dummy";
    await client.db("sample_airbnb").collection("listingsAndReviews")
        .deleteOne({ name: nameOfListing })
        .then(result => {
            console.log(`${result.deletedCount} document(s) was/were deleted.`);
            res.status(200).send({ message: `Successfully deleted` })
        })
        .catch(err => {
            console.log('error while deleting')
            res.status(500).send({ message: `Error during deletion '${err}'` })
        })
})

app.put('/listings/:name', async (req, res) => {
    let nameOfListing = req.params.name;
    let updatedListing = req.body;
    await client.db("sample_airbnb").collection("listingsAndReviews")
        .updateOne({ name: nameOfListing }, { $set: updatedListing })
        .then(result => {
            console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            console.log(`${result.modifiedCount} document(s) was/were updated.`);
            if (result.matchedCount > 0) {
                res.status(200).send({ message: `Successfully updated ${result.modifiedCount} document` })
            } else {
                res.status(200).send({ message: `No matching record to update` })
            }
        })
        .catch(err => {
            console.log('error while updating')
            res.status(500).send({ message: `Error while updating '${err}'` })
        })
})


async function closeDb() {
    await client.close();
}
// closeDb();

// Server start
app.listen(5000, () => console.log('server running on port 5000'));