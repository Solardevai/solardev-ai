export function formatArea(squareMetres: number) {
  return squareMetres >= 10_000
    ? `${(squareMetres / 10_000).toFixed(2)} ha`
    : `${Math.round(squareMetres).toLocaleString()} m²`;
}

export function formatDistance(kilometres: number) {
  return kilometres >= 1
    ? `${kilometres.toFixed(2)} km`
    : `${Math.round(kilometres * 1_000)} m`;
}
