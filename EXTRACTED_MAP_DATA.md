# Extracted Map Data from Full Report - Lenape Pre-Colonial

Data extracted from `Full Report - Lenape Pre Colonial.docx` on 2026-02-17.
Purpose: Supplement the existing 11 settlement sites in `LENAPE_BRONX_MAP.md` with all additional map-relevant data from the full report.

---

## 1. Additional Settlement Sites NOT in LENAPE_BRONX_MAP.md

The full report's Village Site Overlay Index lists 6 named sites. Cross-referencing against the 11 in `LENAPE_BRONX_MAP.md`, the report introduces **one site split** that the existing data treats as a single entry, plus confirms a neighboring-group settlement:

```json
{
  "additional_or_modified_settlements": [
    {
      "note": "SPLIT: The report treats Keskeskeck as TWO distinct sites (North and South) rather than one",
      "sites": [
        {
          "name": "Keskeskeck (North)",
          "modernLocation": "Van Cortlandt Park",
          "streetOverlay": "Parade Ground area; Broadway at W 233rd St",
          "approximate_coordinates": {
            "lat": 40.8900,
            "lng": -73.8986
          },
          "territory": "Weckquaesgeek",
          "description": "Northern extent of the Keskeskeck settlement district within Van Cortlandt Park. 19th-century excavations revealed circular wigwams and indoor hearths used for seasonal burials.",
          "type": "major"
        },
        {
          "name": "Keskeskeck (South)",
          "modernLocation": "Highbridge / University Heights",
          "streetOverlay": "South of W 167th St; near Cromwell's Creek",
          "approximate_coordinates": {
            "lat": 40.8380,
            "lng": -73.9270
          },
          "territory": "Weckquaesgeek",
          "description": "Southern extent of the Keskeskeck settlement district, near Cromwell's Creek in the Highbridge/University Heights area. Part of the 'sedge grass plains' landscape.",
          "type": "major"
        }
      ]
    },
    {
      "note": "NEIGHBORING GROUP: The Canarsee are listed in the territorial table as holding southern Manhattan / Brooklyn",
      "name": "Canarsee Territory (Southern Manhattan / Brooklyn)",
      "modernLocation": "Southern Manhattan / Brooklyn",
      "territory": "Canarsee",
      "key_waterways": ["East River", "Upper New York Bay"],
      "neighboring_groups": ["Weckquaesgeek", "Rockaway"],
      "relevance": "Neighboring territory that traded with and bordered the Bronx-based bands. Not within Bronx boundaries but relevant for trade/connection overlays."
    }
  ]
}
```

---

## 2. Trail Routes / Paths with Geographic Descriptions

```json
{
  "trails": [
    {
      "id": "trail_1",
      "indigenous_name": "Wickquasgeck Trail",
      "modern_equivalent": "Broadway",
      "type": "primary north-south artery",
      "territory": "Weckquaesgeek",
      "description": "The primary north-south artery for the Weckquaesgeek people, connecting the 'birch bark country' (northern forested interior) to Manhattan. This was the main overland route through western Bronx territory.",
      "significance": "Main communication and travel route for the Weckquaesgeek band. Later became the basis for modern Broadway.",
      "approximate_path_waypoints": [
        {"label": "Northern terminus (Birch bark country)", "lat": 40.905, "lng": -73.907},
        {"label": "Van Cortlandt / Keskeskeck North", "lat": 40.890, "lng": -73.899},
        {"label": "Kingsbridge", "lat": 40.878, "lng": -73.907},
        {"label": "Spuyten Duyvil approach", "lat": 40.878, "lng": -73.922},
        {"label": "Into Manhattan via Harlem", "lat": 40.870, "lng": -73.927}
      ]
    },
    {
      "id": "trail_2",
      "indigenous_name": "Shore Path",
      "modern_equivalent": "Boston Post Road / Pelham Parkway",
      "type": "coastal east-west connector",
      "territory": "Siwanoy",
      "description": "Used by the Siwanoy to navigate between coastal summer settlements and inland hunting grounds. Followed the eastern coastline and connected Sound-facing villages.",
      "significance": "Enabled seasonal migration between coastal shellfish camps (summer) and inland hunting territories (winter).",
      "approximate_path_waypoints": [
        {"label": "Pelham Bay / Laaphawachking", "lat": 40.871, "lng": -73.791},
        {"label": "Mid-Pelham Parkway", "lat": 40.858, "lng": -73.855},
        {"label": "Westchester Square area", "lat": 40.839, "lng": -73.845},
        {"label": "Castle Hill", "lat": 40.819, "lng": -73.851},
        {"label": "Clason Point / Snakapins", "lat": 40.806, "lng": -73.849}
      ]
    },
    {
      "id": "trail_3",
      "indigenous_name": "The Wading Place / Paparinemin",
      "modern_equivalent": "Kingsbridge",
      "type": "river crossing / ford",
      "territory": "Weckquaesgeek",
      "description": "The critical crossing point at the Spuyten Duyvil ford. Known by the Lenape name Paparinemin. This was the key land-bridge connecting the Bronx mainland to Manhattan Island.",
      "significance": "Controlled by the Nipinichsen village. The only practical low-tide crossing between the Bronx and Manhattan in the pre-colonial period.",
      "approximate_coordinates": {
        "lat": 40.8781,
        "lng": -73.9219
      }
    }
  ]
}
```

