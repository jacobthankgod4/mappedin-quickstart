import React, { useEffect, useRef, useState } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

const ShoppingMallMap = () => {
  const mapContainerRef = useRef(null);
  const [mapView, setMapView] = useState(null);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFloor, setCurrentFloor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shopping mall specific configuration
  const mallConfig = {
    backgroundColor: '#f8f9fa',
    antialias: true,
    shadows: true,
    lighting: {
      ambient: 0.6,
      directional: 0.8
    }
  };

  // Store categories for filtering
  const storeCategories = [
    'Fashion & Apparel',
    'Electronics',
    'Food & Dining',
    'Beauty & Health',
    'Home & Garden',
    'Entertainment',
    'Services'
  ];

  useEffect(() => {
    initializeMap();
    return () => cleanup();
  }, []);

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      
      // Load map data with demo credentials
      const mapData = await getMapData({
        key: 'mik_yeBk6oNLFVhz8VjTo2463b852',
        secret: 'mis_2g9ST8ZcbZHEw5k3CZzOBpKwVLXKU2YGnFWWKKlCrAuU2T7',
        mapId: '65c0ff7430b94e3fabd5bb8c'
      });

      // Initialize 3D map view
      const mapViewInstance = await show3dMap(mapContainerRef.current, mapData, mallConfig);
      setMapView(mapViewInstance);

      // Setup shopping mall features
      await setupShoppingMallFeatures(mapViewInstance, mapData);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Map initialization failed:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const setupShoppingMallFeatures = async (mapViewInstance, mapData) => {
    // Get all spaces (stores)
    const allSpaces = mapData.getByType('space');
    const storeSpaces = allSpaces.filter(space => 
      space.name && !space.name.toLowerCase().includes('washroom') && 
      !space.name.toLowerCase().includes('corridor')
    );
    
    setStores(storeSpaces);
    setCurrentFloor(mapData.getByType('floor')[0]);

    // Add store labels
    mapViewInstance.Labels.labelAll({
      fontSize: 12,
      fontColor: '#2c3e50',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 4,
      padding: 8
    });

    // Add promotional markers for featured stores
    addPromotionalMarkers(mapViewInstance, storeSpaces);

    // Setup event handlers
    setupEventHandlers(mapViewInstance);

    // Add directory kiosk markers
    addDirectoryKiosks(mapViewInstance, mapData);
  };

  const addPromotionalMarkers = (mapViewInstance, storeSpaces) => {
    // Add special promotion markers for random stores
    const featuredStores = storeSpaces.slice(0, 5);
    
    featuredStores.forEach((store, index) => {
      const promotionTypes = ['SALE', 'NEW', 'HOT', '50% OFF', 'GRAND OPENING'];
      const colors = ['#e74c3c', '#f39c12', '#e67e22', '#27ae60', '#9b59b6'];
      
      mapViewInstance.Markers.add(store, `
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
      `, {
        rank: 2
      });
    });
  };

  const addDirectoryKiosks = (mapViewInstance, mapData) => {
    // Add directory kiosk markers at main entrances
    const entrances = mapData.getByType('space').filter(space => 
      space.name && space.name.toLowerCase().includes('entrance')
    );

    entrances.forEach(entrance => {
      mapViewInstance.Markers.add(entrance, `
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
      `, {
        rank: 3
      });
    });
  };

  const setupEventHandlers = (mapViewInstance) => {
    // Handle space clicks
    mapViewInstance.on('click', (event) => {
      if (event.spaces && event.spaces.length > 0) {
        const clickedSpace = event.spaces[0];
        handleStoreSelection(clickedSpace);
      }
    });

    // Handle floor changes
    mapViewInstance.on('floor-change', (event) => {
      setCurrentFloor(event.floor);
    });
  };

  const handleStoreSelection = (store) => {
    if (!mapView) return;

    setSelectedStore(store);
    
    // Focus on the selected store
    mapView.Camera.focusOn(store, {
      zoom: 1000,
      tilt: 30,
      duration: 1000
    });

    // Highlight the store
    mapView.Polygons.add(store, {
      color: '#3498db',
      opacity: 0.3,
      strokeColor: '#2980b9',
      strokeWidth: 2
    });
  };

  const searchStores = (query) => {
    setSearchQuery(query);
    if (!query.trim()) return;

    const filteredStores = stores.filter(store =>
      store.name.toLowerCase().includes(query.toLowerCase())
    );

    // Clear existing search markers
    mapView?.Markers.removeAll();
    
    // Add markers for search results
    filteredStores.forEach(store => {
      mapView?.Markers.add(store, `
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
      `);
    });
  };

  const getDirectionsToStore = async (targetStore) => {
    if (!mapView || !currentFloor) return;

    try {
      // Get user's current location (simulate entrance)
      const entrances = stores.filter(space => 
        space.name && space.name.toLowerCase().includes('entrance')
      );
      const startPoint = entrances[0] || stores[0];

      // Get directions
      const directions = await mapView.getDirections(startPoint, targetStore);
      
      if (directions) {
        // Draw the path
        mapView.Paths.add(directions.coordinates, {
          color: '#27ae60',
          width: 4,
          opacity: 0.8
        });

        // Focus on the path
        mapView.Camera.focusOn(directions.coordinates);
      }
    } catch (error) {
      console.error('Failed to get directions:', error);
    }
  };

  const filterByCategory = (category) => {
    // This would typically use actual store category data
    // For demo purposes, we'll filter by name patterns
    const categoryKeywords = {
      'Fashion & Apparel': ['fashion', 'clothing', 'apparel', 'shoes'],
      'Electronics': ['electronics', 'tech', 'phone', 'computer'],
      'Food & Dining': ['restaurant', 'cafe', 'food', 'dining'],
      'Beauty & Health': ['beauty', 'health', 'pharmacy', 'salon'],
      'Home & Garden': ['home', 'furniture', 'garden'],
      'Entertainment': ['cinema', 'games', 'entertainment'],
      'Services': ['bank', 'service', 'repair']
    };

    const keywords = categoryKeywords[category] || [];
    const filteredStores = stores.filter(store =>
      keywords.some(keyword => 
        store.name.toLowerCase().includes(keyword)
      )
    );

    // Highlight category stores
    mapView?.Polygons.removeAll();
    filteredStores.forEach(store => {
      mapView?.Polygons.add(store, {
        color: '#f39c12',
        opacity: 0.2
      });
    });
  };

  const cleanup = () => {
    if (mapView) {
      mapView.Markers.removeAll();
      mapView.Labels.removeAll();
      mapView.Polygons.removeAll();
      mapView.Paths.removeAll();
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Shopping Mall Map...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Initializing stores and amenities</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#e74c3c'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Failed to Load Map</div>
        <div style={{ fontSize: '14px' }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      
      {/* Shopping Mall Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '300px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>🏬 Mall Directory</h3>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search stores..."
          value={searchQuery}
          onChange={(e) => searchStores(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '15px'
          }}
        />

        {/* Category Filter */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Filter by Category:
          </label>
          <select 
            onChange={(e) => filterByCategory(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          >
            <option value="">All Categories</option>
            {storeCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Store List */}
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Stores ({stores.length})</h4>
          {stores.slice(0, 10).map((store, index) => (
            <div
              key={store.id}
              onClick={() => handleStoreSelection(store)}
              style={{
                padding: '8px',
                margin: '4px 0',
                background: selectedStore?.id === store.id ? '#3498db' : '#f8f9fa',
                color: selectedStore?.id === store.id ? 'white' : '#333',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {store.name}
            </div>
          ))}
        </div>

        {/* Selected Store Actions */}
        {selectedStore && (
          <div style={{ 
            marginTop: '15px', 
            padding: '15px', 
            background: '#ecf0f1', 
            borderRadius: '4px' 
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>{selectedStore.name}</h4>
            <button
              onClick={() => getDirectionsToStore(selectedStore)}
              style={{
                background: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Get Directions
            </button>
            <button
              onClick={() => setSelectedStore(null)}
              style={{
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Floor Indicator */}
      {currentFloor && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '20px',
          fontSize: '14px'
        }}>
          Floor: {currentFloor.name}
        </div>
      )}
    </div>
  );
};

export default ShoppingMallMap;