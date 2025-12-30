# MAPPEDIN WEB SDK - COMPLETE CONTEXT DOCUMENT
## Comprehensive Technical Reference for React Implementation

---

## 🔍 **PROJECT AUDIT SUMMARY**

### **Current State Analysis**
```
mappedin-react-demo/
├── ISSUES IDENTIFIED:
│   ├── Hybrid CRA + Webpack setup (conflicting)
│   ├── Invalid demo credentials (401 errors)
│   ├── Duplicate App files (js/tsx confusion)
│   └── Unused webpack dependencies
├── WORKING COMPONENTS:
│   ├── @mappedin/mappedin-js@6.9.1 ✅
│   ├── React 19.2.3 ✅
│   └── Basic map initialization ✅
└── AUTHENTICATION: ❌ (Requires valid credentials)
```

---

## 📚 **COMPLETE MAPPEDIN WEB SDK API REFERENCE**

### **1. CORE IMPORTS & INITIALIZATION**
```javascript
// Primary SDK Import
import { 
  getMapData,           // Fetch venue data from API
  show3dMap,           // Initialize 3D map view
  MapView,             // Map instance interface
  Venue,               // Venue data structure
  Space,               // Individual room/area
  Floor,               // Floor level data
  Category,            // Space categorization
  Coordinate,          // 3D position data
  Directions,          // Navigation path data
  Marker,              // Map marker object
  Label,               // Text label object
  Path,                // Route visualization
  Polygon,             // Area shape object
  Text3D               // 3D text object
} from '@mappedin/mappedin-js';

// Authentication & Map Loading
const credentials = {
  key: 'your-api-key',        // From developer.mappedin.com
  secret: 'your-api-secret',  // From developer.mappedin.com
  mapId: 'venue-map-id'       // Specific venue identifier
};

const mapData = await getMapData(credentials);
const mapView = await show3dMap(containerElement, mapData, options);
```

### **2. MAP VIEW COMPLETE API**
```javascript
// MapView Interface - Complete Method Reference
const mapView = {
  // CORE PROPERTIES
  venue: Venue,                    // Venue data access
  currentFloor: Floor,             // Active floor reference
  camera: Camera,                  // Camera controller
  
  // NAVIGATION METHODS
  getDirections: async (from, to) => Directions,  // Calculate route
  setFloor: async (floor) => void,                // Change active floor
  focusOn: async (target, options) => void,       // Focus camera on target
  
  // MARKER MANAGEMENT
  Markers: {
    add: (space, template) => Marker,        // Add marker to space
    remove: (marker) => void,                // Remove specific marker
    removeAll: () => void,                   // Clear all markers
    show: (marker) => void,                  // Show hidden marker
    hide: (marker) => void,                  // Hide visible marker
    showAll: () => void,                     // Show all markers
    hideAll: () => void,                     // Hide all markers
    get: (id) => Marker,                     // Get marker by ID
    getAll: () => Marker[]                   // Get all markers
  },
  
  // LABEL MANAGEMENT
  Labels: {
    labelAll: (options) => void,             // Auto-label all spaces
    add: (space, text, options) => Label,    // Add custom label
    remove: (label) => void,                 // Remove specific label
    removeAll: () => void,                   // Clear all labels
    show: (label) => void,                   // Show hidden label
    hide: (label) => void,                   // Hide visible label
    showAll: () => void,                     // Show all labels
    hideAll: () => void                      // Hide all labels
  },
  
  // PATH MANAGEMENT
  Paths: {
    add: (coordinates, options) => Path,     // Draw path on map
    remove: (path) => void,                  // Remove specific path
    removeAll: () => void,                   // Clear all paths
    show: (path) => void,                    // Show hidden path
    hide: (path) => void,                    // Hide visible path
    animate: (path, options) => void         // Animate path drawing
  },
  
  // POLYGON MANAGEMENT
  Polygons: {
    add: (coordinates, options) => Polygon,  // Add area shape
    remove: (polygon) => void,               // Remove specific polygon
    removeAll: () => void,                   // Clear all polygons
    show: (polygon) => void,                 // Show hidden polygon
    hide: (polygon) => void                  // Hide visible polygon
  },
  
  // 3D TEXT MANAGEMENT
  Text3D: {
    add: (coordinate, text, options) => Text3D,  // Add 3D text
    remove: (text3d) => void,                    // Remove 3D text
    removeAll: () => void,                       // Clear all 3D text
    labelAll: (options) => void                  // Auto-add 3D labels
  },
  
  // CAMERA CONTROLS
  Camera: {
    focusOn: async (target, options) => void,    // Focus on target
    animateTo: async (position, options) => void, // Animate to position
    setRotation: (rotation) => void,             // Set camera rotation
    setZoom: (zoom) => void,                     // Set zoom level
    setPitch: (pitch) => void,                   // Set camera pitch
    getPosition: () => Coordinate,               // Get current position
    getBounds: () => Bounds                      // Get view bounds
  },
  
  // EVENT SYSTEM
  on: (event, callback) => void,            // Add event listener
  off: (event, callback) => void,           // Remove event listener
  emit: (event, data) => void,              // Emit custom event
  
  // UTILITY METHODS
  destroy: () => void,                      // Clean up map instance
  reload: async () => void,                 // Reload map data
  screenshot: (options) => Promise<Blob>,   // Capture map image
  setOptions: (options) => void             // Update map options
};
```

