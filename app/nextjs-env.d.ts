// Add TypeScript definitions to make sure the imported types are recognized
import { Company } from '@/app/types/index';

declare global {
  interface CompanyData extends Company {
    data?: Record<string, string | undefined>;
  }
}

export {}; 