---

## 3. Geographic Features with Lenape Names

```json
{
  "geographic_features": {
    "rivers_and_waterways": [
      {
        "lenape_name": "Aquahung",
        "modern_name": "Bronx River",
        "type": "river",
        "significance": "Central axis of the borough. Served as both a vital resource and the geographical marker separating the inland hunting grounds from the coastal habitation sites. THE territorial boundary between the Siwanoy (east) and Weckquaesgeek (west).",
        "approximate_path": [
          {"label": "Northern entry from Westchester", "lat": 40.898, "lng": -73.870},
          {"label": "Bronx Zoo area", "lat": 40.852, "lng": -73.878},
          {"label": "Hunts Point confluence / mouth", "lat": 40.810, "lng": -73.877}
        ]
      },
      {
        "lenape_name": null,
        "modern_name": "Harlem River",
        "type": "river / tidal strait",
        "significance": "Western boundary waterway. Part of the Weckquaesgeek domain. Separates the Bronx from Manhattan.",
        "territory": "Weckquaesgeek"
      },
      {
        "lenape_name": "Saeck Kill",
        "modern_name": "Unknown modern equivalent (possibly a creek in the western Bronx)",
        "type": "creek / kill",
        "significance": "Listed as a key waterway of the Weckquaesgeek territory. The Dutch term 'kill' (creek) was appended to the Lenape name.",
        "territory": "Weckquaesgeek"
      },
      {
        "lenape_name": null,
        "modern_name": "Hudson River",
        "type": "major river",
        "significance": "Western boundary of Weckquaesgeek territory. Riverdale Shell Middens indicate seasonal use of the Hudson shoreline for shellfishing.",
        "territory": "Weckquaesgeek"
      },
      {
        "lenape_name": null,
        "modern_name": "East River",
        "type": "tidal strait",
        "significance": "Shared waterway between Siwanoy and Canarsee territories. Connected Quinnahung (Hunts Point) to broader waterborne trade networks.",
        "territories": ["Siwanoy", "Canarsee"]
      },
      {
        "lenape_name": null,
        "modern_name": "Long Island Sound",
        "type": "coastal body",
        "significance": "Eastern boundary of Siwanoy territory. Primary source of shellfish for wampum production and food. Defined the coastal character of the eastern Bronx settlements.",
        "territory": "Siwanoy"
      },
      {
        "lenape_name": null,
        "modern_name": "Pugsley's Creek",
        "type": "creek",
        "significance": "Adjacent to Snakapins (Clason Point). Part of the 'two waters' referenced in the Snakapins name.",
        "territory": "Siwanoy",
        "approximate_coordinates": {"lat": 40.806, "lng": -73.849}
      },
      {
        "lenape_name": null,
        "modern_name": "Cromwell's Creek",
        "type": "creek",
        "significance": "Near the southern extent of Keskeskeck (South) settlement. Landmark reference in the report's overlay index.",
        "territory": "Weckquaesgeek",
        "approximate_coordinates": {"lat": 40.837, "lng": -73.927}
      },
      {
        "lenape_name": null,
        "modern_name": "Westchester Creek",
        "type": "creek",
        "significance": "Near Castle Hill Peninsula settlement. Associated with wampum production shell heaps.",
        "territory": "Siwanoy"
      },
      {
        "lenape_name": null,
        "modern_name": "Weir Creek",
        "type": "creek",
        "significance": "Location of the Throgs Neck Shell Heap encampment. Name suggests possible fish weir usage.",
        "territory": "Siwanoy",
        "approximate_coordinates": {"lat": 40.823, "lng": -73.821}
      }
    ],
    "hills_and_ridges": [
      {
        "name": "Spuyten Duyvil Hill",
        "modern_location": "Henry Hudson Memorial Park, Spuyten Duyvil",
        "significance": "Site of Nipinichsen fortified village. Dramatic ridge overlooking the Hudson River. Controlled the wading place at Paparinemin.",
        "approximate_coordinates": {"lat": 40.878, "lng": -73.922}
      },
      {
        "name": "Hill-and-ridge terrain (northern Bronx)",
        "description": "The report describes the northern reaches of the borough as characterized by 'hill-and-ridge' terrain that defined the boundaries between the Siwanoy and Weckquaesgeek bands.",
        "significance": "Natural topographic boundary markers between indigenous political units."
      }
    ],
    "notable_landmarks": [
      {
        "name": "The Grey Mare",
        "type": "glacial erratic boulder",
        "location": "Northwestern shore of Hunter Island, Pelham Bay Park",
        "significance": "Believed by the Siwanoy to have been placed by their guardian Manitou (spirit). Cultural/spiritual landmark.",
        "approximate_coordinates": {"lat": 40.872, "lng": -73.792}
      },
      {
        "name": "Treaty Oak",
        "type": "historical tree",
        "location": "Hunter Island, Pelham Bay Park",
        "significance": "The 1654 Pell Treaty was signed under this tree, ceding 9,160 acres to Thomas Pell.",
        "approximate_coordinates": {"lat": 40.871, "lng": -73.791}
      },
      {
        "name": "Drake Cemetery area",
        "type": "historical landmark",
        "location": "Hunts Point Ave at East 163rd St",
        "significance": "Street overlay reference for the Quinnahung settlement site.",
        "approximate_coordinates": {"lat": 40.810, "lng": -73.877}
      }
    ],
    "coastal_features": [
      {
        "name": "Salt marshes of the Long Island Sound",
        "type": "wetland / salt marsh",
        "location": "Eastern Bronx coastline",
        "significance": "Part of the 'diverse environmental mosaic' described in the report. Defined the ecological character of Siwanoy territory."
      },
      {
        "name": "Tidal inlets (eastern Bronx)",
        "type": "tidal inlet system",
        "location": "Eastern coastal strip",
        "significance": "The Siwanoy inhabited a region 'defined by tidal inlets and marine resources.'"
      }
    ]
  }
}
```

