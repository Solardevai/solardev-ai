import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";

const handbooks = [
  {
    localPath:
      "./private/solardev-ai-volume-1-v1.1.pdf",
    blobPath:
      "products/solardev-ai-volume-1-v1.1.pdf",
  },
  {
    localPath:
      "./private/solardev-ai-volume-2-v1.1.pdf",
    blobPath:
      "products/solardev-ai-volume-2-v1.1.pdf",
  },
];

async function uploadHandbooks() {
  for (const handbook of handbooks) {
    const file = await readFile(handbook.localPath);
    const blob = await put(
      handbook.blobPath,
      file,
      {
        access: "private",
        contentType: "application/pdf",
        allowOverwrite: true,
      },
    );

    console.log(
      `Private PDF uploaded: ${blob.pathname}`,
    );
  }
}

uploadHandbooks().catch((error) => {
  console.error("PDF upload failed:", error);
  process.exit(1);
});
