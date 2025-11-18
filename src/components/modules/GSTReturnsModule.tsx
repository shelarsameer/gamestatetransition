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
import { FileText, Calendar, CheckCircle, Clock, AlertTriangle, Plus, Download, Upload } from 'lucide-react';

const returnsData = [
  {
    id: 1,
    client: 'TechCorp India Pvt Ltd',
    gstin: '27AABCT1234F1Z5',
    returnType: 'GSTR-1',
    period: 'October 2024',
    dueDate: '2024-11-11',
    filedDate: '2024-11-08',
    status: 'Filed',
    taxableValue: 2500000,
    taxAmount: 450000,
    consultant: 'CA Rajesh Kumar'
  },
  {
    id: 2,
    client: 'Global Traders Pvt Ltd',
    gstin: '29AABCT5678G2Z8',
    returnType: 'GSTR-3B',
    period: 'October 2024',
    dueDate: '2024-11-20',
    filedDate: '2024-11-18',
    status: 'Filed',
    taxableValue: 1800000,
    taxAmount: 324000,
    consultant: 'CA Priya Sharma'
  },
  {
    id: 3,
    client: 'Megha Exports Ltd',
    gstin: '07AABCT9012H3Z1',
    returnType: 'GSTR-1',
    period: 'October 2024',
    dueDate: '2024-11-11',
    filedDate: null,
    status: 'Pending',
    taxableValue: 1200000,
    taxAmount: 216000,
    consultant: 'CA Amit Verma'
  },
  {
    id: 4,
    client: 'Sunrise Manufacturing',
    gstin: '24AABCT3456I4Z9',
    returnType: 'GSTR-3B',
    period: 'October 2024',
    dueDate: '2024-11-20',
    filedDate: null,
    status: 'In Progress',
    taxableValue: 900000,
    taxAmount: 162000,
    consultant: 'CA Neha Patel'
  },
  {
    id: 5,
    client: 'TechCorp India Pvt Ltd',
    gstin: '27AABCT1234F1Z5',
    returnType: 'GSTR-9',
    period: 'FY 2023-24',
    dueDate: '2024-12-31',
    filedDate: null,
    status: 'Draft',
    taxableValue: 28000000,
    taxAmount: 5040000,
    consultant: 'CA Rajesh Kumar'
  }
];

