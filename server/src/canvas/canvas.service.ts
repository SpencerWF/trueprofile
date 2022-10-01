import { loadImage, Canvas, createCanvas } from "canvas";
import { create } from "domain";
import { writeFileSync } from "fs";
import path from "path";

export const save_image_from_url = async (image_url: string): Promise<string> => {
    // Store the image for replacement later
    const profile_image = await loadImage(image_url);
    const canvas = createCanvas(400, 400); //400 due to twitter image sizing
    const context = canvas.getContext('2d');
    
    context.drawImage(profile_image, 0, 0);
    const image_out = canvas.toBuffer("image/png");

    const filename: string = make_image_name();
    const filepath: string = path.join(__dirname, '..', 'images', `${filename}.png`);
    writeFileSync(filepath, image_out);

    return filename;
}

export const draw_circle_from_url = async (image_url: string) => {
    // Draw circle on the image from the url
    const filepath: string = path.join(__dirname, '..', 'images', `${image_url}.png`);
    const profile_image = await loadImage(filepath);
    const canvas = createCanvas(400, 400); //400 due to twitter image sizing
    const context = canvas.getContext('2d');
    
    context.drawImage(profile_image, 0, 0);
    context.strokeStyle = '#E14625';
    context.fillStyle = '#E14625';
    context.arc(50, 200, 20, 0, Math.PI*2, true);
    context.fill();

    context.moveTo(80, 200);
    context.arc(50, 200, 30, 0, Math.PI*2, true);
    context.arc(50, 200, 29, 0, Math.PI*2, true);
    context.arc(50, 200, 28, 0, Math.PI*2, true);
    context.stroke();
    const image_out = canvas.toBuffer("image/png");

    return image_out;
}

export const retrieve_image_from_url = async (image_url: string): Promise<Buffer | null> => {
    if(image_url != null) {
        const profile_image = await loadImage(image_url);
        const canvas = createCanvas(400, 400);
        const context = canvas.getContext('2d');

        context.drawImage(profile_image, 0, 0);

        return canvas.toBuffer("image/png");
    }
    
    return null;
}

/**
 * Needed functions
 */

 function make_image_name():string {
    let output_string: string = "";
    let options: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i=0; i<24; i++) {
        output_string += options.charAt(Math.floor(Math.random()*options.length))
    }

    return output_string;
}