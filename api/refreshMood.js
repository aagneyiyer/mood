import { parse } from 'csv-parse';
import { list } from '@vercel/blob';
import allowCors from './cors.js';

const MOOD_COLORS = {
  'goated': '#1B5E20',        // Dark green
  'great': '#4CAF50',         // Green
  'average': '#FFC107',       // Yellow
  'mid/stressful': '#FF5722', // Orange-red
  'awful': '#B71C1C'          // Bright red
};

async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the latest CSV from Blob storage
    const { blobs } = await list();
    const latestBlob = blobs
      .filter(blob => blob.pathname === 'mood.csv')
      .sort((a, b) => b.uploadedAt - a.uploadedAt)[0];

    if (!latestBlob) {
      return res.status(404).json({ error: 'No mood data found' });
    }

    // Fetch the CSV content
    const response = await fetch(latestBlob.url);
    const csvContent = await response.text();

    // Parse CSV content
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Get current year
    const currentYear = new Date().getFullYear();

    // Create date to color mapping (only for current year)
    const moodMapping = {};
    records.forEach(record => {
      const date = record.full_date;
      const year = parseInt(date.split('-')[0]);
      
      // Only process entries from current year
      if (year === currentYear) {
        const mood = record.mood.toLowerCase();
        if (MOOD_COLORS[mood]) {
          moodMapping[date] = MOOD_COLORS[mood];
        }
      }
    });

    res.status(200).json(moodMapping);
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ error: 'Failed to process CSV data' });
  }
}

export default allowCors(handler);
