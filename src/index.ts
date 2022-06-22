import * as dotenv from "dotenv";
dotenv.config();

import { BaseStreamer } from "./streamer/streamer.interface";

import * as streamerService from "./streamer/streamer.service";
import { init_listener } from "./twitch/twitch.service";

const me: BaseStreamer = {
    username: "TrueProfile",
    account_type: "free",
    email: "swalkerfooks@gmail.com",
    password_hash: "098poilkjmnb"
}

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}

init_listener();

streamerService.create(me);
// const me_id = await streamerService.get_id(me.username);
streamerService.add_twitch(me.username, "trueprofile");

// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();

