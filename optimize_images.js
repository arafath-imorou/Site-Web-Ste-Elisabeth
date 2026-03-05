import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const IMG_DIR = 'c:/Users/HP/Desktop/ITA/HOTEL TEST/public/Images';

async function optimize() {
    console.log('Starting image optimization...');
    const files = fs.readdirSync(IMG_DIR);

    for (const file of files) {
        if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.png')) {
            const inputPath = path.join(IMG_DIR, file);
            const fileName = path.parse(file).name;
            const outputPath = path.join(IMG_DIR, `${fileName}.webp`);

            try {
                process.stdout.write(`Optimizing ${file}... `);
                const image = await Jimp.read(inputPath);

                // Resize if too large (max 1600px width/height)
                if (image.width > 1600 || image.height > 1600) {
                    image.scaleToFit({ width: 1600, height: 1600 });
                }

                // Convert to WebP via Jimp (note: jimp doesn't natively speak webp well in some versions, but we can try)
                // Actually Jimp doesn't support WebP export in all environments easily.
                // Alternative: Just compress the JPEGs hard.

                await image.quality(75).write(inputPath); // In-place compression for now
                console.log('Compressed (In-place JPG).');

            } catch (err) {
                console.error(`Error processing ${file}: ${err.message}`);
            }
        }
    }
    console.log('Optimization complete.');
}

optimize();
