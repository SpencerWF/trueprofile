/**
 * Necessary Imports
 */
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { DirectConnectionAdapter, EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';

/** 
 * Necessary Defines
 */

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new ApiClient({ authProvider });

/**
 * Create Listender
 */

const listenerSecret = get_unique_reference_number();

const twitch_listener = new EventSubListener({
    apiClient,
    adapter: new NgrokAdapter(),
    secret: listenerSecret
});
await twitch_listener.listen();

/**
 * Exported Functions
 */
export const track_status_twitch = (streamer_name: string): boolean {

} 


/**
 * Streamer Class
 */

class Twitch_Streamer {
    twitch_service: boolean = true;
    private _twitch_id: string;
    private _name: string;
    private _onlineSubscription;
    private _offlineSubscription;

    constructor(streamer_name:string) {
        console.log(`Creating twitch streamer ${streamer_name}`);
        this.name = streamer_name;
    }

    public set twitch_id(v : string) {
        this._twitch_id = v;
    }
    
    public get twitch_id() : string {
        return this._twitch_id;
    }
    
    public set name(v : string) {
        this._name = v;
    }

    public get name() : string {
        return this._name;
    }

    public set onlineSubscription(v) {
        this._onlineSubscription = v;
    }

    public get onlineSubscription() {
        return this._onlineSubscription;
    }

    
    public set offlineSubscription(v) {
        this._offlineSubscription = v;
    }

    
    public get offlineSubscription() {
        return this._offlineSubscription;
    }

    private async setup_live_subscriptions() {
        this.onlineSubscription = await twitch_listener.subscribeToStreamOnlineEvents(this.twitch_id, e => {
            console.log(`${e.broadcasterDisplayName} just went live!`);
        });
    
        
        this.offlineSubscription = await twitch_listener.subscribeToStreamOfflineEvents(this.twitch_id, e => {
            console.log(`${e.broadcasterDisplayName} just went offline.`);
        });
    }
}

/**
 * Twitch API Functions
 */

// Will need to be in the twitch service
// Setting up auth for twitch

async function create_listener() {
    const listenerSecret = get_unique_reference_number();

    const twitch_listener = new EventSubListener({
        apiClient,
        adapter: new NgrokAdapter(),
        secret: listenerSecret
    });
    await twitch_listener.listen();
}

async function retrieve_twitch_id(twitch_name: string): Promise<string | null> {
    const user_data = await apiClient.callApi({url:"users", method:"GET", jsonBody:"login=ironmouse"});

    console.log(user_data);

    return user_data["data"]["id"];
}

// async function setup_live_subscriptions(twitch_name: string) {
//     const onlineSubscription = await listener.subscribeToStreamOnlineEvents(userId, e => {
//         console.log(`${e.broadcasterDisplayName} just went live!`);
//     });

    
//     const offlineSubscription = await listener.subscribeToStreamOfflineEvents(userId, e => {
//         console.log(`${e.broadcasterDisplayName} just went offline.`);
//     });
// }

/**
 * Service Functions 
 */
function make_reference_number(): string {
    let output_string: string = "";
    let options: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    for(var i=0; i<11; i++) {
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