import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Package, Users, DollarSign, FileText } from 'lucide-react';
import { Button } from '../ui/button';

// Month-wise data by value
const monthlyValueData = [
  { month: 'Jan', value: 2450000, mismatches: 45 },
  { month: 'Feb', value: 2180000, mismatches: 38 },
  { month: 'Mar', value: 2890000, mismatches: 52 },
  { month: 'Apr', value: 2650000, mismatches: 48 },
  { month: 'May', value: 3120000, mismatches: 61 },
  { month: 'Jun', value: 2780000, mismatches: 44 },
];

// Supplier distribution for current month
const supplierData = [
  { name: 'Megha Exports Ltd', value: 450000, color: '#3B82F6' },
  { name: 'TechCorp India', value: 380000, color: '#8B5CF6' },
  { name: 'Sunrise Manufacturing', value: 320000, color: '#10B981' },
  { name: 'Metro Electronics', value: 280000, color: '#F59E0B' },
  { name: 'Global Traders', value: 250000, color: '#EF4444' },
  { name: 'Others', value: 1100000, color: '#6B7280' },
];

// Category distribution
const categoryData = [
  { name: 'Raw Materials', value: 35, color: '#3B82F6' },
  { name: 'Finished Goods', value: 28, color: '#8B5CF6' },
  { name: 'Services', value: 18, color: '#10B981' },
  { name: 'Capital Equipment', value: 12, color: '#F59E0B' },
  { name: 'Consumables', value: 7, color: '#EF4444' },
];

// Month-wise category breakdown
const monthlyCategoryData = [
  { month: 'Jan', rawMaterials: 850000, finishedGoods: 680000, services: 520000, equipment: 400000 },
  { month: 'Feb', rawMaterials: 780000, finishedGoods: 620000, services: 480000, equipment: 300000 },
  { month: 'Mar', rawMaterials: 980000, finishedGoods: 820000, services: 620000, equipment: 470000 },
  { month: 'Apr', rawMaterials: 920000, finishedGoods: 750000, services: 580000, equipment: 400000 },
  { month: 'May', rawMaterials: 1100000, finishedGoods: 880000, services: 680000, equipment: 460000 },
  { month: 'Jun', rawMaterials: 950000, finishedGoods: 780000, services: 620000, equipment: 430000 },
];

// Most frequent cases
const frequentCases = [
  {
    issue: 'Missing Invoice in GSTR-2A',
    count: 156,
    percentage: 38,
    impact: '₹4,850,000',
    action: 'Contact suppliers for ITC claims',
    priority: 'high',
    icon: FileText
  },
  {
    issue: 'Amount Mismatch',
    count: 98,
    percentage: 24,
    impact: '₹2,340,000',
    action: 'Verify invoice amounts with vendors',
    priority: 'high',
    icon: DollarSign
  },
  {
    issue: 'Tax Rate Discrepancy',
    count: 67,
    percentage: 16,
    impact: '₹1,240,000',
    action: 'Review HSN code mapping',
    priority: 'medium',
    icon: AlertTriangle
  },
  {
    issue: 'Missing in Books',
    count: 52,
    percentage: 13,
    impact: '₹980,000',
    action: 'Update purchase register',
    priority: 'medium',
    icon: Package
  },
  {
    issue: 'Supplier GSTIN Mismatch',
    count: 38,
    percentage: 9,
    impact: '₹620,000',
    action: 'Verify supplier registration details',
    priority: 'low',
    icon: Users
  },
];

