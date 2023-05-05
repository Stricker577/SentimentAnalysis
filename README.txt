#Sentiment
Welcome to Sentiment Analysis by Andrew Kirkman!

#Descroption
This app is designed to combine two API's together for sentiment analysis with Azure Cognitive Services alongside of Twitter API. This app uses both API's to search 
Twitter for a brand Name/phrase and for Azure to provide sentiment analysis on its 10 item data set. In this project, we use only 10 twitter tweets as our Twitter
Student API only allows up to 10 pulls at once. In a future project, this can be upped to provide stronger and more accurate results. 

#Getting Started
1. You will need to have NodeJS installed on your machine. In our example, we use Node version 16. Different versions may provide different results
2. Create an Azure Cognitive Services account. Then, create a new Cognitive services multi-service account. You should be able to find your endpoint and keys there,
3. Create a Twitter Developer account. This may take a few days to process but once completed, from the home developer page you may find your keys/ endpoints.
4. Create an .env file that holds the following fields: (Note: This App does not use all of the fields below and these fields are secret. They will only be 
held on the local device)

    azureendpoint=<yourendpoint>
    azureaccesskey=<youraccesskey>
    twitterkey=<youraccesskey>
    twittersecretkey=<yoursecretkey>
    twitteracesstoken=<yourtoken>
    twitteracesstokensecret=<yoursecrettoken>
    
5. Run the application and navigate to localhost:3000

#Usage
1. Enter in a brand, phrase, etc to search for using the twitter API and hit submit.
2. Once the results have been posted, look for the sentiment analysis score and result on the first line. This for example will say:
"The Result of the brand test according to twitter is Neutral with a score of 0.33!"
3. The score that is processed is a score of 0-1, 0 being very negative with 1 being very positive. This can be converted to a percentage in future applications.

#Notes
Twitter API has rate limiting that may affect usability of this based on the developer license you have. This may be as little as 10 million tweets per month or higher.
This API will only grab the top 10 most recent tweets according to twitter. This is heavily reliant that you can trust the data that twitter is providing.
