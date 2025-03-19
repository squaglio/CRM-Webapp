import { NextResponse } from 'next/server';
import { getSheetData, formatSheetData } from '@/app/utils/googleSheets';

export async function POST(request: Request) {
  try {
    const { spreadsheetId, range } = await request.json();

    if (!spreadsheetId || !range) {
      return NextResponse.json(
        { error: 'Spreadsheet ID and range are required' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL || !process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Google Sheets credentials not configured' },
        { status: 500 }
      );
    }

    const rawData = await getSheetData(spreadsheetId, range);
    if (!rawData) {
      return NextResponse.json(
        { error: 'No data found in the specified range' },
        { status: 404 }
      );
    }

    const formattedData = formatSheetData(rawData);

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error('Error importing sheet:', error);
    return NextResponse.json(
      { error: 'Failed to import sheet data' },
      { status: 500 }
    );
  }
} 