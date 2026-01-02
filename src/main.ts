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
  } catch (err) {
    console.error('Select store error:', err);
  }
}

function showDirections() {
  const content = document.getElementById('sheetContent')!;
  content.innerHTML = `
    <div class="directions-card">
      <div style="font-size:18px;font-weight:500;color:#202124;margin-bottom:16px;">Get Directions</div>
      
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;color:#5f6368;margin-bottom:8px;">FROM</label>
        <div style="position:relative;">
          <input id="startInput" class="location-input" type="text" placeholder="Choose starting point" readonly />
          <div id="startDropdown" class="location-dropdown" style="display:none;"></div>
        </div>
      </div>
      
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;color:#5f6368;margin-bottom:8px;">TO</label>
        <div style="position:relative;">
          <input id="endInput" class="location-input" type="text" value="${selectedStore.name}" readonly />
        </div>
      </div>
      
      <button class="btn-primary" id="startNavBtn" disabled>Start Navigation</button>
      <button class="btn-secondary" style="margin-top:8px;" onclick="updateStoreList()">Cancel</button>
    </div>
  `;
  
  const startInput = document.getElementById('startInput') as HTMLInputElement;
  const startDropdown = document.getElementById('startDropdown')!;
  const startNavBtn = document.getElementById('startNavBtn') as HTMLButtonElement;
  
  startInput.addEventListener('click', () => {
    startDropdown.innerHTML = stores.map(s => `
      <div class="dropdown-item" data-id="${s.id}">${s.name}</div>
    `).join('');
    startDropdown.style.display = 'block';
    
    startDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        navStartPoint = stores.find(st => st.id === item.getAttribute('data-id'));
        (startInput as HTMLInputElement).value = navStartPoint!.name;
        startDropdown.style.display = 'none';
        startNavBtn.disabled = false;
      });
    });
  });
  
  startNavBtn.addEventListener('click', async () => {
    navEndPoint = selectedStore;
    await drawNavigation();
  });
}

async function drawNavigation() {
  if (!navStartPoint || !navEndPoint) return;
  try {
    const directions = await mapView.getDirections(navStartPoint, navEndPoint);
    if (directions) {
      await mapView.Navigation.draw(directions, {
        pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5, pulseColor: '#4285f4' },
        markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' },
        setMapToDeparture: true,
        animatePathDrawing: true
      });
      mapView.Camera.focusOn({ nodes: directions.path });
      const content = document.getElementById('sheetContent')!;
      const distance = directions.distance ? directions.distance.toFixed(0) : 'N/A';
      const time = directions.distance ? Math.ceil(directions.distance / 1.4 / 60) : 'N/A';
      content.innerHTML = `
        <div class="directions-card">
          <div class="directions-header">
            <div class="directions-icon">🧭</div>
            <div class="directions-info">
              <div class="directions-time">${time} min</div>
              <div class="directions-distance">${distance} m</div>
            </div>
          </div>
          <div class="route-details">
            <div class="route-point">
              <div class="route-dot start"></div>
              <div class="route-text">${navStartPoint.name}</div>
            </div>
            <div class="route-point">
              <div class="route-dot end"></div>
              <div class="route-text">${navEndPoint.name}</div>
            </div>
          </div>
          <button class="btn-secondary" onclick="clearNavigation()">End route</button>
        </div>
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

function hideSheet() {
  document.getElementById('bottomSheet')!.style.display = 'none';
}

(window as any).clearSelection = clearSelection;
(window as any).clearNavigation = clearNavigation;
(window as any).hideSheet = hideSheet;
(window as any).showDirections = showDirections;



function setupUI() {
  const uiContainer = document.createElement('div');
  uiContainer.innerHTML = `
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input id="searchInput" class="search-input" type="text" placeholder="Search here" />
      <div id="searchResults" class="search-results" style="display:none;"></div>
    </div>
    <div id="bottomSheet" class="bottom-sheet">
      <div class="sheet-header">
        <div class="sheet-title">Stores</div>
        <button class="close-btn" onclick="hideSheet()">×</button>
      </div>
      <div id="sheetContent" class="sheet-content"></div>
    </div>
  `;
  document.body.appendChild(uiContainer);

  const searchInput = document.getElementById('searchInput')!;
  const searchResultsDiv = document.getElementById('searchResults')!;
  
  searchInput.addEventListener('input', (e) => {
    const query = ((e.target as HTMLInputElement).value);
    if (query.trim()) {
      const results = stores.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
      if (results.length > 0) {
        searchResultsDiv.innerHTML = results.map(s => `
          <div class="search-result-item" data-id="${s.id}">${s.name}</div>
        `).join('');
        searchResultsDiv.style.display = 'block';
        searchResultsDiv.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const store = stores.find(st => st.id === item.getAttribute('data-id'));
            if (store) {
              selectStore(store);
              (searchInput as HTMLInputElement).value = '';
              searchResultsDiv.style.display = 'none';
            }
          });
        });
      } else {
        searchResultsDiv.style.display = 'none';
      }
    } else {
      searchResultsDiv.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target as Node) && !searchResultsDiv.contains(e.target as Node)) {
      searchResultsDiv.style.display = 'none';
    }
  });

  attachStoreListeners();
  updateStoreList();
}

function updateStoreList() {
  const content = document.getElementById('sheetContent')!;
  const sheet = document.getElementById('bottomSheet')!;
  sheet.style.display = 'block';

  if (selectedStore) {
    content.innerHTML = `
      <div class="directions-card">
        <div class="directions-header">
          <div class="directions-icon">📍</div>
          <div class="directions-info">
            <div style="font-size:18px;font-weight:500;color:#202124;">${selectedStore.name}</div>
            <div style="font-size:14px;color:#5f6368;margin-top:4px;">Store</div>
          </div>
        </div>
        <button class="btn-primary" onclick="showDirections()">Directions</button>
        <button class="btn-secondary" style="margin-top:8px;" onclick="clearSelection()">Close</button>
      </div>
    `;
  } else {
    content.innerHTML = searchResults.map(store => `
      <div class="store-card" data-id="${store.id}">
        <div class="store-icon">🏪</div>
        <div class="store-info">
          <div class="store-name">${store.name}</div>
          <div class="store-type">Store</div>
        </div>
      </div>
    `).join('');
  }
}

function attachStoreListeners() {
  const content = document.getElementById('sheetContent');
  if (!content) return;
  
  content.onclick = (e) => {
    const card = (e.target as HTMLElement).closest('.store-card');
    if (card) {
      const storeId = card.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) selectStore(store);
    }
  };
}

init();
