import { Company } from '../types';
import { useState } from 'react';

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onUpdateDate: (id: string, date: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export default function CompanyList({ companies, onEdit, onDelete, onUpdateDate, onUpdateNotes }: CompanyListProps) {
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<string>('');

  const handleDateClick = (company: Company) => {
    setEditingDateId(company.id);
    setTempDate(company.data['Last Contact Date'] || '');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDate(e.target.value);
  };

  const handleDateSubmit = (id: string) => {
    if (tempDate) {
      onUpdateDate(id, tempDate);
    }
    setEditingDateId(null);
  };

  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handleDateSubmit(id);
    } else if (e.key === 'Escape') {
      setEditingDateId(null);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>, company: Company) => {
    onUpdateNotes(company.id, e.target.value);
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No companies added yet. Click "Add New Company" to get started.
      </div>
    );
  }

  // Get all unique headers from all companies except Notes and filter out empty columns
  const headers = Array.from(new Set(
    companies.flatMap(company => Object.keys(company.data))
  ))
  .filter(header => header !== 'Notes')
  .filter(header => 
    companies.some(company => 
      company.data[header] && 
      company.data[header].trim() !== '' && 
      company.data[header].toLowerCase() !== 'null' &&
      company.data[header].toLowerCase() !== 'undefined'
    )
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[300px]">
              Notes
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap">
                  {header === 'Last Contact Date' ? (
                    editingDateId === company.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          value={tempDate}
                          onChange={handleDateChange}
                          onKeyDown={(e) => handleDateKeyDown(e, company.id)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          onClick={() => handleDateSubmit(company.id)}
                          className="text-sm text-green-600 hover:text-green-900"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setEditingDateId(null)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="text-sm text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() => handleDateClick(company)}
                      >
                        {company.data[header] || ''}
                      </div>
                    )
                  ) : (
                    <div className="text-sm text-gray-900">{company.data[header] || ''}</div>
                  )}
                </td>
              ))}
              <td className="px-6 py-4">
                <div className="relative">
                  <textarea
                    value={company.data['Notes'] || ''}
                    onChange={(e) => handleNotesChange(e, company)}
                    placeholder="Click to add notes..."
                    className="w-[200px] text-sm border border-gray-300 rounded px-2 py-1 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 
                             min-h-[40px] max-h-[80px] resize-none bg-white shadow-sm
                             hover:border-blue-300 transition-colors duration-200
                             overflow-auto"
                    rows={2}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(company)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(company.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 