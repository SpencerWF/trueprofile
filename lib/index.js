"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Will need to be in the twitch service
const auth_1 = require("@twurple/auth");
const api_1 = require("@twurple/api");
const eventsub_1 = require("@twurple/eventsub");
const eventsub_ngrok_1 = require("@twurple/eventsub-ngrok");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// import * as streamerService from "./streamer/streamer.service";
if (!process.env.PORT) {
    process.exit(1);
}
function make_reference_number() {
    let output_string = "";
    let options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 60; i++) {
        output_string += options.charAt(Math.floor(Math.random() * options.length));
    }
    return output_string;
}
function get_unique_reference_number() {
    let id_unfound = true;
    let reference_id;
    reference_id = make_reference_number();
    return reference_id;
}
// Will need to be in the twitch service
// Setting up auth for twitch
const clientId = 'TWITCH_CLIENT_ID';
const clientSecret = 'TWITCH_CLIENT_SECRET';
const authProvider = new auth_1.ClientCredentialsAuthProvider(clientId, clientSecret);
const apiClient = new api_1.ApiClient({ authProvider });
// Will need to be in twitch service
// Setting up event listener
//await apiClient.eventSub.deleteAllSubscriptions();
const listenerSecret = get_unique_reference_number();
const listener = new eventsub_1.EventSubListener({
    apiClient,
    adapter: new eventsub_ngrok_1.NgrokAdapter(),
    secret: listenerSecret
});
