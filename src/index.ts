
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

import * as streamerService from "./streamer/streamer.service";
import { streamerRouter } from "./streamer/streamer.router";
import { profileRouter } from "./profile/profile.router";

import { auth } from "express-oauth2-jwt-bearer";

import cors from 'cors';

if(!process.env.PORT) {
    process.exit(1);
}
const app = express();

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
});

const allowedOrigins = [process.env.CORS_TEST_ORIGIN, process.env.CORS_ORIGIN];
const options: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(options));


app.use(express.json());

streamerService.setup_tracking();

app.get('/api/public', (req, res) => {
    res.json({
        message: 'Hello from a public endpoint'
    });
});

app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(checkJwt);

app.get('/api/private', (req, res) => {
    res.json({
        message: "Hello from a private endpoint"
    });
});

app.use("/api/streamer", streamerRouter);
app.use("/api/profile", profileRouter);



app.get('/settings-component/', (req, res) => {
    res.send('Settings Page');
});

app.get('/*', (req, res) => {
    res.send("General Page");
});

console.log(`Listening on port ${process.env.PORT}`);

app.listen(process.env.PORT);

