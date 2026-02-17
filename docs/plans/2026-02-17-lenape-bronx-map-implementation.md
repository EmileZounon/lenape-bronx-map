# Lenape Bronx Map — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an interactive Google Maps visualization of pre-colonial Lenape settlements in the Bronx, deployed to GitHub Pages.

**Architecture:** Single `index.html` with embedded CSS/JS. Google Maps JavaScript API with `AdvancedMarkerElement` (requires `mapId`), `Polygon`, `Polyline`, and `InfoWindow`. Cloud-based map styling via Google Cloud Console. All data embedded as JS objects. No build tools.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript (ES2020+), Google Maps JavaScript API v3.

---

### Task 1: Create GitHub repo and scaffold HTML skeleton

**Files:**
- Create: `lenape-bronx-map/index.html`
- Create: `lenape-bronx-map/README.md`

**Step 1: Create the GitHub repo**

```bash
cd /Users/emilegiovannie
mkdir lenape-bronx-map
cd lenape-bronx-map
git init
```

**Step 2: Create README with setup instructions**

Create `README.md` with:
- Project description
- Google Maps API key setup instructions (create GCP project, enable Maps JavaScript API, create Map ID, get API key)
- How to deploy to GitHub Pages
- How to run locally (just open index.html or use `python3 -m http.server`)

**Step 3: Create HTML skeleton**

Create `index.html` with:
- HTML5 doctype, `<meta charset="utf-8">`, viewport meta tag
- `<title>Pre-Colonial Lenape Settlements of the Bronx</title>`
- Google Fonts: Inter (400, 700) and JetBrains Mono (400)
- CSS custom properties for the full color palette from the design doc
- CSS reset and base styles (dark theme: `#0f172a` background)
- Empty `<div id="map">` filling the viewport
- Google Maps API script tag with `loading=async`, `callback=initMap`, placeholder `YOUR_API_KEY`, and `libraries=marker`
- Empty `initMap()` function that creates a Google Map centered on the Bronx (`40.8448, -73.8648`, zoom 12) with `mapId` placeholder

**Step 4: Verify the map loads**

Open `index.html` in browser. Confirm: dark-themed page with a Google Map centered on the Bronx. (Map won't render without a valid API key — that's expected at this stage. The HTML structure should be correct.)

**Step 5: Commit**

```bash
git add index.html README.md
git commit -m "feat: scaffold HTML skeleton with Google Maps initialization"
```

---

### Task 2: Embed all settlement data as JS objects

**Files:**
- Modify: `lenape-bronx-map/index.html` (add data inside `<script>`)

**Step 1: Add the SETTLEMENTS array**

Inside the `<script>` tag, before `initMap()`, add a `const SETTLEMENTS = [...]` array with all 12 settlement objects. Each object has: `id`, `name`, `meaning`, `alternativeMeaning` (optional), `territory`, `modernLocation`, `coordinates` (`{lat, lng}`), `type`, `significance`, `icon` (emoji string), `highlight` (boolean).

Sites (from LENAPE_BRONX_MAP.md + split Keskeskeck):
1. Nipinichsen (40.8781, -73.9219) — Weckquaesgeek, fortified
2. Keskeskeck North (40.8900, -73.8986) — Weckquaesgeek, major
3. Keskeskeck South (40.8380, -73.9270) — Weckquaesgeek, major
4. Riverdale Shell Middens (40.9003, -73.9136) — Weckquaesgeek, seasonal
5. Snakapins (40.8058, -73.8494) — Siwanoy, major, highlight
6. Quinnahung (40.8095, -73.8774) — Siwanoy, agricultural
7. Laaphawachking (40.8714, -73.7906) — Siwanoy, economic, highlight
8. Castle Hill (40.8192, -73.8506) — Siwanoy, economic
9. Throgs Neck Shell Heap (40.8226, -73.8213) — Siwanoy, seasonal
10. Ferry Point Burial Ground (40.8186, -73.8329) — Siwanoy, ceremonial
11. Bear Swamp (40.8520, -73.8553) — Siwanoy, historical, highlight
12. 2015 Pelham Bay Discovery (40.8650, -73.8050) — Siwanoy, archaeological, highlight

