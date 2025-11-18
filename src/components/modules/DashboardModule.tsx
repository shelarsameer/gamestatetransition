import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Building2, FileText, Receipt, Users, Calendar, Plus, TrendingUp, AlertCircle, IndianRupee } from 'lucide-react';

const keyStats = [
  { title: 'Total Clients', value: '42', icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'GST Returns Filed', value: '156', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Invoices Reconciled', value: '1,247', icon: Receipt, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Active Consultants', value: '18', icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  { title: 'Upcoming Deadlines', value: '7', icon: Calendar, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

const notifications = [
  { message: "GSTR-3B filing due in 2 days for ABC Ltd", type: 'deadline', time: '1 hour ago' },
  { message: "New invoice batch uploaded for XYZ Corp", type: 'new', time: '3 hours ago' },
  { message: "Reconciliation completed for DEF Enterprises", type: 'completed', time: '5 hours ago' },
  { message: "Tax consultant assigned to GHI Industries", type: 'assignment', time: '1 day ago' },
  { message: "Client 'MNO Trading' updated GSTIN details", type: 'update', time: '2 days ago' },
];

const quickActions = [
  { title: 'Add New Client', description: 'Register a new client company', icon: Building2, action: 'add-client' },
  { title: 'Upload Invoices', description: 'Import invoice data for reconciliation', icon: Receipt, action: 'upload-invoices' },
  { title: 'File GST Return', description: 'Initiate return filing process', icon: FileText, action: 'file-return' },
];

export function DashboardModule() {
  const userName = "Amit Mehta";

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">Welcome back, {userName}!</h1>
        <p className="text-blue-100">Here's an overview of your GST reconciliation activities.</p>
      </div>

      {/* Key Stats */}
      <div>
        <h2 className="text-xl text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {keyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Recent Notifications</span>
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {notifications.length} New
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {notification.type === 'deadline' && <Calendar className="h-4 w-4 text-orange-600" />}
                    {notification.type === 'new' && <Plus className="h-4 w-4 text-green-600" />}
                    {notification.type === 'completed' && <TrendingUp className="h-4 w-4 text-blue-600" />}
                    {notification.type === 'assignment' && <Users className="h-4 w-4 text-purple-600" />}
                    {notification.type === 'update' && <AlertCircle className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">View All Notifications</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reconciliations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ABC Ltd - Oct 2024</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Matched</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">XYZ Corp - Oct 2024</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partial</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DEF Enterprises - Sep 2024</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Matched</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GSTR-1 (Oct 2024)</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">15 Filed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GSTR-3B (Oct 2024)</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">12 Filed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">GSTR-9 (FY 2023-24)</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">TechCorp India</span>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">₹2.5Cr turnover</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Global Traders</span>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">₹1.8Cr turnover</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Megha Exports</span>
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">₹1.2Cr turnover</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
