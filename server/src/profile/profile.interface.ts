export interface BaseProfile {
    name: string;
    img_change_type: string;
    custom_img: string;
    text_change_type: string;
    custom_text: string;
}

export interface Profile extends BaseProfile {
    unique_id: string;
    profile_id: string;
}