**Step 2: Add the TRAILS array**

```javascript
const TRAILS = [
  {
    id: 'wickquasgeck',
    name: 'Wickquasgeck Trail',
    modernEquivalent: 'Broadway',
    territory: 'Weckquaesgeek',
    description: 'Primary north-south artery connecting birch bark country to Manhattan.',
    path: [
      {lat: 40.905, lng: -73.907},
      {lat: 40.890, lng: -73.899},
      {lat: 40.878, lng: -73.907},
      {lat: 40.878, lng: -73.922},
      {lat: 40.870, lng: -73.927}
    ]
  },
  {
    id: 'shore-path',
    name: 'Shore Path',
    modernEquivalent: 'Boston Post Road / Pelham Parkway',
    territory: 'Siwanoy',
    description: 'Coastal east-west connector between summer shellfish camps and inland hunting grounds.',
    path: [
      {lat: 40.871, lng: -73.791},
      {lat: 40.858, lng: -73.855},
      {lat: 40.839, lng: -73.845},
      {lat: 40.819, lng: -73.851},
      {lat: 40.806, lng: -73.849}
    ]
  },
  {
    id: 'wading-place',
    name: 'The Wading Place (Paparinemin)',
    modernEquivalent: 'Kingsbridge',
    territory: 'Weckquaesgeek',
    description: 'Critical low-tide ford connecting the Bronx mainland to Manhattan Island.',
    path: [{lat: 40.8781, lng: -73.9219}]
  }
];
```

**Step 3: Add the BRONX_RIVER path**

```javascript
const BRONX_RIVER = {
  name: 'Aquahung (Bronx River)',
  description: 'Territorial boundary between Siwanoy (east) and Weckquaesgeek (west).',
  path: [
    {lat: 40.898, lng: -73.870},
    {lat: 40.876, lng: -73.873},
    {lat: 40.852, lng: -73.878},
    {lat: 40.830, lng: -73.880},
    {lat: 40.810, lng: -73.877}
  ]
};
```

**Step 4: Add TERRITORY_POLYGONS**

Approximate polygon coordinates for Weckquaesgeek (western Bronx) and Siwanoy (eastern Bronx), using the Bronx River as the dividing line and the borough boundaries as the outer edges.

**Step 5: Add LANDMARKS, ECOLOGICAL_ZONES, NEIGHBORING_TERRITORIES, TIMELINE, and STATISTICS arrays**

All data from the extracted map data document and the original LENAPE_BRONX_MAP.md.

**Step 6: Add SETTLEMENT_TYPES lookup**

```javascript
const SETTLEMENT_TYPES = {
  fortified: {label: 'Fortified Stronghold', color: '#dc2626'},
  major: {label: 'Major Village', color: '#f97316'},
  economic: {label: 'Trade/Wampum Center', color: '#eab308'},
  agricultural: {label: 'Agricultural Site', color: '#22c55e'},
  ceremonial: {label: 'Ceremonial/Burial Site', color: '#8b5cf6'},
  seasonal: {label: 'Seasonal Camp', color: '#06b6d4'},
  historical: {label: 'Historical Site', color: '#6b7280'},
  archaeological: {label: 'Archaeological Discovery', color: '#ec4899'}
};
```

**Step 7: Commit**

```bash
git add index.html
git commit -m "feat: embed all settlement, trail, territory, and timeline data"
```

---

### Task 3: Render settlement markers on the map

**Files:**
- Modify: `lenape-bronx-map/index.html` (update `initMap()` and add CSS)

**Step 1: Import the marker library**

Inside `initMap()`:
```javascript
const {AdvancedMarkerElement} = await google.maps.importLibrary('marker');
```

**Step 2: Create custom marker HTML elements**