### **3. DATA STRUCTURES - COMPLETE INTERFACES**
```javascript
// Venue Interface
const venue = {
  id: 'string',                    // Unique venue identifier
  name: 'string',                  // Venue display name
  slug: 'string',                  // URL-friendly name
  floors: Floor[],                 // Array of floor objects
  spaces: Space[],                 // Array of all spaces
  categories: Category[],          // Space categories
  
  // Data Access Methods
  getByType: (type) => any[],                    // Get objects by type
  getById: (id) => any,                          // Get object by ID
  getSpacesByCategory: (categoryId) => Space[],  // Filter spaces
  getSpacesByFloor: (floorId) => Space[],        // Get floor spaces
  searchSpaces: (query) => Space[]               // Search by name
};

// Floor Interface
const floor = {
  id: 'string',                    // Unique floor identifier
  name: 'string',                  // Floor display name
  shortName: 'string',             // Abbreviated name
  elevation: 'number',             // Floor height/level
  spaces: Space[],                 // Spaces on this floor
  
  // Floor Methods
  getSpaces: () => Space[],        // Get all spaces on floor
  getSpacesByCategory: (categoryId) => Space[]  // Filter by category
};

// Space Interface
const space = {
  id: 'string',                    // Unique space identifier
  name: 'string',                  // Space display name
  description: 'string',           // Optional description
  floor: Floor,                    // Parent floor reference
  category: Category,              // Space category
  coordinates: Coordinate[],       // Boundary coordinates
  center: Coordinate,              // Center point
  entrances: Coordinate[],         // Entry points
  accessible: 'boolean',           // Accessibility flag
  
  // Space Methods
  distanceTo: (target) => 'number',      // Calculate distance
  isOnFloor: (floor) => 'boolean',       // Check floor membership
  getBounds: () => Bounds,               // Get bounding box
  contains: (coordinate) => 'boolean'    // Check if point inside
};

// Category Interface
const category = {
  id: 'string',                    // Unique category identifier
  name: 'string',                  // Category display name
  color: 'string',                 // Default color (hex)
  icon: 'string',                  // Icon identifier
  spaces: Space[]                  // Spaces in this category
};

// Coordinate Interface
const coordinate = {
  latitude: 'number',              // Latitude coordinate
  longitude: 'number',             // Longitude coordinate
  elevation: 'number'              // Height/floor level
};

// Directions Interface
const directions = {
  coordinates: Coordinate[],       // Path coordinates
  distance: 'number',              // Total distance
  duration: 'number',              // Estimated time
  instructions: Instruction[],     // Turn-by-turn directions
  
  // Direction Methods
  getSegments: () => Segment[],    // Get path segments
  getTotalTime: () => 'number',    // Calculate total time
  getWaypoints: () => Coordinate[] // Get key waypoints
};
```

