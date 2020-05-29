let listingAndReviews = require('../model/ListingsAndReviews'),
    express = require('express'),
    router = express.Router();

// Get all
router.get('/', async (req, res) => {
    await listingAndReviews.find()
        .then((result) => {
            if (result) {
                res.status(200).send({ data: result })
            }
        })
        .catch(err => {
            res.status(200).send({ data: null, message: err })
        })
});

// Filter by name
router.get('/:name', async (req, res) => {
    let nameOfListing = req.params.name;
    let result = await listingAndReviews.findOne({ name: nameOfListing })

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        res.status(200).send({ data: result, message: `Found a listing in the collection with the name '${nameOfListing}':` })
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
        res.status(200).send({ data: null, message: `No listings found with the name '${nameOfListing}'` })
    }
});

// Create new
router.post('/', (req, res) => {
    const newListing = new listingAndReviews(req.body)
    newListing.save()
        .then((ress) => {
            res.send(ress);
        })
        .catch((err) => {
            console.log('err', err)
            res.status(500).send(err);
        });
})

// delete one
router.delete('/:name', async (req, res) => {
    let nameOfListing = req.params.name;
    // TODO
})

// update one
router.put('/:name', async (req, res) => {
    let nameOfListing = req.params.name;
    let updatedListing = req.body;
    // TODO
})

module.exports = router;