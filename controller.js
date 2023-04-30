//configure requirements 
const express = require('express');
const router = express.Router();
const twitter = require('twitter-lite');
const bodyParser = require('body-parser');

//this uses dotenv to hide the keys on my local machine so that they are not revealed publically 
const dotenv = require('dotenv').config();

//endpoint and one of the two keys taken from Azure services that was set up
const endpoint = process.env.azureendpoint;
const accessKey = process.env.azureaccesskey;

//twitter api pull using keys that were generated through the developer.twitter.com portal
const twitteraccess = new twitter({
    consumer_key: process.env.twitterkey,
    consumer_secret: process.env.twittersecretkey,
    access_token_key: process.env.twitteracesstoken,
    access_token_secret: process.env.twitteracesstokensecret
});

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('index', {brandName: '', sentimentResult: '', tweets: []});
});

router.post('/', (req, res, next) => {
    //create the search query for the user. Also remove retweets and replies from the result
    const brandName = req.body.brand;
    const searchQuery = `${brandName} -filter:retweets -filter:replies`;

    //look at the last 10 tweets that were created as our search data
    const tweetData = {
        q: searchQuery,
        lang: "en",
        result_type: "recent",
        count: 10
    };

    twitteraccess.get('search/tweets', tweetData)
    .then(async tweets => {
        const tweetItems = tweets.statuses.map(status => status.text);

        const response = await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({
                documents: tweetItems.map((text, index) => ({ id: String(index), language: "en", text })),
            }),
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": accessKey
            }
        });
        const sentimentData = await response.json();
        const averageSentiment = sentimentData.documents.reduce((total, current) => total + current.confidenceScores.positive, 0) / sentimentData.documents.length;
        let sentimentResult = '';
        if (averageSentiment > 0.66) {
            sentimentResult = 'Positive';
        } else if (averageSentiment < 0.33) {
            sentimentResult = 'Negative';
        } else {
            sentimentResult = 'Neutral';
        }
        res.render('index', {brandName: brandName, sentimentResult: averageSentiment, tweets: tweetItems});
    })
    //if there is an error, keep moving on.
    .catch(err=>next(err));  
});


module.exports = router;