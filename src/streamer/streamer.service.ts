/**
 * Datamodel Interfaces
 */
import { Streamer, BaseStreamer } from "./streamer.interface";
import { Streamers } from "./streamers.interface";

/**
 * Necessary Imports
 */
import mysql from "mysql2";
import util 
const mysqlConfig = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
};

/**
 * Service Functions
 */

export const findall = async (): Promise<Streamer[]> => {

}

export const find = async (unique_id: string): Promise<Item> => {
    if(process.env.MYSQL == 'true') {

    } else {

    }

    return null;
}

export const create = async (streamer: Streamer) => {
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
        query( sql, args ) {
            return await connection.query(sql, args);
        },
        close() {
            return await connection.end();
        }
    }
}