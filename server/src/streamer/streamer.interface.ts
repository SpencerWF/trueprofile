export interface BaseStreamer {
    email: string;
    username: string;
    account_type: string;
    create_date?: Date;
    modification_date?: Date;
    password_hash?: string;
    twitch_id?: string;
    twitch_name?: string;
    youtube_id?: string;
    youtube_name?: string;
    reddit_id?: string;
    reddit_name?: string;
}

export interface Streamer extends BaseStreamer {
    unique_id: string;
}