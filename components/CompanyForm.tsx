import { useState, FormEvent } from 'react';
import { Company } from '../types';

interface CompanyFormProps {
  company?: Company;
  onSubmit: (company: Company) => void;
  onCancel: () => void;
  sections?: string[];
}

export default function CompanyForm({ company, onSubmit, onCancel, sections = [] }: CompanyFormProps) {
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    company?.data || {
      'Company Name': '',
      'Contact Person': '',
      'Email': '',
      'Phone': '',
      'Last Contact Date': '',
      'Address': '',
      'Notes': ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (company) {
      onSubmit({
        ...company,
        data: {
          ...formData,
          'Notes': formData['Notes'] || ''
        }
      });
    } else {
      onSubmit({
        id: '', // This will be set in the parent component
        section: 'Default',
        data: {
          ...formData,
          'Notes': formData['Notes'] || ''
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-4">
        {company ? 'Edit Company' : 'Add New Company'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="Company Name" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            id="Company Name"
            name="Company Name"
            value={formData['Company Name'] || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="Contact Person" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person *
          </label>
          <input
            type="text"
            id="Contact Person"
            name="Contact Person"
            value={formData['Contact Person'] || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={formData['Email'] || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="Last Contact Date" className="block text-sm font-medium text-gray-700 mb-1">
            Last Contact Date *
          </label>
          <input
            type="date"
            id="Last Contact Date"
            name="Last Contact Date"
            value={formData['Last Contact Date'] || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="Address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            id="Address"
            name="Address"
            value={formData['Address'] || ''}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
            Section *
          </label>
          <select
            id="section"
            name="section"
            value={company?.section || 'Default'}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Default">Default</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="Phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          id="Phone"
          name="Phone"
          value={formData['Phone'] || ''}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="Notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="Notes"
          name="Notes"
          value={formData['Notes'] || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
        >
          {company ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
} 