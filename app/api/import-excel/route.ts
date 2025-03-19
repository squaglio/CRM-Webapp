import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sheetsParam = formData.get('sheets');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Parse the Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const result: { [key: string]: any[] } = {};

    // If no sheets specified, process all sheets
    let sheetsToProcess: string[];
    if (!sheetsParam) {
      sheetsToProcess = workbook.SheetNames;
    } else {
      try {
        sheetsToProcess = JSON.parse(sheetsParam as string);
        if (!Array.isArray(sheetsToProcess)) {
          throw new Error('Invalid sheets parameter format');
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid sheets parameter format' },
          { status: 400 }
        );
      }
    }

    // Process the sheets
    sheetsToProcess.forEach((sheetName: string) => {
      if (workbook.SheetNames.includes(sheetName)) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          raw: false, // Convert all data to strings
          defval: '' // Use empty string for empty cells
        }) as any[][];
        
        // Ensure we have data and headers
        if (jsonData.length > 0) {
          result[sheetName] = jsonData;
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Excel file processed successfully'
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return NextResponse.json(
      { error: 'Failed to process Excel file' },
      { status: 500 }
    );
  }
} 