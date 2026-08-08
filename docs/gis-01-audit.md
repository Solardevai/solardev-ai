# GIS-01 audit and implementation boundary

## Current Site Assessment capability

- MapLibre GL 6 with an Esri World Topographic Map default and satellite imagery toggle.
- Location and coordinate search through a server-side Nominatim proxy.
- Polygon drawing, vertex editing, area, perimeter, and centroid calculations.
- KMZ import and KMZ, KML, and GeoJSON export.
- PVGIS annual yield and TMY requests through route handlers.
- Live OpenStreetMap road, transmission, and substation context through Overpass.
- Signed-in project creation through Clerk, Prisma, and PostgreSQL.

## GIS-01 changes

- `components/gis/MapCore.tsx` owns the reusable MapLibre lifecycle, basemap,
  controls, and map canvas shared by Site Assessment and the project workspace.
- `lib/gis/layers.ts` is the first formal layer registry. It is the source of
  layer names, colors, default visibility, minimum zoom, provider metadata, and
  intended screening behavior.
- `types/gis.ts` defines map state and future constraint-result contracts.
- `types/project.ts` distinguishes the future project domain model from the
  narrower persistence payload supported by the current database.
- Site Assessment keeps the same analyses, exports, and save behavior while being
  surfaced consistently under Tools.

## Deliberately deferred

- Do not add environmental, land, or terrain datasets until licensing,
  jurisdiction, update cadence, and screening rules are defined per layer.
- Do not expand the Prisma `Project` model until defaults and validation are
  agreed for technology, country, lifecycle status, and map state.
- Do not create `/platform/projects/[projectId]` until projects can be read by
  ID with owner authorization; the current API only creates projects.

## GIS-02 delivered

- Owner-authorized project retrieval and update endpoints.
- Backward-compatible technology, country, status, and map-state persistence.
- `/platform/projects/[projectId]` GIS Lite workspace using `MapCore`.
- Saved-project list on the protected dashboard.
- Site Assessment conversion path into the project workspace.

## Recommended next implementation

GIS-03 infrastructure proximity is now delivered with polygon-to-asset
distance calculations, source timestamps, search-radius disclosure and
recommended verification actions.

GIS-03 Natura 2000 screening is now delivered using the official EEA 2024
dataset and GeometryServer operations for union, intersection and geodesic
area. Results include affected area, site percentage, designations, source
metadata, limitations and risk classification.

GIS-03 nationally designated protected-area screening is now delivered against
the official EEA NatDA v23 query service, with its May 2025 reporting cutoff and
known country-coverage gaps disclosed alongside each result. The analysis
returns unique CDDA designations, unioned overlap, geodesic affected area and
site percentage using the same traceable result contract.

GIS-03 Floods Directive reporting-area screening is now delivered using the
operational EEA 2019 point, line and polygon services. It flags exact site
intersections but deliberately does not calculate an affected-area percentage:
these are Member-State Areas of Potential Significant Flood Risk, not consistent
inundation footprints. Results disclose the newer March 2025 reference dataset
and direct users to current national authority hazard maps.

GIS-03 surface-water proximity is now delivered using live OpenStreetMap data
through resilient Overpass endpoints. It measures polygon-boundary distance to
watercourses, standing water and wetlands, detects on-site intersections and
returns dataset timestamps, search radius, confidence limitations and authority
verification actions.

GIS-03 terrain screening is now delivered using a bounded site grid and the
public Mapzen Terrain Tiles bare-earth DEM mosaic hosted by the AWS Open Data
program. It provides approximately 30 m source detail in the target European
markets without an API key and reports sampled elevation range, average slope,
90th-percentile slope, maximum sampled slope, risk logic, source attribution
and survey limitations.

GIS-03 preliminary scoring is now delivered as an explainable eight-criterion,
100-point model covering environmental designations, flood and surface water,
grid and access proximity, and terrain. Each deduction, weight and evidence
statement is returned. Missing sources are excluded through available-weight
normalization, lower the reported coverage/confidence, and never receive a
favourable default. Individual sources have a 35-second orchestration deadline.

GIS-03 immutable analysis history is now delivered. Every completed preliminary
score creates an append-only PostgreSQL snapshot containing its full evidence
payload, methodology version, score, coverage and confidence. Owner-authorized
list and detail endpoints let the project workspace reopen prior runs and show
their change from the immediately preceding result.

GIS-03 professional screening reports are now delivered as owner-authorized PDF
downloads for every immutable score run. Each report includes project and site
metadata, the executive result, weighted criterion evidence, recommended next
actions, the persisted source register and limitations, methodology, reliance
language and the snapshot audit record. Legacy snapshots remain exportable and
explicitly disclose when detailed source metadata was not yet persisted.

GIS-03 portfolio comparison is now delivered on the protected dashboard. It
uses a summary-only owner-scoped query to rank the latest immutable run for each
project by score, coverage, material-constraint count, analysis recency or name.
Portfolio cards summarize analysis coverage, average score, material criteria
and high-confidence runs, while each row links to the workspace and latest PDF.

Workspace commercial controls remain available for a later launch, but
enforcement is disabled by default through `BILLING_ENFORCEMENT_ENABLED=false`.
Site scoring, reports, GIS analyses, saved projects, and exports therefore have
no product quota or payment gate during the open-access period. Usage events
continue to be recorded so limits can be introduced later without rebuilding
the entitlement system. Authentication remains required for project ownership
and persistence, not payment.

The snapshot PDF package now includes a dated vector map exhibit of the saved
candidate-site boundary and a spatial constraint register. The register ties
each immutable criterion finding to its screening status, score, provider and
persisted retrieval timestamp, while legacy snapshots disclose when exact
source metadata was not retained.

Methodology v1.2 now persists a structured spatial constraint register inside
each immutable score snapshot. It retains source feature identifiers for Natura
2000, national designations, Floods Directive areas, OpenStreetMap water and
infrastructure features, plus the applicable spatial metrics, retrieval times
and recommended actions. Professional PDFs include an authority-identifier
appendix, and every saved run exposes an owner-authorized CSV register download.
Legacy runs remain downloadable with an explicit metadata fallback.

Methodology v1.3 now evaluates terrain on a clipped 9 × 9 cell grid. Cells with
a calculated slope greater than 5° and a downslope aspect from 315° through
north to 45° are classified as non-usable screening area. Their clipped
geometry, estimated area and site percentage are persisted with the score,
rendered as an orange map overlay and recorded as a terrain intersection in the
constraint register. The mask remains a DEM-based screening estimate that must
be confirmed with higher-resolution terrain data and a topographic survey.

The next GIS increment should add project-level analyst notes and disposition
states so each constraint can be tracked from screening finding to verified,
accepted, mitigated or excluded.
