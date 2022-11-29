/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "./streamer.service";
import * as ProfileService from "../profile/profile.service";
import * as CanvasService from "../canvas/canvas.service";
import { Streamer, BaseStreamer } from "./streamer.interface";
import { Stream } from "stream";
import { BaseProfile, Profile } from "../profile/profile.interface";

/**
 * Router Definition
 */
 
export const streamerRouter = express.Router();

 /**
  * Controller Definitions
  */

// GET streamer/id/:streamerid

streamerRouter.get("/id", async(req: Request, res: Response) => {
    //Not using any authentication or authorization, but may implement a timer
    const streamer_id: string = req.auth.payload.sub;
    // console.table(req.auth.payload[process.env.EMAIL_INDEX]); 
    // console.log(`Looking for information about ${streamer_id}`);

    try{
        var streamer: BaseStreamer | false = await StreamerService.find(streamer_id);
        // console.log("Received streamer from service");
        // console.table(streamer);

        if(streamer) {
            return res.status(200).send(streamer);
        } else {
            const new_streamer: BaseStreamer = {
                email: req.auth.payload[process.env.EMAIL_INDEX],
                account_type: "free",
                status: "active"
            }
            streamer = await StreamerService.create(streamer_id, new_streamer);
        }

        res.status(404).send("Streamer not found");
    } catch (e) {
        let errorMessage = "Failed without Error instance";
        if (e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(errorMessage);
    }
});

// GET streamer/id/:streamerid

streamerRouter.get("/twitch/:twitchname", async(req: Request, res: Response) => {
    const twitch_name: string = req.params.twitchid;

    // Insert Auth here

    try {
        const streamer_id: string = await StreamerService.findIdByTwitchName(twitch_name);

        if(streamer_id) {
            return streamerRouter.get(streamer_id);
        }
        res.status(404).send("Streamer not found");
        
    } catch (e) {
        let errorMessage = "Failed without error instance";
        if(e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(errorMessage); 
    }

});
// /api/streamer/twitch_code/

// POST streamer/id
streamerRouter.post("/id", async(req: Request, res: Response) => {
    const streamer_id: string = req.auth.payload.sub;
    const streamer_email: string = req.auth.payload[process.env.EMAIL_INDEX];

    try {
        const streamer: BaseStreamer = req.body;
            // Creating streamer
            const freshStreamer: BaseStreamer = {
                email: streamer_email,
                account_type: "free",
                status: "active",
            }

        const newStreamer = await StreamerService.create(streamer_id, streamer);

        res.status(201).json(newStreamer);
    } catch (e) {
        let errorMessage = "Failed without error instance";
        if(e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(e.message);
    }
});

// PUT streamer/id/:streamerid

streamerRouter.put("/id", async (req: Request, res: Response) => {
    const streamer_id: string = req.auth.payload.sub;

    try {
      const StreamerUpdate: Streamer = req.body;
  
      const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);
  
      if (existingStreamer) {
        const updatedStreamer = await StreamerService.update(streamer_id, StreamerUpdate);
        return res.status(200).json(updatedStreamer);
      }
  
      const newStreamer = await StreamerService.create(streamer_id, StreamerUpdate);
  
      res.status(201).json(newStreamer);
    } catch (e) {
      res.status(500).send(e.message);
    }
});

streamerRouter.put("/twitch_code", async (req: Request, res: Response) => {
    console.log("Received request to twitch_code");
    const streamer_id: string = req.auth.payload.sub;

    try {
        const twitch_code: string = req.body.code;
        console.table(req.body);

        StreamerService.add_twitch(streamer_id, twitch_code);
    } catch (e) {
        res.status(500).send
    }
});

//TODO: Need a function to push twitter access tokens to mysql database
// streamerRouter.put("/id/:streamerid/twitter_access", async (req: Request, res: Response) => {
//     const unique_id: string = req.params.id;
  
//     try {
//       const StreamerUpdate: Streamer = req.body;
  
//       const existingStreamer: Streamer = await StreamerService.find(unique_id);
  
//       if (existingStreamer) {
//         const updatedStreamer = await StreamerService.update(unique_id, StreamerUpdate);
//         return res.status(200).json(updatedStreamer);
//       }
  
//       const newStreamer = await StreamerService.create(StreamerUpdate);
  
//       res.status(201).json(newStreamer);
//     } catch (e) {
//       res.status(500).send(e.message);
//     }
// });

streamerRouter.delete("/id", async(req: Request, res: Response) => {
    const streamer_id: string = req.auth.payload.sub;

    try {
        const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);

        if (existingStreamer) {
            await StreamerService.del(streamer_id);
        }
    } catch (e) {

    }
});