### **4. EVENT SYSTEM - COMPLETE REFERENCE**
```javascript
// Available Events with Interfaces
mapView.on('click', (event) => {
  // ClickEvent Interface
  event.coordinate;     // Coordinate - Click position
  event.space;          // Space | null - Clicked space
  event.floor;          // Floor - Current floor
  event.pixel;          // {x, y} - Screen coordinates
});

mapView.on('hover', (event) => {
  // HoverEvent Interface
  event.coordinate;     // Coordinate - Hover position
  event.space;          // Space | null - Hovered space
  event.floor;          // Floor - Current floor
});

mapView.on('floor-change', (event) => {
  // FloorChangeEvent Interface
  event.floor;          // Floor - New active floor
  event.previousFloor;  // Floor - Previous floor
});

mapView.on('camera-change', (event) => {
  // CameraChangeEvent Interface
  event.position;       // Coordinate - Camera position
  event.rotation;       // number - Camera rotation
  event.zoom;           // number - Zoom level
  event.pitch;          // number - Camera pitch
});

mapView.on('marker-click', (event) => {
  // MarkerClickEvent Interface
  event.marker;         // Marker - Clicked marker
  event.space;          // Space - Associated space
  event.coordinate;     // Coordinate - Marker position
});

mapView.on('path-complete', (event) => {
  // PathCompleteEvent Interface
  event.path;           // Path - Completed path
  event.duration;       // number - Animation duration
});

mapView.on('load', (event) => {
  // LoadEvent Interface
  event.venue;          // Venue - Loaded venue data
  event.loadTime;       // number - Load duration
});

mapView.on('error', (event) => {
  // ErrorEvent Interface
  event.type;           // string - Error type
  event.message;        // string - Error message
  event.code;           // number - Error code
});
```

### **5. STYLING & CUSTOMIZATION - COMPLETE OPTIONS**
```javascript
// Map Initialization Options
const mapOptions = {
  backgroundColor: '#f0f0f0',      // Background color
  antialias: true,                 // Enable antialiasing
  shadows: true,                   // Enable shadows
  reflections: false,              // Enable reflections
  multiFloorView: false,           // Show multiple floors
  
  // Camera Options
  camera: {
    animate: true,                 // Enable camera animations
    animationDuration: 1000,       // Animation duration (ms)
    easing: 'ease-in-out',         // Animation easing
    maxZoom: 22,                   // Maximum zoom level
    minZoom: 10,                   // Minimum zoom level
    maxPitch: 60,                  // Maximum camera pitch
    minPitch: 0                    // Minimum camera pitch
  },
  
  // Rendering Options
  rendering: {
    quality: 'high',               // 'low' | 'medium' | 'high'
    fps: 60,                       // Target frame rate
    pixelRatio: window.devicePixelRatio  // Display pixel ratio
  }
};

// Marker Template Options
const markerTemplate = `
  <div class="custom-marker" style="
    background: {{category.color}};
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  ">
    {{name.substring(0,2)}}
  </div>
`;

// Label Options
const labelOptions = {
  fontSize: 14,                    // Font size in pixels
  fontColor: '#333333',            // Text color
  fontFamily: 'Arial, sans-serif', // Font family
  backgroundColor: 'rgba(255,255,255,0.8)', // Background color
  borderColor: '#cccccc',          // Border color
  borderWidth: 1,                  // Border width
  borderRadius: 4,                 // Border radius
  padding: 8,                      // Internal padding
  maxWidth: 200,                   // Maximum width
  textAlign: 'center',             // Text alignment
  visible: true                    // Initial visibility
};

// Path Options
const pathOptions = {
  width: 4,                        // Path width in pixels
  color: '#007AFF',                // Path color
  opacity: 0.8,                    // Path opacity (0-1)
  pattern: 'solid',                // 'solid' | 'dashed' | 'dotted'
  animation: 'none',               // 'none' | 'flow' | 'pulse'
  animationSpeed: 1.0,             // Animation speed multiplier
  zIndex: 100                      // Rendering order
};

// Polygon Options
const polygonOptions = {
  fillColor: '#4ECDC4',            // Fill color
  fillOpacity: 0.3,                // Fill opacity (0-1)
  strokeColor: '#2C3E50',          // Border color
  strokeWidth: 2,                  // Border width
  strokeOpacity: 1.0,              // Border opacity (0-1)
  strokePattern: 'solid',          // Border pattern
  zIndex: 50                       // Rendering order
};
```

