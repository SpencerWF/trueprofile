import Twit from "twit";
import { Client } from "twitter-api-sdk";

export interface Twits {
    [index: string]: Twit;
}

export interface Clients {
    [index: string]: Client;
}