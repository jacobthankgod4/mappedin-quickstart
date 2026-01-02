import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const options = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c'
};

let mapView: any = null;
let stores: any[] = [];
let searchResults: any[] = [];
let selectedStore: any = null;
let currentFloor: any = null;
let debugLogs: string[] = [];

function log(msg: string) {
  console.log(msg);
  debugLogs.push(msg);
  const debugPanel = document.getElementById('debugPanel');
  if (debugPanel) {
    debugPanel.innerHTML = debugLogs.slice(-15).map(m => `<div>${m}</div>`).join('');
  }
}

async function init() {
  log('INIT START');
  const container = document.getElementById('mappedin-map')!;
  log('Container found: ' + !!container);
  container.style.position = 'relative';

  const mapData = await getMapData(options);
  log('Map data loaded');
  mapView = await show3dMap(container, mapData);
  log('show3dMap completed');
  
  setupStores(mapData);
  log('setupStores done');
  
  setupLabels();
  log('setupLabels done');
  
  setupFloorIndicator(mapData);
  log('setupFloorIndicator done');
  
  setupUI();
  log('setupUI done');
  log('INIT END');
}

function setupStores(mapData: any) {
  log('setupStores: checking data sources');
  try {
    if (mapData.locations && mapData.locations.length > 0) {
      stores = mapData.locations;
      log('Using locations: ' + stores.length);
    } else {
      const spaces = mapData.getByType?.('space') || [];
      stores = spaces.filter((s: any) => s && s.name);
      log('Using spaces: ' + stores.length);
    }
    searchResults = stores;
    log('Found ' + stores.length + ' stores');
  } catch (err) {
    log('setupStores error: ' + err);
    stores = [];
    searchResults = [];
  }
}

function setupLabels() {
  log('setupLabels: mapView.Labels exists? ' + !!mapView?.Labels);
  try {
    mapView.Labels.labelAll({
      fontSize: 12,
      fontColor: '#2c3e50',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 4,
      padding: 8
    });
    log('Labels applied');
  } catch (err) {
    log('Labels error: ' + err);
  }
}

function setupFloorIndicator(mapData: any) {
  const floors = mapData.getByType('floor');
  currentFloor = floors[0];

  const indicator = document.createElement('div');
  indicator.id = 'floorIndicator';
  indicator.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 1000;
  `;
  indicator.textContent = `Floor: ${currentFloor?.name || 'Unknown'}`;
  document.body.appendChild(indicator);
  log('Floor indicator appended');

  mapView.on('floor-change', (event: any) => {
    currentFloor = event.floor;
    indicator.textContent = `Floor: ${currentFloor?.name || 'Unknown'}`;
  });
}

function searchStores(query: string) {
  log('searchStores: query=' + query + ', total=' + stores.length);
  if (!query.trim()) {
    searchResults = stores;
  } else {
    searchResults = stores.filter((store) =>
      store.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  log('search results: ' + searchResults.length);
  updateStoreList();
}

function selectStore(store: any) {
  try {
    selectedStore = store;
    log('selectStore: ' + store.name);
    if (mapView?.Camera?.focusOn) {
      mapView.Camera.focusOn(store, {
        zoom: 1000,
        tilt: 30,
        duration: 1000
      });
    }
    updateStoreList();
  } catch (err) {
    log('selectStore error: ' + err);
  }
}

function setupUI() {
  log('setupUI: creating panel');
  
  const debugPanel = document.createElement('div');
  debugPanel.id = 'debugPanel';
  debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.9);
    color: #0f0;
    padding: 10px;
    border-radius: 4px;
    font-size: 10px;
    max-width: 200px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 2000;
    font-family: monospace;
  `;
  document.body.appendChild(debugPanel);
  log('Debug panel added');

  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 100;
  `;

  panel.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #2c3e50;">🏬 Stores</h3>
    <input
      id="searchInput"
      type="text"
      placeholder="Search stores..."
      style="
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 15px;
        box-sizing: border-box;
      "
    />
    <div id="storeList" style="max-height: 400px; overflow-y: auto;"></div>
  `;

  document.body.appendChild(panel);
  log('Panel appended to body');

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchStores((e.target as HTMLInputElement).value);
    });
    log('Search listener attached');
  }

  updateStoreList();
}

function updateStoreList() {
  const storeList = document.getElementById('storeList');
  log('updateStoreList: storeList=' + !!storeList + ', results=' + searchResults.length);
  if (!storeList) return;

  storeList.innerHTML = searchResults
    .map((store) => {
      const image = store.images?.[0]?.url || '';
      const description = store.description || '';
      const phone = store.phone || '';
      const isSelected = selectedStore?.id === store.id;
      
      return `
        <div 
          class="store-item"
          data-store-id="${store.id}"
          style="
            padding: 12px;
            margin: 8px 0;
            background: ${isSelected ? '#3498db' : '#f8f9fa'};
            color: ${isSelected ? 'white' : '#333'};
            border-radius: 6px;
            cursor: pointer;
            overflow: hidden;
          ">
          ${image ? `<img src="${image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 8px; display: block;">` : ''}
          <div style="font-weight: bold; font-size: 14px;">${store.name}</div>
          ${description ? `<div style="font-size: 12px; margin-top: 4px; opacity: ${isSelected ? '0.9' : '0.7'};">${description}</div>` : ''}
          ${phone ? `<div style="font-size: 11px; margin-top: 4px; opacity: ${isSelected ? '0.9' : '0.7'};">${phone}</div>` : ''}
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.store-item').forEach((item) => {
    item.addEventListener('click', () => {
      const storeId = item.getAttribute('data-store-id');
      const store = stores.find((s) => s.id === storeId);
      if (store) selectStore(store);
    });
  });
}

log('Script loaded');
init();
