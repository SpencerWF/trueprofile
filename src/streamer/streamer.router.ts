/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "./streamer.service";
import { BaseStreamer } from "./streamer.interface";
import axios from "axios";
import { sign } from "crypto";

/**
 * Router Definition
 */
 
export const streamerRouter = express.Router();
var email_index: string;

if(typeof process.env.EMAIL_INDEX == 'string') {
    email_index = process.env.EMAIL_INDEX;
} else {
    process.exit(1);
}

const oauth = require('oauth');
const oauthConsumer = new oauth.OAuth(
    'https://twitter.com/oauth/request_token', 
    'https://twitter.com/oauth/access_token',
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    '1.0a',
    process.env.TWITTER_CALLBACK,
    'HMAC-SHA1'
)
const https = require('https');

var hmacsha1 = require('hmacsha1');

 /**
  * Controller Definitions
  */

// GET streamer/id/:streamerid

streamerRouter.get("/id", async(req: Request, res: Response) => {
    //Not using any authentication or authorization, but may implement a timer
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;
            // console.table(req.auth.payload[process.env.EMAIL_INDEX]); 
            // console.log(`Looking for information about ${streamer_id}`);

        try{
            let streamer: BaseStreamer | false = await StreamerService.find(streamer_id);
            console.log("Received streamer from service");
            console.table(streamer);

            if(streamer) {
                return res.status(200).send(streamer);
            } else {
                if(typeof req.auth.payload[email_index] == 'string') {
                    const new_streamer: BaseStreamer = {
                        email: req.auth.payload[email_index] as string,
                        account_type: "free",
                        status: "active"
                    }
                    streamer = await StreamerService.create(streamer_id, new_streamer);
                }
            }

            res.status(404).send("Streamer not found");
        } catch (e) {
            let errorMessage = "Failed without Error instance";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            res.status(500).send(errorMessage);
        }
    }
    res.status(401).send();
});

streamerRouter.get("/twitter/request_token", async(req: Request, res: Response) => {
    // Perform the first step in the Twitter OAuth process
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;

        try{
            // Confirm user exists in the database
            let streamer: BaseStreamer | false = await StreamerService.find(streamer_id);

            if(streamer) {
                try {
                    const reply: any = await getOAuthRequestToken();
                    //@ts-ignore
                    if(typeof reply == 'string' && reply[2]["oauth_callback_confirmed"] != 'true') {
                        res.status(500);
                    }
                    console.log(`OAuth Request Tokens `);
                    console.log(reply);
                    StreamerService.add_twitter_oauth(streamer_id, reply["oauthRequestToken"], reply["oauthRequestTokenSecret"]);
                    res.status(200).send(`https://api.twitter.com/oauth/authorize?oauth_token=${reply["oauthRequestToken"]}`);
                } catch (error) {
                    console.error(error);
                    res.status(401);
                }
            }
        } catch (e) {
            let errorMessage = "Failed without Error instance";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            res.status(500).send(errorMessage);
        }
    }
})

// GET streamer/id/:streamerid

// streamerRouter.get("/twitch/:twitchname", async(req: Request, res: Response) => {
//     const twitch_name: string = req.params.twitchid;

//     // Insert Auth here

//     try {
//         const streamer_id: string = await StreamerService.findIdByTwitchName(twitch_name);

//         if(streamer_id) {
//             return streamerRouter.get(streamer_id);
//         }
//         res.status(404).send("Streamer not found");
        
//     } catch (e) {
//         let errorMessage = "Failed without error instance";
//         if(e instanceof Error) {
//             errorMessage = e.message;
//         }
//         res.status(500).send(errorMessage); 
//     }

// });
// /api/streamer/twitch_code/

// POST streamer/id
streamerRouter.post("/id", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;
        // const streamer_email: string = req.auth.payload[process.env.EMAIL_INDEX];

        try {
            const streamer: BaseStreamer = req.body;
                // Creating streamer
                // const freshStreamer: BaseStreamer = {
                //     email: streamer_email,
                //     account_type: "free",
                //     status: "active",
                // }

            const newStreamer = await StreamerService.create(streamer_id, streamer);

            res.status(201).json(newStreamer);
        } catch (e) {
            let errorMessage = "Failed without error instance";
            if(e instanceof Error) {
                errorMessage = e.message;
            }
            res.status(500).send(errorMessage);
        }
    }
});

