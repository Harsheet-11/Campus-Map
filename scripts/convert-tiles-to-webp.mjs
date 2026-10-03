import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const tilesDir = path.join(projectRoot, "public", "tiles");

async function getPngFiles(dir) {
  const entries = await fs.promises.readdir(dir, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await getPngFiles(fullPath)));
    } else if (
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(".png")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log("🔍 Finding PNG tiles...");

  const pngFiles = await getPngFiles(tilesDir);

  console.log(`Found ${pngFiles.length} PNG tiles.`);

  if (pngFiles.length === 0) {
    console.log("No PNG tiles found.");
    return;
  }

  let converted = 0;
  let skipped = 0;
  let originalBytes = 0;
  let webpBytes = 0;

  for (const pngPath of pngFiles) {
    const webpPath = pngPath.replace(/\.png$/i, ".webp");

    const pngStats = await fs.promises.stat(pngPath);
    originalBytes += pngStats.size;

    if (fs.existsSync(webpPath)) {
      const webpStats = await fs.promises.stat(webpPath);
      webpBytes += webpStats.size;
      skipped++;
      continue;
    }

    await sharp(pngPath)
      .webp({ quality: 75 })
      .toFile(webpPath);

    const webpStats = await fs.promises.stat(webpPath);
    webpBytes += webpStats.size;

    converted++;

    if (converted % 100 === 0) {
      console.log(`Converted ${converted} tiles...`);
    }
  }

  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);

  const savings =
    originalBytes > 0
      ? ((1 - webpBytes / originalBytes) * 100).toFixed(1)
      : "0";

  console.log("");
  console.log("✅ Conversion complete!");
  console.log(`PNG tiles:       ${pngFiles.length}`);
  console.log(`Converted:       ${converted}`);
  console.log(`Already existed: ${skipped}`);
  console.log("");
  console.log(`Original size:   ${mb(originalBytes)} MB`);
  console.log(`WebP size:       ${mb(webpBytes)} MB`);
  console.log(`Space reduction: ${savings}%`);
  console.log("");
  console.log("⚠️ PNG files were NOT deleted.");
}

main().catch((error) => {
  console.error("❌ Conversion failed:");
  console.error(error);
  process.exit(1);
});
