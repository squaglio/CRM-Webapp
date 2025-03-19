import { google } from 'googleapis';

// Initialize the Google Sheets API
const sheets = google.sheets('v4');

// Function to get data from a Google Sheet
export async function getSheetData(spreadsheetId: string, range: string) {
  try {
    // Use the public API key for authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      auth,
    });

    return response.data.values;
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    throw error;
  }
}

// Function to format sheet data into a structured format
export function formatSheetData(data: any[][] | undefined) {
  if (!data || data.length === 0) return [];

  const headers = data[0];
  return data.slice(1).map(row => {
    const item: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      item[header] = row[index] || '';
    });
    return item;
  });
} 