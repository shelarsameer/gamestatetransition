import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, AlertTriangle, XCircle, Mail, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Record Not Found - RED Category
const recordNotFoundData = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-078',
    gstin: '27AABCT1234L1Z5',
    supplierName: 'ABC Technologies Pvt Ltd',
    supplierEmail: 'accounts@abctech.com',
    invoiceDate: '2024-06-10',
    invoiceValue: 145000,
    mismatchCategory: 'Record not found in GSTR-2A',
    comments: 'Invoice missing in supplier GSTR-1 filing'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-125',
    gstin: '29AABCT5678M2Z8',
    supplierName: 'XYZ Manufacturing Ltd',
    supplierEmail: 'billing@xyzmanuf.com',
    invoiceDate: '2024-06-14',
    invoiceValue: 234000,
    mismatchCategory: 'Record not found in Books',
    comments: 'Invoice found in GSTR-2A but missing in purchase register'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-167',
    gstin: '07AABCT9012H3Z1',
    supplierName: 'Megha Exports Ltd',
    supplierEmail: 'finance@meghaexports.com',
    invoiceDate: '2024-06-16',
    invoiceValue: 189000,
    mismatchCategory: 'Record not found in GSTR-2A',
    comments: 'Supplier has not filed GSTR-1 for this period'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-198',
    gstin: '19AABCT3456I4Z9',
    supplierName: 'Global Trading Co',
    supplierEmail: 'accounts@globaltrading.in',
    invoiceDate: '2024-06-19',
    invoiceValue: 298000,
    mismatchCategory: 'Record not found in GSTR-2A',
    comments: 'Invoice not reported by supplier in GSTR-1'
  },
  {
    id: 5,
    invoiceNumber: 'INV-2024-234',
    gstin: '24AABCT7890K4Z3',
    supplierName: 'Smart Solutions Ltd',
    supplierEmail: 'ap@smartsolutions.com',
    invoiceDate: '2024-06-23',
    invoiceValue: 167000,
    mismatchCategory: 'Record not found in Books',
    comments: 'Entry missing in purchase ledger - needs reconciliation'
  },
];

// Data Mismatch - AMBER Category
const dataMismatchData = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-056',
    gstin: '33AABCT2345L5Z6',
    supplierName: 'TechPro Industries',
    supplierEmail: 'accounts@techpro.in',
    invoiceDate: '2024-06-08',
    invoiceValue: 156000,
    gstr2aValue: 155500,
    mismatchType: 'Amount Mismatch',
    mismatchCategory: 'GST value difference - ₹500',
    comments: 'Minor GST calculation difference'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-089',
    gstin: '36AABCT6789M6Z4',
    supplierName: 'Prime Electronics',
    supplierEmail: 'billing@primeelectronics.com',
    invoiceDate: '2024-06-11',
    invoiceValue: 234500,
    gstr2aValue: 234500,
    mismatchType: 'Name Mismatch',
    mismatchCategory: 'Supplier name difference - "Prime Elect. Pvt Ltd" vs "Prime Electronics"',
    comments: 'Abbreviated name in GSTR-2A'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-134',
    gstin: '09AABCT4567N7Z2',
    supplierName: 'Metro Supplies',
    supplierEmail: 'finance@metrosupplies.in',
    invoiceDate: '2024-06-15',
    invoiceValue: 187000,
    gstr2aValue: 186200,
    mismatchType: 'Combination Mismatch',
    mismatchCategory: 'GST diff + Date diff - Value ₹800, Date off by 1 day',
    comments: 'Multiple field discrepancies detected'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-176',
    gstin: '22AABCT8901O8Z5',
    supplierName: 'Sunrise Manufacturing',
    supplierEmail: 'accounts@sunrisemfg.com',
    invoiceDate: '2024-06-18',
    invoiceValue: 298000,
    gstr2aValue: 295000,
    mismatchType: 'Amount Mismatch',
    mismatchCategory: 'Taxable value difference - ₹3,000',
    comments: 'Significant amount discrepancy - needs verification'
  },
  {
    id: 5,
    invoiceNumber: 'INV-2024-209',
    gstin: '11AABCT5432P9Z7',
    supplierName: 'Quality Components Ltd',
    supplierEmail: 'ap@qualitycomp.com',
    invoiceDate: '2024-06-21',
    invoiceValue: 145000,
    gstr2aValue: 145000,
    mismatchType: 'GSTIN Mismatch',
    mismatchCategory: 'GSTIN format difference - "11AABCT5432P9Z7" vs "11AABCT5432P1Z7"',
    comments: 'Check digit mismatch in GSTIN'
  },
  {
    id: 6,
    invoiceNumber: 'INV-2024-245',
    gstin: '27AABCT9876Q1Z3',
    supplierName: 'Excel Trading Co',
    supplierEmail: 'billing@exceltrade.in',
    invoiceDate: '2024-06-24',
    invoiceValue: 176500,
    gstr2aValue: 176500,
    mismatchType: 'Date Mismatch',
    mismatchCategory: 'Invoice date difference - 3 days variance',
    comments: 'Date recorded differently in systems'
  },
];

