/**
 * Require External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as StreamerService from "../streamer/streamer.service";
import * as ProfileService from "./profile.service";
import { BaseStreamer } from "../streamer/streamer.interface";
// import { Stream } from "stream";
import { Profile, BaseProfile } from "./profile.interface";

const fs = require('fs');
const path = require('path');

/**
 * Router Definition
 */
 
export const profileRouter = express.Router();
 
 /**
  * Controller Definitions
  */

// GET streamer/id/:streamerid/profile/:profileid

profileRouter.get("/id/", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;
        // const profile_id: string = req.params.profileid;
        console.log(`Looking for profiles for streamer: ${streamer_id}`);

        try{
            const profiles: BaseProfile[] | false = await ProfileService.findProfileList(streamer_id);

            if(profiles) {
                return res.status(200).send(profiles);
            }

            res.status(404).send("Profile not found");
        } catch (e) {
            let errorMessage = "Failed without Error instance";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            res.status(500).send(errorMessage);
        }
    }
});

profileRouter.get("/id/image/:image", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;
        const image_url: string = req.params.image;

        console.log(`Looking for image for streamer: ${streamer_id} with ${image_url}`);

        try{
            if(fs.existsSync(`${__dirname}/../images/${image_url}.jpg`)) {
                return res.sendFile(path.resolve(`${__dirname}/../images/${image_url}.jpg`));
            } else {
                console.log(__dirname);
            }
            res.status(404).send("Image not found");
        } catch (e) {
            let errorMessage = "Failed without Error instance";
            if (e instanceof Error) {
                errorMessage = e.message;
            }
            res.status(500).send(errorMessage);
        }
    }
});

// POST streamer/id/:streamerid/profile/:profileid

profileRouter.post("/id/profile", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;

        try {
            const profile: BaseProfile = req.body;

            const newProfile = await ProfileService.create(streamer_id, profile);

            res.status(201).json(newProfile);
        } catch (e) {
            let errorMessage = "Failed without error instance";
            if(e instanceof Error) {
                errorMessage = e.message;
            }
            res.status(500).send(errorMessage);
        }
    }
});

// PUT streamer/id/:streamerid/profile/:profileid

profileRouter.put("/id/:streamerid/profile/:profileid", async (req: Request, res: Response) => {
    const unique_id: string = req.params.id;
  
    try {
      const profileUpdate: Profile = req.body;
  
      const existingProfile: Profile | null = await ProfileService.find(unique_id, profileUpdate.profile_id);
  
      if (existingProfile !== null) {
        const updatedStreamer = await ProfileService.update(unique_id, profileUpdate.profile_id, profileUpdate);
        return res.status(200).json(updatedStreamer);
      }
  
      const newProfile = await ProfileService.create(unique_id, profileUpdate);
  
      res.status(201).json(newProfile);
    } catch (e: any) {
      res.status(500).send(e.message);
    }
});

profileRouter.delete("/id/profile", async(req: Request, res: Response) => {
    if(req.auth !== undefined && typeof req.auth.payload.sub == 'string') {
        const streamer_id: string = req.auth.payload.sub;

        try {
            const existingStreamer: BaseStreamer | false = await StreamerService.find(streamer_id);

            if (existingStreamer) {
                await StreamerService.del(streamer_id);

            }
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    }
});