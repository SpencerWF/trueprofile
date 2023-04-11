/**
 * Data Structure Interfaces
 */

/**
 * Necessary Imports
 */
import Twit from "twit";
import { Client } from "twitter-api-sdk";
const fs = require('fs');

/**
 * Necessary Defines
 */
// Used for twitter api v1.1
var twit_dict = {};

// const T = new Twit({
//     consumer_key: process.env.TWITTER_CONSUMER_KEY,
//     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//     access_token: process.env.TWITTER_ACCOUNT_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCOUNT_ACCESS_SECRET
// })


// Used for twitter api v2
const twitter_client = new Client(process.env.TWITTER_BEARER_TOKEN);

/**
 * Exported Functions
 */
export const twitter_test = async (unique_id: string, access_token: string, access_token_secret: string) => {
    const buff = await fs.readFileSync('cat_400x400.jpg');
    const base64data = buff.toString('base64');
    const T = get_twit(unique_id, access_token, access_token_secret);
    if(T) {
        T.post('account/update_profile_image', { name:'cat', image: base64data}, function(err, data) {
            console.log(data);
        });
    } else {
        console.error("get_twit not working");
    }
}

export const get_twitter_profile_picture = async (twitter_username: string) => {
    // Get data from twitter such as profile picture url
    const user_data = await get_twitter_data(twitter_username);
    if(user_data) {
        const image_url = user_data.data.profile_image_url.replace("normal", "400x400");
        return image_url;
    }

    return null;
}

export const set_profile_picture = async (unique_id: string, access_token: string, access_token_secret: string, image_data: string | Buffer) => {
    // let buff = await fs.readFileSync('cat_400x400.jpg');
    const base64data = image_data.toString('base64');
    const T = get_twit(unique_id, access_token, access_token_secret);
    T.post('account/update_profile_image', { image: base64data}, function() {
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

// export const get_twitter_request_token = async () => {
//     T.post('oauth/request_token', {
//         oauth_callback: "https%3A%2F%2Fgeniecreator.com%2Ftwitter-login"
//     });
//}

/**
 * Necessary Functions
 */
function get_twit(unique_id: string, access_token: string, access_token_secret: string) {
    if(twit_dict[unique_id] === undefined) {
        try{
            twit_dict[unique_id]= new Twit({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token: access_token,
                access_token_secret: access_token_secret
            })
        } catch (err) {
            console.error(`Could not create twit with access token and access token secret, ${err}`);
            return false;
        }
    }

    return twit_dict[unique_id];
}

/**
 * Needed for creation of twitter images
const offline_image_name: string = await CanvasService.

const online_profile: BaseProfile = {
    name: "Online",
    custom_img: "",
    custom_text: 
}
await ProfileService.create(streamer_id, online_profile);
 */