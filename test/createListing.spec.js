const assert = require('assert');
const ListingsAndReviews = require('../model/ListingsAndReviews');
const app = require('../index.js'),
    chai = require('chai'),
    request = require('supertest');

beforeEach(() => {
    // any authentication method & drop test collection
    ListingsAndReviews.deleteMany()
        .then(() => {
            console.log('Deleted all docs')
        })
        .catch(err => console.error('Error deleting docs', err))
})

after(() => {
    setTimeout(() => {
        process.exit(1);
    }, 1000)
})

describe('POST', function () {
    it('creates a listing record', function (done) {
        // get this data from function in testutil.js
        let dummyObj = {
            "name": "IMDB " + Date.now().toString(),
            "summary": "dummy summary",
            "bedrooms": 2,
            "bathrooms": 3,
            "phone": "123-455-7896"
        }

        request(app)
            .post('/api/v1/listings')
            .send(dummyObj)
            .set('content-type', 'application/json')
            // .expect('Content-Type', 'json')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                ListingsAndReviews.findOne({ name: dummyObj.name })
                    .then((lnr) => {
                        chai.expect(lnr).to.have.property('name', dummyObj.name)
                        chai.expect(lnr).to.have.property('summary', dummyObj.summary)
                        chai.expect(lnr).to.have.property('bedrooms', dummyObj.bedrooms)
                        chai.expect(lnr).to.have.property('bathrooms', dummyObj.bathrooms)
                        chai.expect(lnr).to.have.property('phone', dummyObj.phone)

                        done()
                    })
                    .catch(err => done(err))
            });

    })
})
