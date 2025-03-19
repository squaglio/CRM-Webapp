export interface CompanyData {
  [key: string]: string | undefined;
}

export interface Company {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  contactName?: string;
  email?: string;
  lastContactDate?: string;
  notes?: string;
  section: string;
  data?: CompanyData;
} 