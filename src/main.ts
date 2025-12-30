import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const options = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c'
};

let mapView: any = null;
let stores: any[] = [];

async function init() {
  const mapData = await getMapData(options);
  mapView = await show3dMap(
    document.getElementById('mappedin-map')!,
    mapData
  );
  setupStores(mapData);
}

function setupStores(mapData: any) {
  const allSpaces = mapData.getByType('space');
  stores = allSpaces.filter((space: any) => space.name);
  console.log(`Found ${stores.length} stores:`, stores.map((s: any) => s.name));
}

init();
