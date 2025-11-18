# Header Row Selection Feature

## Overview
Added the ability to select which row contains headers in your GST and Tally files, allowing you to skip unnecessary top rows with metadata or titles.

## Features

### 1. Header Row Selection Interface
- **Step 2 in the workflow**: After uploading files, select the header row for each file
- **Dropdown selector**: Choose from all available rows in your file
- **Live preview**: See the content of the selected row before confirming
- **Independent selection**: Each file can have a different header row

### 2. Data Preview
- Shows the actual content of the selected header row
- Displays key-value pairs from that row
- Helps verify you've selected the correct row

### 3. Dynamic Column Mapping
- Column headers update automatically when you change the header row
- Column mapping interface reflects the new headers
- Preview data updates to show records after the header row

### 4. Database Storage
- Header row numbers are stored in the database
- Can be retrieved later for reference
- Included in reconciliation summary

## How to Use

### Step 1: Upload Files
1. Upload your GST file (Excel or CSV)
2. Upload your Tally file (Excel or CSV)
3. Click "Next: Column Mapping"

### Step 2: Select Header Row
1. For **GST File**:
   - Open the "GST File - Header Row" dropdown
   - Select the row that contains your column headers
   - Review the preview to confirm
   
2. For **Tally File**:
   - Open the "Tally File - Header Row" dropdown
   - Select the row that contains your column headers
   - Review the preview to confirm

### Step 3: Continue
- Click "Next: Column Mapping" to proceed
- Select which columns to use for reconciliation
- Start reconciliation

## Example Scenarios

### Scenario 1: File with Title Row
```
Row 1: "GST 2B-B2B Report - June 2024"
Row 2: "Generated on: 2024-06-15"
Row 3: Invoice Number | Vendor Name | Amount | GSTIN
Row 4: INV001 | ABC Supplies | 50000 | 27AABCT1234A1Z0
...
```
**Solution**: Select Row 3 as the header row

### Scenario 2: File with Metadata
```
Row 1: Company: ABC Corp
Row 2: Period: June 2024
Row 3: [Empty]
Row 4: Bill Number | Party Name | Bill Amount | Party GSTIN
Row 5: INV001 | ABC Supplies | 50000 | 27AABCT1234A1Z0
...
```
**Solution**: Select Row 4 as the header row

### Scenario 3: Clean File
```
Row 1: Invoice Number | Vendor Name | Amount | GSTIN
Row 2: INV001 | ABC Supplies | 50000 | 27AABCT1234A1Z0
...
```
**Solution**: Select Row 1 as the header row (default)

## Technical Details

### Frontend Changes
- **HomeModule.tsx**: Added header row selection interface
- **New state variables**:
  - `gstHeaderRow`: Selected header row for GST file
  - `tallyHeaderRow`: Selected header row for Tally file
  - `gstAllData`: Complete parsed GST data
  - `tallyAllData`: Complete parsed Tally data
  - `showHeaderSelection`: Toggle for header selection UI

- **New function**: `handleHeaderRowChange(source, rowNum)`
  - Updates headers and preview when row selection changes
  - Dynamically updates column mapping

### Backend Changes
- **server/index.js**:
  - Upload endpoint now returns all data (`gstAllData`, `tallyAllData`)
  - Reconciliation endpoint accepts `gstHeaderRow` and `tallyHeaderRow`
  - Data is sliced before reconciliation to skip unnecessary rows
  - Header row info is stored in database

- **server/utils/database.js**:
  - Added `gst_header_row` and `tally_header_row` columns to `reconciliation_results` table

### Database Schema
```sql
ALTER TABLE reconciliation_results ADD COLUMN gst_header_row INTEGER DEFAULT 1;
ALTER TABLE reconciliation_results ADD COLUMN tally_header_row INTEGER DEFAULT 1;
```

## API Changes

### Upload Endpoint
**Response now includes:**
```json
{
  "success": true,
  "uploadId": 1,
  "gstAllData": [...],        // NEW: All rows from GST file
  "tallyAllData": [...],      // NEW: All rows from Tally file
  "gstHeaders": [...],
  "tallyHeaders": [...],
  "gstPreview": [...],
  "tallyPreview": [...]
}
```

### Reconciliation Endpoint
**Request now accepts:**
```json
{
  "uploadId": 1,
  "gstColumns": [...],
  "tallyColumns": [...],
  "gstHeaderRow": 3,          // NEW: Header row number (1-indexed)
  "tallyHeaderRow": 4         // NEW: Header row number (1-indexed)
}
```

**Response includes:**
```json
{
  "success": true,
  "resultId": 1,
  "summary": {
    "totalGstRecords": 10,
    "totalTallyRecords": 10,
    "exactMatches": 9,
    "partialMatches": 0,
    "tallyMismatches": 1,
    "gstMismatches": 1,
    "gstHeaderRow": 3,        // NEW: Stored header row
    "tallyHeaderRow": 4       // NEW: Stored header row
  }
}
```

## Benefits

✅ **Skip metadata rows** - Ignore titles, dates, and other non-data rows
✅ **Flexible file formats** - Support files with different structures
✅ **Visual confirmation** - Preview rows before processing
✅ **Automatic updates** - Column mapping updates when header row changes
✅ **Persistent storage** - Header row info saved for future reference
✅ **No data loss** - All rows stored, only reconciliation uses selected range

## Workflow

```
Upload Files
    ↓
Select Header Rows (NEW)
    ↓
Preview & Confirm
    ↓
Map Columns
    ↓
Start Reconciliation
    ↓
View Results
```

## Notes

- Header row numbers are **1-indexed** (Row 1 is the first row)
- The header row itself becomes the column names
- Data reconciliation starts from the row **after** the header row
- All rows are stored in the database, only the reconciliation uses the selected range
- If no header row is selected, defaults to Row 1

## Troubleshooting

**Q: I selected the wrong header row, can I change it?**
A: Yes! Go back to the header row selection step and select a different row. The preview will update immediately.

**Q: What if my file has no headers?**
A: You can still use the tool. Select the first data row as the "header row" and manually map the columns.

**Q: Can I have different header rows for GST and Tally?**
A: Yes! Each file can have its header row selected independently.

**Q: Are the skipped rows lost?**
A: No, all rows are stored in the database. Only the reconciliation process uses the selected range.
