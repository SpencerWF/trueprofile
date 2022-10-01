/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "./streamer.service";
import { Streamer, BaseStreamer } from "./streamer.interface";
import { Stream } from "stream";
import { Profile } from "../profile/profile.interface";

/**
 * Router Definition
 */
 
export const streamerRouter = express.Router();

 /**
  * Controller Definitions
  */

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
    } catch (e) {
        let errorMessage = "Failed without error instance";
        if(e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(errorMessage); 
    }
});

// POST streamer/id/:streamerid

streamerRouter.post("/id/:streamerid", async(req: Request, res: Response) => {
    // Insert Auth here

    try {
        const streamer: BaseStreamer = req.body;

        const newStreamer = await StreamerService.create(streamer);

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

streamerRouter.put("/id/:streamerid", async (req: Request, res: Response) => {
    const unique_id: string = req.params.id;
  
    try {
      const StreamerUpdate: Streamer = req.body;
  
      const existingStreamer: Streamer = await StreamerService.find(unique_id);
  
      if (existingStreamer) {
        const updatedStreamer = await StreamerService.update(unique_id, StreamerUpdate);
        return res.status(200).json(updatedStreamer);
      }
  
      const newStreamer = await StreamerService.create(StreamerUpdate);
  
      res.status(201).json(newStreamer);
    } catch (e) {
      res.status(500).send(e.message);
    }
});

streamerRouter.delete("/id/:streamerid", async(req: Request, res: Response) => {
    const unique_id: string = req.params.id;

    try {
        const existingStreamer: Streamer = await StreamerService.find(unique_id);

        if (existingStreamer) {
            await StreamerService.del(existingStreamer);
        }
    } catch (e) {

    }
});