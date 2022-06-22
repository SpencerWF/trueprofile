/**
 * Datamodel Interfaces
 */
import { Streamer, BaseStreamer } from "./streamer.interface";
import { Streamers } from "./streamers.interface";
import { Twitch_Streamer, retrieve_twitch_id } from "../twitch/twitch.service";

/**
 * Necessary Imports
 */
import mysql from "mysql2/promise";

/**
 * Necessary Defines
 */
const mysqlConfig = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
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

export const create = async (streamer: BaseStreamer) => {
    if(process.env.MYSQL == 'true') {
        const queryString = "INSERT INTO streamer (unique_id, username, password, account_type) VALUES (UUID_TO_BIN(UUID()), ?, ?);";
        const db = await makeDb(mysqlConfig);
        try{
            db.query(queryString, [streamer.username, streamer.account_type]);
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

function makeDb(config) {
    const connection = mysql.createConnection( mysqlConfig );

    return {
        async query( sql, args ) {
            return await connection.query(sql, args);
        },
        async close() {
            return await connection.end();
        }
    }
}

export const add_twitch = async (username: string, twitch_name: string) => {
    const twitch_id = await retrieve_twitch_id(twitch_name);

    if(twitch_id) {
        const db = makeDb(mysqlConfig);
        const checkQueryString = "SELECT unique_id FROM streamers WHERE twitch_id=?";

        const rows = await db.query(checkQueryString, [twitch_id]);

        if(rows[0].length==0) {
            const queryString = "UPDATE streamers SET twitch_name=?, twitch_id=? WHERE unique_id=?";

            try {
                db.query(queryString, [twitch_name, twitch_id, username]);
            } catch (error) {
                console.log(error);
            } finally {
                db.close();
            }

            // Setup Twitch Streamer and Subscribe to online/offline events
            const twitch_streamer: Twitch_Streamer = new Twitch_Streamer(twitch_name);

            twitch_streamer.setup_live_subscriptions();
            console.log("Setup subscriptions");
        }
    }

    return null;
}