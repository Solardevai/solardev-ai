import {
  PDFDocument,
  PDFFont,
  PDFPage,
  StandardFonts,
  rgb,
} from "pdf-lib";
import type {
  AnalysisSnapshotDetail,
  PreliminarySiteScore,
} from "@/types/gis";
import type { SolarDevProject } from "@/types/project";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const COLORS = {
  ink: rgb(0.055, 0.09, 0.15),
  slate: rgb(0.29, 0.35, 0.43),
  muted: rgb(0.48, 0.53, 0.59),
  line: rgb(0.86, 0.88, 0.9),
  paper: rgb(0.98, 0.985, 0.99),
  emerald: rgb(0.11, 0.62, 0.44),
  paleEmerald: rgb(0.9, 0.97, 0.94),
  amber: rgb(0.72, 0.43, 0.05),
  rose: rgb(0.7, 0.16, 0.25),
  white: rgb(1, 1, 1),
};

function ascii(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00b0/g, " deg")
    .replace(/\u00b7/g, " | ")
    .replace(/[^\x20-\x7e]/g, "?");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(value));
}

function formatBand(band: PreliminarySiteScore["band"]) {
  const labels: Record<PreliminarySiteScore["band"], string> = {
    "favourable-screening": "Favourable screening",
    "further-review": "Further review",
    "material-constraints": "Material constraints",
    unavailable: "Unavailable",
  };
  return labels[band];
}

function wrapText(text: string, font: PDFFont, size: number, width: number) {
  const words = ascii(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

class ReportBuilder {
  readonly document: PDFDocument;
  readonly regular: PDFFont;
  readonly bold: PDFFont;
  page: PDFPage;
  y: number;

  private constructor(
    document: PDFDocument,
    regular: PDFFont,
    bold: PDFFont,
  ) {
    this.document = document;
    this.regular = regular;
    this.bold = bold;
    this.page = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  static async create() {
    const document = await PDFDocument.create();
    const [regular, bold] = await Promise.all([
      document.embedFont(StandardFonts.Helvetica),
      document.embedFont(StandardFonts.HelveticaBold),
    ]);
    return new ReportBuilder(document, regular, bold);
  }

  newPage(sectionTitle?: string) {
    this.page = this.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.page.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      color: COLORS.paper,
    });
    this.y = PAGE_HEIGHT - MARGIN;
    if (sectionTitle) {
      this.page.drawText(ascii(sectionTitle.toUpperCase()), {
        x: MARGIN,
        y: this.y,
        size: 9,
        font: this.bold,
        color: COLORS.emerald,
      });
      this.y -= 18;
      this.rule();
      this.y -= 18;
    }
  }

  ensureSpace(height: number, continuedTitle?: string) {
    if (this.y - height < 54) this.newPage(continuedTitle);
  }

  rule() {
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 0.7,
      color: COLORS.line,
    });
  }

  heading(text: string, size = 18) {
    this.ensureSpace(size + 18);
    this.page.drawText(ascii(text), {
      x: MARGIN,
      y: this.y,
      size,
      font: this.bold,
      color: COLORS.ink,
    });
    this.y -= size + 12;
  }

  paragraph(
    text: string,
    options: {
      size?: number;
      color?: ReturnType<typeof rgb>;
      indent?: number;
      gap?: number;
      continuedTitle?: string;
    } = {},
  ) {
    const size = options.size ?? 9.5;
    const indent = options.indent ?? 0;
    const lineHeight = size * 1.45;
    const lines = wrapText(text, this.regular, size, CONTENT_WIDTH - indent);
    for (const line of lines) {
      this.ensureSpace(lineHeight, options.continuedTitle);
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y,
        size,
        font: this.regular,
        color: options.color ?? COLORS.slate,
      });
      this.y -= lineHeight;
    }
    this.y -= options.gap ?? 7;
  }

  labelValue(label: string, value: string, x: number, y: number, width: number) {
    this.page.drawText(ascii(label.toUpperCase()), {
      x,
      y,
      size: 7.5,
      font: this.bold,
      color: COLORS.muted,
    });
    const lines = wrapText(value, this.regular, 10, width);
    lines.slice(0, 2).forEach((line, index) => {
      this.page.drawText(line, {
        x,
        y: y - 15 - index * 12,
        size: 10,
        font: this.regular,
        color: COLORS.ink,
      });
    });
  }

  async finish() {
    const pages = this.document.getPages();
    pages.forEach((page, index) => {
      page.drawText("SolarDev AI | Preliminary screening report", {
        x: MARGIN,
        y: 26,
        size: 7.5,
        font: this.regular,
        color: COLORS.muted,
      });
      const pageLabel = `${index + 1} / ${pages.length}`;
      page.drawText(pageLabel, {
        x: PAGE_WIDTH - MARGIN - this.regular.widthOfTextAtSize(pageLabel, 7.5),
        y: 26,
        size: 7.5,
        font: this.regular,
        color: COLORS.muted,
      });
    });
    return this.document.save();
  }
}

