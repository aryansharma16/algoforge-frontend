# Geo data (profile location)

- **`countries.json`** — 249 countries (ISO 3166-1 alpha-2 + name). Static, safe for the client.
- **`india-states-cities.json`** — All states/UTs of India + city lists per state (curated, not every village).

## India flow in the UI

1. User selects **India** → state dropdown lists all states/UTs.
2. User selects e.g. **Punjab** → city dropdown lists cities for Punjab.
3. User can pick a city **or** type any city if it’s not in the list.

## Growing the dataset

Bundling **every city worldwide** (~151k+) would be huge and would expose API keys if done from the browser. To go further:

- Use [Country State City API](https://docs.countrystatecity.in/api/introduction) **on your backend** with `X-CSCAPI-KEY`, then expose `/api/geo/states?country=IN` and `/api/geo/cities?country=IN&state=PB` to the frontend.
- Or run `node scripts/build-india-geo.mjs` and extend `states[].cities` in the script.
