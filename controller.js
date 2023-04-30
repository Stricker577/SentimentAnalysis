//configure requirements 
const express = require('express');
const router = express.Router();
const twitter = require('twitter-lite');
const bodyParser = require('body-parser');
const axios = require('axios');

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

//This is used to allow our searchQuery to take the brand name that is provided.
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('index', {brandName: '', sentimentType: '', sentimentResult: '', tweets: []});
});

router.post('/', async (req, res, next) => {
    //create the search query for the user. Also remove retweets and replies from the result
    const brandName = req.body.brand;
    const searchQuery = `${brandName} -filter:retweets -filter:replies`;

    //look at the last 10 tweets that were created as our search data. We are limited to only 10 tweets at a time.
    const tweetData = {
        q: searchQuery,
        lang: "en",
        result_type: "recent",
        count: 10
    };

    try {
        //use our twitter access key to search tweets based on the query we provided.
        const tweets = await twitteraccess.get('search/tweets', tweetData);

        //This line creates an array of the tweets that were given to us by our data 
        const tweetItems = tweets.statuses.map(status => status.text);

        //This line creates an array of the tweets that were given to us by our data 
        const documentData = {
            documents: tweetItems.map((text, index) => ({id: String(index), language: "en", text})),
        };

        //send our tweet array to azure in order to get back our analysis
        const response = await axios.post(endpoint, documentData, {
            //add our subsciption key to gain access to perform this action
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": accessKey
            }
        });

        //based on the response from above, this will be our sentiment analysis. We can then perform the equation following to gain the average sentiment based on all of the responses.
        const sentimentData = response.data;
        const averageSentiment = sentimentData.documents.reduce((total, current) => total + current.confidenceScores.positive, 0) / sentimentData.documents.length;

        //once we have gathered our results based on the sentiment score, parse this to display a positive neutral or negative response.
        let sentimentResult = '';
        if (averageSentiment > 0.66) {
            sentimentResult = 'Positive';
        } else if (averageSentiment < 0.33) {
            sentimentResult = 'Negative';
        } else {
            sentimentResult = 'Neutral';
        }

        //send brand name averagesentiment and tweetItems to index so it can display the most recent tweets and the overall brands sentiment
        res.render('index', {brandName: brandName, sentimentType: sentimentResult, sentimentResult: averageSentiment, tweets: tweetItems});
    } catch (err) {
        //if there is an error, keep moving on.
        next(err);
    }
});


//export our model to app.js
module.exports = router;