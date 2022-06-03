// Will need to be in the twitch service
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { DirectConnectionAdapter, EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';

import * as dotenv from "dotenv";

dotenv.config();

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}

function make_reference_number(): string {
    let output_string: string = "";
    let options: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i<60; i++) {
        output_string += options.charAt(Math.floor(Math.random()*options.length))
    }

    return output_string;
}

function get_unique_reference_number(): string {
    let id_unfound: boolean = true;
    let reference_id: string;

    reference_id = make_reference_number();

    return reference_id;
}

// Will need to be in the twitch service
// Setting up auth for twitch
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });


// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();

const listenerSecret = get_unique_reference_number();

const listener = new EventSubListener({
    apiClient,
    adapter: new NgrokAdapter(),
    secret: listenerSecret
});
await listener.listen();

const userId = '798790185';

const onlineSubscription = await listener.subscribeToStreamOnlineEvents(userId, e => {
  console.log(`${e.broadcasterDisplayName} just went live!`);
});

const offlineSubscription = await listener.subscribeToStreamOfflineEvents(userId, e => {
  console.log(`${e.broadcasterDisplayName} just went offline.`);
});