function recommendationItems(score: PreliminarySiteScore) {
  const items = score.criteria
    .filter((criterion) => criterion.status !== "favourable")
    .map((criterion) =>
      criterion.status === "unavailable"
        ? `Restore or verify the ${criterion.label.toLowerCase()} input, then rerun the screening.`
        : `Verify ${criterion.label.toLowerCase()} with the competent authority or a qualified specialist: ${criterion.evidence}`,
    );
  items.push(
    "Confirm land control, planning policy, grid capacity, access rights, geotechnical conditions and current authority datasets before making a development or investment decision.",
  );
  return items;
}

function criterionSourceId(criterionId: PreliminarySiteScore["criteria"][number]["id"]) {
  if (
    criterionId === "main-road" ||
    criterionId === "transmission-line" ||
    criterionId === "substation"
  ) {
    return "infrastructure";
  }
  if (criterionId === "national-designations") {
    return "national-designations";
  }
  return criterionId;
}

function sourceForCriterion(
  score: PreliminarySiteScore,
  criterionId: PreliminarySiteScore["criteria"][number]["id"],
) {
  const sourceId = criterionSourceId(criterionId);
  return score.sources?.find((source) => source.id === sourceId) ?? null;
}

function drawMapExhibit(
  report: ReportBuilder,
  project: SolarDevProject,
  snapshot: AnalysisSnapshotDetail,
) {
  report.newPage("Dated map exhibit");
  report.heading("Saved site boundary");
  report.paragraph(
    `Exhibit date: ${formatDate(snapshot.createdAt)} | Analysis date: ${formatDate(snapshot.payload.generatedAt)} | CRS: WGS 84 geographic coordinates (EPSG:4326).`,
    { size: 8.7 },
  );

  const mapTop = report.y;
  const mapHeight = 390;
  const mapBottom = mapTop - mapHeight;
  report.page.drawRectangle({
    x: MARGIN,
    y: mapBottom,
    width: CONTENT_WIDTH,
    height: mapHeight,
    color: rgb(0.955, 0.97, 0.975),
    borderWidth: 0.8,
    borderColor: COLORS.line,
  });

  for (let index = 1; index < 5; index += 1) {
    const x = MARGIN + (CONTENT_WIDTH * index) / 5;
    const y = mapBottom + (mapHeight * index) / 5;
    report.page.drawLine({
      start: { x, y: mapBottom },
      end: { x, y: mapTop },
      thickness: 0.35,
      color: COLORS.line,
    });
    report.page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + CONTENT_WIDTH, y },
      thickness: 0.35,
      color: COLORS.line,
    });
  }

  const ring = (project.site.geometry.coordinates[0] ?? []).filter(
    (coordinate) =>
      Number.isFinite(coordinate[0]) && Number.isFinite(coordinate[1]),
  );
  if (ring.length >= 3) {
    const longitudes = ring.map(([longitude]) => longitude);
    const latitudes = ring.map(([, latitude]) => latitude);
    const minimumLongitude = Math.min(...longitudes);
    const maximumLongitude = Math.max(...longitudes);
    const minimumLatitude = Math.min(...latitudes);
    const maximumLatitude = Math.max(...latitudes);
    const centerLongitude = (minimumLongitude + maximumLongitude) / 2;
    const centerLatitude = (minimumLatitude + maximumLatitude) / 2;
    const longitudeFactor = Math.max(
      0.15,
      Math.cos((centerLatitude * Math.PI) / 180),
    );
    const projected = ring.map(([longitude, latitude]) => ({
      x: (longitude - centerLongitude) * longitudeFactor,
      y: latitude - centerLatitude,
    }));
    const xRange = Math.max(
      1e-8,
      Math.max(...projected.map((point) => point.x)) -
        Math.min(...projected.map((point) => point.x)),
    );
    const yRange = Math.max(
      1e-8,
      Math.max(...projected.map((point) => point.y)) -
        Math.min(...projected.map((point) => point.y)),
    );
    const scale = Math.min(
      (CONTENT_WIDTH - 70) / xRange,
      (mapHeight - 70) / yRange,
    );
    const toPagePoint = (point: { x: number; y: number }) => ({
      x: MARGIN + CONTENT_WIDTH / 2 + point.x * scale,
      y: mapBottom + mapHeight / 2 + point.y * scale,
    });
    const pagePoints = projected.map(toPagePoint);
    for (let index = 1; index < pagePoints.length; index += 1) {
      report.page.drawLine({
        start: pagePoints[index - 1],
        end: pagePoints[index],
        thickness: 2.2,
        color: COLORS.emerald,
      });
    }
    const first = pagePoints[0];
    const last = pagePoints.at(-1);
    if (first && last && (first.x !== last.x || first.y !== last.y)) {
      report.page.drawLine({
        start: last,
        end: first,
        thickness: 2.2,
        color: COLORS.emerald,
      });
    }
    const centroidPoint = toPagePoint({
      x: (project.site.centroid[0] - centerLongitude) * longitudeFactor,
      y: project.site.centroid[1] - centerLatitude,
    });
    report.page.drawCircle({
      x: centroidPoint.x,
      y: centroidPoint.y,
      size: 4,
      color: COLORS.ink,
      borderWidth: 1.5,
      borderColor: COLORS.white,
    });

    const boundsLabel = `${minimumLatitude.toFixed(5)}, ${minimumLongitude.toFixed(5)} to ${maximumLatitude.toFixed(5)}, ${maximumLongitude.toFixed(5)}`;
    report.page.drawText(ascii(boundsLabel), {
      x: MARGIN + 10,
      y: mapBottom + 10,
      size: 7.5,
      font: report.regular,
      color: COLORS.muted,
    });
  } else {
    report.page.drawText("Saved boundary geometry is unavailable.", {
      x: MARGIN + 18,
      y: mapBottom + mapHeight / 2,
      size: 10,
      font: report.regular,
      color: COLORS.rose,
    });
  }

  const northX = MARGIN + CONTENT_WIDTH - 28;
  const northY = mapTop - 30;
  report.page.drawText("N", {
    x: northX - 3,
    y: northY + 10,
    size: 9,
    font: report.bold,
    color: COLORS.ink,
  });
  report.page.drawLine({
    start: { x: northX, y: northY - 12 },
    end: { x: northX, y: northY + 7 },
    thickness: 1.5,
    color: COLORS.ink,
  });
  report.page.drawLine({
    start: { x: northX, y: northY + 7 },
    end: { x: northX - 4, y: northY + 1 },
    thickness: 1.5,
    color: COLORS.ink,
  });
  report.page.drawLine({
    start: { x: northX, y: northY + 7 },
    end: { x: northX + 4, y: northY + 1 },
    thickness: 1.5,
    color: COLORS.ink,
  });

  report.y = mapBottom - 24;
  report.heading("Exhibit particulars", 13);
  const detailTop = report.y;
  const detailWidth = (CONTENT_WIDTH - 24) / 2;
  report.labelValue(
    "Site centroid",
    `${project.site.centroid[1].toFixed(5)}, ${project.site.centroid[0].toFixed(5)}`,
    MARGIN,
    detailTop,
    detailWidth,
  );
  report.labelValue(
    "Gross boundary area",
    `${(project.site.areaSqm / 10_000).toFixed(2)} ha`,
    MARGIN + detailWidth + 24,
    detailTop,
    detailWidth,
  );
  report.y = detailTop - 62;
  report.paragraph(
    "This vector exhibit records the saved candidate-site boundary used for the selected analysis snapshot. It is not a cadastral, topographic or legal-title plan; boundary position and area require survey and land-record verification.",
    { size: 8.4, color: COLORS.muted },
  );
}

