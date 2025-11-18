import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Users, Mail, Phone, Building2, FileText, Award, Plus, Edit, Eye } from 'lucide-react';

const consultantsData = [
  {
    id: 1,
    name: 'CA Rajesh Kumar',
    membershipNo: 'CA-123456',
    email: 'rajesh.kumar@finguru.com',
    phone: '+91-98765-43210',
    specialization: 'GST Compliance & Returns',
    clientsAssigned: 12,
    returnsFiled: 48,
    yearsOfExperience: 8,
    qualifications: ['CA', 'CS'],
    status: 'Active'
  },
  {
    id: 2,
    name: 'CA Priya Sharma',
    membershipNo: 'CA-234567',
    email: 'priya.sharma@finguru.com',
    phone: '+91-98765-43211',
    specialization: 'Tax Reconciliation',
    clientsAssigned: 10,
    returnsFiled: 42,
    yearsOfExperience: 6,
    qualifications: ['CA', 'CMA'],
    status: 'Active'
  },
  {
    id: 3,
    name: 'CA Amit Verma',
    membershipNo: 'CA-345678',
    email: 'amit.verma@finguru.com',
    phone: '+91-98765-43212',
    specialization: 'Export-Import GST',
    clientsAssigned: 8,
    returnsFiled: 35,
    yearsOfExperience: 10,
    qualifications: ['CA', 'MBA'],
    status: 'Active'
  },
  {
    id: 4,
    name: 'CA Neha Patel',
    membershipNo: 'CA-456789',
    email: 'neha.patel@finguru.com',
    phone: '+91-98765-43213',
    specialization: 'Annual Returns & Audit',
    clientsAssigned: 7,
    returnsFiled: 28,
    yearsOfExperience: 5,
    qualifications: ['CA'],
    status: 'Active'
  },
  {
    id: 5,
    name: 'CA Vikram Singh',
    membershipNo: 'CA-567890',
    email: 'vikram.singh@finguru.com',
    phone: '+91-98765-43214',
    specialization: 'GST Litigation',
    clientsAssigned: 5,
    returnsFiled: 18,
    yearsOfExperience: 12,
    qualifications: ['CA', 'LLB'],
    status: 'On Leave'
  }
];

