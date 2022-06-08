import * as dotenv from "dotenv";
import * as twitchService from "./twitch/twitch.service";

dotenv.config();

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}

const me = new twitchService.Twitch_Streamer("trueprofile");
await me.setup_live_subscriptions()

// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();

