/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "../streamer/streamer.service";
import * as ProfileService from "./profile.service";
import { Streamer, BaseStreamer } from "../streamer/streamer.interface";
import { Stream } from "stream";
import { Profile, BaseProfile } from "./profile.interface";

/**
 * Router Definition
 */
 
export const profileRouter = express.Router();
 
 /**
  * Controller Definitions
  */

// GET streamer/id/:streamerid/profile/:profileid

profileRouter.get("/id/:streamerid/profile/:profileid", async(req: Request, res: Response) => {
    //Not using any authentication or authorization, but may implement a timer
    const streamer_id: string = req.params.streamerid;
    const profile_id: string = req.params.profileid;
    console.log(`Looking for information about streamer: ${streamer_id} and profile: ${profile_id}`);

    try{
        const profile: Profile = await ProfileService.find(streamer_id, profile_id);

        if(profile) {
            return res.status(200).send(profile);
        }

        res.status(404).send("Profile not found");
    } catch (e) {
        let errorMessage = "Failed without Error instance";
        if (e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(errorMessage);
    }
});

// POST streamer/id/:streamerid/profile/:profileid

profileRouter.post("/id/:streamerid/profile/:profileid", async(req: Request, res: Response) => {
    // Insert Auth here

    try {
        const streamer: Streamer = await StreamerService.find(req.params.streamerid);

        const profile: BaseProfile = req.body;

        const newProfile = await ProfileService.create(streamer.unique_id, profile);

        res.status(201).json(newProfile);
    } catch (e) {
        let errorMessage = "Failed without error instance";
        if(e instanceof Error) {
            errorMessage = e.message;
        }
        res.status(500).send(e.message);
    }
});

// PUT streamer/id/:streamerid/profile/:profileid

profileRouter.put("/id/:streamerid/profile/:profileid", async (req: Request, res: Response) => {
    const unique_id: string = req.params.id;
  
    try {
      const profileUpdate: Profile = req.body;
  
      const existingProfile: Profile = await ProfileService.find(unique_id, profileUpdate.profile_id);
  
      if (existingProfile) {
        const updatedStreamer = await ProfileService.update(unique_id, profileUpdate.profile_id, profileUpdate);
        return res.status(200).json(updatedStreamer);
      }
  
      const newProfile = await ProfileService.create(unique_id, profileUpdate);
  
      res.status(201).json(newProfile);
    } catch (e) {
      res.status(500).send(e.message);
    }
});

profileRouter.remove("/id/:streamerid/profile/:profileid", async(req: Request, res: Response) => {
    const unique_id: string = req.params.id;

    try {
        const existingStreamer: Streamer = await StreamerService.find(unique_id);

        if (existingStreamer) {
            await StreamerService.del(existingStreamer);
        }
    } catch (e) {

    }
});