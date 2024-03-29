/**
 * Datamodel Interfaces
 */
import { BaseStreamer, Tokens } from "./streamer.interface";
// import { Streamers } from "./streamers.interface";
import { Twitch_Streamer, auth_twitch, deleteSubscriptions, init_listener, list_twitch_subscriptions} from "../twitch/twitch.service";
import * as twitterService from "../twitter/twitter.service";
import * as canvasService from "../canvas/canvas.service";
import { AccessToken } from "@twurple/auth/lib";

/**
 * Necessary Imports
 */
import mysql from "mysql2/promise";
import path from "path";
// import { stream } from "twitter-api-sdk/dist/request";
import { HelixPrivilegedUser } from "@twurple/api/lib";
import { test } from "node:test";

/**
 * Necessary Defines
 */
var sql_port: number;

if(typeof process.env.SQL_PORT == 'string') {
    sql_port = parseInt(process.env.SQL_PORT);
} else {
    process.exit(1);
}

const mysqlConfig = {
    host: process.env.SQL_HOST,
    port: sql_port,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
}

// if(process.env.MYSQL != 'true') {
    // let streamers: Streamers = [];
// }

/**
 * Service Functions
 */

// export const findall = async (): Promise<Streamer[]> => {

// }

export const find = async (unique_id: string): Promise<BaseStreamer | false> => {
    if(process.env.MYSQL == 'true') {
        const queryString = "SELECT unique_id, email, account_type, youtube_name, reddit_name, twitch_name, twitter_name, status FROM streamers WHERE unique_id=?";
        let streamer: BaseStreamer;
        const db = await makeDb();
        try{
            const rows = (await db.query(queryString, [unique_id]))[0] as unknown;

            // Converting output from service into BaseStreamer format, stripping any hidden information
            if(Array.isArray(rows) && rows.length>0) {
                streamer = {
                    email: rows[0][`email`],
                    account_type: rows[0]["account_type"],
                    youtube_name: rows[0]["youtube_name"],
                    reddit_name: rows[0]["reddit_name"],
                    twitch_name: rows[0]["twitch_name"],
                    twitter_name: rows[0]["twitter_name"],
                    status: rows[0]["status"],
                }
                console.log("Streamer is");
                console.log(streamer);

                return streamer;
            }
            
            return false;
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err);
        } finally {
            await db.close();
        }
    } else {
        // Handle test case
    }

    return false;
}

export const setup_tracking = async () => {
    const del_result = await deleteSubscriptions();
    if(del_result) {
        const sub_result = await setup_twitch_events();
        if(sub_result) {
            console.log("Subscription Count matches");
        } else {
            console.log("Subscription count does not match");
        }
    }


    // const image_url = await twitterService.get_twitter_profile_picture("3dSpencer");
    // const test_tokens: Tokens | null = await get_twitter_access_tokens('auth0|6342bd5808c244ef54eeb787');
    // if(test_tokens !== null) {
    //     twitterService.twitter_test('auth0|6342bd5808c244ef54eeb787', test_tokens['twitter_access_token'], test_tokens['twitter_access_token_secret']);
    // } else {
    //     console.log("Could not get twitter access tokens");
    // }
    // twitterService.set_profile_picture("3dSpencer", await canvasService.draw_circle_from_url(image_url));
    // const user_data = await twitterService.get_twitter_data("3dspencer");
    // console.table(user_data);
}

export const create = async (unique_id: string, streamer: BaseStreamer) => {
    if(process.env.MYSQL == 'true') {
        const queryString = "INSERT INTO streamers (unique_id, email, account_type, status) VALUES (?, ?, ?, ?);";
        const db = await makeDb();
        try{
            //Assume a new streamer is creating a free account and has set their account to active (the default)
            const result = await db.query(queryString, [unique_id, streamer.email, streamer.account_type, 'active']);

            if(result) {
                return streamer;
            }
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err);
        } finally {
            await db.close();
        }
        return false;

    } //TODO: Add else if needed

    return false;
}

export const del = async(streamer_id: string) => {
    if(process.env.MYSQL == 'true') {
        const queryString = "DELETE FROM streamers WHERE unique_id=?";
        const db = await makeDb();

        try {
            db.query(queryString, [streamer_id]);
        } catch (err) {
            console.log(err);
        } finally {
            await db.close();
        }
    } //TODO: Add else if needed

    return null;
}

