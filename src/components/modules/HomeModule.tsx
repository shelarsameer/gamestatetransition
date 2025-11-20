import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, FileCheck, TrendingUp, AlertTriangle, Clock, CheckCircle, Upload, MessageSquare, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function HomeModule() {
  const [gstFile, setGstFile] = useState<File | null>(null);
  const [tallyFile, setTallyFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [gstHeaders, setGstHeaders] = useState<string[]>([]);
  const [tallyHeaders, setTallyHeaders] = useState<string[]>([]);
  const [gstPreview, setGstPreview] = useState([]);
  const [tallyPreview, setTallyPreview] = useState([]);
  const [gstAllData, setGstAllData] = useState([]);
  const [tallyAllData, setTallyAllData] = useState([]);
  const [gstHeaderRow, setGstHeaderRow] = useState('1');
  const [tallyHeaderRow, setTallyHeaderRow] = useState('1');
  const [gstColumnMapping, setGstColumnMapping] = useState<string[]>([]);
  const [tallyColumnMapping, setTallyColumnMapping] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showColumnMapping, setShowColumnMapping] = useState(false);
  const [showHeaderSelection, setShowHeaderSelection] = useState(false);
  const [reconciliationInProgress, setReconciliationInProgress] = useState(false);
  const [numMappingPairs, setNumMappingPairs] = useState(1);

  const handleGstFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGstFile(e.target.files[0]);
    }
  };

  const handleTallyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTallyFile(e.target.files[0]);
    }
  };

  const handleUploadFiles = async () => {
    if (!gstFile || !tallyFile) {
      alert('Please select both GST and Tally files');
      return;
    }

    setIsUploading(true);
    try {
      console.log('Starting upload with files:', gstFile.name, tallyFile.name);
      const formData = new FormData();
      formData.append('gstFile', gstFile);
      formData.append('tallyFile', tallyFile);

      console.log('Sending request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      if (data.success) {
        console.log('Upload successful, showing header selection');
        console.log('Setting showHeaderSelection to true');
        setUploadId(data.uploadId);
        setGstAllData(data.gstAllData);
        setTallyAllData(data.tallyAllData);
        setGstHeaders(data.gstHeaders);
        setTallyHeaders(data.tallyHeaders);
        setGstPreview(data.gstPreview);
        setTallyPreview(data.tallyPreview);
        setGstColumnMapping([]);
        setTallyColumnMapping([]);
        setNumMappingPairs(1);
        setShowHeaderSelection(true);
        console.log('showHeaderSelection state updated');
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload files: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
      console.log('Upload complete');
    }
  };

  const handleHeaderRowChange = (source: 'gst' | 'tally', rowNum: string) => {
    const rowIndex = parseInt(rowNum) - 1;
    
    if (source === 'gst') {
      setGstHeaderRow(rowNum);
      if (gstAllData[rowIndex]) {
        // Get the column names from the current parsed data structure
        const currentColumnNames = Object.keys(gstAllData[rowIndex]);
        // Get the values from the selected row to use as new headers
        const selectedRow = gstAllData[rowIndex];
        const newHeaders = currentColumnNames.map(col => String(selectedRow[col]));
        setGstHeaders(newHeaders);
        // Reset mappings when header row changes
        setGstColumnMapping(new Array(newHeaders.length).fill(''));
      }
    } else {
      setTallyHeaderRow(rowNum);
      if (tallyAllData[rowIndex]) {
        // Get the column names from the current parsed data structure
        const currentColumnNames = Object.keys(tallyAllData[rowIndex]);
        // Get the values from the selected row to use as new headers
        const selectedRow = tallyAllData[rowIndex];
        const newHeaders = currentColumnNames.map(col => String(selectedRow[col]));
        setTallyHeaders(newHeaders);
        // Reset mappings when header row changes
        setTallyColumnMapping(new Array(newHeaders.length).fill(''));
      }
    }
  };

  const initializeDefaultMappings = () => {
    // Helper function to find best matching column (case-insensitive, ignoring special chars)
    const findMatchingColumn = (searchTerms: string[], availableColumns: string[]): string | null => {
      for (const term of searchTerms) {
        // Normalize search term: lowercase and remove special chars
        const normalizedTerm = term.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        for (const col of availableColumns) {
          // Normalize column name: lowercase and remove special chars
          const normalizedCol = col.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          if (normalizedCol === normalizedTerm || normalizedCol.includes(normalizedTerm)) {
            return col;
          }
        }
      }
      return null;
    };

    const defaultMappings = [
      { gst: ['GSTIN of supplier', 'gstin'], tally: ['GSTIN', 'gstin'] },
      { gst: ['Invoice number', 'invoice number', 'inv no'], tally: ['2B Invoice No', '2b invoice no', 'invoice no'] },
      { gst: ['Invoice Date', 'invoice date', 'date'], tally: ['Invoice Date', 'invoice date', 'date'] },
      { gst: ['Taxable Value', 'taxable value', 'taxable'], tally: ['Taxable Value', 'taxable value', 'taxable'] },
      { gst: ['Integrated Tax', 'integrated tax', 'igst'], tally: ['IGST', 'igst', 'integrated tax'] },
      { gst: ['Central Tax', 'central tax', 'cgst'], tally: ['CGST', 'cgst', 'central tax'] },
      { gst: ['State/UT Tax', 'state tax', 'sgst'], tally: ['SGST', 'sgst', 'state tax'] }
    ];

    const gstMappings: string[] = [];
    const tallyMappings: string[] = [];

    // Try to match all default mappings with flexible matching
    defaultMappings.forEach(mapping => {
      const gstMatch = findMatchingColumn(mapping.gst, gstHeaders);
      const tallyMatch = findMatchingColumn(mapping.tally, tallyHeaders);
      
      if (gstMatch && tallyMatch) {
        gstMappings.push(gstMatch);
        tallyMappings.push(tallyMatch);
      } else {
        gstMappings.push('');
        tallyMappings.push('');
      }
    });

    setGstColumnMapping(gstMappings);
    setTallyColumnMapping(tallyMappings);
    setNumMappingPairs(7);
  };

  const handleSaveMapping = async () => {
    if (!uploadId) return;

    setReconciliationInProgress(true);
    try {
      const response = await fetch('/api/save-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          gstColumns: gstColumnMapping,
          tallyColumns: tallyColumnMapping,
          gstHeaderRow: parseInt(gstHeaderRow),
          tallyHeaderRow: parseInt(tallyHeaderRow)
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);
      
      if (data.success) {
        alert('Mapping saved successfully! Log ID: ' + data.logId);
        // Reset the form
        setShowColumnMapping(false);
        setShowHeaderSelection(false);
        setGstFile(null);
        setTallyFile(null);
        setUploadId(null);
      } else {
        alert('Failed to save mapping: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save mapping error:', error);
      alert(`Failed to save mapping: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setReconciliationInProgress(false);
    }
  };

  const recentActivity = [
    { id: 1, action: 'New mismatch detected', client: 'Megha Exports Ltd', time: '2 hours ago', type: 'alert' },
    { id: 2, action: 'Reconciliation completed', client: 'TechCorp India Pvt Ltd', time: '4 hours ago', type: 'success' },
    { id: 3, action: 'Client added', client: 'Smart Solutions Ltd', time: '1 day ago', type: 'info' },
    { id: 4, action: 'Mismatch resolved', client: 'Sunrise Manufacturing', time: '2 days ago', type: 'success' },
  ];

  const quickStats = [
    { label: 'Active Clients', value: '42', icon: Building2, color: 'blue' },
    { label: 'Pending Mismatches', value: '15', icon: AlertTriangle, color: 'red' },
    { label: 'Resolved Today', value: '8', icon: CheckCircle, color: 'green' },
    { label: 'Due This Week', value: '12', icon: Clock, color: 'orange' },
  ];

  console.log('Rendering HomeModule - showColumnMapping:', showColumnMapping, 'showHeaderSelection:', showHeaderSelection);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900">Welcome to FinGuru GST Recon</h2>
        <p className="text-gray-600">Your intelligent GST reconciliation platform</p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files for Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          {showColumnMapping ? (
            // Column Mapping Interface
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Step 3:</strong> Map columns between GST and Tally files to ensure accurate reconciliation
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Column Mapping:</strong> Map GST columns to Tally columns for reconciliation
                  </p>
                </div>

                <div className="space-y-4">
                  {Array.from({ length: numMappingPairs }).map((_: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">GST Column</label>
                        <select
                          value={gstColumnMapping[idx] || ''}
                          onChange={(e: any) => {
                            const newMapping = [...gstColumnMapping];
                            newMapping[idx] = e.target.value;
                            setGstColumnMapping(newMapping);
                          }}
                          className="w-full p-2 border rounded-lg bg-white text-sm"
                        >
                          <option value="">-- Select GST Column --</option>
                          {gstHeaders.map((gstCol: string) => (
                            <option key={gstCol} value={gstCol}>
                              {gstCol}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-center">
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>

                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maps to Tally Column</label>
                        <select
                          value={tallyColumnMapping[idx] || ''}
                          onChange={(e: any) => {
                            const newMapping = [...tallyColumnMapping];
                            newMapping[idx] = e.target.value;
                            setTallyColumnMapping(newMapping);
                          }}
                          className="w-full p-2 border rounded-lg bg-white text-sm"
                        >
                          <option value="">-- Select Tally Column --</option>
                          {tallyHeaders.map((tallyCol: string) => (
                            <option key={tallyCol} value={tallyCol}>
                              {tallyCol}
                            </option>
                          ))}
                        </select>
                      </div>

                      {numMappingPairs > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newGstMapping = gstColumnMapping.filter((_: string, i: number) => i !== idx);
                            const newTallyMapping = tallyColumnMapping.filter((_: string, i: number) => i !== idx);
                            setGstColumnMapping(newGstMapping);
                            setTallyColumnMapping(newTallyMapping);
                            setNumMappingPairs(numMappingPairs - 1);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add More Button */}
                <Button
                  variant="outline"
                  onClick={() => setNumMappingPairs(numMappingPairs + 1)}
                  className="w-full"
                >
                  + Add More Column Mapping
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowColumnMapping(false);
                    setShowHeaderSelection(true);
                  }}
                >
                  Back
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={
                    !gstColumnMapping.some((m: string, idx: number) => m && tallyColumnMapping[idx]) || 
                    reconciliationInProgress
                  }
                  onClick={handleSaveMapping}
                >
                  {reconciliationInProgress ? 'Saving...' : 'Save Mapping'}
                </Button>
              </div>
            </div>
          ) : showHeaderSelection ? (
            // Header Row Selection Interface
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Step 2:</strong> Select header row for each file (skip unnecessary rows)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GST Header Row Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST 2B File Upload
                    </label>
                    <Select value={gstHeaderRow} onValueChange={(val: string) => handleHeaderRowChange('gst', val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gstAllData.map((_: any, idx: number) => (
                          <SelectItem key={idx} value={String(idx + 1)}>
                            Row {idx + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Select which row contains your headers</p>
                  </div>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-xs font-medium text-gray-700 mb-2">Columns in Row {gstHeaderRow}:</p>
                    <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                      {gstHeaders.map((col: string) => (
                        <div key={col} className="truncate">
                          • {col}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>Total Columns:</strong> {gstHeaders.length}
                    </p>
                    <p className="text-xs text-blue-900">
                      <strong>Total Rows:</strong> {gstAllData.length - parseInt(gstHeaderRow)}
                    </p>
                  </div>
                </div>

                {/* Tally Header Row Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tally File - Header Row
                    </label>
                    <Select value={tallyHeaderRow} onValueChange={(val: string) => handleHeaderRowChange('tally', val)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tallyAllData.map((_: any, idx: number) => (
                          <SelectItem key={idx} value={String(idx + 1)}>
                            Row {idx + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Select which row contains your headers</p>
                  </div>

                  <div className="border rounded-lg p-3 bg-gray-50">
                    <p className="text-xs font-medium text-gray-700 mb-2">Columns in Row {tallyHeaderRow}:</p>
                    <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                      {tallyHeaders.map((col: string) => (
                        <div key={col} className="truncate">
                          • {col}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-900">
                      <strong>Total Columns:</strong> {tallyHeaders.length}
                    </p>
                    <p className="text-xs text-blue-900">
                      <strong>Total Rows:</strong> {tallyAllData.length - parseInt(tallyHeaderRow)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowHeaderSelection(false);
                    setGstFile(null);
                    setTallyFile(null);
                  }}
                >
                  Back
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    console.log('Clicking Next: Column Mapping');
                    initializeDefaultMappings();
                    setShowColumnMapping(true);
                  }}
                >
                  Next: Column Mapping
                </Button>
              </div>
            </div>
          ) : (
            // File Upload Interface
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GST File Upload */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-700">GST 2B File Upload</span>
                    <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                            <span>Upload GST 2B file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".xlsx,.xls,.csv"
                              onChange={handleGstFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">XLSX, XLS, CSV up to 10MB</p>
                        {gstFile && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <p className="text-xs text-green-700 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {gstFile.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>

                {/* Tally File Upload */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-700">Tally File Upload (Books)</span>
                    <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-500 transition-colors cursor-pointer bg-gray-50 hover:bg-green-50">
                      <div className="space-y-2 text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500">
                            <span>Upload Tally file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept=".xlsx,.xls,.csv"
                              onChange={handleTallyFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">XLSX, XLS, CSV up to 10MB</p>
                        {tallyFile && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                            <p className="text-xs text-green-700 flex items-center justify-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {tallyFile.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Upload Action Button */}
              {(gstFile || tallyFile) && (
                <div className="mt-6 flex items-center justify-center">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    disabled={!gstFile || !tallyFile || isUploading}
                    onClick={handleUploadFiles}
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : (gstFile && tallyFile ? 'Next: Select Header Row' : 'Upload Both Files to Continue')}
                  </Button>
                </div>
              )}
            </>
          )
          }
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-24 flex flex-col items-center justify-center" style={{ backgroundColor: '#4E4260' }}>
              <FileCheck className="h-6 w-6 mb-2" />
              <span>Start Reconciliation</span>
            </Button>
            <Button className="h-24 flex flex-col items-center justify-center" style={{ backgroundColor: '#4E4260' }}>
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>View Analytics</span>
            </Button>
            <Button className="h-24 flex flex-col items-center justify-center" style={{ backgroundColor: '#4E4260' }}>
              <MessageSquare className="h-6 w-6 mb-2" />
              <span>Chat with Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {activity.type === 'alert' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                  {activity.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {activity.type === 'info' && <Building2 className="h-5 w-5 text-blue-600" />}
                  <div>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.client}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with AI-Powered Reconciliation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">1</div>
              <div>
                <p className="text-sm text-gray-900">Upload your GST and Tally data in CSV, Excel format</p>
                <p className="text-xs text-gray-600">Use the file upload section above to import both GSTR-2A and Tally books data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">2</div>
              <div>
                <p className="text-sm text-gray-900">Run automated GST reconciliation</p>
                <p className="text-xs text-gray-600">Our AI compares your books with GSTR-2A data</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">3</div>
              <div>
                <p className="text-sm text-gray-900">Review and resolve mismatches</p>
                <p className="text-xs text-gray-600">Check GST Recon for detailed mismatch records and resolution workflows</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">4</div>
              <div>
                <p className="text-sm text-gray-900">Explore analytics and insights</p>
                <p className="text-xs text-gray-600">View month-wise charts, trends, and frequent cases in the Analytics module</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">5</div>
              <div>
                <p className="text-sm text-gray-900">Chat with your data using AI</p>
                <p className="text-xs text-gray-600">Ask questions and get instant insights from your reconciliation data</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}