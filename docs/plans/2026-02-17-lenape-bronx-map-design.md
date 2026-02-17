# Design: Pre-Colonial Lenape Settlements of the Bronx — Interactive Map

**Date:** 2026-02-17
**Status:** Implemented
**Live site:** https://emilezounon.github.io/lenape-bronx-map/
**Repository:** https://github.com/EmileZounon/lenape-bronx-map
**Hosting:** GitHub Pages
**Stack:** Single HTML/CSS/JS file + Google Maps JavaScript API

---

## Overview

An interactive map visualization documenting Indigenous Lenape geography in the Bronx before European contact (pre-1609). Overlays historical settlement data, trail routes, territory boundaries, ecological zones, and neighboring territories onto modern geography using Google Maps.

---

## Architecture

Single `index.html` file (~1,900 lines) with embedded CSS and JS. No build tools, no framework. Data embedded as JS objects. Google Maps API loaded via `<script>` tag. Deployed to GitHub Pages directly from the repo.

**Repository:** `lenape-bronx-map`
**Entry point:** `index.html`
**Assets:** `assets/` directory for reference images

---

## Google Maps API Configuration

- **API Key:** Configured and active (Maps JavaScript API)
- **Map ID:** `a9461ba5f543306b87fc900f` (Vector map, no tilt/rotation)
- **Map styling:** Cloud-based via Google Cloud Console (local JSON styling incompatible with `mapId` required by `AdvancedMarkerElement`)

---

## Map Layers (7 total, all toggleable)

| # | Layer | Google Maps Feature | Default |
|---|-------|-------------------|---------|
| 1 | **Settlements** (12 markers) | `AdvancedMarkerElement` with custom HTML emoji icons | ON |
| 2 | **Territories** (Weckquaesgeek blue, Siwanoy red) | `google.maps.Polygon` with semi-transparent fill | ON |
| 3 | **Bronx River / Aquahung** (territorial boundary) | `google.maps.Polyline` dashed cyan | ON |
| 4 | **Trails** (Wickquasgeck Trail, Shore Path, Wading Place) | `google.maps.Polyline` with waypoint markers | OFF |
| 5 | **Landmarks** (Grey Mare, Treaty Oak) | `AdvancedMarkerElement` | OFF |
| 6 | **Ecological Zones** (salt marshes, ridges, etc.) | `google.maps.Polygon` with pattern fills | OFF |
| 7 | **Neighboring Territories** (Wappinger, Sintsink, Canarsee, Rockaway) | `google.maps.Polygon` faded outlines | OFF |

---

## Data

### Settlements (12 sites with exact modern addresses)

Keskeskeck split into North and South per the full report. Each settlement has: id, name, meaning, territory, modernLocation (exact street address with zip code), coordinates, type, significance, icon, highlight flag.

| # | Name | Modern Address |
|---|------|---------------|
| 1 | Nipinichsen | 2300 Johnson Ave, Spuyten Duyvil, Bronx, NY 10463 |
| 2 | Keskeskeck (North) | Broadway & W 246th St, Van Cortlandt Park, Bronx, NY 10471 |
| 3 | Keskeskeck (South) | 1201 Ogden Ave, Highbridge, Bronx, NY 10452 |
| 4 | Riverdale Shell Middens | W 254th St & Spaulding Ln, Riverdale Park, Bronx, NY 10471 |
| 5 | Snakapins | Soundview Ave at Clason Point Park, Bronx, NY 10473 |
| 6 | Quinnahung | 123 Food Center Dr, Hunts Point, Bronx, NY 10474 |
| 7 | Laaphawachking | 1 Orchard Beach Rd, Hunter Island, Pelham Bay Park, Bronx, NY 10464 |
| 8 | Castle Hill | 2125 Randall Ave, Castle Hill, Bronx, NY 10473 |
| 9 | Throgs Neck Shell Heap | 528 Calhoun Ave, Throgs Neck, Bronx, NY 10465 |
| 10 | Ferry Point Burial Ground | 500 Hutchinson River Pkwy, Ferry Point Park, Bronx, NY 10465 |
| 11 | Bear Swamp | 1919 Haight Ave, Morris Park, Bronx, NY 10461 |
| 12 | 2015 Pelham Bay Discovery | Orchard Beach Rd, near Bartow-Pell Mansion, Pelham Bay Park, Bronx, NY 10464 |

### Trails (3 routes)

- Wickquasgeck Trail (Broadway) — 5 waypoints
- Shore Path (Boston Post Road) — 5 waypoints
- Wading Place / Paparinemin (Kingsbridge) — point marker

### Geographic Features

- Bronx River (Aquahung) — 9-point polyline path
- Grey Mare boulder, Treaty Oak

### Ecological Zones (6)

