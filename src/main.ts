import { getMapData, show3dMap } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";

const options = {
  key: "mik_public",
  secret: "mis_public",
  mapId: "65c0ff7430b94e3fabd5bb8c",
};

const storeCategories = [
  "Fashion & Apparel",
  "Electronics",
  "Food & Dining",
  "Beauty & Health",
  "Home & Garden",
  "Entertainment",
  "Services",
];

let mapView: any = null;
let stores: any[] = [];
let selectedStore: any = null;
let currentFloor: any = null;

const init = async () => {
  try {
    const mapData = await getMapData(options);
    mapView = await show3dMap(document.getElementById("app")!, mapData);
    await setupShoppingMallFeatures(mapView, mapData);
  } catch (err) {
    console.error("Map initialization failed:", err);
  }
};

const setupShoppingMallFeatures = async (mapViewInstance: any, mapData: any) => {
  const allSpaces = mapData.getByType("space");
  stores = allSpaces.filter(
    (space: any) =>
      space.name &&
      !space.name.toLowerCase().includes("washroom") &&
      !space.name.toLowerCase().includes("corridor")
  );

  currentFloor = mapData.getByType("floor")[0];

  mapViewInstance.Labels.labelAll({
    fontSize: 12,
    fontColor: "#2c3e50",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 4,
    padding: 8,
  });

  setupUI();
  addPromotionalMarkers(mapView, stores);
  setupEventHandlers(mapView);
  addDirectoryKiosks(mapView, mapData);
};

const addPromotionalMarkers = (mapViewInstance: any, storeSpaces: any[]) => {
  const featuredStores = storeSpaces.slice(0, 5);
  const promotionTypes = ["SALE", "NEW", "HOT", "50% OFF", "GRAND OPENING"];
  const colors = ["#e74c3c", "#f39c12", "#e67e22", "#27ae60", "#9b59b6"];

  featuredStores.forEach((store, index) => {
    mapViewInstance.Markers.add(
      store,
      `
      <div style="
        background: ${colors[index]};
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: bold;
        font-size: 11px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translateY(-10px);
      ">
        ${promotionTypes[index]}
      </div>
    `,
      { rank: 2 }
    );
  });
};

const addDirectoryKiosks = (mapViewInstance: any, mapData: any) => {
  const entrances = mapData
    .getByType("space")
    .filter((space: any) => space.name && space.name.toLowerCase().includes("entrance"));

  entrances.forEach((entrance: any) => {
    mapViewInstance.Markers.add(
      entrance,
      `
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
    `,
      { rank: 3 }
    );
  });
};

const setupEventHandlers = (mapViewInstance: any) => {
  mapViewInstance.on("click", (event: any) => {
    if (event.spaces && event.spaces.length > 0) {
      handleStoreSelection(event.spaces[0]);
    }
  });

  mapViewInstance.on("floor-change", (event: any) => {
    currentFloor = event.floor;
    updateFloorIndicator();
  });
};

const handleStoreSelection = (store: any) => {
  if (!mapView) return;

  selectedStore = store;

  mapView.Camera.focusOn(store, {
    zoom: 1000,
    tilt: 30,
    duration: 1000,
  });

  mapView.Polygons.add(store, {
    color: "#3498db",
    opacity: 0.3,
    strokeColor: "#2980b9",
    strokeWidth: 2,
  });

  updateStorePanel();
};

const searchStores = (query: string) => {
  if (!query.trim()) return;

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(query.toLowerCase())
  );

  mapView?.Markers.removeAll();
  addPromotionalMarkers(mapView, stores);
  addDirectoryKiosks(mapView, { getByType: () => [] });

  filteredStores.forEach((store) => {
    mapView?.Markers.add(
      store,
      `
      <div style="
        background: #e74c3c;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: bold;
      ">
        MATCH
      </div>
    `
    );
  });
};

const getDirectionsToStore = async (targetStore: any) => {
  if (!mapView || !currentFloor) return;

  try {
    const entrances = stores.filter(
      (space) => space.name && space.name.toLowerCase().includes("entrance")
    );
    const startPoint = entrances[0] || stores[0];

    const directions = await mapView.getDirections(startPoint, targetStore);

    if (directions) {
      mapView.Paths.add(directions.coordinates, {
        color: "#27ae60",
        width: 4,
        opacity: 0.8,
      });

      mapView.Camera.focusOn(directions.coordinates);
    }
  } catch (error) {
    console.error("Failed to get directions:", error);
  }
};