---

## 4. Population Figures and Demographic Data

```json
{
  "demographics": {
    "regional_population": {
      "lenape_total_nyc_area": "~15,000 (pre-contact estimate)",
      "source": "Referenced in territorial context table"
    },
    "siwanoy": {
      "pre_contact_population": "~1,800",
      "post_kiefts_war_population": "~800",
      "population_decline_percent": "~55.6%",
      "decline_cause": "Kieft's War (1643-1645)",
      "largest_settlement": {
        "name": "Snakapins",
        "dwellings": "70+ (described as 'over seventy dwellings')",
        "estimated_population_per_dwelling": "8-15 persons (standard Eastern Woodland estimate)",
        "estimated_village_population": "560-1050 persons"
      }
    },
    "weckquaesgeek": {
      "pre_contact_population": "Part of ~15,000 regional total (specific number not given)",
      "note": "Population subsumed within the broader 15,000 Lenape NYC-area figure"
    },
    "canarsee": {
      "territory": "Southern Manhattan / Brooklyn",
      "note": "Neighboring group; no specific population figures given in this report"
    },
    "social_organization": {
      "kinship_system": "Matrilineal clans",
      "property_inheritance": "Through the mother's line",
      "political_inheritance": "Through the mother's line",
      "political_structure": "Decentralized — significant local autonomy while maintaining cohesive cultural identity",
      "cultural_cohesion": "Shared religious practices and ecological management"
    },
    "named_leaders": [
      {
        "name": "Freequemeck",
        "role": "Sachem",
        "territory": "Weckquaesgeek",
        "event": "Signatory of August 3, 1639 Dutch purchase deed for Keskeskick"
      },
      {
        "name": "Rechgawar",
        "role": "Sachem",
        "territory": "Weckquaesgeek",
        "event": "Signatory of August 3, 1639 Dutch purchase deed for Keskeskick"
      },
      {
        "name": "Packanmans",
        "role": "Sachem",
        "territory": "Weckquaesgeek",
        "event": "Signatory of August 3, 1639 Dutch purchase deed for Keskeskick"
      },
      {
        "name": "Wampage I (Anhooke)",
        "role": "Sachem",
        "territory": "Siwanoy",
        "event": "Governed the stockaded settlement at Laaphawachking circa 1640"
      },
      {
        "name": "Wampage II",
        "role": "Sachem (son of Wampage I)",
        "territory": "Siwanoy",
        "event": "Maintained a fortified 'castle' on Hunter Island into the late 17th century"
      }
    ]
  }
}
```

