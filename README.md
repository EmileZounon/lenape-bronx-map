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