const filterByCategory = (category: string) => {
  const categoryKeywords: Record<string, string[]> = {
    "Fashion & Apparel": ["fashion", "clothing", "apparel", "shoes"],
    Electronics: ["electronics", "tech", "phone", "computer"],
    "Food & Dining": ["restaurant", "cafe", "food", "dining"],
    "Beauty & Health": ["beauty", "health", "pharmacy", "salon"],
    "Home & Garden": ["home", "furniture", "garden"],
    Entertainment: ["cinema", "games", "entertainment"],
    Services: ["bank", "service", "repair"],
  };

  const keywords = categoryKeywords[category] || [];
  const filteredStores = stores.filter((store) =>
    keywords.some((keyword) => store.name.toLowerCase().includes(keyword))
  );

  mapView?.Polygons.removeAll();
  filteredStores.forEach((store) => {
    mapView?.Polygons.add(store, {
      color: "#f39c12",
      opacity: 0.2,
    });
  });
};

const setupUI = () => {
  const app = document.getElementById("app")!;
  const controlsDiv = document.createElement("div");
  controlsDiv.id = "controls";
  controlsDiv.style.cssText = `
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    min-width: 300px;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 10;
  `;

  controlsDiv.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #2c3e50;">🏬 Mall Directory</h3>
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
    <div style="margin-bottom: 15px;">
      <label style="display: block; margin-bottom: 5px; font-weight: bold;">Filter by Category:</label>
      <select id="categoryFilter" style="width: 100%; padding: 8px; border-radius: 4px;">
        <option value="">All Categories</option>
        ${storeCategories.map((cat) => `<option value="${cat}">${cat}</option>`).join("")}
      </select>
    </div>
    <div style="max-height: 300px; overflow-y: auto;">
      <h4 style="margin: 0 0 10px 0;">Stores (${stores.length})</h4>
      <div id="storeList"></div>
    </div>
    <div id="selectedStorePanel" style="display: none; margin-top: 15px; padding: 15px; background: #ecf0f1; border-radius: 4px;">
      <h4 id="selectedStoreName" style="margin: 0 0 10px 0;"></h4>
      <button id="directionsBtn" style="background: #27ae60; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px;">Get Directions</button>
      <button id="clearBtn" style="background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Clear</button>
    </div>
  `;

  const floorDiv = document.createElement("div");
  floorDiv.id = "floorIndicator";
  floorDiv.style.cssText = `
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 10;
  `;
  floorDiv.textContent = `Floor: ${currentFloor?.name || "Unknown"}`;

  app.appendChild(controlsDiv);
  app.appendChild(floorDiv);

  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    searchStores((e.target as HTMLInputElement).value);
  });

  document.getElementById("categoryFilter")?.addEventListener("change", (e) => {
    filterByCategory((e.target as HTMLSelectElement).value);
  });

  document.getElementById("directionsBtn")?.addEventListener("click", () => {
    if (selectedStore) getDirectionsToStore(selectedStore);
  });

  document.getElementById("clearBtn")?.addEventListener("click", () => {
    selectedStore = null;
    updateStorePanel();
  });

  updateStoreList();
};

const updateStoreList = () => {
  const storeList = document.getElementById("storeList");
  if (!storeList) return;

  storeList.innerHTML = stores
    .slice(0, 10)
    .map(
      (store) => `
    <div
      class="store-item"
      data-store-id="${store.id}"
      style="
        padding: 8px;
        margin: 4px 0;
        background: ${selectedStore?.id === store.id ? "#3498db" : "#f8f9fa"};
        color: ${selectedStore?.id === store.id ? "white" : "#333"};
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      "
    >
      ${store.name}
    </div>
  `
    )
    .join("");

  document.querySelectorAll(".store-item").forEach((item) => {
    item.addEventListener("click", () => {
      const storeId = item.getAttribute("data-store-id");
      const store = stores.find((s) => s.id === storeId);
      if (store) handleStoreSelection(store);
    });
  });
};

const updateStorePanel = () => {
  const panel = document.getElementById("selectedStorePanel");
  if (!panel) return;

  if (selectedStore) {
    panel.style.display = "block";
    const nameEl = document.getElementById("selectedStoreName");
    if (nameEl) nameEl.textContent = selectedStore.name;
  } else {
    panel.style.display = "none";
  }

  updateStoreList();
};

const updateFloorIndicator = () => {
  const indicator = document.getElementById("floorIndicator");
  if (indicator) indicator.textContent = `Floor: ${currentFloor?.name || "Unknown"}`;
};

init();