function drawConstraintRegister(
  report: ReportBuilder,
  snapshot: AnalysisSnapshotDetail,
) {
  const score = snapshot.payload;
  report.newPage("Spatial constraint register");
  report.heading("Snapshot constraint register");
  report.paragraph(
    "This register preserves the spatial finding, screening status and source retrieval date for each criterion in the selected immutable run.",
  );

  for (const criterion of score.criteria) {
    const source = sourceForCriterion(score, criterion.id);
    const evidenceLines = wrapText(
      criterion.evidence,
      report.regular,
      8.5,
      CONTENT_WIDTH - 20,
    );
    const sourceText = source
      ? `${source.provider} | retrieved ${formatDate(source.retrievedAt)}`
      : "Source metadata was not persisted for this snapshot.";
    const sourceLines = wrapText(
      sourceText,
      report.regular,
      7.6,
      CONTENT_WIDTH - 20,
    );
    const rowHeight = 49 + evidenceLines.length * 11 + sourceLines.length * 10;
    report.ensureSpace(rowHeight, "Spatial constraint register - continued");
    const rowTop = report.y;
    report.page.drawRectangle({
      x: MARGIN,
      y: rowTop - rowHeight + 5,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: COLORS.white,
      borderWidth: 0.7,
      borderColor: COLORS.line,
    });
    report.page.drawText(ascii(criterion.label), {
      x: MARGIN + 10,
      y: rowTop - 17,
      size: 9.7,
      font: report.bold,
      color: COLORS.ink,
    });
    const registerStatus = `${criterion.group.toUpperCase()} | ${criterion.status.toUpperCase()} | ${criterion.score ?? "N/A"}/100`;
    report.page.drawText(ascii(registerStatus), {
      x:
        PAGE_WIDTH -
        MARGIN -
        report.regular.widthOfTextAtSize(ascii(registerStatus), 7.8) -
        10,
      y: rowTop - 17,
      size: 7.8,
      font: report.regular,
      color:
        criterion.status === "constraint"
          ? COLORS.rose
          : criterion.status === "caution"
            ? COLORS.amber
            : COLORS.slate,
    });
    evidenceLines.forEach((line, index) => {
      report.page.drawText(line, {
        x: MARGIN + 10,
        y: rowTop - 36 - index * 11,
        size: 8.5,
        font: report.regular,
        color: COLORS.slate,
      });
    });
    const sourceTop = rowTop - 40 - evidenceLines.length * 11;
    sourceLines.forEach((line, index) => {
      report.page.drawText(line, {
        x: MARGIN + 10,
        y: sourceTop - index * 10,
        size: 7.6,
        font: report.regular,
        color: COLORS.muted,
      });
    });
    report.y -= rowHeight + 7;
  }
}

