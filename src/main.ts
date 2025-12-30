import { getMapData, show3dMap, MapView, MappedinPolygon } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';
import productData from './products.json';

const options = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c'
};

let mapView: MapView;
let venues: any;
let stores: any[] = [];
let selectedStore: any = null;

const storeCategories = [
  'Fashion & Apparel',
  'Electronics',
  'Food & Dining',
  'Beauty & Health',
  'Home & Garden',
  'Entertainment',
  'Services'
];

async function init() {
  const mapData = await getMapData(options);
  venues = mapData;
  mapView = await show3dMap(
    document.getElementById('mappedin-map')!,
    mapData
  );

  // Get all locations (stores)
  stores = mapData.locations || [];
  
  // Setup UI
  setupUI();
  setupEventHandlers();
}

function setupUI() {
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'controls';
  controlsDiv.innerHTML = `
    <div style="position: absolute; top: 20px; left: 20px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 300px; max-height: 80vh; overflow-y: auto; z-index: 1000;">
      <h3 style="margin: 0 0 15px 0; color: #2c3e50;">🏬 Mall Directory</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Filter by Category:</label>
        <select id="categoryFilter" style="width: 100%; padding: 8px; border-radius: 4px;">
          <option value="">All Categories</option>
          ${storeCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        </select>
      </div>

      <div style="max-height: 300px; overflow-y: auto;">
        <h4 style="margin: 0 0 10px 0;">Stores (${stores.length})</h4>
        <div id="storesList"></div>
      </div>

      <div id="selectedStoreInfo" style="display: none; margin-top: 15px; padding: 15px; background: #ecf0f1; border-radius: 4px;">
        <h4 id="selectedStoreName" style="margin: 0 0 10px 0;"></h4>
        <button id="directionsBtn" style="background: #27ae60; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Get Directions</button>
        <button id="clearBtn" style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 8px;">Clear</button>
      </div>

      <div id="searchDiv" style="display: none; margin-top: 15px;">
        <input type="text" id="productSearch" placeholder="Search products..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 10px;">
        <div id="searchResults" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px; max-height: 200px; overflow-y: auto;"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(controlsDiv);
  renderStoresList();
  setupEventListeners();
}

function renderStoresList() {
  const storesList = document.getElementById('storesList')!;
  storesList.innerHTML = stores.map((store, idx) => `
    <div data-store-id="${idx}" style="padding: 8px; margin: 4px 0; background: #f8f9fa; border-radius: 4px; cursor: pointer; font-size: 14px;">
      ${store.name}
    </div>
  `).join('');

  storesList.querySelectorAll('div').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-store-id')!);
      handleStoreSelection(stores[idx]);
    });
  });
}

function handleStoreSelection(store: any) {
  selectedStore = store;
  document.getElementById('selectedStoreName')!.textContent = store.name;
  document.getElementById('selectedStoreInfo')!.style.display = 'block';
  document.getElementById('searchDiv')!.style.display = 'block';

  if (mapView.Camera) {
    mapView.Camera.focusOn(store);
  }
}

function setupEventHandlers() {
  document.getElementById('categoryFilter')!.addEventListener('change', (e) => {
    const category = (e.target as HTMLSelectElement).value;
    filterByCategory(category);
  });

  document.getElementById('directionsBtn')!.addEventListener('click', () => {
    if (selectedStore) {
      navigateToStore(selectedStore);
    }
  });

  document.getElementById('clearBtn')!.addEventListener('click', () => {
    selectedStore = null;
    document.getElementById('selectedStoreInfo')!.style.display = 'none';
    document.getElementById('searchDiv')!.style.display = 'none';
  });

  document.getElementById('productSearch')!.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    searchProducts(query);
  });
}

function filterByCategory(category: string) {
  if (!category) {
    renderStoresList();
    return;
  }

  const keywords: { [key: string]: string[] } = {
    'Fashion & Apparel': ['fashion', 'clothing', 'apparel', 'shoes'],
    'Electronics': ['electronics', 'tech', 'phone', 'computer'],
    'Food & Dining': ['restaurant', 'cafe', 'food', 'dining'],
    'Beauty & Health': ['beauty', 'health', 'pharmacy', 'salon'],
    'Home & Garden': ['home', 'furniture', 'garden'],
    'Entertainment': ['cinema', 'games', 'entertainment'],
    'Services': ['bank', 'service', 'repair']
  };

  const filtered = stores.filter(store =>
    keywords[category]?.some(kw => store.name.toLowerCase().includes(kw))
  );

  const storesList = document.getElementById('storesList')!;
  storesList.innerHTML = filtered.map((store, idx) => `
    <div data-store-name="${store.name}" style="padding: 8px; margin: 4px 0; background: #f8f9fa; border-radius: 4px; cursor: pointer; font-size: 14px;">
      ${store.name}
    </div>
  `).join('');

  storesList.querySelectorAll('div').forEach(el => {
    el.addEventListener('click', () => {
      const name = el.getAttribute('data-store-name')!;
      const store = stores.find(s => s.name === name);
      if (store) handleStoreSelection(store);
    });
  });
}

function navigateToStore(store: any) {
  if (mapView.Camera) {
    mapView.Camera.focusOn(store);
  }
}

function searchProducts(query: string) {
  const searchResults = document.getElementById('searchResults')!;
  
  if (query.length < 2) {
    searchResults.innerHTML = '';
    return;
  }

  const results = productData.filter((p: any) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  searchResults.innerHTML = results.map((product: any) => `
    <div data-polygon="${product.polygonName}" style="padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;">
      <div style="font-weight: bold;">${product.name}</div>
      <div style="font-size: 12px; color: #666;">$${product.price}</div>
    </div>
  `).join('');

  searchResults.querySelectorAll('div').forEach(el => {
    el.addEventListener('click', () => {
      const polygonName = el.getAttribute('data-polygon')!;
      const polygon = venues.polygons?.find((p: any) => p.name === polygonName);
      if (polygon) {
        mapView.Camera.focusOn(polygon);
      }
    });
  });
}

function setupEventListeners() {
  if (mapView.on) {
    mapView.on('click', () => {
      document.getElementById('selectedStoreInfo')!.style.display = 'none';
    });
  }
}

init();
