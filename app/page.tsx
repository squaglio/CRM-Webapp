'use client';

import { useState } from 'react';
import CompanyList from '@/components/CompanyList';
import CompanyForm from '@/components/CompanyForm';
import GoogleSheetImport from '@/components/GoogleSheetImport';
import ExcelImport from '@/components/ExcelImport';
import type { Company, CompanyData } from '@/app/types/index';

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<string>('companies');
  const [sections, setSections] = useState<string[]>([]);

  const addCompany = (company: Company) => {
    const companyWithData = company as Company & { data?: CompanyData };
    
    setCompanies([...companies, {
      id: companyWithData.id,
      name: companyWithData.name,
      address: companyWithData.address,
      phone: companyWithData.phone,
      contactName: companyWithData.contactName,
      email: companyWithData.email,
      lastContactDate: companyWithData.lastContactDate,
      notes: companyWithData.notes,
      section: 'Default',
      data: companyWithData.data
    }]);
    setIsAddingNew(false);
  };

  const updateCompany = (updatedCompany: Company) => {
    const companyWithData = updatedCompany as Company & { data?: CompanyData };
    
    setCompanies(companies.map(company => 
      company.id === companyWithData.id ? {
        id: companyWithData.id,
        name: companyWithData.name,
        address: companyWithData.address,
        phone: companyWithData.phone,
        contactName: companyWithData.contactName,
        email: companyWithData.email,
        lastContactDate: companyWithData.lastContactDate,
        notes: companyWithData.notes,
        section: companyWithData.section,
        data: companyWithData.data
      } : company
    ));
    setEditingCompany(null);
  };

  const deleteCompany = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  const updateCompanyWithData = (company: Company, updates: { [key: string]: string }) => {
    const companyWithData = company as Company & { data?: CompanyData };
    const updatedData = { ...(companyWithData.data || {}) };
    
    Object.entries(updates).forEach(([key, value]) => {
      updatedData[key] = value;
    });

    return {
      id: companyWithData.id,
      name: companyWithData.name,
      address: companyWithData.address,
      phone: companyWithData.phone,
      contactName: companyWithData.contactName,
      email: companyWithData.email,
      lastContactDate: companyWithData.lastContactDate,
      notes: companyWithData.notes,
      section: companyWithData.section,
      data: updatedData
    };
  };

  const handleUpdateDate = (id: string, date: string) => {
    setCompanies(prevCompanies =>
      prevCompanies.map(company =>
        company.id === id
          ? updateCompanyWithData(company, { 'Last Contact Date': date })
          : company
      )
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id === id) {
          const companyWithData = company as Company & { data?: CompanyData };
          
          return {
            ...companyWithData,
            notes,
            data: {
              ...(companyWithData.data || {}),
              'Notes': notes
            }
          };
        }
        return company;
      })
    );
  };

  const handleUpdateField = (id: string, field: string, value: string) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id === id) {
          const companyWithData = company as Company & { data?: CompanyData };
          
          return {
            ...companyWithData,
            data: {
              ...(companyWithData.data || {}),
              [field]: value
            }
          };
        }
        return company;
      })
    );
  };

  const handleImportComplete = (importedCompanies: Company[], sheetName: string) => {
    // Add the new companies to the existing ones
    setCompanies(prevCompanies => [
      ...prevCompanies, 
      ...importedCompanies.map(company => {
        const companyWithData = company as Company & { data?: CompanyData };
        
        return {
          id: companyWithData.id,
          name: companyWithData.name,
          address: companyWithData.address,
          phone: companyWithData.phone,
          contactName: companyWithData.contactName,
          email: companyWithData.email,
          lastContactDate: companyWithData.lastContactDate,
          notes: companyWithData.notes,
          section: companyWithData.section,
          data: companyWithData.data
        };
      })
    ]);
    
    // Add the new section if it doesn't exist
    setSections(prevSections => {
      if (!prevSections.includes(sheetName)) {
        return [...prevSections, sheetName];
      }
      return prevSections;
    });

    // Switch to the new section
    setActiveTab(sheetName);
  };

  const companiesBySection = companies.reduce((acc, company) => {
    const section = company.section || 'Default';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(company);
    return acc;
  }, {} as { [key: string]: Company[] });

  const filteredCompanies = activeTab === 'companies'
    ? companies
    : companies.filter(company => company.section === activeTab);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <nav className="flex space-x-8 overflow-x-auto px-4">
          <button
            onClick={() => setActiveTab('companies')}
            className={`${
              activeTab === 'companies'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
          >
            Companies
          </button>
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveTab(section)}
              className={`${
                activeTab === section
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {section}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('import')}
            className={`${
              activeTab === 'import'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
          >
            Import Data
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab !== 'import' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'companies' ? 'All Companies' : activeTab}
              </h2>
              {!isAddingNew && !editingCompany && (
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Add New Company</span>
                </button>
              )}
            </div>

            {isAddingNew && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <CompanyForm
                  onSubmit={addCompany}
                  onCancel={() => setIsAddingNew(false)}
                  sections={sections}
                />
              </div>
            )}

            {editingCompany && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <CompanyForm
                  company={editingCompany}
                  onSubmit={updateCompany}
                  onCancel={() => setEditingCompany(null)}
                  sections={sections}
                />
              </div>
            )}

            <CompanyList
              companies={filteredCompanies}
              onEdit={setEditingCompany}
              onDelete={deleteCompany}
              onUpdateDate={handleUpdateDate}
              onUpdateNotes={handleUpdateNotes}
              onUpdateField={handleUpdateField}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <GoogleSheetImport />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <ExcelImport onImportComplete={handleImportComplete} />
          </div>
        </div>
      )}
    </div>
  );
} 