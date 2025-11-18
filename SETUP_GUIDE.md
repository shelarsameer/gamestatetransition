# GST Reconciliation Tool - Setup Guide

## Project Overview
A web application for reconciling GST (Goods and Services Tax) data between two sources:
- GST 2B-B2B data (from the GST portal)
- Tally ERP data (from accounting software)

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL 17 (running on port 5432)
- npm or yarn

## Database Setup

### 1. Create Database
```sql
CREATE DATABASE gst_recon;
```

### 2. Connect to Database
```sql
\c gst_recon
```

The tables will be created automatically when the server starts.

## Installation & Setup

### 1. Frontend Setup
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon"
npm install
```

### 2. Backend Setup
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon\server"
npm install
```

### 3. Environment Configuration
Backend `.env` file is already configured with:
```
PORT=5000
DB_USER=postgres
DB_PASSWORD=Sam@16704
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gst_recon
```

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon\server"
npm run dev
```
Server will run on `http://localhost:5000`

### Terminal 2: Start Frontend Development Server
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon"
npm run dev
```
Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Features

### 1. Home Page (HomeModule.tsx)
- **File Upload**: Upload GST 2B-B2B and Tally ERP files (Excel/CSV)
- **Data Preview**: View first few rows of uploaded files
- **Column Mapping**: Select and map columns between GST and Tally data
- **Start Reconciliation**: Initiate the reconciliation process

### 2. Reconciliation Logic
The system matches records based on:

**Exact Matches (Type 1)**
- Records found in both GST and Tally with matching key fields
- Logic: `(2B-B2B.Feature1 = Tally.Feature1) AND (2B-B2B.Feature2 = Tally.Feature2)`

**Partial Matches (Type 2)**
- Records found in both but with discrepancies
- Logic: `(2B-B2B.Feature1 = Tally.Feature1) OR (2B-B2B.Feature2 = Tally.Feature2)`

**Mismatches**
- Type 1: In Tally but missing in GST 2B-B2B
- Type 2: In GST 2B-B2B but missing in Tally

### 3. Results Page
Displays comprehensive reconciliation results with:
- **Summary Statistics**: Total records, match counts, discrepancies
- **Tabbed Interface**:
  - Tab 1: Exact Matches
  - Tab 2: Partial Matches
  - Tab 3: Tally Mismatches
  - Tab 4: GST Mismatches
- **Data Visualization**: Pie charts and match rate indicators
- **Export Functionality**: Download results as CSV for each view

## API Endpoints

### File Upload
```
POST /api/upload
Content-Type: multipart/form-data
Body: { gstFile, tallyFile }
Response: { success, uploadId, gstHeaders, tallyHeaders, gstPreview, tallyPreview }
```

### Get Upload Details
```
GET /api/upload/:uploadId
Response: Upload object with GST and Tally data
```

### Run Reconciliation
```
POST /api/reconcile
Content-Type: application/json
Body: { uploadId, gstColumns, tallyColumns }
Response: { success, resultId, summary }
```

### Get Results
```
GET /api/results/:resultId
Response: Reconciliation results with all match types
```

### Export Results
```
GET /api/results/:resultId/export
Response: Results data for CSV export
```

## File Format Requirements

### Supported Formats
- Excel (.xlsx, .xls)
- CSV (.csv)
- Maximum file size: 10MB

### Data Structure
Files should have headers in the first row with column names. The application will:
1. Parse the file
2. Display preview of data
3. Allow column mapping
4. Use mapped columns for reconciliation

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running on port 5432
- Verify credentials in `.env` file
- Check if `gst_recon` database exists

### File Upload Error
- Ensure file format is supported (Excel or CSV)
- Check file size is under 10MB
- Verify file has proper headers

### Reconciliation Not Starting
- Ensure both files are uploaded
- Select at least one column from each file for mapping
- Check browser console for errors

## Project Structure
```
FinGuru _ GST Recon/
├── src/
│   ├── components/
│   │   ├── modules/
│   │   │   ├── HomeModule.tsx          # File upload & column mapping
│   │   │   ├── ReconciliationResultsModule.tsx  # Results display
│   │   │   └── ...
│   │   └── ui/                         # UI components
│   ├── App.tsx
│   └── main.tsx
├── server/
│   ├── index.js                        # Main server file
│   ├── utils/
│   │   ├── fileParser.js               # Excel/CSV parsing
│   │   ├── reconciliation.js           # Reconciliation logic
│   │   └── database.js                 # Database initialization
│   ├── package.json
│   └── .env
├── package.json
└── vite.config.ts
```

## Next Steps

1. **Install dependencies** for both frontend and backend
2. **Create PostgreSQL database** named `gst_recon`
3. **Start the backend server** on port 5000
4. **Start the frontend** on port 5173
5. **Upload sample files** to test the reconciliation
6. **Review results** and export data as needed

## Support
For issues or questions, check the browser console and server logs for detailed error messages.