---

## 5. Ecological / Environmental Details (Pre-Colonial Landscape)

```json
{
  "ecology": {
    "landscape_description": "The Bronx was not a monolithic wilderness but a diverse environmental mosaic, ranging from the salt marshes of the Long Island Sound to the dramatic ridges overlooking the Hudson River.",
    "biome": "Eastern Woodlands",
    "landscape_zones": [
      {
        "zone": "Salt marshes",
        "location": "Long Island Sound coast (eastern Bronx)",
        "territory": "Siwanoy",
        "resources": "Shellfish (oysters, hard clams, scallops, mussels, whelk), marine resources"
      },
      {
        "zone": "Dramatic ridges",
        "location": "Hudson River frontage (western Bronx)",
        "territory": "Weckquaesgeek",
        "resources": "Defensive high ground, overlook positions"
      },
      {
        "zone": "Tidal inlets",
        "location": "Eastern coastal strip",
        "territory": "Siwanoy",
        "resources": "Marine resources, shellfish beds"
      },
      {
        "zone": "Birch bark country",
        "location": "Northern interior (referenced by Wickquasgeck Trail name)",
        "territory": "Weckquaesgeek",
        "resources": "Birch bark for canoe construction and other uses"
      },
      {
        "zone": "Sedge grass plains",
        "location": "Van Cortlandt Park / Keskeskeck area",
        "territory": "Weckquaesgeek",
        "resources": "The name Keskeskeck means 'salt sedge-marsh', indicating wetland grasslands"
      },
      {
        "zone": "Inland hunting grounds",
        "location": "Interior, away from coast",
        "territory": "Both",
        "resources": "Game animals, winter hunting territory"
      },
      {
        "zone": "Fertile coasts",
        "location": "Eastern Woodlands coastal areas",
        "territory": "Siwanoy",
        "resources": "Agricultural potential, shellfish, fish"
      }
    ],
    "welikia_project_data": {
      "description": "The Welikia Project created a Digital Elevation Model (DEM) of the city as it appeared in 1609 by georeferencing over 600 historical maps.",
      "methodology": "Uses 'Muir Webs' — computational networks representing the relationships between species, habitats, and abiotic factors like soil and freshwater access.",
      "application": "Allows researchers to deduce likely locations of Lenape settlements based on ecological suitability.",
      "url": "https://www.welikia.org/map-explorer"
    },
    "shell_species_found_archaeologically": [
      "Oyster shells",
      "Hard clams",
      "Scallops",
      "Mussels",
      "Whelk"
    ],
    "managed_ecosystems_note": "The report describes 'managed ecosystems' indicating that the Lenape actively shaped their environment through ecological management practices (burning, clearing, planting)."
  }
}
```