function drawAuthorityIdentifiers(
  report: ReportBuilder,
  snapshot: AnalysisSnapshotDetail,
) {
  report.newPage("Authority identifier appendix");
  report.heading("Feature-level source identifiers");
  report.paragraph(
    "Identifiers below are preserved from the source response used by the selected analysis run. Use them to locate the mapped record in current competent-authority data; an identifier is not confirmation that the feature remains current or legally applicable.",
  );

  const register = snapshot.payload.constraintRegister;
  if (!register) {
    report.paragraph(
      "This legacy snapshot predates feature-level constraint-register persistence. Its screening findings remain available, but exact designation and mapped-feature identifiers cannot be reconstructed without rerunning the analysis.",
      { color: COLORS.amber },
    );
    return;
  }

  const rowsWithFeatures = register.filter((row) => row.features.length > 0);
  if (!rowsWithFeatures.length) {
    report.paragraph(
      "No mapped feature identifiers were returned by the available sources during this run. Review the constraint register and source availability before treating this as evidence of absence.",
      { color: COLORS.amber },
    );
    return;
  }

  for (const row of rowsWithFeatures) {
    report.ensureSpace(74, "Authority identifier appendix - continued");
    report.heading(row.label, 12);
    for (const feature of row.features) {
      const featureText = [
        feature.identifier,
        feature.name,
        feature.jurisdiction ? `jurisdiction ${feature.jurisdiction}` : null,
        feature.classification,
      ]
        .filter(Boolean)
        .join(" | ");
      report.paragraph(`- ${featureText}`, {
        size: 8.5,
        indent: 8,
        gap: 3,
        continuedTitle: "Authority identifier appendix - continued",
      });
    }
    report.y -= 6;
  }
}

