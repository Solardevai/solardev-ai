import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleMessages = [];
const failedRequests = [];
const tileResponses = [];

page.on("console", (message) => {
  consoleMessages.push({ type: message.type(), text: message.text() });
});
page.on("pageerror", (error) => {
  consoleMessages.push({ type: "pageerror", text: error.message });
});
page.on("requestfailed", (request) => {
  failedRequests.push({ url: request.url(), error: request.failure()?.errorText });
});
page.on("response", (response) => {
  if (
    response.url().includes("tile.openstreetmap.org") ||
    response.url().includes("server.arcgisonline.com")
  ) {
    tileResponses.push({ url: response.url(), status: response.status() });
  }
});

await page.goto(
  process.env.MAP_TEST_URL ??
    "http://127.0.0.1:3010/tools/solar-site-screening",
  {
  waitUntil: "networkidle",
  },
);
await page.waitForTimeout(3000);

const rejectAnalytics = page.getByRole("button", { name: "Reject analytics" });
if (await rejectAnalytics.isVisible().catch(() => false)) {
  await rejectAnalytics.click();
}

const satelliteButton = page.getByRole("button", { name: "satellite" });
if (await satelliteButton.isVisible().catch(() => false)) {
  await satelliteButton.click();
  await page.waitForTimeout(1500);
}

await page.getByRole("button", { name: "Start drawing" }).click();
const mapBox = await page.locator(".maplibregl-canvas").boundingBox();
if (mapBox) {
  await page.mouse.click(mapBox.x + mapBox.width * 0.35, mapBox.y + mapBox.height * 0.35);
  await page.mouse.click(mapBox.x + mapBox.width * 0.65, mapBox.y + mapBox.height * 0.35);
  await page.mouse.click(mapBox.x + mapBox.width * 0.55, mapBox.y + mapBox.height * 0.65);
}

const mapState = await page.evaluate(() => {
  const canvas = document.querySelector(".maplibregl-canvas");
  return {
    canvas: canvas
      ? {
          width: canvas.width,
          height: canvas.height,
          clientWidth: canvas.clientWidth,
          clientHeight: canvas.clientHeight,
        }
      : null,
    controls: document.querySelectorAll(".maplibregl-ctrl").length,
    satelliteSelected:
      document
        .querySelector('button[aria-pressed="true"]')
        ?.textContent?.trim()
        .toLowerCase() === "satellite",
    drawingStatus: document.body.innerText.includes("Boundary ready."),
    overlayPath:
      document.querySelector("[data-site-path]")?.getAttribute("d") ?? "",
    overlayVertices: document.querySelectorAll(
      "[data-site-vertices] circle",
    ).length,
    webgl:
      Boolean(document.createElement("canvas").getContext("webgl2")) ||
      Boolean(document.createElement("canvas").getContext("webgl")),
    resources: performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((name) => name.includes("tile.openstreetmap.org")),
  };
});

console.log(
  JSON.stringify(
    { mapState, consoleMessages, failedRequests, tileResponses },
    null,
    2,
  ),
);
await page.screenshot({
  path: "tmp/map-drawing-verification.png",
  fullPage: true,
});
await browser.close();