For each settlement, create a custom HTML element as the marker's `content`:
- A `<div>` with the emoji icon, styled as a circle (40x40px) with territory-colored border
- Highlighted sites get a CSS pulsing animation (keyframes `pulse` with box-shadow)
- Territory color: Weckquaesgeek = `#3b82f6`, Siwanoy = `#ef4444`

```javascript
SETTLEMENTS.forEach(site => {
  const markerEl = document.createElement('div');
  markerEl.className = 'marker' + (site.highlight ? ' marker--highlight' : '');
  markerEl.style.borderColor = site.territory === 'Weckquaesgeek' ? '#3b82f6' : '#ef4444';
  markerEl.innerHTML = site.icon;
  markerEl.title = `${site.name} — ${site.modernLocation}`;

  const marker = new AdvancedMarkerElement({
    map,
    position: site.coordinates,
    content: markerEl,
    title: site.name
  });

  marker.addListener('click', () => showSettlementDetail(site));
});
```

**Step 3: Add marker CSS**

```css
.marker {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 3px solid;
  background: #1e293b;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}
.marker:hover { transform: scale(1.2); }
.marker--highlight {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
}
```

**Step 4: Add a stub `showSettlementDetail(site)` function**

Just `console.log(site.name)` for now — the detail panel comes in Task 7.

**Step 5: Verify in browser**

Open the page. All 12 markers should appear on the map at the correct Bronx locations, with emoji icons, colored borders, and pulsing animations on highlighted sites. Hovering should show a tooltip.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: render 12 settlement markers with custom emoji icons and pulse animation"
```

---

### Task 4: Render territory polygons and Bronx River boundary

**Files:**
- Modify: `lenape-bronx-map/index.html` (add to `initMap()`)

**Step 1: Create Weckquaesgeek polygon**

```javascript
const weckquaesgeekPoly = new google.maps.Polygon({
  paths: TERRITORY_POLYGONS.weckquaesgeek,
  strokeColor: '#3b82f6',
  strokeOpacity: 0.6,
  strokeWeight: 2,
  fillColor: '#3b82f6',
  fillOpacity: 0.08,
  map
});
```

**Step 2: Create Siwanoy polygon**

Same pattern with `#ef4444`.

**Step 3: Create Bronx River polyline**

```javascript
const bronxRiver = new google.maps.Polyline({
  path: BRONX_RIVER.path,
  strokeColor: '#22d3ee',
  strokeOpacity: 0.8,
  strokeWeight: 3,
  icons: [{
    icon: {path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3},
    offset: '0',
    repeat: '15px'
  }],
  strokeOpacity: 0,
  map
});
```

The `icons` + `strokeOpacity: 0` trick creates a dashed line effect with Google Maps Polyline.

**Step 4: Add click listener on Bronx River**

Click → show InfoWindow with "Aquahung (Bronx River) — Territorial boundary between Siwanoy and Weckquaesgeek."

**Step 5: Store references for layer toggling**

Push all polygons and polylines into a `layers` object:
```javascript
const layers = {
  territories: [weckquaesgeekPoly, siwanoyPoly],
  river: [bronxRiver],
  trails: [],
  landmarks: [],
  ecoZones: [],
  neighbors: []
};
```

**Step 6: Verify in browser**

Two semi-transparent polygons should shade the Bronx, divided by a dashed cyan Bronx River line.

**Step 7: Commit**

```bash
git add index.html
git commit -m "feat: render territory polygons and dashed Bronx River boundary"
```

---

### Task 5: Render trails, landmarks, ecological zones, and neighboring territories

**Files:**
- Modify: `lenape-bronx-map/index.html`

**Step 1: Render trail polylines**

For each trail in TRAILS, create a `google.maps.Polyline` with purple color (`#a855f7`), opacity 0.7, weight 3. For the Wading Place (single point), create an `AdvancedMarkerElement` instead.

Add click listeners that open an InfoWindow with the trail name, modern equivalent, and description.

Set `map: null` initially (trails default OFF per design).

**Step 2: Render landmark markers**

Create `AdvancedMarkerElement` for Grey Mare and Treaty Oak with amber (`#f59e0b`) colored marker styling and diamond/star icons. Set `map: null` initially (landmarks default OFF).

