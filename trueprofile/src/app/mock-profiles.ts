import { Profile } from "./profile";

export const PROFILES: Profile[] = [
    {
        id: 0,
        name: 'Online',
        img_change_type: "Edit",
        custom_img: '',
        text_change_type: "Edit",
        custom_text: "| LIVE NOW"
    },
    {
        id: 1,
        name: 'League of Legends',
        img_change_type: "Replace",
        custom_img: '',
        text_change_type: "Replace",
        custom_text: "NOW PLAYING LEAGUE!"
    },
    {
        id: 2,
        name: 'Binding of Isaac',
        img_change_type: "Replace",
        custom_img: '',
        text_change_type: "Edit",
        custom_text: "| NOW PLAYING THE BINDING OF ISAAC"
    }
];