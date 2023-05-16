/**
 * Datamodel Interfaces
 */
import { Profile, BaseProfile } from "./profile.interface";

/**
 * Necessary Imports
 */
import mysql from "mysql2/promise";

var sql_port: number;

if(typeof process.env.SQL_PORT == 'string') {
    sql_port = parseInt(process.env.SQL_PORT);
} else {
    process.exit(1);
}

/**
 * Necessary Defines
 */
const mysqlConfig = {
    host: process.env.SQL_HOST,
    port: parseInt(process.env.SQL_PORT),
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

// }

export const find = async (unique_id: string, profile_id: string): Promise<Profile | null> => {
    if(process.env.MYSQL == 'true') {
        const queryString = "SELECT * FROM profiles WHERE unique_id=? AND profile_id=?";
        const db = await makeDb();
        try{
            const rows = (await db.query(queryString, [unique_id, profile_id]))[0];
            //TODO: Add find functionality
            if(Array.isArray(rows)) {
                console.log("Code needs to be added to handle finding profiles");
            }
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err)
        } finally {
            await db.close();
        }
    }// else {
        // Handle test case
    //}

    return null;
}

export const findProfileList = async (unique_id: string): Promise<BaseProfile[] | false> => {
    if(process.env.MYSQL == 'true') {
        const queryString = "SELECT * FROM profiles WHERE unique_id=?";
        const db = await makeDb();
        try{
            const rows = (await db.query(queryString, [unique_id]))[0] as unknown;
            const profiles = [];
            if(Array.isArray(rows)) {
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    profiles.push({
                        name: element["name"],
                        img_change_type: element["img_change_type"],
                        custom_img: element["custom_img"],
                        text_change_type: element["text_change_type"],
                        custom_text: element["custom_text"],
                    });
                }
                return profiles;
            }
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

export const create = async (unique_id: string, profile: BaseProfile): Promise<BaseProfile | null> => {
    if(process.env.MYSQL == 'true') {
        const queryString = "INSERT INTO profiles (unique_id, profile_id, name, img_change_type, custom_img, text_change_type, custom_text) VALUES (?, UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?);";
        const db = await makeDb();
        try{
            const rows = (await db.query(queryString, [unique_id, profile.name, profile.custom_img, profile.custom_text]))[0] as unknown;
            if(Array.isArray(rows)) {
                console.log("Need to complete profile create functionality");
            }
        } catch (err) {
            // Once a discord server is setup should report errors to a webhook on discord
            console.log(err);
            return null;
        } finally {
            await db.close();
        }

    }// else {
        
    // }

    return profile;
}

export const update = async(unique_id: string, profile_id: string, profile: BaseProfile) => {
    if(process.env.MYSQL == 'true') {
        const queryString = "UPDATE profiles SET name=?, img_change_type=?, custom_img=?, text_change_type=?, custom_text=? WHERE unique_id=? AND profile_id=?";
        const db = await makeDb();
        try{
            const rows = (await db.query(queryString, [profile.name, profile.custom_img, profile.custom_text, unique_id, profile_id]))[0] as unknown;
            if(Array.isArray(rows)) {
                console.log()
            }
        } catch (err) {
            console.log(err);
        } finally {
            await db.close();
        }
    } //else {

    // }

    return null;
}

// export const del = async(unique_id: string, profile_id: string) => {
//     if(process.env.MYSQL == 'true') {
//         const queryString = "DELETE FROM profiles WHERE unique_id=? AND profile_id=?";
//         const db = await makeDb(mysqlConfig);

//         try {
//             db.query(queryString, [unique_id, profile_id]);
//         } catch (err) {
//             console.log(err);
//         } finally {
//             await db.close();
//         }
//     } else {

//     }

//     return null;
// }

/**
 * 
 */

async function makeDb() {
    const connection = await mysql.createConnection( mysqlConfig );

    return {
        async query( sql: string, args: any ) {
            return await connection.query(sql, args);
        },
        async close() {
            return await connection.end();
        }
    }
}