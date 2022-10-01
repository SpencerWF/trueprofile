/**
 * Data Structure Interfaces
 */

/**
 * Necessary Imports
 */
import Twit from "twit";
import { Client } from "twitter-api-sdk";
var fs = require('fs');

/**
 * Necessary Defines
 */
// Used for twitter api v1.1
var T = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCOUNT_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCOUNT_ACCESS_SECRET
})

// Used for twitter api v2
const twitter_client = new Client(process.env.TWITTER_BEARER_TOKEN);

/**
 * Exported Functions
 */
export const twitter_test = async () => {
    let buff = await fs.readFileSync('cat_400x400.jpg');
    let base64data = buff.toString('base64');
    T.post('account/update_profile_image', { name:'cat', image: base64data}, function(err, data, response) {
        console.log(data);
    });
}

export const get_twitter_profile_picture = async (twitter_username: string) => {
    const user_data = await get_twitter_data(twitter_username);
    if(user_data) {
        const image_url = user_data.data.profile_image_url.replace("normal", "400x400");
        return image_url;
    }

    return null;
}

export const set_profile_picture = async (access_token: string, access_token_secret: string, image_data: string | Buffer) => {
    // let buff = await fs.readFileSync('cat_400x400.jpg');
    let base64data = image_data.toString('base64');
    T.post('account/update_profile_image', { image: base64data}, function(err, data, response) {
        // console.log(data);
    });
}

export const get_twitter_data = async (twitter_username: string) => {
    try{
        const user = await twitter_client.users.findUserByUsername(twitter_username, {"user.fields":["profile_image_url"]});
        if(!user) {
            throw new Error("No user with username found");            
        } else {
            return user;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * Necessary Functions
 */
// function get_twitter_access(username: string) {
    
// }