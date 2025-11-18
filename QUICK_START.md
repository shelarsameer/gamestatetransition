# GST Reconciliation Tool - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Create Database
```bash
psql -U postgres
CREATE DATABASE gst_recon;
\q
```

### Step 2: Install Dependencies
```bash
# Frontend
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon"
npm install

# Backend
cd server
npm install
```

### Step 3: Start Backend (Terminal 1)
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon\server"
npm run dev
```
✅ Server running on `http://localhost:5000`

### Step 4: Start Frontend (Terminal 2)
```bash
cd "c:\Users\PC\Downloads\FinGuru _ GST Recon"
npm run dev
```
✅ App running on `http://localhost:5173`

### Step 5: Test with Sample Data
1. Open `http://localhost:5173` in browser
2. Login (any credentials)
3. Upload files:
   - GST: `sample_data/gst_sample.csv`
   - Tally: `sample_data/tally_sample.csv`
4. Map columns:
   - GST: `Invoice Number`, `Vendor Name`, `Amount`
   - Tally: `Bill Number`, `Party Name`, `Bill Amount`
5. Click "Start Reconciliation"
6. View results with charts and tables

---

## 📊 Expected Results
- **Exact Matches**: 9 records
- **Partial Matches**: 0 records
- **Tally Mismatches**: 1 record (INV011)
- **GST Mismatches**: 1 record (INV010)
- **Match Rate**: 90%

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/components/modules/HomeModule.tsx` | File upload & column mapping |
| `src/components/modules/ReconciliationResultsModule.tsx` | Results display |
| `server/index.js` | Backend API server |
| `server/utils/reconciliation.js` | Reconciliation logic |
| `sample_data/gst_sample.csv` | Test GST data |
| `sample_data/tally_sample.csv` | Test Tally data |

---

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Change port in server/.env or use different port
PORT=5001 npm run dev
```

**Database error?**
```bash
# Verify database exists
psql -U postgres -l | grep gst_recon

# If missing, create it
createdb gst_recon
```

**Module not found?**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- **Setup Details**: See `SETUP_GUIDE.md`
- **Testing Procedures**: See `TESTING_GUIDE.md`
- **Full Implementation**: See `IMPLEMENTATION_SUMMARY.md`

---

## ✨ Features

✅ Upload GST and Tally files (Excel/CSV)
✅ Preview data before processing
✅ Flexible column mapping
✅ Intelligent reconciliation
✅ Visual results with charts
✅ Export to CSV
✅ Database persistence

---

## 🎯 Next Steps

1. Test with sample data
2. Upload your own GST and Tally files
3. Review reconciliation results
4. Export data for further analysis
5. Customize column mappings as needed

---

## 💡 Tips

- Use the preview tab to verify data before reconciliation
- Select only the columns you want to match on
- Export results for further analysis in Excel
- Check the browser console (F12) for detailed error messages

---

## 📞 Support

For issues:
1. Check browser console (F12 → Console tab)
2. Check server terminal for errors
3. Verify database is running
4. See `TESTING_GUIDE.md` for troubleshooting

---

**Happy Reconciling! 🎉**