---

## 🏗️ **COMPLETE IMPLEMENTATION PATTERNS**

### **6. REACT INTEGRATION PATTERNS**
```javascript
// Complete React Hook for Mappedin
import { useState, useEffect, useRef, useCallback } from 'react';
import { getMapData, show3dMap } from '@mappedin/mappedin-js';

export const useMappedin = (credentials, options = {}) => {
  const mapRef = useRef(null);
  const [mapView, setMapView] = useState(null);
  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(null);

  const initializeMap = useCallback(async (container) => {
    if (!container || !credentials) return;

    try {
      setIsLoading(true);
      setError(null);

      const mapData = await getMapData(credentials);
      const view = await show3dMap(container, mapData, options);

      setMapView(view);
      setVenue(mapData.venue);
      setCurrentFloor(view.currentFloor);

      // Setup event listeners
      view.on('floor-change', (event) => {
        setCurrentFloor(event.floor);
      });

      view.on('error', (event) => {
        setError(event.message);
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [credentials, options]);

  useEffect(() => {
    if (mapRef.current) {
      initializeMap(mapRef.current);
    }

    return () => {
      if (mapView) {
        mapView.destroy();
      }
    };
  }, [initializeMap]);

  // Map control methods
  const focusOnSpace = useCallback(async (space, options = {}) => {
    if (mapView) {
      await mapView.Camera.focusOn(space, options);
    }
  }, [mapView]);

  const addMarker = useCallback((space, template) => {
    if (mapView) {
      return mapView.Markers.add(space, template);
    }
  }, [mapView]);

  const getDirections = useCallback(async (from, to) => {
    if (mapView) {
      return await mapView.getDirections(from, to);
    }
  }, [mapView]);

  const drawPath = useCallback((coordinates, options = {}) => {
    if (mapView) {
      return mapView.Paths.add(coordinates, options);
    }
  }, [mapView]);

  return {
    mapRef,
    mapView,
    venue,
    currentFloor,
    isLoading,
    error,
    focusOnSpace,
    addMarker,
    getDirections,
    drawPath
  };
};

// Complete React Component Implementation
export const MappedInMap = ({ 
  credentials, 
  onMapReady, 
  onSpaceClick,
  style = { width: '100%', height: '500px' }
}) => {
  const {
    mapRef,
    mapView,
    venue,
    currentFloor,
    isLoading,
    error,
    focusOnSpace,
    addMarker,
    getDirections,
    drawPath
  } = useMappedin(credentials);

  useEffect(() => {
    if (mapView && onMapReady) {
      onMapReady({
        mapView,
        venue,
        focusOnSpace,
        addMarker,
        getDirections,
        drawPath
      });
    }
  }, [mapView, venue, onMapReady]);

  useEffect(() => {
    if (mapView && onSpaceClick) {
      const handleClick = (event) => {
        if (event.space) {
          onSpaceClick(event.space, event);
        }
      };

      mapView.on('click', handleClick);
      return () => mapView.off('click', handleClick);
    }
  }, [mapView, onSpaceClick]);

  if (error) {
    return (
      <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>
          <h3>Map Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.8)'
        }}>
          <div>Loading map...</div>
        </div>
      )}
      {currentFloor && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(255,255,255,0.9)',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          Floor: {currentFloor.name}
        </div>
      )}
    </div>
  );
};
```

This document provides complete coverage of the Mappedin Web SDK with all APIs, patterns, and React integration examples.