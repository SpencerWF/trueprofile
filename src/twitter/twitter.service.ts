/**
 * Data Structure Interfaces
 */

/**
 * Necessary Imports
 */
import Twit from "twit";
// var Twit = require('twit');
var fs = require('fs');

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
    let buff = fs.readFileSync('cat_400x400.jpg');
    let base64data = buff.toString('base64');
    T.get('account/update_profile_image', { name:'cat', image: base64data}, function(err, data, response) {
        console.log(data);
    });
}