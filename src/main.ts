import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';
import './styles.css';

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
let selectedPolygon: any = null;
let navStartPoint: any = null;
let navEndPoint: any = null;

async function init() {
  const container = document.getElementById('mappedin-map')!;
  container.style.position = 'relative';

  const mapData = await getMapData(options);
  mapView = await show3dMap(container, mapData);
  
  setupStores(mapData);
  setupFloorIndicator(mapData);
  addLabels();
  addPromotionalMarkers();
  addDirectoryKiosks(mapData);
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
  indicator.className = 'floor-indicator';
  indicator.textContent = currentFloor?.name || 'Floor 1';
  document.body.appendChild(indicator);
  mapView.on('floor-change', (event: any) => {
    currentFloor = event.floor;
    indicator.textContent = currentFloor?.name || 'Floor 1';
  });
}

function addLabels() {
  try {
    stores.forEach((store) => {
      mapView.Labels.add(store, store.name, {
        fontSize: 12,
        fontColor: '#2c3e50',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 4,
        padding: 8
      });
    });
  } catch (err) {
    console.error('Labels error:', err);
  }
}

function addPromotionalMarkers() {
  const promotionTypes = ['SALE', 'NEW', 'HOT', '50% OFF', 'GRAND OPENING'];
  const colors = ['#e74c3c', '#f39c12', '#e67e22', '#27ae60', '#9b59b6'];
  
  stores.slice(0, 5).forEach((store, index) => {
    try {
      mapView.Markers.add(store, `
        <div style="
          background: ${colors[index]};
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 11px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${promotionTypes[index]}
        </div>
      `, { rank: 2 });
    } catch (err) {}
  });
}

function addDirectoryKiosks(mapData: any) {
  try {
    const spaces = mapData.getByType?.('space') || [];
    const entrances = spaces.filter((s: any) => s.name && s.name.toLowerCase().includes('entrance'));
    
    entrances.forEach((entrance: any) => {
      mapView.Markers.add(entrance, `
        <div style="
          background: #3498db;
          color: white;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        ">
          ℹ️
        </div>
      `, { rank: 3 });
    });
  } catch (err) {}
}

function searchStores(query: string) {
  if (!query.trim()) {
    searchResults = stores;
  } else {
    searchResults = stores.filter((store) =>
      store.name.toLowerCase().includes(query.toLowerCase())
    );
    if (searchResults.length > 0) {
      try {
        mapView.Camera.focusOn(searchResults[0], {
          zoom: 1000,
          tilt: 30,
          duration: 1000
        });
      } catch (err) {}
    }
  }
  updateStoreList();
}

function selectStore(store: any) {
  try {
    selectedStore = store;
    
    if (selectedPolygon) {
      try {
        mapView.Polygons.remove(selectedPolygon);
      } catch (err) {}
    }
    
    selectedPolygon = mapView.Polygons.add(store, {
      color: '#3498db',
      opacity: 0.3,
      strokeColor: '#2980b9',
      strokeWidth: 2
    });
    
    mapView.Camera.focusOn(store, {
      zoom: 1000,
      tilt: 30,
      duration: 1000
    });
    updateStoreList();
  } catch (err) {}
}

