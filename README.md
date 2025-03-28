# Daily Mood API

A Vercel serverless API function that converts CSV mood data into a color-coded date mapping.

## API Endpoints

1. `POST /api/uploadMood` - Upload CSV data
   - Accepts CSV content in the request body
   - Saves the CSV data for later processing

2. `GET /api/refreshMood` - Get color-coded mood data
   - Returns a JSON mapping of dates to hex color codes for the current year
   - Example response:
   ```json
   {
     "2025-03-27": "#FFC107",
     "2025-03-26": "#FFC107"
   }
   ```

## Development

1. Install dependencies:
```bash
npm install
```

2. Run locally:
```bash
vercel dev
```

## Deployment

Deploy to Vercel:
```bash
vercel
```
