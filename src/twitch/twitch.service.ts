/**
 * Necessary Imports
 */
import { ClientCredentialsAuthProvider, RefreshingAuthProvider, exchangeCode, AccessToken, RefreshConfig } from '@twurple/auth';
import { ApiClient, HelixPrivilegedUser } from '@twurple/api';
import { EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';

/** 
 * Necessary Defines
 */
const twitchClientAuth = {
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET
}
// const clientId = process.env.TWITCH_CLIENT_ID;
// const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const authProvider = new ClientCredentialsAuthProvider(twitchClientAuth.clientId, twitchClientAuth.clientSecret);
const apiClient = new ApiClient({ authProvider });
// const refreshingAuthProvider

/**
 * Create Listender
 */

const listenerSecret = get_unique_reference_number();

const twitch_listener = new EventSubListener({
    apiClient,
    adapter: new NgrokAdapter(),
    secret: listenerSecret
});

let refreshingAuths = {}

/**
 * Exported Functions
 */

export const init_listener = async () => {
    await twitch_listener.listen();
}

// export const retrieve_twitch_id = async (twitch_name: string): Promise<string | null> => {
//     const user_data = await apiClient.users.getUserByName(twitch_name);
//     if(user_data.id) {
//         return user_data.id;
//     }

//     return null;
// }

export const auth_twitch = async (twitch_code: string): Promise<AccessToken | false> => {
    try {
        const response = await exchangeCode(twitchClientAuth.clientId, twitchClientAuth.clientSecret, twitch_code, 'http://localhost:4200/twitch-login');
        console.table(response);
        return response;
    }
    catch {
        console.log("Error with exchanging code for access token");
    }

    return false;
    //TODO: Store access token in Mysql Database, create twitch streamer
} 

/**
 * Streamer Class
 */

export class Twitch_Streamer {
    twitch_service: boolean = true;
    private _unique_id: string;
    private _twitch_id: string = null;
    private _name: string = null;
    private _access_token: AccessToken;
    private _refresh_config: RefreshConfig;
    private _refreshingAuthProvider: RefreshingAuthProvider;
    private _apiClient: ApiClient;
    // private _twitchListener: EventSubListener;
    private _onlineSubscription;
    private _offlineSubscription;
    private _store_data_callback;

    constructor(unique_id: string, options: {twitch_id?: string, accessToken?: AccessToken, listenerSecret?: string}) {
        this._unique_id = unique_id;
        if(options.accessToken) {
            this._access_token = options.accessToken;
        }
        if(options.twitch_id) {
            this._twitch_id = options.twitch_id;
        }
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

    public set access_token(v : AccessToken) {
        this._access_token = v;
    }

    public async retreive_twitch_data(store_data): Promise<HelixPrivilegedUser | false> {
        this._store_data_callback = store_data;
        this._refresh_config = {
            clientId: twitchClientAuth.clientId,
            clientSecret: twitchClientAuth.clientSecret,
            onRefresh: this.store_twitch_access_token
        }
        this._refreshingAuthProvider = new RefreshingAuthProvider(this._refresh_config, this._access_token);
        this._apiClient = new ApiClient({ authProvider: this._refreshingAuthProvider }); //TODO: Can set logger details with this

        try {
            await this.deleteSubscriptions();
            console.log("Deleting Subscriptions");

            const data: HelixPrivilegedUser = await this._apiClient.users.getMe();

            console.log(data);

            console.log("Retreived me");

            if(!this.twitch_id) {
                console.log("Retreiving this user's data from twitch for first time");
                this.twitch_id = data.id;
                this.name = data.name;
            }

            if(data) {
                return data;
            }
        } catch (e){
            console.log(`Failed to retrieve user data: ${e}`);
            return false;
        }
        console.log("Data not received for user");
        return false;
    }

    public async store_twitch_access_token() {
        console.log("Storing Twitch Access Token");
        this._store_data_callback(this._unique_id, this._access_token);
    }

    public async setup_live_subscriptions(state_functions: Array<Function>) {
        // if(this.twitch_id == "") {
        //     await this.retrieve_twitch_id();
        // }
        // if(!this.twitch_id) {
        //     return false;
        // }
        console.log(`Setting up live subscriptions for ${this.name}`);
        // setTimeout(async () => {
        try {
            console.log(`Got to online events: ${this.twitch_id}`);

            this._onlineSubscription = await twitch_listener.subscribeToStreamOnlineEvents(this.twitch_id, e => {
                console.log(`${e.broadcasterDisplayName} just went live!`);
                state_functions[0](this.twitch_id);
            });
        } catch (error) {
            console.log(`Error: ${error}`);
        }
            // setTimeout(async () => {
        try {
            console.log(`Got to offline events: ${this.twitch_id}`);
            this._offlineSubscription = await twitch_listener.subscribeToStreamOfflineEvents(this.twitch_id, e => {
                console.log(`${e.broadcasterDisplayName} just went offline.`);
                state_functions[1](this.twitch_id);
            });
        } catch (error) {
            console.log(`Error: ${error}`);
        }

            // }, 1000);
        // }, 1000);

    }

    public async cancel_live_subscriptions() {
        try {
            await this._onlineSubscription.stop();

            await this._offlineSubscription.stop();
        } catch (error) {
            console.log(error);
        }
    }

    public async deleteSubscriptions() {
        await this._apiClient.eventSub.deleteAllSubscriptions();
    }
}

// export const deleteAllSubscriptions = async () => {
//     // var subscriptions_data = await apiClient.eventSub.getSubscriptions();
//     // console.table(subscriptions_data);
//     await apiClient.eventSub.deleteAllSubscriptions();
// }

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
