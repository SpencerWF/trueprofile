
import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();

import * as streamerService from "./streamer/streamer.service";
import { streamerRouter } from "./streamer/streamer.router";
import { profileRouter } from "./profile/profile.router";

import { auth } from "express-oauth2-jwt-bearer";

import cors from 'cors';

console.log("******************")

if(!process.env.PORT) {
    process.exit(1);
}
const app = express();

const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
});

if(!process.env.CORS_ORIGIN) {
    process.exit(1);
}
const allowedOrigins = [process.env.CORS_ORIGIN];
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200
};
app.use(cors(options));


app.use(express.json());

streamerService.setup_tracking();

app.get('/api/public', (req: Request, res: Response) => {
    res.json({
        message: 'Hello from a public endpoint'
    });
});

app.use('/public', express.static('./public'));

// app.use(checkJwt);

app.get('/api/private', checkJwt, (req: Request, res: Response) => {
    res.json({
        message: "Hello from a private endpoint"
    });
});

app.use("/api/streamer", checkJwt, streamerRouter);
app.use("/api/profile", checkJwt, profileRouter);

// app.get('/settings-component/', (req: Request, res: Response) => {
//     res.send('Settings Page');
// });

app.get('/*', (req: Request, res: Response) => {
    res.send("General Page");
});

console.log(`Listening on port ${process.env.PORT}`);

app.listen(process.env.PORT);

