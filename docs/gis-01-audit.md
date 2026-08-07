# GIS-01 audit and implementation boundary

## Current Site Check capability

- MapLibre GL 6 with an Esri World Imagery raster basemap.
- Location and coordinate search through a server-side Nominatim proxy.
- Polygon drawing, vertex editing, area, perimeter, and centroid calculations.
- KMZ import and KMZ, KML, and GeoJSON export.
- PVGIS annual yield and TMY requests through route handlers.
- Live OpenStreetMap road, transmission, and substation context through Overpass.
- Signed-in project creation through Clerk, Prisma, and PostgreSQL.

## GIS-01 changes

- `components/gis/MapCore.tsx` owns the reusable MapLibre lifecycle, basemap,
  controls, and map canvas shared by Site Check and a future workspace.
- `lib/gis/layers.ts` is the first formal layer registry. It is the source of
  layer names, colors, default visibility, minimum zoom, provider metadata, and
  intended screening behavior.
- `types/gis.ts` defines map state and future constraint-result contracts.
- `types/project.ts` distinguishes the future project domain model from the
  narrower persistence payload supported by the current database.
- Site Check keeps the same UI, analyses, exports, and save behavior.

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
- Site Check conversion path into the project workspace.

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
90 m Copernicus DEM through Open-Meteo. It reports sampled elevation range,
average slope, 90th-percentile slope, maximum sampled slope, risk logic and
survey limitations. Production access is gated behind a commercial
`OPEN_METEO_API_KEY`; the free endpoint is available only through an explicit
non-production evaluation flag.

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

The next increment should add portfolio comparison so owners can rank saved
projects by score, coverage, confidence and material-constraint count.
