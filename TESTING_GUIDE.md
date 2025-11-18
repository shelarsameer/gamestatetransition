# GST Reconciliation Tool - Testing Guide

## Quick Start Testing

### Step 1: Database Setup
```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE gst_recon;

-- Verify database created
\l
```

### Step 2: Install Dependencies

**Frontend:**
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon"
npm install
```

**Backend:**
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon\server"
npm install
```

### Step 3: Start Services

**Terminal 1 - Backend:**
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon\server"
npm run dev
```
Expected output: `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon"
npm run dev
```
Expected output: `VITE v... ready in ... ms`

### Step 4: Test with Sample Data

1. **Open Application**
   - Navigate to `http://localhost:5173`
   - Login with any credentials

2. **Upload Sample Files**
   - Go to Home Module
   - Upload `sample_data/gst_sample.csv` as GST file
   - Upload `sample_data/tally_sample.csv` as Tally file
   - Click "Next: Column Mapping"

3. **Map Columns**
   - In "Column Mapping" tab, select:
     - GST: `Invoice Number`, `Vendor Name`, `Amount`
     - Tally: `Bill Number`, `Party Name`, `Bill Amount`
   - Click "Start Reconciliation"

4. **View Results**
   - System will process and show reconciliation results
   - Expected matches: 9 exact matches
   - Expected mismatches: 1 GST mismatch (INV010), 1 Tally mismatch (INV011)

## Test Scenarios

### Scenario 1: Perfect Match
**Description:** All records match exactly

**Sample Data:**
```
GST: INV001, ABC Supplies, 50000
Tally: INV001, ABC Supplies, 50000
```

**Expected Result:** Exact Match

---

### Scenario 2: Partial Match (Amount Difference)
**Description:** Invoice numbers match but amounts differ

**Sample Data:**
```
GST: INV002, XYZ Trading, 75000
Tally: INV002, XYZ Trading, 75500
```

**Expected Result:** Partial Match with discrepancy in Amount

---

### Scenario 3: Missing in GST
**Description:** Record exists in Tally but not in GST

**Sample Data:**
```
Tally: INV011, New Supplier, 40000
GST: (No matching record)
```

**Expected Result:** Tally Mismatch

---

### Scenario 4: Missing in Tally
**Description:** Record exists in GST but not in Tally

**Sample Data:**
```
GST: INV010, Direct Suppliers, 55000
Tally: (No matching record)
```

**Expected Result:** GST Mismatch

---

## API Testing

### Test File Upload
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "gstFile=@sample_data/gst_sample.csv" \
  -F "tallyFile=@sample_data/tally_sample.csv"
```

Expected Response:
```json
{
  "success": true,
  "uploadId": 1,
  "gstHeaders": ["Invoice Number", "Vendor Name", ...],
  "tallyHeaders": ["Bill Number", "Party Name", ...],
  "gstPreview": [...],
  "tallyPreview": [...]
}
```

### Test Reconciliation
```bash
curl -X POST http://localhost:5000/api/reconcile \
  -H "Content-Type: application/json" \
  -d '{
    "uploadId": 1,
    "gstColumns": ["Invoice Number", "Vendor Name", "Amount"],
    "tallyColumns": ["Bill Number", "Party Name", "Bill Amount"]
  }'
```

Expected Response:
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
    "gstMismatches": 1
  }
}
```

### Get Results
```bash
curl http://localhost:5000/api/results/1
```

## UI Testing Checklist

### Home Page
- [ ] File upload section displays correctly
- [ ] Can select GST file
- [ ] Can select Tally file
- [ ] File names display after selection
- [ ] "Next: Column Mapping" button enables when both files selected
- [ ] Column mapping interface shows all available columns
- [ ] Can select/deselect columns
- [ ] "Start Reconciliation" button enables when columns selected

### Results Page
- [ ] Summary statistics display correctly
- [ ] Pie chart shows match distribution
- [ ] Match percentage bar displays
- [ ] All four tabs are accessible
- [ ] Exact Matches tab shows matched records
- [ ] Partial Matches tab shows discrepancies
- [ ] Tally Mismatches tab shows missing in GST
- [ ] GST Mismatches tab shows missing in Tally
- [ ] Export buttons work for each tab
- [ ] Back button returns to home

## Performance Testing

### Large File Testing
Test with files containing:
- 1,000 records
- 10,000 records
- 100,000 records

Monitor:
- Upload time
- Processing time
- Memory usage
- UI responsiveness

## Error Handling Testing

### Test Cases
1. **Invalid File Format**
   - Upload .txt file
   - Expected: Error message

2. **Empty File**
   - Upload empty CSV
   - Expected: Error message

3. **Missing Headers**
   - Upload CSV without header row
   - Expected: Error or warning

4. **Database Connection Error**
   - Stop PostgreSQL
   - Try to upload
   - Expected: Connection error message

5. **Server Timeout**
   - Upload very large file
   - Expected: Timeout handling

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Regression Testing

After any code changes, verify:
1. File upload still works
2. Column mapping displays correctly
3. Reconciliation logic produces correct results
4. Results display properly
5. Export functionality works
6. Navigation between pages works

## Known Limitations

1. **File Size**: Maximum 10MB per file
2. **Column Count**: No hard limit, but UI may need scrolling for many columns
3. **Record Count**: Performance may degrade with >100,000 records
4. **Concurrent Users**: Single server instance, no load balancing

## Troubleshooting

### Issue: "Cannot connect to server"
**Solution:**
- Verify backend is running on port 5000
- Check firewall settings
- Verify API URL in frontend code

### Issue: "Database connection failed"
**Solution:**
- Verify PostgreSQL is running
- Check credentials in .env
- Verify database `gst_recon` exists

### Issue: "File upload fails"
**Solution:**
- Check file format (must be CSV or Excel)
- Verify file size < 10MB
- Check file has headers

### Issue: "Reconciliation takes too long"
**Solution:**
- Try with smaller file
- Check server logs for errors
- Verify database performance

## Support

For detailed logs:
- **Frontend**: Open browser DevTools (F12) → Console tab
- **Backend**: Check terminal where `npm run dev` is running
- **Database**: Check PostgreSQL logs

## Next Steps

1. Complete all test scenarios
2. Test with real GST and Tally data
3. Perform load testing
4. Get user feedback
5. Deploy to production