export function GSTReturnsModule() {
  const [isNewReturnOpen, setIsNewReturnOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  const handleViewDetails = (returnData: any) => {
    setSelectedReturn(returnData);
    setIsViewDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Filed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Filed
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Draft':
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        );
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

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalReturns = returnsData.length;
  const filedReturns = returnsData.filter(r => r.status === 'Filed').length;
  const pendingReturns = returnsData.filter(r => r.status === 'Pending' || r.status === 'In Progress').length;
  const complianceRate = Math.round((filedReturns / totalReturns) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">GST Returns</h2>
          <p className="text-gray-600">Manage and track GST return filings for all clients</p>
        </div>
        <Dialog open={isNewReturnOpen} onOpenChange={setIsNewReturnOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Initiate Return
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Initiate GST Return Filing</DialogTitle>
              <DialogDescription>
                Start a new GST return filing process for a client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Select Client</Label>
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
                <Label htmlFor="return-type">Return Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select return type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gstr1">GSTR-1 (Outward Supplies)</SelectItem>
                    <SelectItem value="gstr3b">GSTR-3B (Summary Return)</SelectItem>
                    <SelectItem value="gstr9">GSTR-9 (Annual Return)</SelectItem>
                    <SelectItem value="gstr9c">GSTR-9C (Reconciliation Statement)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">Filing Period</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nov-2024">November 2024</SelectItem>
                    <SelectItem value="oct-2024">October 2024</SelectItem>
                    <SelectItem value="sep-2024">September 2024</SelectItem>
                    <SelectItem value="fy-2023-24">FY 2023-24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consultant">Assign Consultant</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select consultant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca-rajesh">CA Rajesh Kumar</SelectItem>
                    <SelectItem value="ca-priya">CA Priya Sharma</SelectItem>
                    <SelectItem value="ca-amit">CA Amit Verma</SelectItem>
                    <SelectItem value="ca-neha">CA Neha Patel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Return
              </Button>
              <Button variant="outline" onClick={() => setIsNewReturnOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Returns Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className="text-2xl text-gray-900">{totalReturns}</p>
                <p className="text-sm text-blue-600">All periods</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Filed</p>
                <p className="text-2xl text-gray-900">{filedReturns}</p>
                <p className="text-sm text-green-600">{complianceRate}% on time</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl text-gray-900">{pendingReturns}</p>
                <p className="text-sm text-orange-600">Action required</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl text-gray-900">3</p>
                <p className="text-sm text-purple-600">Next 7 days</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Filing Rate</span>
                <span className="text-sm text-gray-900">{complianceRate}%</span>
              </div>
              <Progress value={complianceRate} className="h-2" />
            </div>
            <div className="grid grid-cols-4 gap-4 pt-2">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-lg text-green-800">{filedReturns}</p>
                <p className="text-sm text-gray-600">Filed</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-lg text-blue-800">
                  {returnsData.filter(r => r.status === 'In Progress').length}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-lg text-orange-800">
                  {returnsData.filter(r => r.status === 'Pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-800">
                  {returnsData.filter(r => r.status === 'Draft').length}
                </p>
                <p className="text-sm text-gray-600">Draft</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Return Filings</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Return Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Filed Date</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Consultant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returnsData.map((returnData) => {
                const daysUntilDue = getDaysUntilDue(returnData.dueDate);
                const isOverdue = daysUntilDue < 0 && !returnData.filedDate;
                
                return (
                  <TableRow key={returnData.id}>
                    <TableCell>
                      <p className="text-gray-900 text-sm">{returnData.client}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono text-gray-700">{returnData.gstin}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{returnData.returnType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{returnData.period}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                          {returnData.dueDate}
                        </span>
                      </div>
                      {!returnData.filedDate && (
                        <p className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                          {isOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `${daysUntilDue} days left`}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {returnData.filedDate ? (
                        <span className="text-sm text-gray-600">{returnData.filedDate}</span>
                      ) : (
                        <span className="text-sm text-gray-400">Not filed</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(returnData.taxAmount)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{returnData.consultant}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(returnData.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(returnData)}>
                          View
                        </Button>
                        {returnData.status !== 'Filed' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <Upload className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Return Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Return Details - {selectedReturn?.returnType}</DialogTitle>
            <DialogDescription>
              Complete filing information and status.
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client</Label>
                  <p className="text-gray-900">{selectedReturn.client}</p>
                </div>
                <div>
                  <Label>GSTIN</Label>
                  <p className="text-gray-900 font-mono">{selectedReturn.gstin}</p>
                </div>
                <div>
                  <Label>Return Type</Label>
                  <Badge variant="outline">{selectedReturn.returnType}</Badge>
                </div>
                <div>
                  <Label>Period</Label>
                  <p className="text-gray-900">{selectedReturn.period}</p>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <p className="text-gray-900">{selectedReturn.dueDate}</p>
                </div>
                <div>
                  <Label>Filed Date</Label>
                  <p className="text-gray-900">
                    {selectedReturn.filedDate || 'Not yet filed'}
                  </p>
                </div>
                <div>
                  <Label>Consultant</Label>
                  <p className="text-gray-900">{selectedReturn.consultant}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReturn.status)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-3 block">Tax Summary</Label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable Value:</span>
                    <span className="text-gray-900">{formatCurrency(selectedReturn.taxableValue)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-900">Total Tax Amount:</span>
                    <span className="text-gray-900">{formatCurrency(selectedReturn.taxAmount)}</span>
                  </div>
                </div>
              </div>

              {selectedReturn.status !== 'Filed' && (
                <div className="flex space-x-2">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    File Return
                  </Button>
                  <Button variant="outline">
                    Download Summary
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
