# Pre-Colonial Lenape Settlements of the Bronx

An interactive map visualization documenting Indigenous geography before European contact (pre-1609).

## Project Overview

Build an interactive web application that visualizes the documented Lenape (Lenni Lenape) settlement sites across the pre-colonial Bronx. The map should overlay historical settlement data onto modern geography, allowing users to explore the Indigenous history of the region.

### Key Features

- Interactive map with modern Bronx geography as the base layer
- Settlement markers with detailed information panels
- Territory visualization showing the Weckquaesgeek (west) and Siwanoy (east) division
- The Bronx River displayed as the territorial boundary
- Filtering by territory (Weckquaesgeek / Siwanoy / All)
- Timeline component showing key historical events
- Mobile-responsive design

---

## Settlement Data

### Territorial Context

The **Bronx River (Aquahung)** served as the territorial boundary between two Munsee-speaking Lenape bands of the Wappinger Confederacy:

| Territory | Location | Population (Pre-Contact) |
|-----------|----------|--------------------------|
| Weckquaesgeek | Western Bronx, Hudson River frontage | Part of ~15,000 Lenape in NYC area |
| Siwanoy | Eastern Bronx, Long Island Sound coast | ~1,800 (dropped to ~800 after Kieft's War) |

### Settlement Sites

```json
{
  "settlements": [
    {
      "id": 1,
      "name": "Nipinichsen",
      "meaning": "Fortified Stronghold",
      "territory": "Weckquaesgeek",
      "modernLocation": "Spuyten Duyvil",
      "coordinates": {
        "lat": 40.8781,
        "lng": -73.9219
      },
      "type": "fortified",
      "significance": "Strategic military site controlling the junction of the Harlem and Hudson Rivers. Warriors launched two dugout canoes from here to attack Henry Hudson's Half Moon in 1609, provoking a skirmish involving cannon and musket fire.",
      "icon": "🏰"
    },
    {
      "id": 2,
      "name": "Keskeskick",
      "meaning": "Salt Sedge-Marsh",
      "territory": "Weckquaesgeek",
      "modernLocation": "Van Cortlandt Park / University Heights",
      "coordinates": {
        "lat": 40.8839,
        "lng": -73.8986
      },
      "type": "major",
      "significance": "Major settlement district spanning from University Heights through Van Cortlandt Park. Subject of August 3, 1639 Dutch purchase deed from sachems Freequemeck, Rechgawar, and Packanmans. Archaeological shell middens from Late Woodland period discovered here. Settlement dates to approximately 14th-15th century.",
      "icon": "🏘️"
    },
    {
      "id": 3,
      "name": "Riverdale Shell Middens",
      "meaning": "Seasonal Shellfishing Site",
      "territory": "Weckquaesgeek",
      "modernLocation": "Riverdale Park",
      "coordinates": {
        "lat": 40.9003,
        "lng": -73.9136
      },
      "type": "seasonal",
      "significance": "Late Woodland Period (300-1000 CE) shell middens discovered during a 1985 Wave Hill archaeological investigation. Evidence of seasonal Hudson shoreline use for shellfishing.",
      "icon": "🐚"
    },
    {
      "id": 4,
      "name": "Snakapins",
      "meaning": "Land by Two Waters",
      "alternativeMeaning": "Ground Nuts",
      "territory": "Siwanoy",
      "modernLocation": "Clasons Point",
      "coordinates": {
        "lat": 40.8058,
        "lng": -73.8494
      },
      "type": "major",
      "significance": "ONE OF THE LARGEST NATIVE AMERICAN SETTLEMENTS IN NYC: approximately 60-70 lodges. Located near the intersection of Soundview Avenue and Leland Avenue. Extensively excavated by Alanson Skinner in 1918-1919 for the Museum of the American Indian. Thomas Cornell purchased the site in 1642; during Kieft's War the following year, the Siwanoy burned his farm. In 2024, the MTA installed artwork by Shervone Neckles at Westchester Sq-East Tremont Ave station titled 'The Land Between Open Water' referencing Snakapins.",
      "icon": "🏘️",
      "highlight": true
    },
    {
      "id": 5,
      "name": "Quinnahung",
      "meaning": "Long High Place",
      "alternativeMeaning": "Planting Neck",
      "territory": "Siwanoy",
      "modernLocation": "Hunts Point",
      "coordinates": {
        "lat": 40.8095,
        "lng": -73.8774
      },
      "type": "agricultural",
      "significance": "Settlement at Hunts Point, across the Bronx River from Snakapins and functioning as its sister village. The tip of Hunts Point served as an important meeting place with agricultural planting grounds. Archaeological evidence includes six projectile points and a stone celt found near a former freshwater spring.",
      "icon": "🌾"
    },
    {
      "id": 6,
      "name": "Laaphawachking",
      "meaning": "Place of Stringing Beads",
      "territory": "Siwanoy",
      "modernLocation": "Hunter Island, Pelham Bay Park",
      "coordinates": {
        "lat": 40.8714,
        "lng": -73.7906
      },
      "type": "economic",
      "significance": "MAJOR WAMPUM PRODUCTION CENTER where artisans worked shells gathered along the Sound coastline into the currency that powered regional trade networks. Stockaded settlement governed by Sachem Wampage I (Anhōōke) circa 1640; his son Wampage II maintained a fortified 'castle' on Hunter Island into the late 17th century. The Grey Mare, a glacial erratic boulder on the northwestern shore, was believed placed by the Siwanoy's guardian Manitou. The 1654 Pell Treaty was signed under the Treaty Oak here, ceding 9,160 acres to Thomas Pell.",
      "icon": "💎",
      "highlight": true
    },
    {
      "id": 7,
      "name": "Castle Hill",
      "meaning": "Wampum Production Site",
      "territory": "Siwanoy",
      "modernLocation": "Castle Hill Peninsula",
      "coordinates": {
        "lat": 40.8192,
        "lng": -73.8506
      },
      "type": "economic",
      "significance": "Settlement on the peninsula near Westchester Creek, notable for a large shell-heap used for wampum bead production — part of the broader coastal wampum economy that made the Bronx's Sound-facing shoreline economically significant across the region.",
      "icon": "💎"
    },
    {
      "id": 8,
      "name": "Throgs Neck Shell Heap",
      "meaning": "Post-1642 Encampment",
      "territory": "Siwanoy",
      "modernLocation": "Weir Creek, Throgs Neck",
      "coordinates": {
        "lat": 40.8226,
        "lng": -73.8213
      },
      "type": "seasonal",
      "significance": "Encampment established after the community relocated from Snakapins following Cornell's 1642 purchase. Skinner's 1919 excavation revealed a substantial shell midden of oyster shells mixed with hard clams, scallops, mussels, and whelk, along with stone spearheads, pottery shards, and human remains.",
      "icon": "🐚"
    },
    {
      "id": 9,
      "name": "Ferry Point Burial Ground",
      "meaning": "Regional Mortuary Site",
      "territory": "Siwanoy",
      "modernLocation": "Ferry Point Park",
      "coordinates": {
        "lat": 40.8186,
        "lng": -73.8329
      },
      "type": "ceremonial",
      "significance": "Regional mortuary site where Siwanoy brought their dead from settlements further inland. Located near fishing camps at Locust Point in the Throgs Neck area.",
      "icon": "⚱️"
    },
    {
      "id": 10,
      "name": "Bear Swamp",
      "meaning": "Last Recorded Settlement",
      "territory": "Siwanoy",
      "modernLocation": "Morris Park",
      "coordinates": {
        "lat": 40.8520,
        "lng": -73.8553
      },
      "type": "historical",
      "significance": "The LAST RECORDED Siwanoy settlement in the Bronx, persisting until approximately 1782. Marks the end of continuous Indigenous habitation in the borough.",
      "icon": "📜",
      "highlight": true
    },
    {
      "id": 11,
      "name": "2015 Pelham Bay Discovery",
      "meaning": "Archaeological Site",
      "territory": "Siwanoy",
      "modernLocation": "Pelham Bay Park Waterfront",
      "coordinates": {
        "lat": 40.8650,
        "lng": -73.8050
      },
      "type": "archaeological",
      "significance": "In 2015, construction at the Pelham Bay Park waterfront unearthed over 100 Native American artifacts — ceramics, stone tools, and chert projectile points dating to 200-1000 CE. Amanda Sutphin, the NYC Landmarks Preservation Commission's Director of Archaeology, called it 'one of the most important archaeological finds in New York City history.' Classified as a Middle Woodland semi-permanent encampment.",
      "icon": "🔍",
      "highlight": true
    }
  ]
}
```

### Settlement Types

| Type | Icon | Description |
|------|------|-------------|
| fortified | 🏰 | Military/defensive stronghold |
| major | 🏘️ | Large residential village |
| economic | 💎 | Wampum production/trade center |
| agricultural | 🌾 | Farming/planting grounds |
| ceremonial | ⚱️ | Burial ground or sacred site |
| seasonal | 🐚 | Seasonal fishing/shellfishing camp |
| historical | 📜 | Historically significant site |
| archaeological | 🔍 | Modern archaeological discovery |

---

## Historical Timeline

```json
{
  "timeline": [
    {
      "date": "~4000 BCE",
      "event": "Earliest Evidence",
      "description": "Earliest archaeological evidence of human habitation in the Bronx region"
    },
    {
      "date": "200-1000 CE",
      "event": "Woodland Period",
      "description": "Woodland Period settlements established; ceramics and agriculture develop"
    },
    {
      "date": "1609",
      "event": "First Contact",
      "description": "First European contact with Henry Hudson; Nipinichsen warriors attack the Half Moon"
    },
    {
      "date": "August 3, 1639",
      "event": "Keskeskick Purchase",
      "description": "Dutch West India Company purchases Keskeskick from Weckquaesgeek sachems Freequemeck, Rechgawar, and Packanmans"
    },
    {
      "date": "1642",
      "event": "Snakapins Purchase",
      "description": "Thomas Cornell purchases Snakapins (Clasons Point) from the Siwanoy"
    },
    {
      "date": "1643-1645",
      "event": "Kieft's War",
      "description": "Devastating conflict; Siwanoy population drops from ~1,800 to ~800. Snakapins burned."
    },
    {
      "date": "1654",
      "event": "Pell Treaty",
      "description": "Treaty signed at Hunter Island under the Treaty Oak; 9,160 acres ceded to Thomas Pell"
    },
    {
      "date": "1782",
      "event": "Last Settlement",
      "description": "Last recorded Siwanoy settlement at Bear Swamp, Morris Park — end of continuous Indigenous habitation"
    },
    {
      "date": "1918-1919",
      "event": "Skinner Excavations",
      "description": "Alanson Skinner excavates Throgs Neck and Clasons Point for the Museum of the American Indian"
    },
    {
      "date": "1922",
      "event": "Bolton's Maps",
      "description": "Reginald Pelham Bolton publishes 'Indian Paths in the Great Metropolis' with 12 detailed maps"
    },
    {
      "date": "2015",
      "event": "Major Discovery",
      "description": "100+ artifacts discovered at Pelham Bay Park — called 'one of the most important archaeological finds in NYC history'"
    }
  ]
}
```

---

## Key Statistics

```json
{
  "statistics": [
    {
      "value": "14+",
      "label": "Documented Settlement Sites"
    },
    {
      "value": "6,000+",
      "label": "Years of Continuous Habitation"
    },
    {
      "value": "~1,800",
      "label": "Siwanoy Population (Pre-Contact)"
    },
    {
      "value": "1782",
      "label": "Last Recorded Settlement"
    },
    {
      "value": "60-70",
      "label": "Lodges at Snakapins (Largest Village)"
    },
    {
      "value": "9,160",
      "label": "Acres Ceded in 1654 Pell Treaty"
    }
  ]
}
```

---

## Technical Requirements

### Recommended Stack

- **Framework**: Next.js 14+ or React 18+
- **Mapping**: Mapbox GL JS, Leaflet, or Google Maps API
- **Styling**: Tailwind CSS
- **Icons**: Lucide React or custom emoji rendering
- **Animations**: Framer Motion (optional)

### Core Components

```
src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.tsx       # Main map wrapper
│   │   ├── SettlementMarker.tsx   # Individual settlement pins
│   │   ├── TerritoryOverlay.tsx   # Weckquaesgeek/Siwanoy shading
│   │   └── BronxRiverLine.tsx     # Territorial boundary
│   ├── Sidebar/
│   │   ├── SettlementDetail.tsx   # Selected settlement info panel
│   │   ├── TerritoryFilter.tsx    # Filter by territory
│   │   └── SearchBar.tsx          # Search settlements
│   ├── Timeline/
│   │   └── HistoricalTimeline.tsx # Horizontal scrolling timeline
│   └── Stats/
│       └── StatisticsBar.tsx      # Key figures display
├── data/
│   ├── settlements.json           # All settlement data
│   └── timeline.json              # Historical events
├── hooks/
│   └── useMapInteraction.ts       # Map state management
└── styles/
    └── globals.css                # Custom styles
```

### Map Configuration

```javascript
// Bronx bounding box for initial view
const BRONX_BOUNDS = {
  center: [-73.8648, 40.8448],
  zoom: 12,
  minZoom: 10,
  maxZoom: 16
};

// Territory polygon coordinates (simplified)
const WECKQUAESGEEK_TERRITORY = {
  color: '#1e40af',
  opacity: 0.15,
  // Western Bronx - approximate boundary along Bronx River
};

const SIWANOY_TERRITORY = {
  color: '#991b1b', 
  opacity: 0.15,
  // Eastern Bronx - approximate boundary along Bronx River
};

// Bronx River path (territorial boundary)
const BRONX_RIVER_PATH = {
  color: '#22d3ee',
  width: 3,
  dashArray: [8, 4],
  // Approximate path from Westchester County south to East River
};
```

---

## Design Specifications

### Color Palette

| Element | Hex | Usage |
|---------|-----|-------|
| Background (Dark) | `#0f172a` | Main background |
| Surface | `#1e293b` | Cards, panels |
| Border | `#334155` | Subtle borders |
| Text Primary | `#e2e8f0` | Main text |
| Text Secondary | `#94a3b8` | Subtitles, labels |
| Text Muted | `#64748b` | Captions |
| Weckquaesgeek | `#1e40af` (dark) / `#3b82f6` (light) | Western territory |
| Siwanoy | `#991b1b` (dark) / `#ef4444` (light) | Eastern territory |
| Bronx River | `#22d3ee` | Territorial boundary |
| Accent | `#22d3ee` | Highlights, stats |

### Typography

- **Headings**: Inter, 700-800 weight
- **Body**: Inter, 400-500 weight
- **Monospace**: JetBrains Mono (for coordinates, dates)

### Responsive Breakpoints

- **Mobile**: < 768px — Collapsible sidebar, bottom sheet for details
- **Tablet**: 768px - 1024px — Side panel, reduced map controls
- **Desktop**: > 1024px — Full sidebar, all controls visible

---

## User Interactions

### Map Interactions

1. **Click marker** → Open detail panel with settlement info
2. **Hover marker** → Show tooltip with name and modern location
3. **Click territory filter** → Highlight/dim settlements by territory
4. **Click Bronx River** → Show info about territorial boundary

### Detail Panel

When a settlement is selected, display:
- Settlement name (Lenape)
- Meaning/translation
- Territory affiliation (with color indicator)
- Modern location
- Settlement type with icon
- Historical significance (full text)
- Coordinates (for reference)

### Timeline Interactions

- Horizontal scroll through events
- Click event → Highlight associated settlement(s) on map
- Optional: Filter map to show only sites relevant to selected time period

---

## Primary Sources

Include a sources/references section with links to:

### Historical Maps (Public Domain)
- Bolton's "Indian Paths in the Great Metropolis" (1922) — Internet Archive, Smithsonian, NYPL Digital Collections
- Bolton's "New York City in Indian Possession" (1920)
- Skinner's excavation reports (1919) — Smithsonian Libraries

### Modern Resources
- NYC Landmarks Preservation Commission Archaeological Map
- Welikia Project (welikia.org) — 1609 ecology reconstruction
- Bronx County Historical Society / Museum of Bronx History

### Academic Sources
- Cantwell & Wall, "Unearthing Gotham" (Yale, 2001)
- Grumet, "Manhattan to Minisink" (2013)
- Gilbert, "Digging the Bronx" (2018)

---

## Accessibility Requirements

- All markers must have aria-labels with settlement name
- Color is not the only indicator of territory (use icons/patterns)
- Timeline is keyboard navigable
- Detail panel content is screen-reader accessible
- Minimum touch target size: 44x44px for mobile

---

## Deployment

Recommended: Vercel or Netlify for static deployment

```bash
# Environment variables needed
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
# OR
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key
```

---

## License

Historical data is compiled from public domain sources (Bolton 1922, Skinner 1919) and publicly available archaeological records. Map implementation code can be MIT licensed.

---

## Future Enhancements

- [ ] Add audio pronunciations of Lenape place names
- [ ] 3D terrain view showing original landscape
- [ ] Compare/contrast slider with 1609 vs modern geography
- [ ] Walking tour mode with GPS integration
- [ ] Educational quiz component
- [ ] Print-friendly map export
- [ ] Embed code for other websites