// PUT streamer/id/:streamerid

// streamerRouter.put("/id", async (req: Request, res: Response) => {
//     const streamer_id: string = req.auth.payload.sub;

//     try {
//       const StreamerUpdate: Streamer = req.body;
  
//       const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);
  
//       if (existingStreamer) {
//         const updatedStreamer = await StreamerService.update(streamer_id, StreamerUpdate);
//         return res.status(200).json(updatedStreamer);
//       }
  
//       const newStreamer = await StreamerService.create(streamer_id, StreamerUpdate);
  
//       res.status(201).json(newStreamer);
//     } catch (e) {
//       res.status(500).send(e.message);
//     }
// });

streamerRouter.put("/twitch_code", async (req: Request, res: Response) => {
    console.log("Received request to twitch_code");
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;

        try {
            const twitch_code: string = req.body.code;
            console.table(req.body);

            await StreamerService.add_twitch(streamer_id, twitch_code);
            res.status(200).send();
        } catch (e) {
            res.status(500).send(e);
        } 
    }
});

//TODO: Need a function to push twitter access tokens to mysql database
streamerRouter.put("/twitter_access", async (req: Request, res: Response) => {
    if(req.auth !== undefined) {
        const streamer_id: string | undefined = req.auth.payload.sub;
    
        try {
            if(streamer_id !== undefined) {
                const twitter_oauth_token: string = req.body.oauth_token;
                const twitter_oauth_verifier: string = req.body.oauth_verifier;
                const twitter_oauth_token_secret: string = await StreamerService.get_twitter_temp_oauth_secret(streamer_id);

                console.table(req.body);

                const reply: any = await getOAuthAccessTokenWith(twitter_oauth_token, twitter_oauth_token_secret, twitter_oauth_verifier);

                console.log(`OAuth Access Tokens `);
                console.log(reply);

                StreamerService.add_twitter_access(streamer_id, reply["oauthAccessToken"], reply["oauthAccessTokenSecret"], reply["results"]["user_id"], reply["results"]["screen_name"]);

                res.status(200).send();
            }
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    } 
    res.status(401).send();
});

streamerRouter.delete("/id", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;

        const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);

        if (existingStreamer) {
            await StreamerService.del(streamer_id);
        }

        res.status(200).send();
    }
    res.status(401).send();
});

streamerRouter.delete("/twitch", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;
        console.log(`Delete Twitch ${streamer_id} - router`);


        const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);

        if (existingStreamer && existingStreamer.twitch_name) {
            StreamerService.del_twitch(streamer_id);
        }

        res.status(200).send();
    }
    res.status(401).send();
});

streamerRouter.delete("/twitter", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;

        console.log(`Delete Twitter ${streamer_id} - router`);

        const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);

        if (existingStreamer && existingStreamer.twitter_name) {
            StreamerService.del_twitter(streamer_id);
        }

        res.status(200).send();
    }
    res.status(401).send();
});

async function getOAuthAccessTokenWith (oauthRequestToken: string, oauthRequestTokenSecret: string, oauthVerifier: string) {
    return new Promise((resolve, reject) => {
      oauthConsumer.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauthVerifier, function (error: string, oauthAccessToken: string, oauthAccessTokenSecret: string, results: string) {
        return error
          ? reject(new Error('Error getting OAuth access token'))
          : resolve({ oauthAccessToken, oauthAccessTokenSecret, results })
      })
    })
}
async function getOAuthRequestToken (): Promise<any> {
    return new Promise((resolve, reject) => {
        oauthConsumer.getOAuthRequestToken(function (error: string, oauthRequestToken: string, oauthRequestTokenSecret: string, results: string) {
        return error
            ? reject(new Error('Error getting OAuth request token'))
            : resolve({ oauthRequestToken, oauthRequestTokenSecret, results })
        })
    })
}

function make_nonce():string {
    let output_string = "";
    const options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(let i=0; i<42; i++) {
        output_string += options.charAt(Math.floor(Math.random()*options.length))
    }

    return output_string;
}

function make_signature():string {
    let signature_string = "";
    const http_method = "POST";
    const base_url = "https://api.twitter.com/oauth/request_token"

    return signature_string;
}