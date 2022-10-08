
import express from "express";
// import session from "express-session";
import * as dotenv from "dotenv";
const path = require('path');
// import { profileRouter } from "./profile/profile.router";
dotenv.config();

import { BaseStreamer } from "./streamer/streamer.interface";

import * as streamerService from "./streamer/streamer.service";
import { streamerRouter } from "./streamer/streamer.router";
import * as profileService from "./profile/profile.service";
import { profileRouter } from "./profile/profile.router";
import { init_listener } from "./twitch/twitch.service";

// const { auth } = require('express-openid-connect');

// const auth_config = {
//     authRequired: false,
//     auth0logout: true,
//     secret: "2A8F0DB4CE0408B3174D1C2B5D2EF93E94E0706E26E73C05C773B7C161426362",
//     baseURL: "http://192.168.1.237:4200/settings-component/",
//     clientID: "6fx5x7nOozGVzssb23NjG6LWIWleihf4",
//     issuerBaseURL: "dev-f5zxf23m.eu.auth0.com"
// }
// const session = require('express-session');
// var session = require('express-session');

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}
const app = express();

// app.use(auth(auth_config));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '../../trueprofile/dist/'));

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: false,
//     resave: false
// }));

init_listener();

streamerService.setup_tracking();

app.use("/api/streamer", streamerRouter);

app.get('/settings-component/', (req, res) => {
    res.send('Settings Page');
});

app.get('/*', (req, res) => {
    // res.sendFile(path.join(__dirname))
    // res.sendFile('index.html',{root:path.join(__dirname, "../../trueprofile/dist/")});
    res.send("General Page");
});

console.log(`Listening on port ${process.env.PORT}`);

app.listen(process.env.PORT);
// streamerService.create(me);
// const me_id = await streamerService.get_id(me.username);
// streamerService.add_twitch(me.username, "trueprofile");

// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();

