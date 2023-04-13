export interface BaseStreamer {
    email: string;
    account_type: string;
    create_date?: Date;
    modification_date?: Date;
    twitch_name?: string;
    youtube_name?: string;
    reddit_name?: string;
    twitter_name?: string;
    status: string;
}

export interface Streamer extends BaseStreamer {
    unique_id: string;
}