export function AnalyticsModule() {
  const [selectedMonth, setSelectedMonth] = useState('Jun');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Analytics</h2>
          <p className="text-gray-600">Month-wise analysis and actionable insights</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Jan">January 2024</SelectItem>
            <SelectItem value="Feb">February 2024</SelectItem>
            <SelectItem value="Mar">March 2024</SelectItem>
            <SelectItem value="Apr">April 2024</SelectItem>
            <SelectItem value="May">May 2024</SelectItem>
            <SelectItem value="Jun">June 2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl text-gray-900 mt-1">₹27.8L</p>
                <p className="text-xs text-green-600 mt-1">+8.2% from avg</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mismatches</p>
                <p className="text-2xl text-gray-900 mt-1">44</p>
                <p className="text-xs text-red-600 mt-1">-12% from last month</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Suppliers</p>
                <p className="text-2xl text-gray-900 mt-1">87</p>
                <p className="text-xs text-blue-600 mt-1">+3 new this month</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categories</p>
                <p className="text-2xl text-gray-900 mt-1">5</p>
                <p className="text-xs text-gray-600 mt-1">Across all invoices</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="value" className="w-full">
        <TabsList>
          <TabsTrigger value="value">By Value</TabsTrigger>
          <TabsTrigger value="supplier">By Supplier</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="value" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Month-wise Transaction Value</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyValueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                    <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(2)}L`} />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" name="Transaction Value (₹)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Month-wise Mismatch Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyValueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mismatches" fill="#EF4444" name="Mismatch Count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supplier" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Distribution - {selectedMonth} 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={supplierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {supplierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(2)}L`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Suppliers by Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplierData.slice(0, 5).map((supplier, index) => (
                    <div key={supplier.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: supplier.color }}></div>
                          <span className="text-sm text-gray-900">{supplier.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">₹{(supplier.value / 100000).toFixed(2)}L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(supplier.value / 450000) * 100}%`,
                            backgroundColor: supplier.color
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Month-wise Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(2)}L`} />
                    <Legend />
                    <Bar dataKey="rawMaterials" stackId="a" fill="#3B82F6" name="Raw Materials" />
                    <Bar dataKey="finishedGoods" stackId="a" fill="#8B5CF6" name="Finished Goods" />
                    <Bar dataKey="services" stackId="a" fill="#10B981" name="Services" />
                    <Bar dataKey="equipment" stackId="a" fill="#F59E0B" name="Equipment" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Most Frequent Cases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            Most Frequent Cases - Actionable Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {frequentCases.map((caseItem, index) => {
              const Icon = caseItem.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    caseItem.priority === 'high'
                      ? 'bg-red-50 border-red-600'
                      : caseItem.priority === 'medium'
                      ? 'bg-orange-50 border-orange-600'
                      : 'bg-blue-50 border-blue-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        caseItem.priority === 'high'
                          ? 'text-red-600'
                          : caseItem.priority === 'medium'
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-sm text-gray-900">{caseItem.issue}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            caseItem.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : caseItem.priority === 'medium'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {caseItem.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                          <span><strong>{caseItem.count}</strong> cases ({caseItem.percentage}%)</span>
                          <span>•</span>
                          <span>Impact: <strong>{caseItem.impact}</strong></span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div
                            className={`h-2 rounded-full ${
                              caseItem.priority === 'high'
                                ? 'bg-red-600'
                                : caseItem.priority === 'medium'
                                ? 'bg-orange-600'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${caseItem.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-700 mb-2">
                          <strong>Recommended Action:</strong> {caseItem.action}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="ml-4 bg-blue-600 hover:bg-blue-700">
                      Take Action
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Missing invoices</strong> in GSTR-2A represent the largest category, affecting 38% of cases
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Top 5 suppliers</strong> account for 62% of total transaction value
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Raw materials</strong> category shows consistent growth trend over past 6 months
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs">1</div>
                <p className="text-sm text-gray-700">
                  Immediately contact suppliers with missing GSTR-2A invoices to claim pending ITC worth ₹4.85L
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs">2</div>
                <p className="text-sm text-gray-700">
                  Verify amount discrepancies with top vendors to resolve ₹2.34L in mismatches
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs">3</div>
                <p className="text-sm text-gray-700">
                  Review HSN code mapping for tax rate discrepancies affecting 67 invoices
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}