function showNavModal() {
  navEndPoint = selectedStore;
  const modal = document.createElement('div');
  modal.className = 'nav-modal';
  modal.innerHTML = `
    <div class="nav-card">
      <div class="nav-header">Get Directions</div>
      <div class="nav-subtitle">Navigate to ${selectedStore.name}</div>
      <div class="location-select">
        <label class="location-label">From</label>
        <select id="startSelect" class="location-input">
          <option value="">Select your location...</option>
          ${stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
        </select>
      </div>
      <button class="btn-primary" id="goBtn">Start Navigation</button>
      <button class="btn-secondary" id="cancelBtn">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.querySelector('#cancelBtn')!.addEventListener('click', () => modal.remove());
  modal.querySelector('#goBtn')!.addEventListener('click', async () => {
    const startId = (document.getElementById('startSelect') as HTMLSelectElement).value;
    if (!startId) return;
    navStartPoint = stores.find(s => s.id === startId);
    modal.remove();
    await drawNavigation();
  });
}

async function drawNavigation() {
  if (!navStartPoint || !navEndPoint) return;
  try {
    const directions = await mapView.getDirections(navStartPoint, navEndPoint);
    if (directions) {
      await mapView.Navigation.draw(directions, {
        pathOptions: { color: '#667eea', nearRadius: 0.5, farRadius: 1.5, pulseColor: '#667eea' },
        markerOptions: { departureColor: '#11998e', destinationColor: '#f5222d' },
        setMapToDeparture: true,
        animatePathDrawing: true
      });
      mapView.Camera.focusOn({ nodes: directions.path });
      const content = document.getElementById('sheetContent')!;
      const distance = directions.distance ? directions.distance.toFixed(0) : 'N/A';
      content.innerHTML = `
        <div class="nav-active">
          <div class="nav-active-title">🧭 Navigation Active</div>
          <div class="nav-route">From: ${navStartPoint.name}</div>
          <div class="nav-route">To: ${navEndPoint.name}</div>
          <div class="nav-distance">${distance}m</div>
        </div>
        <button class="btn-secondary" onclick="clearNavigation()">End Navigation</button>
      `;
    }
  } catch (err) {}
}

function clearSelection() {
  selectedStore = null;
  if (selectedPolygon) {
    try { mapView.Polygons.remove(selectedPolygon); } catch (err) {}
    selectedPolygon = null;
  }
  updateStoreList();
}

function clearNavigation() {
  mapView.Navigation.clear();
  navStartPoint = null;
  navEndPoint = null;
  clearSelection();
}

(window as any).clearSelection = clearSelection;
(window as any).clearNavigation = clearNavigation;



function setupUI() {
  const uiContainer = document.createElement('div');
  uiContainer.innerHTML = `
    <div class="search-bar">
      <input id="searchInput" class="search-input" type="text" placeholder="Search stores..." />
      <span class="search-icon">🔍</span>
    </div>
    <div id="bottomSheet" class="bottom-sheet">
      <div class="sheet-handle"></div>
      <div class="sheet-header">
        <div class="sheet-title">Stores</div>
      </div>
      <div id="sheetContent" class="sheet-content"></div>
    </div>
    <button id="navFab" class="fab" style="display:none;">📍</button>
  `;
  document.body.appendChild(uiContainer);

  const sheet = document.getElementById('bottomSheet')!;
  const handle = sheet.querySelector('.sheet-handle')!;
  handle.addEventListener('click', () => sheet.classList.toggle('expanded'));

  document.getElementById('searchInput')!.addEventListener('input', (e) => {
    searchStores((e.target as HTMLInputElement).value);
  });

  updateStoreList();
}

function updateStoreList() {
  const content = document.getElementById('sheetContent')!;
  const fab = document.getElementById('navFab')!;

  if (selectedStore) {
    fab.style.display = 'flex';
    fab.onclick = showNavModal;
    content.innerHTML = `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;margin-bottom:16px;">📍</div>
        <h2 style="font-size:24px;font-weight:600;margin-bottom:8px;">${selectedStore.name}</h2>
        <p style="color:#666;margin-bottom:24px;">Tap the button to navigate</p>
        <button class="btn-secondary" onclick="clearSelection()">← Back to List</button>
      </div>
    `;
  } else {
    fab.style.display = 'none';
    content.innerHTML = searchResults.map(store => `
      <div class="store-card" data-id="${store.id}">
        <div class="store-name">${store.name}</div>
      </div>
    `).join('');
    content.querySelectorAll('.store-card').forEach(card => {
      card.addEventListener('click', () => {
        const store = stores.find(s => s.id === card.getAttribute('data-id'));
        if (store) selectStore(store);
      });
    });
  }
}

init();
