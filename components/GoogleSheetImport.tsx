'use client';

import { useState } from 'react';
import type { Company } from '@/app/types';

export default function GoogleSheetImport() {
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [range, setRange] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImport = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const response = await fetch('/api/import-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId,
          range,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import sheet');
      }

      setSuccess(true);
      // Here you can handle the imported data as needed
      console.log('Imported data:', data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Import from Google Sheets</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Spreadsheet ID
          </label>
          <input
            type="text"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter spreadsheet ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Range (e.g., Sheet1!A1:D10)
          </label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter range"
          />
        </div>

        <button
          onClick={handleImport}
          disabled={loading || !spreadsheetId || !range}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : 'Import Sheet'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm mt-2">
            Sheet imported successfully!
          </div>
        )}
      </div>
    </div>
  );
} 