/**
 * 
 */

async function makeDb() {
    const connection = await mysql.createConnection( mysqlConfig );

    return {
        async query( sql: any, args: any ) {
            return await connection.query(sql, args);
        },
        async close() {
            return await connection.end();
        }
    }
}

export const add_twitter = async (unique_id: string, twitter_name: string) => {
    const user_data = await twitterService.get_twitter_data(twitter_name);
    if(user_data && user_data.data !== undefined) {
        if(process.env.MYSQL == "true") {
            const queryString = "UPDATE streamers SET twitter_name=?, twitter_id=? WHERE unique_id=?";
            const db = await makeDb();
            try{
                db.query(queryString, [twitter_name, user_data.data.id, unique_id]);
            } catch (err) {
                // Once a discord server is setup should report errors to a webhook on discord
                console.log(err);
            } finally {
                await db.close();
            }
        }
    }
}

export const add_twitter_access = async (unique_id: string, twitter_access_token: string, twitter_access_secret: string, twitter_id: string, twitter_name: string) => {
    if(process.env.MYSQL == "true") {
        console.log(`Setting Twitter details for ${twitter_name}`)
        const queryString = "UPDATE streamers SET twitter_access_token=?, twitter_access_token_secret=?, twitter_id=?, twitter_name=? WHERE unique_id=?";
        const db = await makeDb();
        try{
            db.query(queryString, [twitter_access_token, twitter_access_secret, twitter_id, twitter_name, unique_id]);
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err);
        } finally {
            await db.close();
        }
    }
}