---

## 6. Coordinates and Location Descriptions (Report's Overlay Table)

```json
{
  "report_overlay_index": {
    "note": "These are the street/landmark overlays from the report's 'Village Site Overlay Index' table — some provide more precise street-level references than the existing LENAPE_BRONX_MAP.md coordinates.",
    "sites": [
      {
        "indigenous_name": "Nipinichsen",
        "modern_context": "Spuyten Duyvil",
        "street_overlay": "Spuyten Duyvil Hill; Henry Hudson Memorial Park",
        "existing_in_map_md": true
      },
      {
        "indigenous_name": "Keskeskeck (North)",
        "modern_context": "Van Cortlandt Park",
        "street_overlay": "Parade Ground area; Broadway at W 233rd St",
        "existing_in_map_md": "Partially (merged as one Keskeskick entry)"
      },
      {
        "indigenous_name": "Keskeskeck (South)",
        "modern_context": "Highbridge / University Heights",
        "street_overlay": "South of W 167th St; near Cromwell's Creek",
        "existing_in_map_md": "Partially (merged as one Keskeskick entry)"
      },
      {
        "indigenous_name": "Snakapins",
        "modern_context": "Clason Point",
        "street_overlay": "Soundview Ave; Pugsley's Creek Park",
        "existing_in_map_md": true
      },
      {
        "indigenous_name": "Quinnahung",
        "modern_context": "Hunts Point",
        "street_overlay": "Hunts Point Ave at East 163rd St; Drake Cemetery",
        "existing_in_map_md": true
      },
      {
        "indigenous_name": "Laaphawachking",
        "modern_context": "Pelham Bay",
        "street_overlay": "Hunter Island and Orchard Beach area",
        "existing_in_map_md": true
      }
    ]
  }
}
```

---

## 7. Weckquaesgeek and Siwanoy Territory Details

```json
{
  "territories": {
    "weckquaesgeek": {
      "name": "Weckquaesgeek",
      "language": "Munsee dialect of Algonquian",
      "broader_affiliation": "Munsee-speaking Lenape",
      "primary_bronx_territory": "West Bronx, Riverdale, Spuyten Duyvil",
      "key_waterways": ["Hudson River", "Harlem River", "Saeck Kill"],
      "neighboring_groups": ["Sintsink", "Canarsee", "Siwanoy"],
      "eastern_boundary": "Aquahung (Bronx River)",
      "western_boundary": "Hudson River",
      "southern_boundary": "Harlem River",
      "landscape": "Dramatic ridges overlooking Hudson; birch bark country to the north; sedge grass plains at Keskeskeck",
      "trail_name_meaning": "'Birch bark country' — Wickquasgeck Trail named after the birch forests of their territory",
      "settlements_in_report": ["Nipinichsen", "Keskeskeck (North)", "Keskeskeck (South)"],
      "key_features": [
        "Controlled the Paparinemin wading place (Kingsbridge crossing)",
        "Warriors challenged Henry Hudson's Half Moon in 1609",
        "Seasonal shellfishing along Hudson River (Riverdale Shell Middens)"
      ]
    },
    "siwanoy": {
      "name": "Siwanoy",
      "language": "Munsee dialect of Algonquian",
      "broader_affiliation": "Munsee-speaking Lenape",
      "primary_bronx_territory": "East Bronx, Pelham Bay, Clason Point",
      "key_waterways": ["Long Island Sound", "East River", "Aquahung (Bronx River)"],
      "neighboring_groups": ["Wappinger", "Weckquaesgeek"],
      "western_boundary": "Aquahung (Bronx River)",
      "eastern_boundary": "Long Island Sound",
      "landscape": "Tidal inlets, salt marshes, coastal peninsulas, marine-resource-rich coastline",
      "settlements_in_report": ["Snakapins", "Quinnahung", "Laaphawachking"],
      "key_features": [
        "Major wampum production economy along Sound coastline",
        "Largest village in NYC area at Snakapins (70+ dwellings)",
        "Population devastated by Kieft's War (1,800 to 800)",
        "Stockaded settlement at Hunter Island governed by Sachem Wampage I",
        "Last Siwanoy settlement at Bear Swamp persisted until 1782"
      ],
      "social_organization": "Matrilineal clans; decentralized with local autonomy"
    },
    "territory_boundary": {
      "feature": "Aquahung (Bronx River)",
      "description": "The central axis of the borough acting as both vital resource and geographical marker separating inland hunting grounds from coastal habitation sites.",
      "boundary_type": "Natural topographic — the 'hill-and-ridge' terrain defined boundaries"
    }
  }
}
```

