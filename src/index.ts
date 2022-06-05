import * as dotenv from "dotenv";

dotenv.config();

// import * as streamerService from "./streamer/streamer.service";

if(!process.env.PORT) {
    process.exit(1);
}


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
