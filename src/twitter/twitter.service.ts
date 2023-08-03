/**
 * Data Structure Interfaces
 */

/**
 * Necessary Imports
 */
import Twit from "twit";
import { Twits, Clients } from "./twitter.interface";
import { Client } from "twitter-api-sdk";
const fs = require('fs');

/**
 * Necessary Defines
 */
// Used for twitter api v1.1
var twit_dict: Twits = {};
var twitter_clients: Clients = {};

// const T = new Twit({
//     consumer_key: process.env.TWITTER_CONSUMER_KEY,
//     consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//     access_token: process.env.TWITTER_ACCOUNT_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCOUNT_ACCESS_SECRET
// })


// Used for twitter api v2
var twitter_client: Client;
var twitter_consumer_key: string;
var twitter_consumer_secret: string;
if(typeof process.env.TWITTER_BEARER_TOKEN == 'string') {
    twitter_client = new Client(process.env.TWITTER_BEARER_TOKEN);
} else {
    process.exit(1);
}

if(typeof process.env.TWITTER_CONSUMER_KEY == 'string') {
    twitter_consumer_key = process.env.TWITTER_CONSUMER_KEY;
} else {
    process.exit(1);
}

if(typeof process.env.TWITTER_CONSUMER_SECRET == 'string') {
    twitter_consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
} else {
    process.exit(1);
}
/**
 * Exported Functions
 */
export const twitter_test = async (unique_id: string, access_token: string, access_token_secret: string) => {
    const buff = await fs.readFileSync('qpdfme93jfnso37t8e9smqbe.jpg');
    const base64data = buff.toString('base64');
    const T: Twit | false = get_twit(unique_id, access_token, access_token_secret);
    if(T) {
        //@ts-ignore
        T.post('account/update_profile_image', { name:'cat', image: base64data}, function(err, data) {
            console.log(data);
        });
    } else {
        console.error("get_twit not working");
    }
}

export const get_twitter_profile_picture = async (twitter_id: string) => {
    // Get data from twitter such as profile picture url
    const user_data = await get_twitter_data_by_id(twitter_id);
    if(user_data) {
        if(user_data.data?.profile_image_url !== undefined) {
            const image_url = user_data.data.profile_image_url.replace("normal", "400x400");
            return image_url;
        }
    }

    return null;
}

export const set_profile_picture = async (unique_id: string, access_token: string, access_token_secret: string, image_data: Buffer) => {
    // let buff = await fs.readFileSync('cat_400x400.jpg');
    const base64data = image_data.toString('base64');
    const T: Twit | false = get_twit(unique_id, access_token, access_token_secret);
    if(T) {
        //TODO: Can we fix this instead of ignoring it?
        //@ts-ignore
        T.post('account/update_profile_image', {image: base64data}, function(err, data, response) {
            console.log(data);
        });
    }
}

export const get_twitter_data = async (twitter_name: string) => {
    try{
        const user = await twitter_client.users.findUserByUsername(twitter_name, {"user.fields":["profile_image_url"]});
        if(!user) {
            throw new Error("No user with name found");            
        } else {
            return user;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const get_twitter_data_by_id = async (twitter_id: string) => {
    try{
        var user;
        if(twitter_id == process.env.TWITTER_ID) {
            user = await twitter_client.users.findMyUser({"user.fields":["profile_image_url"]});
        } else {
            user = await twitter_client.users.findUserById(twitter_id, {"user.fields":["profile_image_url"]});
        }
        if(!user) {
            throw new Error("No user with id found")
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
function get_twit(unique_id: string, access_token: string, access_token_secret: string): Twit | false {
    console.log(`Unique_id: ${unique_id}, access token ${access_token}, access token secret ${access_token_secret}`);
    if(twit_dict[unique_id] === undefined && typeof process.env.TWITTER_CONSUMER_KEY) {
        try{
            twit_dict[unique_id] = new Twit({
                consumer_key: twitter_consumer_key,
                consumer_secret: twitter_consumer_secret,
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

function get_twitter_client(unique_id: string, access_token: string, access_token_secret: string): Client | false {
    console.log(`Unique ID: ${unique_id}, Access Token: ${access_token}, Access Token Secret: ${access_token_secret}`);
    if(twitter_clients[unique_id] === undefined) {
        if(typeof process.env.TWITTER_CONSUMER_KEY == 'string') {
            try {

            } catch(err) {
                console.error(`Could not create Twitter Client with access token and access token secret, ${err}`);
                return false;
            }
        }
    } else {
        return twitter_clients[unique_id];
    }
    return false;
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