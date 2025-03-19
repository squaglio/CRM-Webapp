import { useState } from 'react';
import type { Company, CompanyData } from '@/app/types/index';

interface CompanyListProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onUpdateDate: (id: string, date: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateField: (id: string, field: string, value: string) => void;
}

export default function CompanyList({ companies, onEdit, onDelete, onUpdateDate, onUpdateNotes, onUpdateField }: CompanyListProps) {
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [tempDate, setTempDate] = useState<string>('');
  const [editingField, setEditingField] = useState<{ id: string; field: string } | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const handleDateClick = (company: Company) => {
    setEditingDateId(company.id);
    const companyWithData = company as Company & { data?: CompanyData };
    setTempDate(companyWithData.data?.['Last Contact Date'] || '');
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

  const handleFieldEdit = (company: Company, field: string) => {
    const companyWithData = company as Company & { data?: CompanyData };
    setEditingField({ id: company.id, field });
    setTempValue(companyWithData.data?.[field] || '');
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  const handleFieldSubmit = () => {
    if (editingField && tempValue !== null) {
      onUpdateField(editingField.id, editingField.field, tempValue);
    }
    setEditingField(null);
  };

  const handleFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFieldSubmit();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
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
    companies.flatMap(company => {
      const companyWithData = company as Company & { data?: CompanyData };
      return Object.keys(companyWithData.data || {});
    })
  ))
  .filter(header => header !== 'Notes')
  .filter(header => 
    companies.some(company => {
      const companyWithData = company as Company & { data?: CompanyData };
      return companyWithData.data?.[header] && 
      companyWithData.data[header].trim() !== '' && 
      companyWithData.data[header].toLowerCase() !== 'null' &&
      companyWithData.data[header].toLowerCase() !== 'undefined';
    })
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
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-900">
                          {(company as Company & { data?: CompanyData }).data?.[header] || ''}
                        </div>
                        <button 
                          onClick={() => handleDateClick(company)}
                          className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    )
                  ) : editingField && editingField.id === company.id && editingField.field === header ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={handleFieldChange}
                        onKeyDown={handleFieldKeyDown}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleFieldSubmit}
                        className="text-sm text-green-600 hover:text-green-900"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 group">
                      <div className="text-sm text-gray-900">
                        {(company as Company & { data?: CompanyData }).data?.[header] || ''}
                      </div>
                      <button 
                        onClick={() => handleFieldEdit(company, header)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 hover:text-blue-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              ))}
              <td className="px-6 py-4">
                <div className="relative">
                  <textarea
                    value={(company as Company & { data?: CompanyData }).data?.['Notes'] || ''}
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