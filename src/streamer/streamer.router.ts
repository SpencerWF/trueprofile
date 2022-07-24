/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "./streamer.service";
import { Streamer, BaseStreamer } from "./streamer.interface";
import { Stream } from "stream";

/**
 * Router Definition
 */
 
export const streamerRouter = express.Router();
 
 /**
  * Controller Definitions
  */
 
 
// GET games
 
// streamerRouter.get("/", async(req: Request, res: Response) => {
//     try{
//         const games: Game[] = await GameService.findAll();
//         res.status(200).send(games);
//     } catch (e) {
//         let errorMessage = "Failed without Error instance";
//         if (e instanceof Error) {
//             errorMessage = e.message;
//         }
//         res.status(500).send(errorMessage);
//     }
// });

// GET streamer/id/:streamerid

streamerRouter.get("/id/:streamerid", async(req: Request, res: Response) => {
    //Not using any authentication or authorization, but may implement a timer
    const streamer_id: string = req.params.streamerid;
    console.log(`Looking for information about ${streamer_id}`);

    try{
        const streamer: Streamer = await StreamerService.find(streamer_id);

        if(streamer) {
            return res.status(200).send(streamer);
        }

        res.status(404).send("Game not found");
    } catch (e) {
        let errorMessage = "Failed without Error instance";
        if (e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(errorMessage);
    }
});

// GET streamer/id/:streamerid

streamerRouter.getByTwitchName("/twitch/:twitchname", async(req: Request, res: Response) => {
    const twitch_name: string = req.params.twitchid;

    // Insert Auth here

    try {
        const streamer_id: string = await StreamerService.findIdByTwitchName(twitch_name);

        if(streamer_id) {
            return streamerRouter.get(streamer_id);
        }
    } catch (e) {

    }
});

streamerRouter.post("/", async(req: Request, res: Response) => {
    // Insert Auth here

    try {
        const streamer: BaseStreamer = req.body;

        const newStreamer = await StreamerService.create(streamer);
    }
});