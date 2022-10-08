
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

import { auth, requiredScopes } from "express-oauth2-jwt-bearer";

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}
const app = express();

const checkJwt = auth({
    audience: 'trueprofile.com',
    issuerBaseURL: 'https://dev-f5zxf23m.eu.auth0.com/'
});

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

app.get('/api/public', (req, res) => {
    res.json({
        message: 'Hello from a public endpoint'
    });
});

app.get('/api/private', checkJwt, (req, res) => {
    res.json({
        message: "Hello from a private endpoint"
    });
});

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

