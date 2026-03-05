import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const PUBLIC_IMG_DIR = path.join(process.cwd(), 'public', 'Images');

// 1. Get all images currently on disk
const allDiskImages = glob.sync('public/Images/**/*.{jpg,jpeg,png}', { absolute: true })
    .map(p => p.replace(/\\/g, '/'))
    .filter(p => !p.toLowerCase().includes('.webp')); // Usually don't want to delete generated webp

console.log(`\nFound ${allDiskImages.length} images on disk.`);

// 2. These are the images explicitly used in the database
const dbImagesRaw = [
    "/Images/PLAT 1.jpg", "/Images/CHAMBRE ALLADA 3.jpg", "/Images/PLAT 4.jpg", "/Images/4c895919-1d54-42ed-94ca-a93e581f0cb2.jpg", "/Images/Evenements/fc4d4165-e94d-4fd0-8899-41ca4f850c47.jpg", "/Images/PLAT 5.jpg", "/Images/Evenements/cbaeaeeb-ee7d-49d9-9393-d8bf87871ac3.jpg", "/Images/Evenements/68586138-5cae-4ec0-a9fe-68fb1442cca7.jpg", "/Images/SUITE NOBLESSE 3.jpg", "/Images/Evenements/ba2a5060-2f67-443c-9bf9-f46857e00490.jpg", "/Images/6db85736-a267-495c-b05b-3164774635d4.jpg", "/Images/Evenements/d53d8ee7-d2d4-4371-8140-d941e8b59d9e.jpg", "/Images/cd84752d-ed35-4e35-be6a-0d68a82dee0e.jpg", "/Images/Evenements/a6c3e34c-6ff4-4858-8cd3-778ff26fa260.jpg", "/Images/Evenements/687e827b-d4fd-4251-aa95-73ff9ecf902e.jpg", "/Images/Evenements/5ceb83a3-c5f1-46f2-a994-e774d1f57745.jpg", "/Images/491086c6-8ded-43ba-8f0d-792926a824a8.jpg", "/Images/Evenements/3b491ac5-b57b-43f5-a93b-ea05b509d126.jpg", "/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg", "/Images/29a9aed9-e630-4350-8151-b44118b66e83.jpg", "/Images/Evenements/7dc7be60-2f72-4eb3-b73a-2cc17a31e72c.jpg", "/Images/CHAMBRE ALLADA 2.jpg", "/Images/ce9db6be-f16d-4e3e-8a0d-a16ea95d3dcd.jpg", "/Images/Evenements/b2b9877e-da2b-41c5-ae83-2bbe57d5c978.jpg", "/Images/Evenements/fa304c7b-d723-4798-b6da-88705e0b9e75.jpg", "/Images/Evenements/d44bb73f-bc13-4476-aa1a-02c65ab31f21.jpg", "/Images/6d2691ec-8b2b-4940-bca3-d0a161e4bc5f.jpg", "/Images/Evenements/f052d30c-8755-4a98-89d3-07b3e5293eab.jpg", "/Images/3ed07405-0775-4762-8707-7e4d5a4a4a72.jpg", "/Images/Evenements/5d34b7e1-e7f3-4b0d-b0a0-55ce9df70ccc.jpg", "/Images/Evenements/12521fea-7496-4445-bc8a-19139fc9f685.jpg", "/Images/PLAT 3.jpg", "/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg", "/Images/SUITE NOBLESSE.jpg", "/Images/3be1bf34-052b-4e5b-9f8e-cc326ce23415.jpg", "/Images/SITE ABOMEY CALAVI.jpg", "/Images/PLAT 2.jpg", "/Images/3734c2e2-8861-4883-a265-352340bf9ef8.jpg", "/Images/3f603029-651e-4f97-ac3b-805c15719bad.jpg", "/Images/Evenements/e900a055-e3c7-4af1-aeec-19eaa12994b2.jpg", "/Images/Evenements/cefc7755-3392-4e9f-8bcd-64dae739c406.jpg", "/Images/Evenements/f83185dd-06f9-4a14-80bf-8113602561a4.jpg", "/Images/bbbe2410-d06f-4968-95d5-4ebe65b80f4c.jpg", "/Images/CHAMBRE ALLADA.jpg", "/Images/00093e73-a1f7-4db6-b2ff-c6432c42bf08.jpg", "/Images/SITE ALLADA.jpg", "/Images/Evenements/f390988e-cc7c-4651-811f-7ced1d2d491c.jpg", "/Images/Evenements/e5ad3cfd-bba5-4e37-b0c2-75067cb59802.jpg", "/Images/SUITE NOBLESSE 5.jpg", "/Images/Evenements/0b349df9-2703-4b41-a6b3-b383dedba918.jpg", "/Images/SALLE DE CONFERENCE.jpg", "/Images/d8ec098d-c1cf-4291-818e-4a616f6f8367.jpg", "/Images/Evenements/a3a8984e-c76b-4fcf-9acc-e7fc42a5b6fc.jpg", "/Images/Evenements/6ee9eea9-22ed-4bb4-be2c-f3d569ab0ace.jpg", "/Images/CHAMBRE DOUCEUR.jpg", "/Images/SUITE NOBLESSE 4.jpg"
];

// Normalize DB paths to absolute local paths
const dbImages = dbImagesRaw.map(p => path.join(process.cwd(), 'public', p).replace(/\\/g, '/'));

// 3. Scan the src directory for statically imported/used images
const srcFiles = glob.sync('src/**/*.{jsx,js,css}', { absolute: true });
const srcImages = new Set();
const imgRegex = /\/Images\/[a-zA-Z0-9_.\-% ]+/g;

srcFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
        // Decode URI component because of spaces like "SITE ABOMEY CALAVI.jpg"
        const decoded = decodeURIComponent(match[0]);
        srcImages.add(path.join(process.cwd(), 'public', decoded).replace(/\\/g, '/'));
    }
});

console.log(`Found ${srcImages.size} images referenced in source code.`);

// Combine all valid images
const allUsedImages = new Set([...dbImages, ...Array.from(srcImages)]);
console.log(`Total valid images (DB + Source): ${allUsedImages.size}`);

// Find orphans
const unusedImages = allDiskImages.filter(diskImg => {
    return !allUsedImages.has(diskImg);
});

console.log(`\nFound ${unusedImages.length} unused images.`);

if (unusedImages.length > 0) {
    console.log('\nDeleting unused images...');
    unusedImages.forEach(img => {
        try {
            fs.unlinkSync(img);
            console.log(`Deleted: ${img.split('public/Images/')[1] || img}`);
        } catch (e) {
            console.error(`Failed to delete: ${img}`, e.message);
        }
    });
    console.log('\nCleanup Complete.');
} else {
    console.log('\nNo unused images found. Directory is clean.');
}