export function screeningReportFilename(project: SolarDevProject) {
  const slug = ascii(project.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${slug || "site"}-preliminary-screening-report.pdf`;
}

export async function generateScreeningReport(
  project: SolarDevProject,
  snapshot: AnalysisSnapshotDetail,
) {
  const score = snapshot.payload;
  const report = await ReportBuilder.create();
  report.document.setTitle(`${project.name} - Preliminary screening report`);
  report.document.setAuthor("SolarDev AI");
  report.document.setSubject("Explainable preliminary renewable-energy site screening");
  report.document.setKeywords([
    "solar",
    "BESS",
    "site screening",
    "GIS",
    "constraints",
  ]);
  report.document.setCreationDate(new Date(snapshot.createdAt));

  report.page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: COLORS.paper,
  });
  report.page.drawRectangle({
    x: 0,
    y: PAGE_HEIGHT - 300,
    width: PAGE_WIDTH,
    height: 300,
    color: COLORS.ink,
  });
  report.page.drawText("SOLARDEV AI", {
    x: MARGIN,
    y: PAGE_HEIGHT - 68,
    size: 10,
    font: report.bold,
    color: COLORS.emerald,
  });
  report.page.drawText("Preliminary screening report", {
    x: MARGIN,
    y: PAGE_HEIGHT - 124,
    size: 25,
    font: report.bold,
    color: COLORS.white,
  });
  wrapText(project.name, report.bold, 16, 340).slice(0, 2).forEach((line, index) => {
    report.page.drawText(line, {
      x: MARGIN,
      y: PAGE_HEIGHT - 162 - index * 21,
      size: 16,
      font: report.bold,
      color: COLORS.white,
    });
  });
  report.page.drawCircle({
    x: PAGE_WIDTH - 105,
    y: PAGE_HEIGHT - 168,
    size: 50,
    borderWidth: 5,
    borderColor: COLORS.emerald,
    color: rgb(0.07, 0.12, 0.18),
  });
  const scoreLabel = score.score === null ? "N/A" : String(score.score);
  report.page.drawText(scoreLabel, {
    x:
      PAGE_WIDTH -
      105 -
      report.bold.widthOfTextAtSize(scoreLabel, 27) / 2,
    y: PAGE_HEIGHT - 176,
    size: 27,
    font: report.bold,
    color: COLORS.white,
  });
  report.page.drawText("OUT OF 100", {
    x: PAGE_WIDTH - 130,
    y: PAGE_HEIGHT - 198,
    size: 7,
    font: report.bold,
    color: COLORS.muted,
  });

  const metadataTop = PAGE_HEIGHT - 350;
  const columnWidth = (CONTENT_WIDTH - 24) / 2;
  report.labelValue("Technology", project.technology.toUpperCase(), MARGIN, metadataTop, columnWidth);
  report.labelValue("Project status", project.status, MARGIN + columnWidth + 24, metadataTop, columnWidth);
  report.labelValue("Country / market", project.country || "Not specified", MARGIN, metadataTop - 70, columnWidth);
  report.labelValue("Gross site area", `${(project.site.areaSqm / 10_000).toFixed(2)} ha`, MARGIN + columnWidth + 24, metadataTop - 70, columnWidth);
  report.labelValue("Site centroid", `${project.site.centroid[1].toFixed(5)}, ${project.site.centroid[0].toFixed(5)}`, MARGIN, metadataTop - 140, columnWidth);
  report.labelValue("Analysis generated", formatDate(score.generatedAt), MARGIN + columnWidth + 24, metadataTop - 140, columnWidth);
  report.labelValue("Snapshot ID", snapshot.id, MARGIN, metadataTop - 210, columnWidth);
  report.labelValue("Methodology", `v${snapshot.methodologyVersion}`, MARGIN + columnWidth + 24, metadataTop - 210, columnWidth);

  report.page.drawRectangle({
    x: MARGIN,
    y: 94,
    width: CONTENT_WIDTH,
    height: 82,
    color: COLORS.paleEmerald,
  });
  report.page.drawText(ascii(formatBand(score.band)), {
    x: MARGIN + 18,
    y: 145,
    size: 15,
    font: report.bold,
    color: COLORS.ink,
  });
  report.page.drawText(
    ascii(`${score.coveragePercent}% data coverage | ${score.confidence} confidence`),
    {
      x: MARGIN + 18,
      y: 122,
      size: 9.5,
      font: report.regular,
      color: COLORS.slate,
    },
  );

  report.newPage("Executive summary");
  report.heading("Screening result");
  report.paragraph(
    `This immutable run produced a score of ${score.score ?? "not available"} out of 100, classified as ${formatBand(score.band).toLowerCase()}, with ${score.coveragePercent}% source coverage and ${score.confidence} confidence. The result reflects only the evidence and source responses recorded at ${formatDate(score.generatedAt)}.`,
  );
  if (score.coveragePercent < 100) {
    report.paragraph(
      `The result is partial. ${score.unavailableSources.length} source group${score.unavailableSources.length === 1 ? " was" : "s were"} unavailable and the score was normalized across available-weight criteria; missing evidence was not treated as favourable.`,
      { color: COLORS.amber },
    );
  }
  report.heading("Recommended next actions", 15);
  recommendationItems(score).forEach((item, index) => {
    report.paragraph(`${index + 1}. ${item}`, {
      indent: 10,
      continuedTitle: "Recommended next actions - continued",
    });
  });

  drawMapExhibit(report, project, snapshot);
  drawConstraintRegister(report, snapshot);
  drawAuthorityIdentifiers(report, snapshot);

  report.newPage("Criterion evidence");
  report.heading("Weighted screening criteria");
  report.paragraph(
    "The table below preserves the score, weight, status and evidence statement returned for every criterion in this run.",
  );
  for (const criterion of score.criteria) {
    const evidenceLines = wrapText(
      criterion.evidence,
      report.regular,
      8.7,
      CONTENT_WIDTH - 20,
    );
    const rowHeight = 43 + evidenceLines.length * 12;
    report.ensureSpace(rowHeight, "Criterion evidence - continued");
    const rowTop = report.y;
    report.page.drawRectangle({
      x: MARGIN,
      y: rowTop - rowHeight + 5,
      width: CONTENT_WIDTH,
      height: rowHeight,
      color: rgb(1, 1, 1),
      borderWidth: 0.7,
      borderColor: COLORS.line,
    });
    report.page.drawText(ascii(criterion.label), {
      x: MARGIN + 10,
      y: rowTop - 18,
      size: 10,
      font: report.bold,
      color: COLORS.ink,
    });
    const metric = `${criterion.score ?? "N/A"}/100 | weight ${criterion.weight}% | ${criterion.status}`;
    report.page.drawText(ascii(metric), {
      x: PAGE_WIDTH - MARGIN - report.regular.widthOfTextAtSize(ascii(metric), 8.2) - 10,
      y: rowTop - 18,
      size: 8.2,
      font: report.regular,
      color:
        criterion.status === "constraint"
          ? COLORS.rose
          : criterion.status === "caution"
            ? COLORS.amber
            : COLORS.slate,
    });
    evidenceLines.forEach((line, index) => {
      report.page.drawText(line, {
        x: MARGIN + 10,
        y: rowTop - 38 - index * 12,
        size: 8.7,
        font: report.regular,
        color: COLORS.slate,
      });
    });
    report.y -= rowHeight + 7;
  }

  report.newPage("Sources and limitations");
  report.heading("Source register");
  if (!score.sources?.length) {
    report.paragraph(
      "This legacy snapshot predates source-register persistence. Its criterion evidence is preserved, but exact provider URLs, retrieval timestamps and dataset versions cannot be reconstructed reliably. Rerun the score to create a report with complete source metadata.",
      { color: COLORS.amber },
    );
  } else {
    for (const source of score.sources) {
      report.ensureSpace(110, "Sources and limitations - continued");
      report.heading(source.label, 12);
      report.paragraph(
        `${source.provider} | ${source.dataset}${source.version ? ` | ${source.version}` : ""} | retrieved ${formatDate(source.retrievedAt)} | ${source.licence}`,
        { size: 8.8, gap: 3 },
      );
      if (source.serviceUrl) {
        report.paragraph(`Service: ${source.serviceUrl}`, { size: 7.8, gap: 2 });
      }
      if (source.metadataUrl) {
        report.paragraph(`Metadata: ${source.metadataUrl}`, { size: 7.8, gap: 3 });
      }
      source.limitations.forEach((limitation) => {
        report.paragraph(`- ${limitation}`, {
          size: 8.4,
          indent: 8,
          gap: 2,
          continuedTitle: "Sources and limitations - continued",
        });
      });
      report.y -= 8;
    }
  }

  if (score.unavailableSources.length) {
    report.heading("Unavailable inputs", 15);
    score.unavailableSources.forEach((source) => {
      report.paragraph(`- ${source.label}: ${source.reason}`, { indent: 8 });
    });
  }

  report.newPage("Methodology and reliance");
  report.heading(`Methodology v${score.methodology.version}`);
  report.paragraph(
    `Eight deterministic criteria total ${score.methodology.totalWeight} weight points. Each available criterion receives a 0-100 score and contributes its weighted deduction. Where a source is unavailable, ${score.methodology.normalization} is used; unavailable criteria reduce coverage and confidence and are never assigned a favourable default.`,
  );
  report.heading("Reliance and professional review", 15);
  report.paragraph(score.disclaimer, { color: COLORS.rose });
  report.paragraph(
    "Mapped datasets can be incomplete, generalized, delayed, or unsuitable for parcel-level design. This report does not establish title, planning consent, environmental acceptability, grid capacity, access rights, flood safety, constructability, yield, valuation, or financing suitability. Use current competent-authority data and appropriately qualified advisers before relying on any finding.",
  );
  report.heading("Audit record", 15);
  report.paragraph(`Project ID: ${project.id}`, { gap: 2 });
  report.paragraph(`Snapshot ID: ${snapshot.id}`, { gap: 2 });
  report.paragraph(`Snapshot created: ${formatDate(snapshot.createdAt)}`, { gap: 2 });
  report.paragraph(`Analysis generated: ${formatDate(score.generatedAt)}`, { gap: 2 });
  report.paragraph(`Methodology version: ${snapshot.methodologyVersion}`, { gap: 2 });
  report.paragraph(
    "The report is generated from the selected immutable snapshot. Generating the PDF does not rerun or refresh any source.",
  );

  return report.finish();
}
