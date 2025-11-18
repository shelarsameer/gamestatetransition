import XLSX from 'xlsx';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Normalize values: replace '-' with '0' and normalize date separators
function normalizeValue(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  // Convert to string for processing
  let strValue = String(value).trim();

  // Replace standalone '-' with '0'
  if (strValue === '-') {
    return 0;
  }

  // Normalize date separators: convert both '/' and '-' to '/' for consistency
  // Match patterns like DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD, YYYY-MM-DD, etc.
  if (/^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}$/.test(strValue)) {
    // Replace all '-' with '/' to normalize date format
    strValue = strValue.replace(/-/g, '/');
  }

  return strValue;
}

export function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get raw data with all columns
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: 0 });
    
    // Get all unique column names from all rows
    const allColumns = new Set();
    data.forEach(row => {
      Object.keys(row).forEach(col => allColumns.add(col));
    });
    
    // Normalize all rows to have all columns with normalized values
    const normalizedData = data.map(row => {
      const normalizedRow = {};
      allColumns.forEach(col => {
        const value = row[col] !== undefined ? row[col] : 0;
        normalizedRow[col] = normalizeValue(value);
      });
      return normalizedRow;
    });
    
    // Clean up file
    fs.unlinkSync(filePath);
    
    return normalizedData;
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

export function parseCSV(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Normalize all values in CSV data
    const normalizedData = data.map(row => {
      const normalizedRow = {};
      Object.keys(row).forEach(col => {
        normalizedRow[col] = normalizeValue(row[col]);
      });
      return normalizedRow;
    });
    
    // Clean up file
    fs.unlinkSync(filePath);
    
    return normalizedData;
  } catch (error) {
    throw new Error(`Failed to parse CSV file: ${error.message}`);
  }
}