---

## 8. Trade Routes and Economic Connections

```json
{
  "economy_and_trade": {
    "wampum_economy": {
      "description": "The Bronx's Sound-facing shoreline was economically significant across the entire Eastern Woodlands region due to wampum production.",
      "production_centers": [
        {
          "site": "Laaphawachking (Hunter Island)",
          "meaning": "Place of Stringing Beads",
          "activity": "Artisans worked shells gathered along the Sound coastline into wampum currency",
          "uses": "Currency and diplomacy across the Eastern Woodlands"
        },
        {
          "site": "Castle Hill Peninsula",
          "activity": "Large shell-heap used for wampum bead production",
          "note": "Part of the broader coastal wampum economy"
        }
      ],
      "raw_materials": "Shells from Long Island Sound coastline (whelk and quahog/hard clam shells)",
      "trade_reach": "Used for currency and diplomacy across the Eastern Woodlands"
    },
    "shellfish_economy": {
      "sites": [
        "Snakapins (Clason Point) — massive shell middens indicating centuries of reliance",
        "Riverdale Shell Middens — seasonal Hudson shoreline shellfishing",
        "Throgs Neck Shell Heap — oyster shells, hard clams, scallops, mussels, whelk"
      ],
      "species": ["Oysters", "Hard clams (quahog)", "Scallops", "Mussels", "Whelk"]
    },
    "trade_connections": {
      "neighboring_groups_table": [
        {"group": "Wappinger", "relation": "Neighbors to the Siwanoy"},
        {"group": "Sintsink", "relation": "Neighbors to the Weckquaesgeek"},
        {"group": "Canarsee", "relation": "Neighbors to the Weckquaesgeek (southern Manhattan / Brooklyn)"},
        {"group": "Rockaway", "relation": "Neighbors to the Canarsee"}
      ],
      "trail_based_trade": [
        {
          "route": "Wickquasgeck Trail (Broadway)",
          "connection": "North-south: birch bark country to Manhattan"
        },
        {
          "route": "Shore Path (Boston Post Road)",
          "connection": "East-west: coastal summer settlements to inland hunting grounds"
        }
      ]
    },
    "agricultural_sites": [
      {
        "site": "Quinnahung (Hunts Point)",
        "meaning_variant": "Planting Neck",
        "description": "The tip of Hunts Point served as an important meeting place with agricultural planting grounds.",
        "type": "agricultural"
      }
    ]
  }
}
```

---

## 9. Waterway Names and Descriptions (Consolidated)

