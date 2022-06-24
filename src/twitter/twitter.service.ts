/**
 * Data Structure Interfaces
 */

/**
 * Necessary Imports
 */
 import Twit from "twit";
// var Twit = require('twit');


/**
 * Necessary Defines
 */

var T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCOUNT_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCOUNT_ACCESS_SECRET
})

export const twitter_test = async () => {
    T.get('search/tweets', { q:'banana since:2011-07-11', count: 100}, function(err, data, response) {
        console.log(data);
    });
}