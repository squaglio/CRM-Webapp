export interface Company {
  id: string;
  section: string;
  lastContactDate?: string;
  data: { [key: string]: string };
} 