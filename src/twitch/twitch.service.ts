/**
 * Necessary Imports
 */
import { ClientCredentialsAuthProvider, StaticAuthProvider } from '@twurple/auth';
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

/**
 * Exported Functions
 */

export const init_listener = async () => {
    await twitch_listener.listen();
}

export const retrieve_twitch_id = async (twitch_name: string): Promise<string | null> => {
    const user_data = await apiClient.users.getUserByName(twitch_name);
    if(user_data.id) {
        return user_data.id;
    }

    return null;
}

/**
 * Streamer Class
 */

export class Twitch_Streamer {
    twitch_service: boolean = true;
    private _twitch_id: string;
    private _name: string;
    private _onlineSubscription;
    private _offlineSubscription;

    constructor(streamer_name:string) {
        console.log(`Creating twitch streamer ${streamer_name}`);
        this.name = streamer_name;
        this.twitch_id = "";
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

    public async setup_live_subscriptions(online_function: Function, offline_function: Function) {
        // if(this.twitch_id == "") {
        //     await this.retrieve_twitch_id();
        // }
        // if(!this.twitch_id) {
        //     return false;
        // }
        setTimeout(async () => {
            this._onlineSubscription = await twitch_listener.subscribeToStreamOnlineEvents(this.twitch_id, e => {
                console.log(`${e.broadcasterDisplayName} just went live!`);
                online_function(this.twitch_id);
            });
            setTimeout(async () => {
                this._offlineSubscription = await twitch_listener.subscribeToStreamOfflineEvents(this.twitch_id, e => {
                    console.log(`${e.broadcasterDisplayName} just went offline.`);
                    offline_function(this.twitch_id);
                });
            }, 1000);
        }, 1000);

    }

    public async cancel_live_subscriptions() {
        try {
            await this._onlineSubscription.stop();

            await this._offlineSubscription.stop();
        } catch (error) {
            console.log(error);
        }
    }

    private async retrieve_twitch_id() {
        const user_data = await apiClient.users.getUserByName(this.name);
        console.log("User Data:");
        console.log(user_data);
    
        this._twitch_id = user_data.id;
    }
}

export const deleteAllSubscriptions = async () => {
    // var subscriptions_data = await apiClient.eventSub.getSubscriptions();
    // console.table(subscriptions_data);
    await apiClient.eventSub.deleteAllSubscriptions();
}

/**
 * Twitch API Functions
 */

// Will need to be in the twitch service
// Setting up auth for twitch

// async function create_listener() {
//     const listenerSecret = get_unique_reference_number();

//     const listener = new EventSubListener({
//         apiClient,
//         adapter: new NgrokAdapter(),
//         secret: listenerSecret
//     });
//     await listener.listen();
// }

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
