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
    // Zoom to first search result
    if (searchResults.length > 0) {
      try {
        mapView.Camera.focusOn(searchResults[0], {
          zoom: 1000,
          tilt: 30,
          duration: 1000
        });
      } catch (err) {
        console.error('Zoom error:', err);
      }
    }
  }
  updateStoreList();
}

function selectStore(store: any) {
  try {
    selectedStore = store;
    console.log('Selected store:', store.name);
    console.log('Enterprise locations:', store.enterpriseLocations);
    if (store.enterpriseLocations && store.enterpriseLocations.length > 0) {
      const loc = store.enterpriseLocations[0];
      console.log('Location gallery:', loc.gallery);
      console.log('Location name:', loc.name);
      console.log('Location description:', loc.description);
    }
    mapView.Camera.focusOn(store, {
      zoom: 1000,
      tilt: 30,
      duration: 1000
    });
    updateStoreList();
  } catch (err) {
    console.error('selectStore error:', err);
  }
}

function clearSelection() {
  selectedStore = null;
  updateStoreList();
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
    <h3 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 16px;">🏬 Directory</h3>
    <input
      id="searchInput"
      type="text"
      placeholder="Search..."
      style="
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 15px;
        box-sizing: border-box;
        font-size: 14px;
      "
    />
    <div id="content" style="max-height: 500px; overflow-y: auto;"></div>
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
  const content = document.getElementById('content');
  if (!content) return;

  if (selectedStore) {
    // Show details view
    let html = '';
    
    if (selectedStore.enterpriseLocations && selectedStore.enterpriseLocations.length > 0) {
      const location = selectedStore.enterpriseLocations[0];
      
      html += `<h2 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px;">${location.name}</h2>`;
      
      if (location.gallery && location.gallery.length > 0) {
        html += `<img src="${location.gallery[0].image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;">`;
      }
      
      if (location.description) {
        html += `<p style="margin: 0 0 12px 0; color: #555; font-size: 14px; line-height: 1.5;">${location.description}</p>`;
      }
      
      if (location.amenity) {
        html += `<p style="margin: 0 0 8px 0; color: #666; font-size: 13px;"><strong>Type:</strong> ${location.amenity}</p>`;
      }
      
      if (location.extra) {
        Object.entries(location.extra).forEach(([key, value]) => {
          html += `<p style="margin: 0 0 6px 0; color: #666; font-size: 13px;"><strong>${key}:</strong> ${value}</p>`;
        });
      }
    } else {
      html += `<h2 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px;">${selectedStore.name}</h2>`;
      if (selectedStore.description) {
        html += `<p style="margin: 0; color: #555; font-size: 14px;">${selectedStore.description}</p>`;
      }
    }
    
    html += `<button id="backBtn" style="margin-top: 15px; width: 100%; padding: 10px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">← Back to List</button>`;
    
    content.innerHTML = html;
    
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.addEventListener('click', clearSelection);
    }
  } else {
    // Show list view
    content.innerHTML = searchResults
      .map((store) => {
        return `
          <div 
            class="store-item"
            data-store-id="${store.id}"
            style="
              padding: 12px;
              margin: 8px 0;
              background: #f8f9fa;
              color: #333;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              transition: all 0.2s ease;
            ">
            ${store.name}
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
}

init();
