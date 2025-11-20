import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseExcel, parseCSV } from './utils/fileParser.js';
import { reconcileData } from './utils/reconciliation.js';
import { initializeDatabase } from './utils/database.js';

// Normalize values for database storage
function normalizeValueForDB(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  let strValue = String(value).trim();

  if (strValue === '-') {
    return 0;
  }

  // Normalize date separators: convert both '/' and '-' to '/' for consistency
  if (/^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}$/.test(strValue)) {
    strValue = strValue.replace(/-/g, '/');
  }

  return strValue;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: 'postgres',
  password: 'Sam@16704',
  host: 'localhost',
  port: 5432,
  database: 'gst_recon'
});

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize database
await initializeDatabase(pool);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Upload and parse files
app.post('/api/upload', upload.fields([
  { name: 'gstFile', maxCount: 1 },
  { name: 'tallyFile', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files.gstFile || !req.files.tallyFile) {
      return res.status(400).json({ error: 'Both GST and Tally files are required' });
    }

    const gstFile = req.files.gstFile[0];
    const tallyFile = req.files.tallyFile[0];

    // Parse files
    let gstData = await parseFile(gstFile);
    let tallyData = await parseFile(tallyFile);

    // Get all unique column names from all rows to ensure no columns are missed
    const getAllColumns = (data) => {
      const columns = new Set();
      data.forEach(row => {
        Object.keys(row).forEach(col => columns.add(col));
      });
      return Array.from(columns);
    };

    const gstAllColumns = getAllColumns(gstData);
    const tallyAllColumns = getAllColumns(tallyData);

    // Store in database
    const uploadId = await storeUpload(pool, gstData, tallyData);

    res.json({
      success: true,
      uploadId,
      gstAllData: gstData,
      tallyAllData: tallyData,
      gstPreview: gstData.slice(1, 6),
      tallyPreview: tallyData.slice(1, 6),
      gstHeaders: gstAllColumns,
      tallyHeaders: tallyAllColumns
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get upload details
app.get('/api/upload/:uploadId', async (req, res) => {
  try {
    const { uploadId } = req.params;
    const result = await pool.query(
      'SELECT * FROM uploads WHERE id = $1',
      [uploadId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run reconciliation
app.post('/api/reconcile', async (req, res) => {
  try {
    const { uploadId, gstColumns, tallyColumns, gstHeaderRow = 1, tallyHeaderRow = 1 } = req.body;

    if (!uploadId || !gstColumns || !tallyColumns) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get data from database
    const uploadResult = await pool.query(
      'SELECT gst_data, tally_data FROM uploads WHERE id = $1',
      [uploadId]
    );

    if (uploadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    let { gst_data, tally_data } = uploadResult.rows[0];

    // Skip rows before header row
    gst_data = gst_data.slice(gstHeaderRow - 1);
    tally_data = tally_data.slice(tallyHeaderRow - 1);

    // Run initial reconciliation (for storing in results table)
    const results = reconcileData(gst_data, tally_data, gstColumns, tallyColumns);

    // Store results with header row info
    const resultId = await storeResults(pool, uploadId, results, gstHeaderRow, tallyHeaderRow);

    try {
      // Store mapped data in actual tables
      await storeMappedData(pool, resultId, gst_data, tally_data, gstColumns, tallyColumns);

      // Perform SQL-based reconciliation on the mapped tables
      const sqlResults = await performSQLReconciliation(pool, resultId);

      res.json({
        success: true,
        resultId,
        summary: {
          totalGstRecords: gst_data.length,
          totalTallyRecords: tally_data.length,
          exactMatches: sqlResults.exactMatches.length,
          partialMatches: sqlResults.partialMatches.length,
          tallyMismatches: sqlResults.tallyMismatches.length,
          gstMismatches: sqlResults.gstMismatches.length,
          gstHeaderRow,
          tallyHeaderRow
        }
      });
    } catch (mappingError) {
      console.error('Error in mapped data storage or SQL reconciliation:', mappingError);
      // Still return success with the initial reconciliation results
      res.json({
        success: true,
        resultId,
        summary: {
          totalGstRecords: gst_data.length,
          totalTallyRecords: tally_data.length,
          exactMatches: results.exactMatches.length,
          partialMatches: results.partialMatches.length,
          tallyMismatches: results.tallyMismatches.length,
          gstMismatches: results.gstMismatches.length,
          gstHeaderRow,
          tallyHeaderRow
        }
      });
    }
  } catch (error) {
    console.error('Reconciliation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get reconciliation results
app.get('/api/results/:resultId', async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await pool.query(
      'SELECT * FROM reconciliation_results WHERE id = $1',
      [resultId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Results not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export results
app.get('/api/results/:resultId/export', async (req, res) => {
  try {
    const { resultId } = req.params;
    const result = await pool.query(
      'SELECT * FROM reconciliation_results WHERE id = $1',
      [resultId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Results not found' });
    }

    const data = result.rows[0];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions
async function parseFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (ext === '.xlsx' || ext === '.xls') {
    return parseExcel(file.path);
  } else if (ext === '.csv') {
    return parseCSV(file.path);
  } else {
    throw new Error('Unsupported file format');
  }
}

async function storeUpload(pool, gstData, tallyData) {
  const result = await pool.query(
    'INSERT INTO uploads (gst_data, tally_data, created_at) VALUES ($1, $2, NOW()) RETURNING id',
    [JSON.stringify(gstData), JSON.stringify(tallyData)]
  );
  return result.rows[0].id;
}

async function storeResults(pool, uploadId, results, gstHeaderRow = 1, tallyHeaderRow = 1) {
  const result = await pool.query(
    'INSERT INTO reconciliation_results (upload_id, exact_matches, partial_matches, tally_mismatches, gst_mismatches, gst_header_row, tally_header_row, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id',
    [uploadId, JSON.stringify(results.exactMatches), JSON.stringify(results.partialMatches), JSON.stringify(results.tallyMismatches), JSON.stringify(results.gstMismatches), gstHeaderRow, tallyHeaderRow]
  );
  return result.rows[0].id;
}

async function performSQLReconciliation(pool, reconciliationId) {
  try {
    const gstTableName = `gst_mapped_${reconciliationId}`;
    const tallyTableName = `tally_mapped_${reconciliationId}`;

    // Get column mapping to know how many features we have
    const mappingResult = await pool.query(
      'SELECT gst_columns, tally_columns FROM column_mappings WHERE reconciliation_id = $1',
      [reconciliationId]
    );

    if (mappingResult.rows.length === 0) {
      throw new Error('Column mapping not found');
    }

    const { gst_columns, tally_columns } = mappingResult.rows[0];
    const gstCols = Array.isArray(gst_columns) ? gst_columns : JSON.parse(gst_columns);
    const tallyCols = Array.isArray(tally_columns) ? tally_columns : JSON.parse(tally_columns);
    
    const validCount = gstCols.filter((col, idx) => col && tallyCols[idx]).length;

    // Build feature column list (excluding id and created_at)
    const featureList = Array.from({ length: validCount }, (_, i) => `feature${i + 1}`).join(', ');

    // Build feature comparison string for all features
    const featureComparisons = Array.from({ length: validCount }, (_, i) => 
      `g.feature${i + 1} = t.feature${i + 1}`
    ).join(' AND ');

    // Build discrepancy detection for partial matches
    const discrepancyChecks = Array.from({ length: validCount }, (_, i) => 
      `CASE WHEN g.feature${i + 1} <> t.feature${i + 1} THEN 'Mismatch in feature${i + 1} ' ELSE '' END`
    ).join(' || ');

    // Match Type 1: Exact Matches (only feature columns, no id or created_at)
    const exactMatchesResult = await pool.query(`
      SELECT ${featureList}
      FROM ${gstTableName} g
      INNER JOIN ${tallyTableName} t
        ON ${featureComparisons}
    `);

    // Match Type 2: Partial Matches (using first 2 features as primary identifiers)
    const partialMatchesResult = await pool.query(`
      SELECT ${featureList},
        ${discrepancyChecks} AS discrepancies
      FROM ${gstTableName} g
      INNER JOIN ${tallyTableName} t
        ON g.feature1 = t.feature1
        AND g.feature2 = t.feature2
      WHERE NOT (${featureComparisons})
    `);

    // Mismatch Type 1: In Tally but Missing in GST
    const tallyMismatchesResult = await pool.query(`
      SELECT ${featureList}
      FROM ${tallyTableName} t
      LEFT JOIN ${gstTableName} g
        ON t.feature1 = g.feature1
        AND t.feature2 = g.feature2
      WHERE g.feature1 IS NULL
    `);

    // Mismatch Type 2: In GST but Missing in Tally
    const gstMismatchesResult = await pool.query(`
      SELECT ${featureList}
      FROM ${gstTableName} g
      LEFT JOIN ${tallyTableName} t
        ON g.feature1 = t.feature1
        AND g.feature2 = t.feature2
      WHERE t.feature1 IS NULL
    `);

    console.log('SQL Reconciliation Results:', {
      exactMatches: exactMatchesResult.rows.length,
      partialMatches: partialMatchesResult.rows.length,
      tallyMismatches: tallyMismatchesResult.rows.length,
      gstMismatches: gstMismatchesResult.rows.length
    });

    return {
      exactMatches: exactMatchesResult.rows,
      partialMatches: partialMatchesResult.rows,
      tallyMismatches: tallyMismatchesResult.rows,
      gstMismatches: gstMismatchesResult.rows
    };
  } catch (error) {
    console.error('SQL reconciliation error:', error);
    throw error;
  }
}

async function storeMappedData(pool, reconciliationId, gstData, tallyData, gstColumns, tallyColumns) {
  try {
    console.log('storeMappedData called with:', { reconciliationId, gstColumnsLength: gstColumns?.length, tallyColumnsLength: tallyColumns?.length });
    
    // Ensure columns are arrays
    const gstCols = Array.isArray(gstColumns) ? gstColumns : [];
    const tallyCols = Array.isArray(tallyColumns) ? tallyColumns : [];

    // Filter out empty mappings and create feature columns
    const validMappings = gstCols
      .map((gstCol, idx) => ({
        gstCol,
        tallyCol: tallyCols[idx],
        featureNum: idx + 1
      }))
      .filter(m => m.gstCol && m.tallyCol);

    console.log('Valid mappings:', validMappings.length);

    if (validMappings.length === 0) {
      throw new Error('No valid column mappings found');
    }

    // Create GST mapped data table with feature columns
    const gstTableName = `gst_mapped_${reconciliationId}`;
    const gstColumns_sql = validMappings
      .map(m => `feature${m.featureNum} TEXT`)
      .join(', ');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${gstTableName} (
        id SERIAL PRIMARY KEY,
        ${gstColumns_sql},
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create Tally mapped data table with feature columns
    const tallyTableName = `tally_mapped_${reconciliationId}`;
    const tallyColumns_sql = validMappings
      .map(m => `feature${m.featureNum} TEXT`)
      .join(', ');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tallyTableName} (
        id SERIAL PRIMARY KEY,
        ${tallyColumns_sql},
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert GST data with normalized values
    for (const row of gstData) {
      const values = validMappings.map(m => normalizeValueForDB(row[m.gstCol] || null));
      const placeholders = validMappings.map((_, i) => `$${i + 1}`).join(', ');
      const featureNames = validMappings.map(m => `feature${m.featureNum}`).join(', ');

      await pool.query(
        `INSERT INTO ${gstTableName} (${featureNames}, created_at) VALUES (${placeholders}, NOW())`,
        values
      );
    }

    // Insert Tally data with normalized values
    for (const row of tallyData) {
      const values = validMappings.map(m => normalizeValueForDB(row[m.tallyCol] || null));
      const placeholders = validMappings.map((_, i) => `$${i + 1}`).join(', ');
      const featureNames = validMappings.map(m => `feature${m.featureNum}`).join(', ');

      await pool.query(
        `INSERT INTO ${tallyTableName} (${featureNames}, created_at) VALUES (${placeholders}, NOW())`,
        values
      );
    }

    // Store column mapping metadata
    await pool.query(
      'INSERT INTO column_mappings (reconciliation_id, gst_columns, tally_columns, created_at) VALUES ($1, $2, $3, NOW())',
      [reconciliationId, JSON.stringify(gstCols), JSON.stringify(tallyCols)]
    );

    console.log(`Mapped data stored successfully in tables: ${gstTableName}, ${tallyTableName}`);
  } catch (error) {
    console.error('Error storing mapped data:', error);
    throw error;
  }
}

// Get all mapping logs
app.get('/api/mapping-logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mapping_logs ORDER BY created_at DESC');
    res.json({ logs: result.rows });
  } catch (error) {
    console.error('Error fetching mapping logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete mapping log
app.delete('/api/mapping-logs/:logId', async (req, res) => {
  try {
    const { logId } = req.params;
    
    // Get the log to find table names
    const logResult = await pool.query('SELECT gst_table_name, tally_table_name FROM mapping_logs WHERE id = $1', [logId]);
    if (logResult.rows.length === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }

    const { gst_table_name, tally_table_name } = logResult.rows[0];

    // Drop the tables
    await pool.query(`DROP TABLE IF EXISTS ${gst_table_name}`);
    await pool.query(`DROP TABLE IF EXISTS ${tally_table_name}`);

    // Delete the log
    await pool.query('DELETE FROM mapping_logs WHERE id = $1', [logId]);

    res.json({ success: true, message: 'Mapping log deleted' });
  } catch (error) {
    console.error('Error deleting mapping log:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export mapping log data
app.get('/api/export-log/:logId', async (req, res) => {
  try {
    const { logId } = req.params;
    
    const logResult = await pool.query('SELECT gst_table_name, tally_table_name FROM mapping_logs WHERE id = $1', [logId]);
    if (logResult.rows.length === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }

    const { gst_table_name, tally_table_name } = logResult.rows[0];

    // Get data from both tables
    const gstResult = await pool.query(`SELECT * FROM ${gst_table_name}`);
    const tallyResult = await pool.query(`SELECT * FROM ${tally_table_name}`);

    // Create CSV content
    let csvContent = 'GST 2B Data\n';
    if (gstResult.rows.length > 0) {
      const headers = Object.keys(gstResult.rows[0]).join(',');
      csvContent += headers + '\n';
      gstResult.rows.forEach(row => {
        const values = Object.values(row).map(v => `"${v}"`).join(',');
        csvContent += values + '\n';
      });
    }

    csvContent += '\n\nTally Data\n';
    if (tallyResult.rows.length > 0) {
      const headers = Object.keys(tallyResult.rows[0]).join(',');
      csvContent += headers + '\n';
      tallyResult.rows.forEach(row => {
        const values = Object.values(row).map(v => `"${v}"`).join(',');
        csvContent += values + '\n';
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="mapping_log_${logId}.csv"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting mapping log:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save mapping endpoint - stores mapped data in tables and creates a log
app.post('/api/save-mapping', async (req, res) => {
  try {
    const { uploadId, gstColumns, tallyColumns, gstHeaderRow, tallyHeaderRow } = req.body;

    if (!uploadId || !gstColumns || !tallyColumns) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Get upload data
    const uploadResult = await pool.query('SELECT gst_data, tally_data FROM uploads WHERE id = $1', [uploadId]);
    if (uploadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    const { gst_data, tally_data } = uploadResult.rows[0];
    const gstData = typeof gst_data === 'string' ? JSON.parse(gst_data) : gst_data;
    const tallyData = typeof tally_data === 'string' ? JSON.parse(tally_data) : tally_data;

    // Filter out empty mappings
    const validMappings = gstColumns
      .map((gstCol, idx) => ({
        gstCol,
        tallyCol: tallyColumns[idx],
        featureNum: idx + 1
      }))
      .filter(m => m.gstCol && m.tallyCol);

    if (validMappings.length === 0) {
      return res.status(400).json({ error: 'No valid column mappings found' });
    }

    // Create dynamic table names
    const logId = Date.now();
    const gstTableName = `gst_mapped_log_${logId}`;
    const tallyTableName = `tally_mapped_log_${logId}`;

    // Create GST table
    const gstColumns_sql = validMappings
      .map(m => `feature${m.featureNum} TEXT`)
      .join(', ');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${gstTableName} (
        id SERIAL PRIMARY KEY,
        ${gstColumns_sql},
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create Tally table
    const tallyColumns_sql = validMappings
      .map(m => `feature${m.featureNum} TEXT`)
      .join(', ');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${tallyTableName} (
        id SERIAL PRIMARY KEY,
        ${tallyColumns_sql},
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Skip rows before header row
    const gstDataFiltered = gstData.slice(gstHeaderRow - 1);
    const tallyDataFiltered = tallyData.slice(tallyHeaderRow - 1);

    // Insert GST data
    for (const row of gstDataFiltered) {
      const values = validMappings.map(m => normalizeValueForDB(row[m.gstCol] || null));
      const placeholders = validMappings.map((_, i) => `$${i + 1}`).join(', ');
      const featureNames = validMappings.map(m => `feature${m.featureNum}`).join(', ');

      await pool.query(
        `INSERT INTO ${gstTableName} (${featureNames}, created_at) VALUES (${placeholders}, NOW())`,
        values
      );
    }

    // Insert Tally data
    for (const row of tallyDataFiltered) {
      const values = validMappings.map(m => normalizeValueForDB(row[m.tallyCol] || null));
      const placeholders = validMappings.map((_, i) => `$${i + 1}`).join(', ');
      const featureNames = validMappings.map(m => `feature${m.featureNum}`).join(', ');

      await pool.query(
        `INSERT INTO ${tallyTableName} (${featureNames}, created_at) VALUES (${placeholders}, NOW())`,
        values
      );
    }

    // Store mapping log
    const logResult = await pool.query(
      `INSERT INTO mapping_logs (upload_id, gst_columns, tally_columns, gst_header_row, tally_header_row, gst_table_name, tally_table_name, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id`,
      [uploadId, gstColumns, tallyColumns, gstHeaderRow, tallyHeaderRow, gstTableName, tallyTableName]
    );

    const savedLogId = logResult.rows[0].id;
    console.log(`Mapping saved successfully. Log ID: ${savedLogId}, Tables: ${gstTableName}, ${tallyTableName}`);

    return res.status(200).json({
      success: true,
      logId: savedLogId,
      gstTableName,
      tallyTableName,
      message: 'Mapping saved successfully'
    });
  } catch (error) {
    console.error('Save mapping error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