Salt marshes, dramatic ridges, tidal inlets, birch bark country, sedge grass plains, inland hunting grounds — approximate polygon regions.

### Neighboring Groups (4)

Wappinger (north), Sintsink (northwest), Canarsee (south), Rockaway (southeast) — outline polygons extending beyond Bronx borders.

### Timeline (10 events)

~4000 BCE through 2015, from LENAPE_BRONX_MAP.md.

### Statistics (6 figures)

14+ sites, 6000+ years, ~1800 Siwanoy population, 1782 last settlement, 60-70 lodges, 9160 acres.

---

## UI Layout

### Desktop (>768px)

- **Collapsible sidebar** (left, starts collapsed) — contains: search bar, territory filter, stats dashboard, settlement list, detail panel
- **Map** (fills remaining space)
- **Layer toggle panel** (bottom-right of map, collapsible)
- **Legend** (top-right, territories + settlement types)
- **Timeline** (fixed bottom bar, horizontally scrollable, keyboard navigable)
- **Sources button** (bottom-left, opens modal)

### Mobile (<=768px)

- **Sidebar** → full-width overlay with hamburger menu toggle and **close button (x)** in top-right
- **Detail panel** → **bottom sheet** sliding up from bottom (~55% of screen), map stays visible above
- **Timeline** → horizontally swipeable strip (60px height)
- **Layer toggles** → compact panel (180px min-width)
- **Legend** → hidden below 480px
- **Sources modal** → max-height 90vh

### Interactions

1. Click settlement marker → detail panel populated (desktop: sidebar opens; mobile: bottom sheet slides up)
2. Hover marker → tooltip with Lenape name + modern address
3. Territory filter (All / Weckquaesgeek / Siwanoy) → dims/highlights markers
4. Layer toggles → show/hide each of the 7 layers
5. Timeline event click → map flies to associated location, highlights settlement
6. Search bar → filter settlements by name or modern location
7. Highlighted sites (Snakapins, Laaphawachking, Bear Swamp, 2015 Discovery) → pulsing ring animation
8. Mobile sidebar close → x button dismisses sidebar back to map
9. Mobile bottom sheet close → x button dismisses detail back to map

---

## Visual Design

### Color Palette

| Element | Hex |
|---------|-----|
| Background | `#0f172a` |
| Surface | `#1e293b` |
| Border | `#334155` |
| Text Primary | `#e2e8f0` |
| Text Secondary | `#94a3b8` |
| Weckquaesgeek | `#3b82f6` |
| Siwanoy | `#ef4444` |
| Bronx River | `#22d3ee` |
| Trails | `#a855f7` |
| Landmarks | `#f59e0b` |
| Eco Zones | Varied greens/browns with low opacity |

### Typography

- Headings: Inter, 700 weight
- Body: Inter, 400 weight
- Data/coordinates: JetBrains Mono

### Favicon

Inline SVG emoji favicon (🏕) — no external file needed.

### Map Style

Cloud-based map styling configured via Google Cloud Console Map ID. Historical cartography feel while keeping streets readable.

---

## Accessibility

- All markers have aria-labels with settlement name and address
- Color is not the only indicator (icons + patterns for territory)
- Timeline keyboard navigable (arrow keys)
- Detail panel screen-reader accessible
- Minimum 44x44px touch targets on mobile
- Sufficient color contrast ratios (WCAG AA)
- Mobile bottom sheet has drag handle visual indicator

---

## File Structure

```
lenape-bronx-map/
├── index.html              # Everything: HTML, CSS, JS, all data (~1,900 lines)
├── assets/
│   └── Grumet_map.jpg      # Reference image from Grumet's "Manhattan to Minisink"
├── LENAPE_BRONX_MAP.md     # Original spec (for reference)
├── EXTRACTED_MAP_DATA.md   # Additional data extracted from research document
└── README.md               # Features, setup instructions, API key, deployment, credits
```

---

## Post-Implementation Changes

Changes made after initial build:

1. **Google Maps API key and Map ID configured** — replaced placeholders with live credentials
2. **Sources modal fix** — `display:flex` was overriding `hidden` attribute; added explicit `[hidden]` CSS rule
3. **Exact street addresses** — all 12 settlements updated from general neighborhoods to precise addresses with zip codes via reverse geocoding
4. **Mobile bottom sheet** — settlement details on mobile now slide up as a bottom sheet (~55% height) instead of taking over the full-screen sidebar; map stays visible
5. **Mobile sidebar close button** — added visible x button in top-right of sidebar on mobile (hidden on desktop)
6. **Favicon** — inline SVG emoji (🏕) for browser tab

---

## Future Enhancements (not in scope)

- Audio pronunciations of Lenape place names
- 3D terrain view
- Compare slider (1609 vs modern)
- Walking tour with GPS
- Educational quiz
- Cloud-based map styling for historical cartography aesthetic