```json
{
  "waterways_consolidated": [
    {
      "lenape_name": "Aquahung",
      "modern_name": "Bronx River",
      "type": "freshwater river",
      "role": "Territorial boundary between Siwanoy and Weckquaesgeek; vital resource; central axis of the borough",
      "territory": "Boundary (Siwanoy east / Weckquaesgeek west)"
    },
    {
      "lenape_name": "Saeck Kill",
      "modern_name": "Uncertain (western Bronx creek)",
      "type": "creek",
      "role": "Key waterway of the Weckquaesgeek territory",
      "territory": "Weckquaesgeek"
    },
    {
      "lenape_name": "Paparinemin",
      "modern_name": "Spuyten Duyvil ford / Kingsbridge crossing",
      "type": "ford / wading place",
      "role": "Critical crossing point connecting Bronx to Manhattan at low tide",
      "territory": "Weckquaesgeek"
    },
    {
      "lenape_name": null,
      "modern_name": "Hudson River",
      "type": "major river",
      "role": "Western boundary of Weckquaesgeek territory",
      "territory": "Weckquaesgeek"
    },
    {
      "lenape_name": null,
      "modern_name": "Harlem River",
      "type": "tidal strait",
      "role": "Southern/western boundary; separates Bronx from Manhattan",
      "territory": "Weckquaesgeek"
    },
    {
      "lenape_name": null,
      "modern_name": "East River",
      "type": "tidal strait",
      "role": "Southern waterway connecting Siwanoy and Canarsee territories",
      "territory": "Siwanoy / Canarsee"
    },
    {
      "lenape_name": null,
      "modern_name": "Long Island Sound",
      "type": "coastal body",
      "role": "Eastern boundary of Siwanoy territory; shellfish source for wampum",
      "territory": "Siwanoy"
    },
    {
      "lenape_name": null,
      "modern_name": "Pugsley's Creek",
      "type": "creek",
      "role": "Adjacent to Snakapins; one of the 'two waters'",
      "territory": "Siwanoy"
    },
    {
      "lenape_name": null,
      "modern_name": "Cromwell's Creek",
      "type": "creek",
      "role": "Landmark near Keskeskeck (South)",
      "territory": "Weckquaesgeek"
    },
    {
      "lenape_name": null,
      "modern_name": "Westchester Creek",
      "type": "creek",
      "role": "Near Castle Hill wampum production site",
      "territory": "Siwanoy"
    },
    {
      "lenape_name": null,
      "modern_name": "Weir Creek",
      "type": "creek",
      "role": "Location of Throgs Neck Shell Heap encampment",
      "territory": "Siwanoy"
    },
    {
      "lenape_name": null,
      "modern_name": "Upper New York Bay",
      "type": "bay",
      "role": "Key waterway of Canarsee territory (neighboring group)",
      "territory": "Canarsee"
    }
  ]
}
```

---

## 10. Agricultural Areas and Planting Grounds

```json
{
  "agriculture": {
    "confirmed_sites": [
      {
        "site": "Quinnahung (Hunts Point)",
        "alternative_meaning": "Planting Neck",
        "description": "The tip of Hunts Point served as an important meeting place with agricultural planting grounds.",
        "approximate_coordinates": {"lat": 40.810, "lng": -73.877},
        "evidence": "Name etymology ('Planting Neck'), described as having planting grounds"
      }
    ],
    "implied_agricultural_context": {
      "woodland_period": "200-1000 CE Woodland Period saw development of ceramics and agriculture",
      "managed_ecosystems": "The report describes the landscape as 'managed ecosystems' suggesting active landscape modification including agricultural clearing",
      "eastern_woodlands_agriculture": "The region's 'strategic proximity to the fertile coasts of the Eastern Woodlands' is highlighted — Eastern Woodlands peoples practiced the 'Three Sisters' agriculture (corn, beans, squash)"
    },
    "seasonal_resource_pattern": {
      "summer": "Coastal settlements for shellfish gathering and fishing (Siwanoy shore camps)",
      "winter": "Inland hunting grounds (accessed via Shore Path / Boston Post Road)",
      "year_round": "Agricultural planting at sites like Quinnahung"
    }
  }
}
```

---

## 11. Archaeological / Cartographic Sources for Map Overlay

```json
{
  "cartographic_sources": {
    "bolton_maps": {
      "title": "Indian Paths in the Great Metropolis",
      "author": "Reginald Pelham Bolton",
      "year": 1922,
      "publisher": "Museum of the American Indian, Heye Foundation",
      "description": "Plotted known village sites and trails over the contemporary street grid. Identified 'Indian stations' characterized by shell middens, hearths, and burial grounds.",
      "methodology": "Physical excavation and analysis of colonial land patents",
      "map_count": "12 detailed maps (per LENAPE_BRONX_MAP.md)"
    },
    "ohman_map": {
      "title": "Greater New York and Contiguous Territory, Showing the Indian Paths, Together with the Approximate Situation of All Known Indian Stations, Map I",
      "cartographer": "A.R. Ohman Map Co.",
      "year": 1912,
      "collaborator": "Reginald Pelham Bolton",
      "available_at": [
        "Brooklyn Public Library Digital Collections",
        "NYPL Digital Collections"
      ]
    },
    "welikia_project": {
      "title": "The Welikia Project",
      "author": "Eric W. Sanderson",
      "organization": "Wildlife Conservation Society / New York Botanical Garden",
      "methodology": "Georeferenced 600+ historical maps to create a Digital Elevation Model (DEM) of 1609 NYC",
      "url": "https://www.welikia.org/map-explorer",
      "upcoming": "Eric W. Sanderson's 'Before New York: An Atlas and Gazetteer' forthcoming from Abrams in 2026"
    },
    "skinner_excavations": {
      "title": "Indians of Manhattan Island and Vicinity",
      "author": "Alanson Skinner",
      "year": 1915,
      "publisher": "Museum of the American Indian, Heye Foundation",
      "excavation_sites": ["Throgs Neck", "Clasons Point (1918-1919)"]
    }
  }
}
```