**Step 3: Render ecological zone polygons**

For each of the 6 ecological zones, create `google.maps.Polygon` with:
- Salt marshes: teal-green, very low opacity
- Dramatic ridges: brown
- Tidal inlets: ocean blue
- Birch bark country: forest green
- Sedge grass plains: olive
- Inland hunting grounds: earthy brown

Set `map: null` initially (eco zones default OFF).

**Step 4: Render neighboring territory polygons**

For Wappinger, Sintsink, Canarsee, Rockaway — faded outline-only polygons (low stroke opacity, no fill). These extend outside the Bronx. Set `map: null` initially (neighbors default OFF).

**Step 5: Push all new elements into the `layers` object**

**Step 6: Verify in browser**

All layers are OFF except settlements + territories + river. Console-test toggling by calling `layers.trails.forEach(t => t.setMap(map))`.

**Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add trail, landmark, ecological zone, and neighboring territory layers"
```

---

### Task 6: Build the layer toggle panel

**Files:**
- Modify: `lenape-bronx-map/index.html` (add HTML + CSS + JS)

**Step 1: Add layer toggle HTML**

A floating panel in the bottom-right corner of the map:
```html
<div id="layer-panel" class="layer-panel">
  <h3>Map Layers</h3>
  <label><input type="checkbox" data-layer="settlements" checked> Settlements</label>
  <label><input type="checkbox" data-layer="territories" checked> Territories</label>
  <label><input type="checkbox" data-layer="river" checked> Bronx River</label>
  <label><input type="checkbox" data-layer="trails"> Trail Routes</label>
  <label><input type="checkbox" data-layer="landmarks"> Landmarks</label>
  <label><input type="checkbox" data-layer="ecoZones"> Ecological Zones</label>
  <label><input type="checkbox" data-layer="neighbors"> Neighboring Peoples</label>
</div>
```

**Step 2: Style the panel**

Absolute positioned, bottom-right, dark surface (`#1e293b`), rounded corners, drop shadow. Checkboxes styled with accent-color matching layer colors.

**Step 3: Add toggle logic**

```javascript
document.querySelectorAll('#layer-panel input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', () => {
    const layerKey = cb.dataset.layer;
    const targetMap = cb.checked ? map : null;
    if (layerKey === 'settlements') {
      settlementMarkers.forEach(m => m.map = targetMap);
    } else {
      layers[layerKey].forEach(item => item.setMap(targetMap));
    }
  });
});
```

**Step 4: Verify in browser**

Toggle each checkbox — layers should appear/disappear on the map.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add layer toggle panel with 7 toggleable layers"
```

---

### Task 7: Build the collapsible sidebar with search, filter, stats, and detail panel

**Files:**
- Modify: `lenape-bronx-map/index.html`

**Step 1: Add sidebar HTML structure**

```html
<aside id="sidebar" class="sidebar sidebar--collapsed">
  <button id="sidebar-toggle" class="sidebar__toggle" aria-label="Toggle sidebar">&#9776;</button>
  <div class="sidebar__content">
    <h1 class="sidebar__title">Pre-Colonial Lenape Settlements of the Bronx</h1>
    <input id="search" type="search" placeholder="Search settlements..." class="sidebar__search">
    <div id="territory-filter" class="sidebar__filter">
      <button data-territory="all" class="filter-btn active">All</button>
      <button data-territory="Weckquaesgeek" class="filter-btn filter-btn--weck">Weckquaesgeek</button>
      <button data-territory="Siwanoy" class="filter-btn filter-btn--siw">Siwanoy</button>
    </div>
    <div id="stats" class="sidebar__stats">
      <!-- 6 stat cards -->
    </div>
    <div id="settlement-list" class="sidebar__list">
      <!-- Generated list of settlements -->
    </div>
    <div id="detail-panel" class="sidebar__detail" hidden>
      <!-- Populated when a settlement is selected -->
    </div>
  </div>
