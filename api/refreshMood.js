import { parse } from 'csv-parse/sync';

const MOOD_COLORS = {
  'goated': '#1B5E20',        // Dark green
  'great': '#4CAF50',         // Green
  'average': '#FFC107',       // Yellow
  'mid/stressful': '#FF5722', // Orange-red
  'awful': '#B71C1C'          // Bright red
};

export default function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const csvContent = req.body;
    if (!csvContent) {
      return res.status(400).json({ error: 'CSV content is required' });
    }

    // Parse CSV content
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Create date to color mapping
    const moodMapping = {};
    records.forEach(record => {
      const date = record.full_date;
      const mood = record.mood.toLowerCase();
      if (MOOD_COLORS[mood]) {
        moodMapping[date] = MOOD_COLORS[mood];
      }
    });

    res.status(200).json(moodMapping);
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ error: 'Failed to process CSV data' });
  }
}