---

## 12. Neighboring Groups (for Context / Connection Overlays)

```json
{
  "neighboring_groups": [
    {
      "name": "Wappinger",
      "relation_to": "Siwanoy",
      "location": "North of Siwanoy territory (Westchester County and beyond)",
      "note": "Broader confederacy that the Bronx bands were part of"
    },
    {
      "name": "Sintsink",
      "relation_to": "Weckquaesgeek",
      "location": "North of Weckquaesgeek territory (lower Westchester, Ossining area)",
      "note": "Neighboring Munsee-speaking group"
    },
    {
      "name": "Canarsee",
      "relation_to": "Weckquaesgeek",
      "location": "Southern Manhattan / Brooklyn",
      "key_waterways": ["East River", "Upper New York Bay"],
      "neighboring_groups": ["Weckquaesgeek", "Rockaway"]
    },
    {
      "name": "Rockaway",
      "relation_to": "Canarsee",
      "location": "Queens / Rockaway Peninsula",
      "note": "Neighboring group to the Canarsee"
    }
  ]
}
```

---

## Summary: What Is NEW vs. What Was Already in LENAPE_BRONX_MAP.md

| Category | New Data Found |
|----------|---------------|
| **Settlement sites** | Keskeskeck should be SPLIT into North (Van Cortlandt/Broadway at W 233rd) and South (Highbridge/W 167th St near Cromwell's Creek). Canarsee territory noted as neighboring. |
| **Trails** | 3 named routes with waypoints: Wickquasgeck Trail (Broadway), Shore Path (Boston Post Road), Wading Place at Paparinemin (Kingsbridge) |
| **Waterways with Lenape names** | Aquahung (Bronx River), Saeck Kill (Weckquaesgeek creek), Paparinemin (Spuyten Duyvil ford) |
| **Additional creeks** | Pugsley's Creek, Cromwell's Creek, Westchester Creek, Weir Creek — all tied to specific settlement sites |
| **Ecological zones** | Salt marshes, dramatic ridges, tidal inlets, birch bark country, sedge grass plains, inland hunting grounds |
| **Territory boundary details** | Hill-and-ridge terrain as natural boundary; Aquahung as central axis |
| **Population** | ~15,000 Lenape in NYC area; Siwanoy ~1,800 pre-contact, ~800 post-Kieft's War; 70+ dwellings at Snakapins |
| **Named leaders** | 5 sachems: Freequemeck, Rechgawar, Packanmans (Weckquaesgeek); Wampage I and II (Siwanoy) |
| **Social structure** | Matrilineal clans, decentralized governance |
| **Trade/economy** | Wampum production chain (shell gathering -> bead stringing -> regional currency); shellfish economy with 5 species |
| **Agriculture** | Quinnahung confirmed as agricultural planting ground; seasonal resource migration pattern |
| **Neighboring groups** | Wappinger, Sintsink, Canarsee, Rockaway — with directional relationships |
| **Street-level overlays** | Precise street intersections for 6 sites from the report's overlay table |
| **Landmarks** | The Grey Mare (glacial erratic), Treaty Oak, Drake Cemetery |
| **Cartographic sources** | Bolton 1922, Ohman 1912, Welikia Project DEM, Skinner 1915 — all with URLs |
