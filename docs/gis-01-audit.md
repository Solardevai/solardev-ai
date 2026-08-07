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

The next constraint increment should add nationally designated protected areas
with the same traceable result contract. AI interpretation should remain
downstream of deterministic results.
