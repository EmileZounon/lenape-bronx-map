# Pre-Colonial Lenape Settlements of the Bronx

Interactive map visualization documenting Indigenous geography before European contact (pre-1609). This single-page application uses the Google Maps JavaScript API to render settlement locations, trails, waterways, and landmarks of the Lenape (Delaware) people who inhabited the area now known as the Bronx.

## Google Maps API Setup

To run this project, you need a Google Maps API key and Map ID:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** (or select an existing one)
3. **Enable the "Maps JavaScript API"**
   - Navigate to APIs & Services > Library
   - Search for "Maps JavaScript API" and click Enable
4. **Create a Map ID**
   - Go to Google Maps Platform > Map Management
   - Click "Create Map ID"
   - Select **"JavaScript"** as the platform
   - Select **"Vector"** as the map type
   - Copy the generated Map ID
5. **Get an API key**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "API key"
   - Restrict the key to **Maps JavaScript API** only
   - Add your domain under application restrictions (for production)

Then open `index.html` and replace:
- `YOUR_API_KEY` with your API key
- `YOUR_MAP_ID` with your Map ID

## What Has Been Built

### Phase 1: HTML Skeleton & Data Constants (Task 1-2)
- Full HTML skeleton with dark-themed CSS variables and Google Maps API loading
- All data constants: SETTLEMENTS (12 sites), TRAILS (3 routes), BRONX_RIVER, TERRITORY_POLYGONS, LANDMARKS, ECOLOGICAL_ZONES, NEIGHBORING_TERRITORIES, SETTLEMENT_TYPES, TIMELINE, STATISTICS
- Basic `initMap()` function creating the map

### Phase 2: All 7 Map Layers & Layer Toggle Panel (Tasks 3-6)
- **Settlement Markers** (12 custom HTML markers with emoji icons, territory-colored borders, pulse animation for highlighted sites)
- **Territory Polygons** (Weckquaesgeek in blue, Siwanoy in red, semi-transparent fill)
- **Bronx River** (dashed cyan polyline with InfoWindow on click)
- **Trail Routes** (purple polylines for Wickquasgeck Trail and Shore Path; wave marker for The Wading Place) -- default OFF
- **Landmarks** (The Grey Mare boulder, Treaty Oak) -- default OFF
- **Ecological Zones** (6 zones: salt marshes, ridges, tidal inlets, birch bark country, sedge plains, hunting grounds) -- default OFF
- **Neighboring Territories** (Wappinger, Sintsink, Canarsee, Rockaway) -- default OFF
- **Layer Toggle Panel** (fixed bottom-right panel with checkboxes for all 7 layers, color swatches, collapse/expand button)
- Shared InfoWindow for all clickable features
- `showSettlementDetail()` stub for future detail panel

## Local Development

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Deployment

This project is designed for deployment via **GitHub Pages** from the `main` branch root (`/`).

## Data Sources & Credits

- **Bolton, Reginald Pelham.** *Indian Paths in the Great Metropolis.* Museum of the American Indian, Heye Foundation, 1922.
- **Grumet, Robert S.** *The Munsee Indians: A History.* University of Oklahoma Press, 2013.
- **Skinner, Alanson.** *The Indians of Manhattan Island and Vicinity.* American Museum of Natural History, 1919.
- **Gilbert, Ashley Bobé.** Research on Lenape place names and settlements, 2018.
- **NYC Landmarks Preservation Commission.** Archaeological and historical reports.
- **Welikia Project.** Ecological reconstruction of pre-colonial Manhattan and the Bronx (welikia.org).