export function TaxConsultantsModule() {
  const [isAddConsultantOpen, setIsAddConsultantOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [newConsultant, setNewConsultant] = useState({
    name: '',
    membershipNo: '',
    email: '',
    phone: '',
    specialization: '',
    yearsOfExperience: '',
    qualifications: ''
  });

  const handleAddConsultant = () => {
    console.log('Adding consultant:', newConsultant);
    setIsAddConsultantOpen(false);
    setNewConsultant({
      name: '',
      membershipNo: '',
      email: '',
      phone: '',
      specialization: '',
      yearsOfExperience: '',
      qualifications: ''
    });
  };

  const handleViewDetails = (consultant: any) => {
    setSelectedConsultant(consultant);
    setIsViewDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'On Leave':
        return <Badge className="bg-orange-100 text-orange-800">On Leave</Badge>;
      case 'Inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Tax Consultants</h2>
          <p className="text-gray-600">Manage tax consultants and their client portfolios</p>
        </div>
        <Dialog open={isAddConsultantOpen} onOpenChange={setIsAddConsultantOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Consultant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tax Consultant</DialogTitle>
              <DialogDescription>
                Register a new tax consultant to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newConsultant.name}
                  onChange={(e) => setNewConsultant({ ...newConsultant, name: e.target.value })}
                  placeholder="CA First Last"
                />
              </div>
              <div>
                <Label htmlFor="membership">Membership Number</Label>
                <Input
                  id="membership"
                  value={newConsultant.membershipNo}
                  onChange={(e) => setNewConsultant({ ...newConsultant, membershipNo: e.target.value })}
                  placeholder="CA-123456"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newConsultant.email}
                  onChange={(e) => setNewConsultant({ ...newConsultant, email: e.target.value })}
                  placeholder="consultant@finguru.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newConsultant.phone}
                  onChange={(e) => setNewConsultant({ ...newConsultant, phone: e.target.value })}
                  placeholder="+91-XXXXX-XXXXX"
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newConsultant.specialization}
                  onChange={(e) => setNewConsultant({ ...newConsultant, specialization: e.target.value })}
                  placeholder="e.g., GST Compliance & Returns"
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newConsultant.yearsOfExperience}
                  onChange={(e) => setNewConsultant({ ...newConsultant, yearsOfExperience: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  value={newConsultant.qualifications}
                  onChange={(e) => setNewConsultant({ ...newConsultant, qualifications: e.target.value })}
                  placeholder="CA, CS, etc. (comma-separated)"
                />
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleAddConsultant} className="bg-blue-600 hover:bg-blue-700">
                Add Consultant
              </Button>
              <Button variant="outline" onClick={() => setIsAddConsultantOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Consultant Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Consultants</p>
                <p className="text-2xl text-gray-900">{consultantsData.length}</p>
                <p className="text-sm text-blue-600">In team</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Consultants</p>
                <p className="text-2xl text-gray-900">
                  {consultantsData.filter(c => c.status === 'Active').length}
                </p>
                <p className="text-sm text-green-600">Available</p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl text-gray-900">
                  {consultantsData.reduce((sum, c) => sum + c.clientsAssigned, 0)}
                </p>
                <p className="text-sm text-purple-600">Under management</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Returns Filed</p>
                <p className="text-2xl text-gray-900">
                  {consultantsData.reduce((sum, c) => sum + c.returnsFiled, 0)}
                </p>
                <p className="text-sm text-indigo-600">This quarter</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultant Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultantsData.map((consultant) => (
          <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                    {getInitials(consultant.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-gray-900">{consultant.name}</h3>
                      <p className="text-sm text-gray-500 font-mono">{consultant.membershipNo}</p>
                    </div>
                    {getStatusBadge(consultant.status)}
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{consultant.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{consultant.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Specialization</p>
                    <p className="text-sm text-gray-900">{consultant.specialization}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-lg text-gray-900">{consultant.clientsAssigned}</p>
                      <p className="text-xs text-gray-500">Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-gray-900">{consultant.returnsFiled}</p>
                      <p className="text-xs text-gray-500">Returns</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-gray-900">{consultant.yearsOfExperience}</p>
                      <p className="text-xs text-gray-500">Yrs Exp</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(consultant)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Consultant Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedConsultant?.name} - Profile</DialogTitle>
            <DialogDescription>
              Complete consultant profile and performance metrics.
            </DialogDescription>
          </DialogHeader>
          {selectedConsultant && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                    {getInitials(selectedConsultant.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl text-gray-900">{selectedConsultant.name}</h3>
                  <p className="text-gray-500 font-mono">{selectedConsultant.membershipNo}</p>
                  <div className="mt-1">{getStatusBadge(selectedConsultant.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-gray-900">{selectedConsultant.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-gray-900">{selectedConsultant.phone}</p>
                </div>
                <div>
                  <Label>Specialization</Label>
                  <p className="text-gray-900">{selectedConsultant.specialization}</p>
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <p className="text-gray-900">{selectedConsultant.yearsOfExperience} years</p>
                </div>
                <div className="col-span-2">
                  <Label>Qualifications</Label>
                  <div className="flex space-x-2 mt-1">
                    {selectedConsultant.qualifications.map((qual: string, index: number) => (
                      <Badge key={index} variant="outline">{qual}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-3 block">Performance Metrics</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl text-blue-800">{selectedConsultant.clientsAssigned}</p>
                    <p className="text-sm text-gray-600">Clients Assigned</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl text-green-800">{selectedConsultant.returnsFiled}</p>
                    <p className="text-sm text-gray-600">Returns Filed</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl text-purple-800">
                      {Math.round((selectedConsultant.returnsFiled / selectedConsultant.clientsAssigned) * 10) / 10}
                    </p>
                    <p className="text-sm text-gray-600">Avg Returns/Client</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-2 block">Recent Activity</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Filed GSTR-3B for TechCorp India</span>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Completed reconciliation for Megha Exports</span>
                    <span className="text-xs text-gray-500">5 days ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">New client assigned: Sunrise Manufacturing</span>
                    <span className="text-xs text-gray-500">1 week ago</span>
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
