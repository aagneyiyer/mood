import { put } from '@vercel/blob';
import allowCors from './cors.js';

async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { csv } = req.body; // Extract CSV data from JSON request body

    if (!csv) {
      return res.status(400).json({ error: 'CSV content is required' });
    }

    // Upload to Vercel Blob Storage
    const blob = await put('mood.csv', csv, {
      access: 'public',
      contentType: 'text/csv'
    });

    res.status(200).json({ 
      message: 'CSV uploaded successfully',
      url: blob.url
    });
  } catch (error) {
    console.error('Error saving CSV:', error);
    res.status(500).json({ error: 'Failed to save CSV data' });
  }
}

export default allowCors(handler);
