
import express from "express";
// import session from "express-session";
import * as dotenv from "dotenv";
import { appendFile } from "fs";
// import { profileRouter } from "./profile/profile.router";
dotenv.config();

import { BaseStreamer } from "./streamer/streamer.interface";

import * as streamerService from "./streamer/streamer.service";
import { streamerRouter } from "./streamer/streamer.router";
import * as profileService from "./profile/profile.service";
import { profileRouter } from "./profile/profile.router";
import { init_listener } from "./twitch/twitch.service";

// const session = require('express-session');
var session = require('express-session');

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}
const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'static')));

init_listener();

streamerService.setup_tracking();

app.use("/api/streamer", streamerRouter);

app.listen(process.env.PORT);
// streamerService.create(me);
// const me_id = await streamerService.get_id(me.username);
// streamerService.add_twitch(me.username, "trueprofile");

// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();
