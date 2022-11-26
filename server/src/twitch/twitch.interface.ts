export interface TwitchAuth {
    access_token: string,
    refresh_token: string,
    scope: Array<string>,
    token_type: string
}