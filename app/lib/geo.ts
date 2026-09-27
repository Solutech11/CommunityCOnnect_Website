import boundaries from "../data/nigeria-states.json";

type Geometry = { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
type Boundary = { properties: { shapeName: string }; geometry: Geometry };
const features = (boundaries as { features: Boundary[] }).features;
export const states = features.map((feature) => feature.properties.shapeName === "Abuja Federal Capital Territory"
  ? "Federal Capital Territory" : feature.properties.shapeName).sort();

function inRing(lon: number, lat: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function inPolygon(lon: number, lat: number, rings: number[][][]) {
  return inRing(lon, lat, rings[0]) && !rings.slice(1).some((ring) => inRing(lon, lat, ring));
}

export function stateAt(latitude: number, longitude: number): string | null {
  for (const feature of features) {
    const geometry = feature.geometry;
    const polygons = geometry.type === "Polygon"
      ? [geometry.coordinates as number[][][]]
      : geometry.coordinates as number[][][][];
    if (polygons.some((polygon) => inPolygon(longitude, latitude, polygon))) {
      return feature.properties.shapeName === "Abuja Federal Capital Territory"
        ? "Federal Capital Territory" : feature.properties.shapeName;
    }
  }
  return null;
}
