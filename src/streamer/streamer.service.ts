/**
 * Datamodel Interfaces
 */
import { Streamer, BaseStreamer } from "./streamer.interface";
import { Streamers } from "./streamers.interface";
import { Twitch_Streamer, retrieve_twitch_id, deleteAllSubscriptions } from "../twitch/twitch.service";
import * as twitterService from "../twitter/twitter.service";
import * as canvasService from "../canvas/canvas.service";

/**
 * Necessary Imports
 */
import mysql from "mysql2/promise";

/**
 * Necessary Defines
 */
const mysqlConfig = {
    host: process.env.SQL_HOST,
    port: parseInt(process.env.SQL_PORT),
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
};

/**
 * Service Functions
 */

// export const findall = async (): Promise<Streamer[]> => {

// }

// export const find = async (unique_id: string): Promise<Streamer> => {
//     if(process.env.MYSQL == 'true') {

//     } else {

//     }

//     return null;
// }

export const setup_tracking = async () => {
    deleteAllSubscriptions();

    setup_twitch_events();

    const image_url = await twitterService.get_twitter_profile_picture("3dSpencer");

    // twitterService.set_profile_picture("3dSpencer", await canvasService.draw_circle_from_url(image_url));
    // const user_data = await twitterService.get_twitter_data("3dspencer");
    // console.table(user_data);
}

export const create = async (streamer: BaseStreamer) => {
    if(process.env.MYSQL == 'true') {
        const queryString = "INSERT INTO streamers (unique_id, username, password, account_type) VALUES (UUID_TO_BIN(UUID()), ?, ?, ?);";
        const db = await makeDb(mysqlConfig);
        try{
            db.query(queryString, [streamer.username, streamer.password_hash, streamer.account_type]);
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err);
        } finally {
            await db.close();
        }

    } else {

    }

    return null;
}

export const update = async () => {
    if(process.env.MYSQL == 'true') {

    } else {

    }

    return null;
}

export const del = async () => {
    if(process.env.MYSQL == 'true') {

    } else {

    }

    return null;
}

/**
 * 
 */

async function makeDb(config) {
    const connection = await mysql.createConnection( mysqlConfig );

    return {
        async query( sql, args ) {
            return await connection.query(sql, args);
        },
        async close() {
            return await connection.end();
        }
    }
}

export const add_twitter = async (username: string, twitter_username: string) => {
    const user_data = await twitterService.get_twitter_data(twitter_username);
    if(user_data) {
        if(process.env.MYSQL == "true") {
            const queryString = "UPDATE streamers SET twitter_username=?, twitter_id=? WHERE username=?";
            const db = await makeDb(mysqlConfig);
            try{
                db.query(queryString, [twitter_username, user_data.data.id, username]);
            } catch (err) {
                // Once a discord server is setup should report errors to a webhook on discord
                console.log(err);
            } finally {
                await db.close();
            }
        }
    }
}

export const add_twitter_access = async (username: string, twitter_access_token: string, twitter_access_secret: string) => {
    if(process.env.MYSQL == "true") {
        const queryString = "UPDATE streamers SET twitter_access_token=?, twitter_access_token_secret=? WHERE username=?";
        const db = await makeDb(mysqlConfig);
        try{
            db.query(queryString, [twitter_access_token, twitter_access_secret, username]);
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err);
        } finally {
            await db.close();
        }
    }
}

export const add_twitch = async (username: string, twitch_name: string) => {
    const twitch_id = await retrieve_twitch_id(twitch_name);

    if(twitch_id) {
        const db = await makeDb(mysqlConfig);
        const checkQueryString = "SELECT unique_id FROM streamers WHERE twitch_id=?";

        const rows = await db.query(checkQueryString, [twitch_id]);

        if(Array.isArray(rows[0]) && rows[0].length==0) {
            const queryString = "UPDATE streamers SET twitch_name=?, twitch_id=? WHERE username=?";

            try {
                db.query(queryString, [twitch_name, twitch_id, username]);
            } catch (error) {
                console.log(error);
            } finally {
                db.close();
            }

            // Setup Twitch Streamer and Subscribe to online/offline events
            const twitch_streamer: Twitch_Streamer = new Twitch_Streamer(twitch_name);
            twitch_streamer.twitch_id = twitch_id;

            console.log("Setup subscriptions");
            setTimeout(() => {
                twitch_streamer.setup_live_subscriptions(streamer_go_live, streamer_go_offline);
            }, 5000);
        }
    }

    return null;
}

export const setup_twitch_events = async () => {
    const db = await makeDb(mysqlConfig);
    const queryString = "SELECT twitch_name, twitch_id FROM streamers WHERE twitch_id IS NOT NULL";
    var reply;

    try {
        reply = await db.query(queryString, []);

        for (let index = 0; index < reply[0].length; index++) {
            const twitch_name = reply[0][index].twitch_name;
            const twitch_id = reply[0][index].twitch_id;

            const twitch_streamer: Twitch_Streamer = new Twitch_Streamer(twitch_name);
            twitch_streamer.twitch_id = twitch_id;
            twitch_streamer.setup_live_subscriptions();
        }
    } catch (error) {
        console.log(error);
    } finally {
        db.close();
    }
}

export const streamer_go_live = async (twitch_id: string) => {
    // Need to react to the streamer going live
    const db = await makeDb(mysqlConfig);
    const queryString:string = "SELECT unique_id, twitter_access_token, twitter_access_token_secret, twitter_username FROM streamers WHERE twitch_id=?"
    var reply;

    try {
        reply = await db.query(queryString, [twitch_id]);

        const image_url = await twitterService.get_twitter_profile_picture(reply[0][0].twitter_username);
        const filename = await canvasService.save_image_from_url(image_url);

        store_image_filename(reply[0][0].unique_id, filename);
        const image_data = await canvasService.draw_circle_from_url(`${__dirname}/../image/${filename}.png`);

        twitterService.set_profile_picture(reply[0][0].twitter_access_token, reply[0][0].twitter_access_token_secret, image_data);
    } finally {
        db.close();
    }
}

export const streamer_go_offline = async (twitch_id: string) => {
    const db = await makeDb(mysqlConfig);
    const queryString: string = "SELECT unique_id, twitter_access_token, twitter_access_token_secret, twitter_username, twitter_return_image FROM streamers WHERE twitch_id=?";
    var reply;

    try {
        reply = await db.query(queryString, [twitch_id]);

        const image_data: string | Buffer = await canvasService.retrieve_image_from_url(`${__dirname}/../image/${reply[0][0].twitter_return_image}`)

        twitterService.set_profile_picture(reply[0][0].twitter_access_token, reply[0][0].twitter_access_secret, image_data);
    } finally {
        db.close();
    }
}

async function store_image_filename(unique_id: string, filename: string) {
    const db = await makeDb(mysqlConfig);
    const queryString = "UPDATE streamers SET twitter_return_image=? WHERE unique_id=?";
    var reply;

    try {
        reply = await db.query(queryString, [filename, unique_id]);
    } catch { 

    } finally {
        db.close();
    }
}