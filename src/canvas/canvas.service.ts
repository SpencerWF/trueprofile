import { loadImage, Canvas, createCanvas } from "canvas";
import { writeFileSync } from "fs";

export const draw_circle_from_url = async (image_url: string) => {
    const profile_image = await loadImage(image_url);
    const canvas = createCanvas(400, 400); //400 due to twitter image sizing
    const context = canvas.getContext('2d');
    
    context.drawImage(profile_image, 0, 0);
    context.fillStyle = 'Red';
    context.arc(50, 200, 30, 0, Math.PI*2);
    const image_out = canvas.toBuffer("image/png");
    // writeFileSync("./image_out.png", image_out);

    return image_out;
}