export function MismatchRecordsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('june');

  const handleEmailSupplier = (supplierEmail: string, invoiceNumber: string) => {
    const subject = encodeURIComponent(`Invoice Reconciliation Required - ${invoiceNumber}`);
    const body = encodeURIComponent(
      `Dear Supplier,\n\nWe have identified a discrepancy in invoice ${invoiceNumber} during our GST reconciliation process.\n\nPlease review and provide clarification at your earliest convenience.\n\nThank you for your cooperation.\n\nBest regards,\nFinGuru GST Recon Team`
    );
    window.location.href = `mailto:${supplierEmail}?subject=${subject}&body=${body}`;
  };

  const filteredRecordNotFound = recordNotFoundData.filter(record =>
    record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDataMismatch = dataMismatchData.filter(record =>
    record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalNotFoundValue = recordNotFoundData.reduce((sum, record) => sum + record.invoiceValue, 0);
  const totalMismatchValue = dataMismatchData.reduce((sum, record) => sum + record.invoiceValue, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Record Not Found</p>
                <p className="text-2xl text-gray-900 mt-1">{recordNotFoundData.length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Data Mismatch</p>
                <p className="text-2xl text-gray-900 mt-1">{dataMismatchData.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Impact</p>
                <p className="text-2xl text-gray-900 mt-1">₹{((totalNotFoundValue + totalMismatchValue) / 100000).toFixed(2)}L</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600">₹</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending Actions</p>
                <p className="text-2xl text-gray-900 mt-1">{recordNotFoundData.length + dataMismatchData.length}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
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

      {/* Tabs for Categories */}
      <Tabs defaultValue="not-found" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="not-found" className="flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>Record Not Found ({recordNotFoundData.length})</span>
          </TabsTrigger>
          <TabsTrigger value="data-mismatch" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Data Mismatch ({dataMismatchData.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Record Not Found Tab */}
        <TabsContent value="not-found" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  Record Not Found - Critical
                </CardTitle>
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-red-50">
                      <TableHead className="w-[120px]">Invoice #</TableHead>
                      <TableHead className="w-[150px]">GSTIN</TableHead>
                      <TableHead className="w-[180px]">Supplier Name</TableHead>
                      <TableHead className="w-[120px]">Invoice Date</TableHead>
                      <TableHead className="w-[130px]">Invoice Value</TableHead>
                      <TableHead className="w-[120px]">Category</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecordNotFound.length > 0 ? (
                      filteredRecordNotFound.map((record) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm">{record.invoiceNumber}</TableCell>
                          <TableCell className="font-mono text-sm">{record.gstin}</TableCell>
                          <TableCell>{record.supplierName}</TableCell>
                          <TableCell>{new Date(record.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                          <TableCell>₹{record.invoiceValue.toLocaleString('en-IN')}</TableCell>
                          <TableCell>
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              <XCircle className="h-3 w-3 mr-1" />
                              RED
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{record.comments}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleEmailSupplier(record.supplierEmail, record.invoiceNumber)}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Critical - Record Not Found</p>
                    <p className="text-xs text-gray-600 mt-1">
                      These invoices are either missing in GSTR-2A (supplier hasn't reported) or missing in your books. 
                      Contact suppliers immediately to resolve ITC claim issues.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Mismatch Tab */}
        <TabsContent value="data-mismatch" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                  Data Mismatch - Requires Attention
                </CardTitle>
                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="w-[120px]">Invoice #</TableHead>
                      <TableHead className="w-[150px]">GSTIN</TableHead>
                      <TableHead className="w-[180px]">Supplier Name</TableHead>
                      <TableHead className="w-[100px]">Books Value</TableHead>
                      <TableHead className="w-[100px]">GSTR-2A Value</TableHead>
                      <TableHead className="w-[120px]">Mismatch Type</TableHead>
                      <TableHead>Category/Details</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDataMismatch.length > 0 ? (
                      filteredDataMismatch.map((record) => (
                        <TableRow key={record.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-sm">{record.invoiceNumber}</TableCell>
                          <TableCell className="font-mono text-sm">{record.gstin}</TableCell>
                          <TableCell>{record.supplierName}</TableCell>
                          <TableCell>₹{record.invoiceValue.toLocaleString('en-IN')}</TableCell>
                          <TableCell>₹{record.gstr2aValue?.toLocaleString('en-IN') || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              AMBER
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{record.mismatchCategory}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleEmailSupplier(record.supplierEmail, record.invoiceNumber)}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No data mismatches found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">Data Discrepancies Detected</p>
                    <p className="text-xs text-gray-600 mt-1">
                      These records exist in both systems but have differences in GST values, supplier names, dates, or combinations thereof. 
                      Contact suppliers to verify and correct the discrepancies.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}