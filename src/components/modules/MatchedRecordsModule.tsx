import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, CheckCircle, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const matchedRecords = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    gstin: '27AABCT1234L1Z5',
    supplierName: 'ABC Technologies Pvt Ltd',
    invoiceDate: '2024-06-15',
    invoiceValue: 125000,
    matchStatus: 'green',
    comments: 'Perfect match - All fields verified'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-045',
    gstin: '29AABCT5678M2Z8',
    supplierName: 'XYZ Manufacturing Ltd',
    invoiceDate: '2024-06-18',
    invoiceValue: 89500,
    matchStatus: 'green',
    comments: 'Complete match - No discrepancies'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-089',
    gstin: '07AABCT9012H3Z1',
    supplierName: 'Megha Exports Ltd',
    invoiceDate: '2024-06-20',
    invoiceValue: 234000,
    matchStatus: 'green',
    comments: 'Verified - 100% match'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-112',
    gstin: '19AABCT3456I4Z9',
    supplierName: 'Global Trading Co',
    invoiceDate: '2024-06-22',
    invoiceValue: 156000,
    matchStatus: 'green',
    comments: 'Perfect match - All fields verified'
  },
  {
    id: 5,
    invoiceNumber: 'INV-2024-156',
    gstin: '24AABCT7890K4Z3',
    supplierName: 'Smart Solutions Ltd',
    invoiceDate: '2024-06-25',
    invoiceValue: 98000,
    matchStatus: 'green',
    comments: 'Complete match - No discrepancies'
  },
  {
    id: 6,
    invoiceNumber: 'INV-2024-189',
    gstin: '33AABCT2345L5Z6',
    supplierName: 'TechPro Industries',
    invoiceDate: '2024-06-27',
    invoiceValue: 187500,
    matchStatus: 'green',
    comments: 'Verified - 100% match'
  },
  {
    id: 7,
    invoiceNumber: 'INV-2024-203',
    gstin: '36AABCT6789M6Z4',
    supplierName: 'Prime Electronics',
    invoiceDate: '2024-06-28',
    invoiceValue: 245000,
    matchStatus: 'green',
    comments: 'Perfect match - All fields verified'
  },
  {
    id: 8,
    invoiceNumber: 'INV-2024-234',
    gstin: '09AABCT4567N7Z2',
    supplierName: 'Metro Supplies',
    invoiceDate: '2024-06-29',
    invoiceValue: 134500,
    matchStatus: 'green',
    comments: 'Complete match - No discrepancies'
  },
];

export function MatchedRecordsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('june');

  const filteredRecords = matchedRecords.filter(record =>
    record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = matchedRecords.reduce((sum, record) => sum + record.invoiceValue, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Matched</p>
                <p className="text-2xl text-gray-900 mt-1">{matchedRecords.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Value</p>
                <p className="text-2xl text-gray-900 mt-1">₹{(totalValue / 100000).toFixed(2)}L</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">₹</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Match Rate</p>
                <p className="text-2xl text-gray-900 mt-1">100%</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Unique Suppliers</p>
                <p className="text-2xl text-gray-900 mt-1">{new Set(matchedRecords.map(r => r.gstin)).size}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Matched Records - 100% Match
            </CardTitle>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Matched Records
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Invoice #, GSTIN, or Supplier Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="june">June 2024</SelectItem>
                <SelectItem value="may">May 2024</SelectItem>
                <SelectItem value="april">April 2024</SelectItem>
                <SelectItem value="all">All Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[120px]">Invoice #</TableHead>
                  <TableHead className="w-[150px]">GSTIN</TableHead>
                  <TableHead className="w-[200px]">Supplier Name</TableHead>
                  <TableHead className="w-[120px]">Invoice Date</TableHead>
                  <TableHead className="w-[130px]">Invoice Value</TableHead>
                  <TableHead className="w-[100px]">Match Status</TableHead>
                  <TableHead>Comments/Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{record.invoiceNumber}</TableCell>
                      <TableCell className="font-mono text-sm">{record.gstin}</TableCell>
                      <TableCell>{record.supplierName}</TableCell>
                      <TableCell>{new Date(record.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>₹{record.invoiceValue.toLocaleString('en-IN')}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          MATCHED
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{record.comments}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No matched records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <p>Showing {filteredRecords.length} of {matchedRecords.length} matched records</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900">
                All records shown above have achieved 100% match between your books and GSTR-2A data.
              </p>
              <p className="text-xs text-gray-600 mt-1">
                These invoices have been successfully reconciled with no discrepancies in Invoice Number, GSTIN, Supplier Name, Date, or Value.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
