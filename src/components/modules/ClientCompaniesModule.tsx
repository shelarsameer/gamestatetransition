import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Building2, MapPin, Phone, Mail, FileText, Edit, Eye, Trash2, Plus, IndianRupee } from 'lucide-react';

const clientsData = [
  {
    id: 1,
    name: 'TechCorp India Pvt Ltd',
    gstin: '27AABCT1234F1Z5',
    location: 'Mumbai, Maharashtra',
    phone: '+91-22-2345-6789',
    email: 'accounts@techcorp.in',
    invoiceCount: 145,
    returnsFiled: 12,
    consultantAssigned: 'CA Rajesh Kumar',
    annualTurnover: '2.5 Cr',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Global Traders Pvt Ltd',
    gstin: '29AABCT5678G2Z8',
    location: 'Bangalore, Karnataka',
    phone: '+91-80-4567-8901',
    email: 'gst@globaltraders.in',
    invoiceCount: 98,
    returnsFiled: 10,
    consultantAssigned: 'CA Priya Sharma',
    annualTurnover: '1.8 Cr',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Megha Exports Ltd',
    gstin: '07AABCT9012H3Z1',
    location: 'New Delhi, Delhi',
    phone: '+91-11-9876-5432',
    email: 'finance@meghaexports.com',
    invoiceCount: 76,
    returnsFiled: 8,
    consultantAssigned: 'CA Amit Verma',
    annualTurnover: '1.2 Cr',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Sunrise Manufacturing',
    gstin: '24AABCT3456I4Z9',
    location: 'Ahmedabad, Gujarat',
    phone: '+91-79-6543-2109',
    email: 'accounts@sunrisemfg.in',
    invoiceCount: 52,
    returnsFiled: 6,
    consultantAssigned: 'CA Neha Patel',
    annualTurnover: '0.9 Cr',
    status: 'Onboarding'
  }
];

const industryOptions = [
  'Manufacturing',
  'Trading',
  'Services',
  'IT/Software',
  'Export/Import',
  'Retail',
  'Construction',
  'Healthcare',
  'Education',
  'Hospitality'
];

export function ClientCompaniesModule() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    gstin: '',
    pan: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    industry: '',
    consultantAssigned: '',
    annualTurnover: ''
  });

  const handleAddClient = () => {
    console.log('Adding client:', newClient);
    setIsAddClientOpen(false);
    setNewClient({
      name: '',
      gstin: '',
      pan: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      industry: '',
      consultantAssigned: '',
      annualTurnover: ''
    });
  };

  const handleViewDetails = (client: any) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Onboarding':
        return <Badge className="bg-orange-100 text-orange-800">Onboarding</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Client Companies</h2>
          <p className="text-gray-600">Manage client companies and their GST compliance</p>
        </div>
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client Company</DialogTitle>
              <DialogDescription>
                Register a new client for GST reconciliation and compliance services.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  value={newClient.gstin}
                  onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value })}
                  placeholder="27AABCT1234F1Z5"
                  maxLength={15}
                />
              </div>
              <div>
                <Label htmlFor="pan">PAN</Label>
                <Input
                  id="pan"
                  value={newClient.pan}
                  onChange={(e) => setNewClient({ ...newClient, pan: e.target.value })}
                  placeholder="AABCT1234F"
                  maxLength={10}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newClient.city}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={newClient.state}
                  onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+91-XX-XXXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="accounts@company.com"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry Type</Label>
                <Select value={newClient.industry} onValueChange={(value) => setNewClient({ ...newClient, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="consultant">Consultant Assigned</Label>
                <Select value={newClient.consultantAssigned} onValueChange={(value) => setNewClient({ ...newClient, consultantAssigned: value })}>
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
              <div>
                <Label htmlFor="turnover">Annual Turnover (₹ Cr)</Label>
                <Input
                  id="turnover"
                  type="number"
                  step="0.1"
                  value={newClient.annualTurnover}
                  onChange={(e) => setNewClient({ ...newClient, annualTurnover: e.target.value })}
                  placeholder="2.5"
                />
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddClient} className="bg-blue-600 hover:bg-blue-700">
                Add Client
              </Button>
              <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl text-gray-900">{clientsData.length}</p>
                <p className="text-sm text-green-600">4 active states</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl text-gray-900">{clientsData.reduce((sum, client) => sum + client.invoiceCount, 0)}</p>
                <p className="text-sm text-purple-600">Processed this month</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Returns Filed</p>
                <p className="text-2xl text-gray-900">{clientsData.reduce((sum, client) => sum + client.returnsFiled, 0)}</p>
                <p className="text-sm text-green-600">This quarter</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Combined Turnover</p>
                <p className="text-2xl text-gray-900">₹6.4 Cr</p>
                <p className="text-sm text-indigo-600">Annual aggregate</p>
              </div>
              <IndianRupee className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client List */}
      <Card>
        <CardHeader>
          <CardTitle>Client Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Returns</TableHead>
                <TableHead>Turnover</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientsData.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500">Consultant: {client.consultantAssigned}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-700 font-mono">{client.gstin}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{client.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{client.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{client.invoiceCount}</TableCell>
                  <TableCell className="text-center">{client.returnsFiled}</TableCell>
                  <TableCell>₹{client.annualTurnover}</TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(client)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedClient?.name} - Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about this client company.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>GSTIN</Label>
                  <p className="text-gray-900 font-mono">{selectedClient.gstin}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-gray-900">{selectedClient.location}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-gray-900">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-gray-900">{selectedClient.email}</p>
                </div>
                <div>
                  <Label>Consultant Assigned</Label>
                  <p className="text-gray-900">{selectedClient.consultantAssigned}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedClient.status)}</div>
                </div>
              </div>
              <div>
                <Label>Compliance Metrics</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-900">{selectedClient.invoiceCount}</p>
                    <p className="text-sm text-gray-600">Invoices Processed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-900">{selectedClient.returnsFiled}</p>
                    <p className="text-sm text-gray-600">Returns Filed</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-900">₹{selectedClient.annualTurnover}</p>
                    <p className="text-sm text-gray-600">Annual Turnover</p>
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
