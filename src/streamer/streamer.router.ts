/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "./streamer.service";
import { Streamer, BaseStreamer } from "./streamer.interface";

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

// GET games/:gameid

streamerRouter.get("/:streamerid", async(req: Request, res: Response) => {
    //Not using any authentication or authorization, but may implement a timer
    const streamerid: string = req.params.streamerid;
    console.log(`Looking for information about ${streamerid}`);

    try{
        const streamer: Streamer = await StreamerService.find(streamerid);

        if(game) {
            return res.status(200).send(game);
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