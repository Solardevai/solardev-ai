import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const localFilePath =
  "./private/solardev-ai-volume-1-v4.pdf";

const blobPathname =
  "products/solardev-ai-volume-1-v4.pdf";

async function uploadVolumeOne() {
  const file = await readFile(localFilePath);

  const blob = await put(blobPathname, file, {
    access: "private",
    contentType: "application/pdf",
    allowOverwrite: true,
  });

  console.log("Private PDF uploaded successfully");
  console.log("Pathname:", blob.pathname);
}

uploadVolumeOne().catch((error) => {
  console.error("PDF upload failed:", error);
  process.exit(1);
});