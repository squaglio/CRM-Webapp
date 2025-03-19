'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Company } from '@/types';

interface ExcelImportProps {
  onImportComplete: (companies: Company[], sheetName: string) => void;
}

interface SheetData {
  name: string;
  preview: any[];
}

// Italian column name mappings
const ITALIAN_COLUMN_MAPPINGS = {
  name: [
    'nome',
    'azienda',
    'società',
    'impresa',
    'ragione sociale',
    'nome azienda'
  ],
  address: [
    'indirizzo',
    'via',
    'sede',
    'località',
    'luogo'
  ],
  phone: [
    'telefono',
    'tel',
    'numero di telefono',
    'cellulare',
    'mobile'
  ],
  contactName: [
    'contatto',
    'nome contatto',
    'referente',
    'persona di contatto',
    'responsabile'
  ],
  email: [
    'email',
    'e-mail',
    'posta elettronica',
    'mail'
  ],
  lastContactDate: [
    'data',
    'ultimo contatto',
    'data ultimo contatto',
    'ultima data',
    'giorno'
  ],
  notes: [
    'note',
    'commenti',
    'osservazioni',
    'descrizione',
    'dettagli'
  ]
};

export default function ExcelImport({ onImportComplete }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setSuccess(false);
      
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('/api/import-excel', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to read Excel file');
        }

        // Get the sheet names from the Excel file
        const sheetNames = Object.keys(data.data);
        setSheets(sheetNames);
        setSelectedSheets(sheetNames); // Select all sheets by default
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to read Excel file');
        setFile(null);
        setSheets([]);
        setSelectedSheets([]);
      }
    }
  };

  const handleSheetToggle = (sheetName: string) => {
    setSelectedSheets(prev => 
      prev.includes(sheetName)
        ? prev.filter(name => name !== sheetName)
        : [...prev, sheetName]
    );
  };

  const handleImport = async () => {
    if (!file || selectedSheets.length === 0) {
      setError('Please select a file and at least one sheet to import');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('sheets', JSON.stringify(selectedSheets));

      const response = await fetch('/api/import-excel', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import Excel file');
      }

      // Process all selected sheets
      selectedSheets.forEach((sheetName) => {
        const sheetData = data.data[sheetName];
        if (sheetData && sheetData.length > 1) { // Skip header row
          const headers = sheetData[0];
          const companies: Company[] = sheetData.slice(1).map((row: any[], index: number) => {
            const companyData: { [key: string]: string } = {};
            headers.forEach((header: string, colIndex: number) => {
              // Use the original header name from Excel
              const headerName = header || `Column ${colIndex + 1}`;
              companyData[headerName] = row[colIndex] || '';
            });
            
            // Ensure Notes field exists
            if (!companyData['Notes']) {
              companyData['Notes'] = '';
            }
            
            return {
              id: `${sheetName}-${index}`,
              section: sheetName,
              data: companyData
            };
          });

          onImportComplete(companies, sheetName);
        }
      });

      setSuccess(true);
      setFile(null);
      setSheets([]);
      setSelectedSheets([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import Excel file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Import from Excel</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {sheets.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Sheets to Import
            </label>
            <div className="space-y-2">
              {sheets.map(sheetName => (
                <label key={sheetName} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSheets.includes(sheetName)}
                    onChange={() => handleSheetToggle(sheetName)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{sheetName}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={loading || !file || selectedSheets.length === 0}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Importing...' : 'Import Selected Sheets'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm mt-2">
            Excel file imported successfully!
          </div>
        )}
      </div>
    </div>
  );
} 