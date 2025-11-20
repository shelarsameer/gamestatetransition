import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, AlertTriangle, FileCheck, Download, Trash2, Calendar, File } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MappingLog {
  id: number;
  upload_id: number;
  gst_columns: string[];
  tally_columns: string[];
  gst_header_row: number;
  tally_header_row: number;
  gst_table_name: string;
  tally_table_name: string;
  created_at: string;
}

export function GSTReconModule() {
  const [mappingLogs, setMappingLogs] = useState<MappingLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<MappingLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMappingLogs();
  }, []);

  const fetchMappingLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mapping-logs');
      if (!response.ok) {
        throw new Error('Failed to fetch mapping logs');
      }
      const data = await response.json();
      setMappingLogs(data.logs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching mapping logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleReconcile = (log: MappingLog) => {
    setSelectedLog(log);
    // Reconciliation will be performed on the selected log's tables
  };

  const handleExport = async (log: MappingLog) => {
    try {
      const response = await fetch(`/api/export-log/${log.id}`);
      if (!response.ok) {
        throw new Error('Failed to export');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mapping_log_${log.id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleDelete = async (logId: number) => {
    if (!confirm('Are you sure you want to delete this mapping log?')) return;
    try {
      const response = await fetch(`/api/mapping-logs/${logId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      setMappingLogs(mappingLogs.filter(log => log.id !== logId));
      if (selectedLog?.id === logId) {
        setSelectedLog(null);
      }
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading mapping logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900">GST Reconciliation</h2>
        <p className="text-gray-600">Select a saved mapping to perform reconciliation</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapping Logs List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              {mappingLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No mapping logs found. Create one in Home.</p>
              ) : (
                <div className="space-y-2">
                  {mappingLogs.map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedLog?.id === log.id
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Log #{log.id}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(log.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {log.gst_columns.length} columns mapped
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Details and Operations */}
        <div className="lg:col-span-2">
          {selectedLog ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="exact">Exact Match</TabsTrigger>
                <TabsTrigger value="partial">Partial Match</TabsTrigger>
                <TabsTrigger value="mismatch">Mismatches</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mapping Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">GST 2B Columns ({selectedLog.gst_columns.length})</p>
                      <div className="mt-2 space-y-1">
                        {selectedLog.gst_columns.map((col, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            • {col}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700">Tally Columns ({selectedLog.tally_columns.length})</p>
                      <div className="mt-2 space-y-1">
                        {selectedLog.tally_columns.map((col, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            • {col}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600">
                        <strong>Created:</strong> {new Date(selectedLog.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>GST Table:</strong> {selectedLog.gst_table_name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Tally Table:</strong> {selectedLog.tally_table_name}
                      </p>
                    </div>

                    <div className="border-t pt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport(selectedLog)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(selectedLog.id)}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exact Matches Tab */}
              <TabsContent value="exact" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Exact Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Records where all mapped columns match exactly</p>
                    <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Run Exact Match Reconciliation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Partial Matches Tab */}
              <TabsContent value="partial" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                      Partial Matches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Records where primary columns match but others differ (fewer than 3 discrepancies)</p>
                    <Button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Run Partial Match Reconciliation
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mismatches Tab */}
              <TabsContent value="mismatch" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Mismatches
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">GST 2B Only</p>
                      <p className="text-xs text-gray-600 mt-1">Records in GST 2B but missing in Tally</p>
                      <Button className="mt-2 w-full bg-red-600 hover:bg-red-700">
                        <FileCheck className="h-4 w-4 mr-2" />
                        View GST 2B Mismatches
                      </Button>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-sm font-medium text-gray-700">Tally Only</p>
                      <p className="text-xs text-gray-600 mt-1">Records in Tally but missing in GST 2B</p>
                      <Button className="mt-2 w-full bg-purple-600 hover:bg-purple-700">
                        <FileCheck className="h-4 w-4 mr-2" />
                        View Tally Mismatches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <File className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a mapping log to view details and perform reconciliation</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}