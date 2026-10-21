import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageDir = "images";
const minBytes = 450 * 1024;
const supported = new Set([".png", ".jpg", ".jpeg"]);
const entries = await fs.readdir(imageDir, { withFileTypes: true });
const replacements = new Map();
let totalBefore = 0;
let totalAfter = 0;
let converted = 0;

for (const entry of entries) {
  if (!entry.isFile()) continue;
  const file = entry.name;
  const ext = path.extname(file).toLowerCase();
  if (!supported.has(ext)) continue;

  const inputPath = path.join(imageDir, file);
  const stat = await fs.stat(inputPath);
  if (stat.size < minBytes) continue;

  const outputName = file.slice(0, -ext.length) + ".webp";
  const outputPath = path.join(imageDir, outputName);
  const isGraphic = /(logo|banner|hero|navigation|stat-card|service|portfolio)/i.test(file);
  const quality = isGraphic ? 90 : 84;

  await sharp(inputPath, { failOn: "none" })
    .rotate()
    .webp({ quality, alphaQuality: 100, effort: 5 })
    .toFile(outputPath);

  const outputStat = await fs.stat(outputPath);
  if (outputStat.size >= stat.size) {
    await fs.unlink(outputPath);
    console.log("Skipped (WebP was not smaller):", file);
    continue;
  }

  replacements.set(file, outputName);
  totalBefore += stat.size;
  totalAfter += outputStat.size;
  converted += 1;
  console.log(`${file}: ${(stat.size / 1024).toFixed(0)} KB -> ${(outputStat.size / 1024).toFixed(0)} KB`);
}

if (replacements.size > 0) {
  const pages = ["index.html", "portfolio.html", "services.html", "contact.html", "styles.css"];
  for (const page of pages) {
    let content;
    try {
      content = await fs.readFile(page, "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/(\r?\n)/);
    for (let i = 0; i < lines.length; i += 2) {
      // Keep social-sharing preview metadata on its original image format.
      if (/og:image/i.test(lines[i])) continue;
      for (const [original, webp] of replacements) {
        lines[i] = lines[i].split(original).join(webp);
      }
    }
    await fs.writeFile(page, lines.join(""), "utf8");
  }
}

console.log(`\nConverted ${converted} image(s). Original files are retained.`);
if (totalBefore > 0) {
  console.log(`Converted-image size: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% smaller).`);
}
