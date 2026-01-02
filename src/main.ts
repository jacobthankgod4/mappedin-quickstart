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

async function init() {
  const container = document.getElementById('mappedin-map')!;
  container.style.position = 'relative';

  const mapData = await getMapData(options);
  mapView = await show3dMap(container, mapData);
  
  setupStores(mapData);
  setupFloorIndicator(mapData);
  setupUI();
}

function setupStores(mapData: any) {
  try {
    if (mapData.locations && mapData.locations.length > 0) {
      stores = mapData.locations;
    } else {
      const spaces = mapData.getByType?.('space') || [];
      stores = spaces.filter((s: any) => s && s.name);
    }
    searchResults = stores;
  } catch (err) {
    stores = [];
    searchResults = [];
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

  mapView.on('floor-change', (event: any) => {
    currentFloor = event.floor;
    indicator.textContent = `Floor: ${currentFloor?.name || 'Unknown'}`;
  });
}

function searchStores(query: string) {
  if (!query.trim()) {
    searchResults = stores;
  } else {
    searchResults = stores.filter((store) =>
      store.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  updateStoreList();
}

function selectStore(store: any) {
  try {
    selectedStore = store;
    if (mapView?.Camera?.focusOn) {
      mapView.Camera.focusOn(store, {
        zoom: 1000,
        tilt: 30,
        duration: 1000
      });
    }
    updateStoreList();
  } catch (err) {
    console.error('selectStore error:', err);
  }
}

function setupUI() {
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 350px;
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
    <div id="storeList" style="max-height: 500px; overflow-y: auto;"></div>
  `;

  document.body.appendChild(panel);

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchStores((e.target as HTMLInputElement).value);
    });
  }

  updateStoreList();
}

function updateStoreList() {
  const storeList = document.getElementById('storeList');
  if (!storeList) return;

  storeList.innerHTML = searchResults
    .map((store) => {
      const isSelected = selectedStore?.id === store.id;
      let detailsHtml = '';

      if (isSelected) {
        // Show location details if available
        if (store.enterpriseLocations && store.enterpriseLocations.length > 0) {
          const location = store.enterpriseLocations[0];
          
          detailsHtml = `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
              ${location.gallery && location.gallery.length > 0 ? `<img src="${location.gallery[0].image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;">` : ''}
              ${location.description ? `<p style="margin: 0 0 8px 0; color: #555; font-size: 13px;">${location.description}</p>` : ''}
              ${location.amenity ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 12px;"><strong>Type:</strong> ${location.amenity}</p>` : ''}
              ${location.extra ? Object.entries(location.extra).map(([key, value]) => `<p style="margin: 0 0 4px 0; color: #666; font-size: 12px;"><strong>${key}:</strong> ${value}</p>`).join('') : ''}
            </div>
          `;
        } else if (store.description) {
          detailsHtml = `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #555; font-size: 13px;">${store.description}</p>
            </div>
          `;
        }
      }

      return `
        <div 
          class="store-item"
          data-store-id="${store.id}"
          style="
            padding: 12px;
            margin: 8px 0;
            background: ${isSelected ? '#f0f7ff' : '#f8f9fa'};
            border: ${isSelected ? '2px solid #3498db' : '1px solid #ddd'};
            border-radius: 6px;
            cursor: pointer;
            overflow: hidden;
          ">
          <div style="font-weight: bold; font-size: 14px; color: #2c3e50;">${store.name}</div>
          ${detailsHtml}
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

init();
