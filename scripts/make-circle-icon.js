const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function createCircularIcon(inputPath, outputPath, size = 256) {
  const imageBuffer = fs.readFileSync(inputPath);
  const base64 = imageBuffer.toString("base64");

  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="circleClip">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>
  </defs>
  <image href="data:image/jpeg;base64,${base64}" width="${size}" height="${size}" clip-path="url(#circleClip)" />
</svg>
  `;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  console.log(`Circular icon created at ${outputPath}`);
}

createCircularIcon(
  path.join(__dirname, "../app/girly.jpeg"),
  path.join(__dirname, "../app/icon.png")
);

