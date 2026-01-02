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
    showStoreDetails(store);
  } catch (err) {
    console.error('selectStore error:', err);
  }
}

function showStoreDetails(store: any) {
  const detailsPanel = document.getElementById('detailsPanel');
  if (!detailsPanel) return;

  let html = `<div style="margin-bottom: 20px;">`;
  
  // Show location details if space has enterprise locations
  if (store.enterpriseLocations && store.enterpriseLocations.length > 0) {
    const location = store.enterpriseLocations[0];
    
    // Gallery/Images
    if (location.gallery && location.gallery.length > 0) {
      html += `<img src="${location.gallery[0].image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">`;
    }
    
    // Name
    html += `<h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 18px;">${location.name}</h2>`;
    
    // Description
    if (location.description) {
      html += `<p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">${location.description}</p>`;
    }
    
    // Amenity
    if (location.amenity) {
      html += `<p style="margin: 0 0 10px 0; color: #666; font-size: 13px;"><strong>Type:</strong> ${location.amenity}</p>`;
    }
    
    // Extra properties
    if (location.extra) {
      Object.entries(location.extra).forEach(([key, value]) => {
        html += `<p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>${key}:</strong> ${value}</p>`;
      });
    }
  } else {
    // Fallback to space description
    html += `<h2 style="margin: 0 0 10px 0; color: #2c3e50; font-size: 18px;">${store.name}</h2>`;
    if (store.description) {
      html += `<p style="margin: 0 0 10px 0; color: #555; font-size: 14px;">${store.description}</p>`;
    }
  }
  
  html += `</div>`;
  detailsPanel.innerHTML = html;
}

function setupUI() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    display: flex;
    gap: 15px;
    z-index: 100;
    max-height: 80vh;
  `;

  // Store list panel
  const listPanel = document.createElement('div');
  listPanel.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  listPanel.innerHTML = `
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

  // Details panel
  const detailsPanel = document.createElement('div');
  detailsPanel.id = 'detailsPanel';
  detailsPanel.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width: 350px;
    max-height: 80vh;
    overflow-y: auto;
  `;
  detailsPanel.innerHTML = `<p style="color: #999;">Select a store to view details</p>`;

  container.appendChild(listPanel);
  container.appendChild(detailsPanel);
  document.body.appendChild(container);

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
          <div style="font-weight: bold; font-size: 14px;">${store.name}</div>
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
