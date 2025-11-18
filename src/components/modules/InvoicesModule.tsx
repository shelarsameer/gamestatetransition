import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Receipt, Upload, FileText, CheckCircle, AlertCircle, XCircle, Plus, IndianRupee, Calendar } from 'lucide-react';

const invoicesData = [
  {
    id: 1,
    invoiceNo: 'INV-2024-001',
    client: 'TechCorp India Pvt Ltd',
    gstin: '27AABCT1234F1Z5',
    date: '2024-10-15',
    amount: 125000,
    taxAmount: 22500,
    totalAmount: 147500,
    type: 'B2B',
    reconciliationStatus: 'Matched',
    gstr2aStatus: 'Available'
  },
  {
    id: 2,
    invoiceNo: 'INV-2024-002',
    client: 'Global Traders Pvt Ltd',
    gstin: '29AABCT5678G2Z8',
    date: '2024-10-18',
    amount: 89000,
    taxAmount: 16020,
    totalAmount: 105020,
    type: 'B2B',
    reconciliationStatus: 'Matched',
    gstr2aStatus: 'Available'
  },
  {
    id: 3,
    invoiceNo: 'INV-2024-003',
    client: 'Megha Exports Ltd',
    gstin: '07AABCT9012H3Z1',
    date: '2024-10-20',
    amount: 156000,
    taxAmount: 28080,
    totalAmount: 184080,
    type: 'Export',
    reconciliationStatus: 'Pending',
    gstr2aStatus: 'Not Available'
  },
  {
    id: 4,
    invoiceNo: 'INV-2024-004',
    client: 'Sunrise Manufacturing',
    gstin: '24AABCT3456I4Z9',
    date: '2024-10-22',
    amount: 67500,
    taxAmount: 12150,
    totalAmount: 79650,
    type: 'B2B',
    reconciliationStatus: 'Mismatch',
    gstr2aStatus: 'Available'
  }
];

export function InvoicesModule() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsViewDetailsOpen(true);
  };

  const getReconciliationBadge = (status: string) => {
    switch (status) {
      case 'Matched':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Matched
          </Badge>
        );
      case 'Mismatch':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Mismatch
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getGSTR2ABadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
      case 'Not Available':
        return <Badge className="bg-gray-100 text-gray-800">Not Available</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalInvoices = invoicesData.length;
  const matchedInvoices = invoicesData.filter(inv => inv.reconciliationStatus === 'Matched').length;
  const matchPercentage = Math.round((matchedInvoices / totalInvoices) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Reconcile invoices with GSTR-2A and track discrepancies</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Invoices
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Invoice Data</DialogTitle>
              <DialogDescription>
                Upload Excel/CSV file containing invoice details for reconciliation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-select">Select Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="techcorp">TechCorp India Pvt Ltd</SelectItem>
                    <SelectItem value="global">Global Traders Pvt Ltd</SelectItem>
                    <SelectItem value="megha">Megha Exports Ltd</SelectItem>
                    <SelectItem value="sunrise">Sunrise Manufacturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">GST Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oct-2024">October 2024</SelectItem>
                    <SelectItem value="sep-2024">September 2024</SelectItem>
                    <SelectItem value="aug-2024">August 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file-upload">Upload File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: Excel (.xlsx, .xls) or CSV (.csv)
                </p>
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Upload & Process
              </Button>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl text-gray-900">{totalInvoices}</p>
                <p className="text-sm text-blue-600">This month</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matched</p>
                <p className="text-2xl text-gray-900">{matchedInvoices}</p>
                <p className="text-sm text-green-600">{matchPercentage}% match rate</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Discrepancies</p>
                <p className="text-2xl text-gray-900">
                  {invoicesData.filter(inv => inv.reconciliationStatus === 'Mismatch').length}
                </p>
                <p className="text-sm text-red-600">Requires attention</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl text-gray-900">
                  ₹{Math.round(invoicesData.reduce((sum, inv) => sum + inv.totalAmount, 0) / 100000) / 10}L
                </p>
                <p className="text-sm text-indigo-600">Invoice amount</p>
              </div>
              <IndianRupee className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reconciliation Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Match Rate</span>
                <span className="text-sm text-gray-900">{matchPercentage}%</span>
              </div>
              <Progress value={matchPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg text-green-800">{matchedInvoices}</p>
                <p className="text-sm text-gray-600">Matched</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-lg text-yellow-800">
                  {invoicesData.filter(inv => inv.reconciliationStatus === 'Pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-lg text-red-800">
                  {invoicesData.filter(inv => inv.reconciliationStatus === 'Mismatch').length}
                </p>
                <p className="text-sm text-gray-600">Mismatched</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoice Records</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reconciliation</TableHead>
                <TableHead>GSTR-2A</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <span className="font-mono text-sm">{invoice.invoiceNo}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-900 text-sm">{invoice.client}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-700">{invoice.gstin}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-600">{invoice.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{formatCurrency(invoice.taxAmount)}</TableCell>
                  <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.type}</Badge>
                  </TableCell>
                  <TableCell>{getReconciliationBadge(invoice.reconciliationStatus)}</TableCell>
                  <TableCell>{getGSTR2ABadge(invoice.gstr2aStatus)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(invoice)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details - {selectedInvoice?.invoiceNo}</DialogTitle>
            <DialogDescription>
              Complete information and reconciliation status.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <p className="text-gray-900">{selectedInvoice.client}</p>
                </div>
                <div>
                  <Label>GSTIN</Label>
                  <p className="text-gray-900 font-mono">{selectedInvoice.gstin}</p>
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <p className="text-gray-900">{selectedInvoice.date}</p>
                </div>
                <div>
                  <Label>Invoice Type</Label>
                  <Badge variant="outline">{selectedInvoice.type}</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-3 block">Amount Breakdown</Label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable Amount:</span>
                    <span className="text-gray-900">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST Amount:</span>
                    <span className="text-gray-900">{formatCurrency(selectedInvoice.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-gray-900">{formatCurrency(selectedInvoice.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-3 block">Reconciliation Status</Label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    {getReconciliationBadge(selectedInvoice.reconciliationStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">GSTR-2A Status:</span>
                    {getGSTR2ABadge(selectedInvoice.gstr2aStatus)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
