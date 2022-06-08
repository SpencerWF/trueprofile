import * as dotenv from "dotenv";
import { init_listener, Twitch_Streamer } from "./twitch/twitch.service";

dotenv.config();

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}

init_listener();

const me = new Twitch_Streamer("trueprofile");
me.setup_live_subscriptions()

// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();