export const get_twitter_temp_oauth_secret = async (unique_id: string) => {
    if(process.env.MYSQL == "true") {
        const queryString = "SELECT twitter_oauth_token_secret FROM streamers WHERE unique_id=?";
        const db = await makeDb();

        try{
            const rows = (await db.query(queryString, [unique_id]))[0] as unknown;

            if(Array.isArray(rows) && rows.length==0) {
                return rows[0]['twitter_oauth_token_secret'];
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
        } finally {
            await db.close();
        }
    }
}

export const add_twitter_oauth = async (unique_id: string, twitter_oauth_token: string, twitter_oauth_token_secret: string) => {
    if(process.env.MYSQL == "true") {
        const queryString = "UPDATE streamers SET twitter_oauth_token=?, twitter_oauth_token_secret=? WHERE unique_id=?";
        const db = await makeDb();

        try{
            db.query(queryString, [twitter_oauth_token, twitter_oauth_token_secret, unique_id]);
        } catch (err) {
            console.log(err);
        } finally {
            await db.close();
        }
    }
}

export const add_twitch = async (unique_id: string, twitch_code: string) => {
    const accessToken: AccessToken | false = await auth_twitch(twitch_code);

    if(accessToken) {
        
        StreamersList[unique_id] = {}
        StreamersList[unique_id]["Twitch_Streamer"] = await new Twitch_Streamer(unique_id, {accessToken: accessToken}); //TODO: Replicate this for each member of database

        const twitch_data: HelixPrivilegedUser = await StreamersList[unique_id]["Twitch_Streamer"].retreive_twitch_data(store_twitch_access_token);
        const db = await makeDb();
        // const checkQueryString = "SELECT unique_id FROM streamers WHERE twitch_id=?";

        // const rows = await db.query(checkQueryString, [StreamersList[unique_id]["Twitch_Streamer"].twitch_id]);

        // if(Array.isArray(rows[0]) && rows[0].length==0) {
        const queryString = "UPDATE streamers SET twitch_name=?, twitch_id=?, twitch_accessToken=?, twitch_refreshToken=?, twitch_obtainmentTimestamp=? WHERE unique_id=?";

        try {
            db.query(queryString, [twitch_data.name, twitch_data.id, accessToken.accessToken, accessToken.refreshToken, accessToken.obtainmentTimestamp, unique_id]);
        } catch (error) {
            console.log(error);
        } finally {
            db.close();
        }

        console.log("Setup subscriptions");

        //TODO: Setup proper timing on signups
        // setTimeout(() => {
        StreamersList[unique_id]["Twitch_Streamer"].setup_live_subscriptions([streamer_go_live, streamer_go_offline]);
        // }, 5000);
    }

    return null;
}

export const setup_twitch_events = async () => {
    const db = await makeDb();
    const queryString = "SELECT unique_id, twitch_id FROM streamers WHERE status='active'";
    let subscription_count = 0;
    let reply;
    let streamer_count = 0;

    try {
        reply = (await db.query(queryString, []))[0] as unknown;
        if(Array.isArray(reply)) {
            for (let index = 0; index < reply.length; index++) {
                if(reply[index].twitch_id!==null) {
                    // const access_token = reply[0][index].twitch_accessToken;
                    // const refresh_token = reply[0][index].twitch_refreshToken;
                    streamer_count += 1;
                    console.log(`Setting up for streamer with twitch_id ${reply[index].twitch_id}`);

                    // const twitch_streamer: Twitch_Streamer = await new Twitch_Streamer(reply[index].unique_id, {twitch_id: reply[index].twitch_id});
                    // twitch_streamer.setup_live_subscriptions([streamer_go_live, streamer_go_offline]);
                    const access_token: AccessToken | false = await get_twitch_access_token(reply[index].twitch_id);
                    if(access_token) {

                        StreamersList[reply[index].unique_id] = {}
                        StreamersList[reply[index].unique_id]["Twitch_Streamer"] = await new Twitch_Streamer(reply[index].unique_id, {twitch_id: reply[index].twitch_id, accessToken: access_token});
                        const subscription_return = await StreamersList[reply[index].unique_id]["Twitch_Streamer"].setup_live_subscriptions([streamer_go_live, streamer_go_offline]);
                        if(subscription_return) {
                            subscription_count += 2;
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        db.close();
    }

    await init_listener();
    const sub_list = await list_twitch_subscriptions();
    if(sub_list !== false) {
        return subscription_count == sub_list['total'];
    } else {
        return false;
    }
}

export const streamer_go_live = async (twitch_id: string) => {
    // Need to react to the streamer going live
    const db = await makeDb();
    const queryString = "SELECT unique_id, twitter_access_token, twitter_access_token_secret, twitter_name, twitter_id FROM streamers WHERE twitch_id=?"
    let reply;

    try {
        reply = (await db.query(queryString, [twitch_id]))[0] as unknown;

        if(Array.isArray(reply)) {
            const image_url: string | null = await twitterService.get_twitter_profile_picture(reply[0].twitter_id);
            if(typeof image_url == 'string') {
                const filename = await canvasService.save_image_from_url(image_url);
                if(filename !== null) {
                    store_image_filename(reply[0].unique_id, filename);
                    
                    const image_data = await canvasService.draw_circle_from_url(filename);

                    twitterService.set_profile_picture(reply[0].unique_id, reply[0].twitter_access_token, reply[0].twitter_access_token_secret, image_data);
                } else {
                    console.log("No image returned, need to update discord once created.")
                }
            }
        }

    } finally {
        db.close();
    }
}

export const streamer_go_offline = async (twitch_id: string) => {
    const db = await makeDb();
    const queryString = "SELECT unique_id, twitter_access_token, twitter_access_token_secret, twitter_name, twitter_return_image FROM streamers WHERE twitch_id=?";
    const queryString2 = "UPDATE streamers SET twitter_return_image=NULL WHERE twitch_id=?";
    let reply;

    try {
        reply = (await db.query(queryString, [twitch_id]))[0] as unknown;
        if(Array.isArray(reply)) {
            db.query(queryString2, [twitch_id])
            const filepath: string = path.join(__dirname, '..', 'images', `${reply[0].twitter_return_image}.png`);
            if(filepath != "null.png") {
                const image_data: Buffer | null = await canvasService.retrieve_image_from_url(filepath);
                if(image_data !== null) {
                    twitterService.set_profile_picture(reply[0][0].unique_id, reply[0].twitter_access_token, reply[0].twitter_access_secret, image_data);
                }
            } else {
                console.log("Image string is null");
            }
        }
    } finally {
        db.close();
    }
}

export const del_twitter = async (unique_id: string) => {
    const db = await makeDb();
    const queryString = "UPDATE streamers SET twitter_name=NULL, twitter_id=NULL, twitter_oauth_token=NULL, twitter_oauth_secret=NULL WHERE unique_id=?";
    console.log(`Delete Twitter ${unique_id} - service`);

    try {
        db.query(queryString, [unique_id]);
    } catch (e) {
        console.error(e);
    } finally {
        db.close();
    }
}

export const del_twitch = async (unique_id: string) => {
    const db = await makeDb();
    const queryString = "UPDATE streamers SET twitch_name=NULL, twitch_id=NULL, twitch_accessToken=NULL WHERE unique_id=?";
    console.log(`Delete Twitch ${unique_id} - service`);

    try {
        db.query(queryString, [unique_id]);
    } catch (e) {
        console.error(e);
    } finally {
        db.close();
    }
}

async function store_image_filename(unique_id: string, filename: string) {
    const db = await makeDb();
    const queryString = "UPDATE streamers SET twitter_return_image=? WHERE unique_id=?";
    // let reply;

    try {
        db.query(queryString, [filename, unique_id]); //TODO: await if needed
    } finally {
        db.close();
    }
}

export const store_twitch_access_token = async (user_id: string, access_token: AccessToken) => {
    const db = await makeDb();
    const queryString = "UPDATE streamers SET twitch_accessToken=?, twitch_refreshToken=?, twitch_expiresIn=?, twitch_obtainmentTimestamp=?, twitch_scope=? WHERE twitch_id=?";
    // let reply;

    try {
        db.query(queryString, [access_token.accessToken, access_token.refreshToken, access_token.expiresIn, access_token.obtainmentTimestamp, access_token.scope.toString(), user_id]); //TODO: await if needed
    } catch {
        // TODO: Need a functional catch here in the scenario that the connection to the database cannot be established
    } finally {
        db.close();
    }
}

async function store_twitch_data_first_time(unique_id: string, access_token: AccessToken, twitch_id: string, twitch_name: string) {
    const db = await makeDb();
    const queryString = "UPDATE streamers SET twitch_id=?, twitch_name=?, twitch_accessToken=?, twitch_refreshToken=?, twitch_expiresIn=?, twitch_scope=? WHERE unique_id=?";

    try {
        db.query(queryString, [twitch_id, twitch_name, access_token.accessToken, access_token.refreshToken, access_token.expiresIn, access_token.scope, unique_id]);
    } catch (e) {
        console.log(e);
        //TODO: Add proper catch functionality
    } finally {
        db.close();
    }
}

async function get_twitch_access_token(twitch_id: string): Promise<AccessToken | false> {
    if(process.env.MYSQL == 'true') {
        const db = await makeDb();
        const queryString = "SELECT twitch_accessToken, twitch_refreshToken, twitch_expiresIn, twitch_obtainmentTimestamp, twitch_scope FROM streamers WHERE twitch_id=?";

        const rows = (await db.query(queryString, twitch_id))[0] as unknown;

        if(Array.isArray(rows) && rows.length > 0) {
            //@ts-ignore
            var return_token: AccessToken = {
                accessToken: rows[0]['twitch_accessToken'],
                expiresIn: rows[0]['twitch_expiresIn'],
                obtainmentTimestamp: rows[0]['twitch_obtainmentTimestamp'],
                refreshToken: rows[0]['twitch_refreshToken'],
            }

            if(rows[0]['twitch_scope'] !== null) {
                return_token.scope = rows[0]['twitch_scope'].split(',')
            } else {
                return_token.scope = [];
            }

            return return_token;
        }
        console.log("Could not find user with access token for that twitch ID")
        return false;
    }

    console.log("Could not get access token for that twitch ID");
    return false;
}

async function get_twitter_access_tokens(unique_id: string): Promise<Tokens | null> {
    if(process.env.MYSQL == 'true') {
        const db = await makeDb();
        const queryString = "SELECT twitter_access_token, twitter_access_token_secret FROM streamers WHERE unique_id=?";

        try {
            const rows = (await db.query(queryString, [unique_id]))[0] as unknown;
            if(Array.isArray(rows) && rows.length>0) {

                const ret_obj = {
                    'twitter_access_token': rows[0]['twitter_access_token'],
                    'twitter_access_token_secret': rows[0]['twitter_access_token_secret']
                }
                return ret_obj;
            }
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            db.close();
        }
    }
    return null;
}

const StreamersList: {[key: string]: any} = {};