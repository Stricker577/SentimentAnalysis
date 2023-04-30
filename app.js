//configure requirements
const express = require('express');
const text = "This project";
const twitter = require('twitter');

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

//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

//start running the website
app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
});

//call the azure sentiment analysis API
app.get('/', (req, res, next) => {
    //This fetch is designed to make a post request to the analysis API 
    fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
            documents: [
                {
                    id: "1",
                    language: "en",
                    text: text
                }
            ]
        }),
        headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": accessKey
        }
    })
    //take the dataset and convert it to a json
    .then(response => response.json())
    //based on the response, take the sentiment score of the dataset
    .then(data => {
        const sentimentScore = data.documents[0].sentiment;
        res.send(`Sentiment score for "${text}": ${sentimentScore}`);
    })
    //if there is an error, keep moving on.
    .catch(err=>next(err));
})