</aside>
```

**Step 2: Style the sidebar**

- Width: 380px on desktop, full-width on mobile
- Starts collapsed (only toggle button visible)
- Slide-in animation with CSS transform
- Scrollable content area
- Dark surface color with border

**Step 3: Implement sidebar toggle**

Click hamburger button → toggle `sidebar--collapsed` class. Map resizes to fill remaining space.

**Step 4: Implement search**

```javascript
document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  settlementMarkers.forEach((marker, i) => {
    const site = SETTLEMENTS[i];
    const match = site.name.toLowerCase().includes(query) ||
                  site.modernLocation.toLowerCase().includes(query) ||
                  site.meaning.toLowerCase().includes(query);
    marker.map = match ? map : null;
  });
  renderSettlementList(query);
});
```

**Step 5: Implement territory filter**

Click filter button → dim/hide markers not matching the territory. Update active button styling.

**Step 6: Render stats cards**

6 cards from STATISTICS data, styled with large number and label below.

**Step 7: Render settlement list**

A clickable list of all settlements in the sidebar. Clicking one calls `showSettlementDetail(site)` and flies the map to that location.

**Step 8: Implement `showSettlementDetail(site)`**

Populates the detail panel with:
- Name + meaning
- Territory badge (color-coded)
- Modern location
- Type with icon
- Full significance text
- Coordinates (in monospace)
- "Close" button to dismiss

Opens the sidebar if collapsed.

**Step 9: Verify in browser**

Test: toggle sidebar, search "Snakapins", filter by Siwanoy, click a settlement in the list, verify detail panel populates and map flies to location.

**Step 10: Commit**

```bash
git add index.html
git commit -m "feat: build collapsible sidebar with search, filter, stats, and detail panel"
```

---

### Task 8: Build the timeline bar

**Files:**
- Modify: `lenape-bronx-map/index.html`

**Step 1: Add timeline HTML**

A fixed bottom bar with horizontally scrollable event markers:
```html
<div id="timeline" class="timeline">
  <div class="timeline__track">
    <!-- Generated event nodes -->
  </div>
</div>
```

**Step 2: Style the timeline**

- Fixed to bottom, full width, 80px height
- Dark surface background
- Horizontal scroll with `overflow-x: auto`
- Each event: vertical line + dot + date label above + event name below
- Active event highlighted in cyan
- Smooth scroll behavior

**Step 3: Generate timeline events**

Loop over TIMELINE array, create event nodes. Space them proportionally or evenly.

**Step 4: Add timeline interaction**

Click an event → map flies to associated settlement coordinates (if applicable), highlight the marker, show brief info. Use `map.panTo()` and `map.setZoom()` for the fly animation.

**Step 5: Add keyboard navigation**

Left/right arrow keys scroll the timeline. Enter selects the focused event.

**Step 6: Verify in browser**

Scroll the timeline, click "1609 First Contact" — map should fly to Nipinichsen. Click "2015 Major Discovery" — should fly to Pelham Bay.

**Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add interactive timeline bar with keyboard navigation"
```

---

### Task 9: Add custom map styling and polish

**Files:**
- Modify: `lenape-bronx-map/index.html`

**Step 1: Add custom map styles array**

Since we need `mapId` for AdvancedMarkerElement, and cloud-based styling requires configuring it in Google Cloud Console, add a comment in the code with instructions for the user to create a custom map style in Cloud Console (mute labels, earthy tones). As a fallback, if the user doesn't set up cloud styling, the default Google Maps style works fine — the dark UI theme surrounding the map provides sufficient contrast.

**Step 2: Add a subtle Bronx boundary outline**

A light dashed polyline tracing the Bronx borough boundary to give geographic context.

**Step 3: Add a legend**

Small floating panel (top-right or bottom-left) explaining:
- Territory colors (blue = Weckquaesgeek, red = Siwanoy)
- Settlement type icons and their meanings
- Trail line color

**Step 4: Add hover tooltips for markers**

On mouseover of any settlement marker, show a small tooltip div with the Lenape name and modern location (not the full info panel, just a quick preview).

