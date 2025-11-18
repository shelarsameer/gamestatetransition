import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, AlertTriangle, Download, ArrowLeft } from 'lucide-react';

interface ReconciliationResult {
  id: string;
  upload_id: string;
  exact_matches: any[];
  partial_matches: any[];
  tally_mismatches: any[];
  gst_mismatches: any[];
  created_at: string;
}

export function ReconciliationResultsModule({ resultId }: { resultId: string }) {
  const [results, setResults] = useState<ReconciliationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [resultId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/results/${resultId}`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to load reconciliation results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Loading reconciliation results...</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">{error || 'Failed to load results'}</p>
      </div>
    );
  }

  const exactMatches = typeof results.exact_matches === 'string' ? JSON.parse(results.exact_matches || '[]') : (results.exact_matches || []);
  const allPartialMatches = typeof results.partial_matches === 'string' ? JSON.parse(results.partial_matches || '[]') : (results.partial_matches || []);
  const tallyMismatches = typeof results.tally_mismatches === 'string' ? JSON.parse(results.tally_mismatches || '[]') : (results.tally_mismatches || []);
  const gstMismatches = typeof results.gst_mismatches === 'string' ? JSON.parse(results.gst_mismatches || '[]') : (results.gst_mismatches || []);

  // Filter partial matches to keep only those with less than 3 discrepancies
  const partialMatches = allPartialMatches.filter((match: any) => {
    const discrepancies = match.discrepancies ? String(match.discrepancies).split('Mismatch').filter((s: string) => s.trim()).length : 0;
    return discrepancies < 3;
  });

  const totalRecords = exactMatches.length + partialMatches.length + tallyMismatches.length + gstMismatches.length;
  const matchPercentage = totalRecords > 0 ? Math.round(((exactMatches.length + partialMatches.length) / totalRecords) * 100) : 0;

  const summaryData = [
    { name: 'Exact Matches', value: exactMatches.length, color: '#10b981' },
    { name: 'Partial Matches', value: partialMatches.length, color: '#f59e0b' },
    { name: 'Tally Mismatches', value: tallyMismatches.length, color: '#ef4444' },
    { name: 'GST Mismatches', value: gstMismatches.length, color: '#8b5cf6' }
  ];

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/results/${resultId}/export`);
      const data = await response.json();
      
      const csv = convertToCSV(data[type]);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ].join('\n');
    
    return csv;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Reconciliation Results</h2>
          <p className="text-gray-600">Detailed analysis of matched and mismatched records</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exact Matches</p>
                <p className="text-2xl text-gray-900 mt-1">{exactMatches.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partial Matches</p>
                <p className="text-2xl text-gray-900 mt-1">{partialMatches.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tally Mismatches</p>
                <p className="text-2xl text-gray-900 mt-1">{tallyMismatches.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">GST Mismatches</p>
                <p className="text-2xl text-gray-900 mt-1">{gstMismatches.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Match Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {summaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Match Percentage */}
        <Card>
          <CardHeader>
            <CardTitle>Match Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Match Rate</span>
                <span className="text-2xl text-gray-900 font-semibold">{matchPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${matchPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Records Processed</span>
                <span className="text-gray-900 font-medium">{totalRecords}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Matched Records</span>
                <span className="text-green-600 font-medium">{exactMatches.length + partialMatches.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Unmatched Records</span>
                <span className="text-red-600 font-medium">{tallyMismatches.length + gstMismatches.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Tabs */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>GST Reconciliation Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="exact" className="w-full">
            <TabsList className="flex flex-wrap gap-2 mb-6 bg-transparent border-b border-gray-200 p-0 h-auto">
              <TabsTrigger value="exact" className="text-sm px-4 py-2 border-b-2 border-transparent data-[state=active]:border-green-600 rounded-none">
                Match | Type 1 ({exactMatches.length})
              </TabsTrigger>
              <TabsTrigger value="partial" className="text-sm px-4 py-2 border-b-2 border-transparent data-[state=active]:border-yellow-600 rounded-none">
                Match | Type 2 ({partialMatches.length})
              </TabsTrigger>
              <TabsTrigger value="gst" className="text-sm px-4 py-2 border-b-2 border-transparent data-[state=active]:border-purple-600 rounded-none">
                Mismatch | Type 1 ({gstMismatches.length})
              </TabsTrigger>
              <TabsTrigger value="tally" className="text-sm px-4 py-2 border-b-2 border-transparent data-[state=active]:border-red-600 rounded-none">
                Mismatch | Type 2 ({tallyMismatches.length})
              </TabsTrigger>
            </TabsList>

            {/* Match | Type 1 Tab - Found in both GST & Tally with all columns matching */}
            <TabsContent value="exact" className="mt-4">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-900">
                    <strong>Match | Type 1:</strong> Found in both GST & Tally with all mapped columns matching exactly
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('exact_matches')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700">GST Record</th>
                        <th className="px-4 py-2 text-left text-gray-700">Tally Record</th>
                        <th className="px-4 py-2 text-left text-gray-700">Match Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exactMatches.slice(0, 10).map((match: any, idx: number) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-600">
                            {JSON.stringify(match.gstRecord).substring(0, 50)}...
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {JSON.stringify(match.tallyRecord).substring(0, 50)}...
                          </td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {match.matchType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {exactMatches.length > 10 && (
                  <p className="text-sm text-gray-600">
                    Showing 10 of {exactMatches.length} records
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Match | Type 2 Tab - Found in both but some columns differ */}
            <TabsContent value="partial" className="mt-4">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Match | Type 2:</strong> Found in both GST & Tally but some mapped columns have different values
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('partial_matches')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700">GST Record</th>
                        <th className="px-4 py-2 text-left text-gray-700">Tally Record</th>
                        <th className="px-4 py-2 text-left text-gray-700">Discrepancies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partialMatches.slice(0, 10).map((match: any, idx: number) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-600">
                            {JSON.stringify(match.gstRecord).substring(0, 50)}...
                          </td>
                          <td className="px-4 py-2 text-gray-600">
                            {JSON.stringify(match.tallyRecord).substring(0, 50)}...
                          </td>
                          <td className="px-4 py-2 text-yellow-600 text-xs">
                            {match.discrepancies?.length || 0} fields differ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {partialMatches.length > 10 && (
                  <p className="text-sm text-gray-600">
                    Showing 10 of {partialMatches.length} records
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Mismatch | Type 2 Tab - Found in Tally but Missing in GST */}
            <TabsContent value="tally" className="mt-4">
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900">
                    <strong>Mismatch | Type 2:</strong> Found in Tally but Missing in GST
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('tally_mismatches')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700">Tally Record</th>
                        <th className="px-4 py-2 text-left text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tallyMismatches.slice(0, 10).map((mismatch: any, idx: number) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-600">
                            {JSON.stringify(mismatch.record).substring(0, 50)}...
                          </td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                              Missing in GST
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tallyMismatches.length > 10 && (
                  <p className="text-sm text-gray-600">
                    Showing 10 of {tallyMismatches.length} records
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Mismatch | Type 1 Tab - Found in GST but Missing in Tally */}
            <TabsContent value="gst" className="mt-4">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900">
                    <strong>Mismatch | Type 1:</strong> Found in GST but Missing in Tally
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport('gst_mismatches')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-700">GST Record</th>
                        <th className="px-4 py-2 text-left text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gstMismatches.slice(0, 10).map((mismatch: any, idx: number) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-600">
                            {JSON.stringify(mismatch.record).substring(0, 50)}...
                          </td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              Missing in Tally
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {gstMismatches.length > 10 && (
                  <p className="text-sm text-gray-600">
                    Showing 10 of {gstMismatches.length} records
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
