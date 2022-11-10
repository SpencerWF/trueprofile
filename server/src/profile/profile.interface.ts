export interface BaseProfile {
    name: string;
    custom_img: string;
    custom_text: string;
}

export interface Profile extends BaseProfile {
    unique_id: string;
    profile_id: string;
}