**Step 5: Add map controls positioning**

Position Google Maps default controls (zoom, fullscreen) in a consistent location that doesn't overlap with the sidebar or layer panel.

**Step 6: Verify in browser**

Check: legend visible, tooltips work on hover, map controls don't overlap UI elements.

**Step 7: Commit**

```bash
git add index.html
git commit -m "feat: add legend, hover tooltips, and visual polish"
```

---

### Task 10: Add sources/references footer and mobile responsiveness

**Files:**
- Modify: `lenape-bronx-map/index.html`

**Step 1: Add sources section**

Below the timeline (or in a collapsible footer area):
- Historical maps: Bolton 1922, Ohman 1912
- Modern resources: Welikia Project, NYC Landmarks, Bronx County Historical Society
- Academic sources: Cantwell & Wall, Grumet, Gilbert

**Step 2: Add mobile responsive styles**

```css
@media (max-width: 768px) {
  .sidebar { width: 100%; height: auto; position: fixed; top: 0; z-index: 1000; }
  .sidebar--collapsed { transform: translateX(-100%); }
  .sidebar__detail { /* bottom sheet behavior */ }
  .timeline { height: 60px; font-size: 12px; }
  .layer-panel { /* smaller, repositioned */ }
  .marker { width: 32px; height: 32px; font-size: 16px; }
}
```

**Step 3: Add touch support for timeline**

Horizontal swipe gesture for the timeline bar on mobile.

**Step 4: Test on mobile viewport**

Use browser dev tools to test at 375px (iPhone), 768px (iPad).

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add sources footer and mobile responsiveness"
```

---

### Task 11: Copy assets, push to GitHub, deploy to GitHub Pages

**Files:**
- Copy: `Grumet_map.jpg` to `lenape-bronx-map/assets/`
- Copy: `LENAPE_BRONX_MAP.md` to `lenape-bronx-map/`

**Step 1: Copy reference assets**

```bash
mkdir -p /Users/emilegiovannie/lenape-bronx-map/assets
cp "/Users/emilegiovannie/Documents/Lenape folder Document/Grumet_map.jpg" /Users/emilegiovannie/lenape-bronx-map/assets/
cp "/Users/emilegiovannie/Documents/Lenape folder Document/LENAPE_BRONX_MAP.md" /Users/emilegiovannie/lenape-bronx-map/
```

**Step 2: Create GitHub repo and push**

```bash
cd /Users/emilegiovannie/lenape-bronx-map
gh repo create lenape-bronx-map --public --source=. --push
```

**Step 3: Enable GitHub Pages**

```bash
gh api repos/EmileZounon/lenape-bronx-map/pages -X POST -f source.branch=main -f source.path=/
```

Or via GitHub Settings > Pages > Source: main branch, root directory.

**Step 4: Update README with the live URL**

Add: `Live site: https://EmileZounon.github.io/lenape-bronx-map/`

**Step 5: Final commit and push**

```bash
git add .
git commit -m "feat: add reference assets and deployment configuration"
git push
```

**Step 6: Verify deployment**

Visit the GitHub Pages URL. Confirm the map loads (user will need to replace `YOUR_API_KEY` and `YOUR_MAP_ID` in the HTML for full functionality).

---

### Task 12: Update documentation

**Files:**
- Modify: `lenape-bronx-map/README.md` — final documentation of what was built
- Modify: `lenape-bronx-map/LENAPE_BRONX_MAP.md` — add "Implementation Status" section

Per user preference: document what was built, update the .md file in the same folder as the build.

**Step 1: Update README.md**

Document:
- What this project is
- Full Google Maps API setup instructions (step by step with screenshots descriptions)
- How to get API key and Map ID
- How to restrict API key to the GitHub Pages domain
- How to run locally
- How to deploy
- Feature list with screenshots descriptions
- Data sources and credits

**Step 2: Commit**

```bash
git add README.md LENAPE_BRONX_MAP.md
git commit -m "docs: complete README with setup instructions and feature documentation"
git push
```
