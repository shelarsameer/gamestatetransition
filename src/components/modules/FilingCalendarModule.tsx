import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const deadlinesData = [
  {
    id: 1,
    date: '2024-11-11',
    returnType: 'GSTR-1',
    client: 'TechCorp India Pvt Ltd',
    consultant: 'CA Rajesh Kumar',
    status: 'Completed',
    priority: 'Medium'
  },
  {
    id: 2,
    date: '2024-11-11',
    returnType: 'GSTR-1',
    client: 'Megha Exports Ltd',
    consultant: 'CA Amit Verma',
    status: 'Pending',
    priority: 'High'
  },
  {
    id: 3,
    date: '2024-11-15',
    returnType: 'GSTR-1',
    client: 'Global Traders Pvt Ltd',
    consultant: 'CA Priya Sharma',
    status: 'In Progress',
    priority: 'Medium'
  },
  {
    id: 4,
    date: '2024-11-20',
    returnType: 'GSTR-3B',
    client: 'TechCorp India Pvt Ltd',
    consultant: 'CA Rajesh Kumar',
    status: 'Completed',
    priority: 'High'
  },
  {
    id: 5,
    date: '2024-11-20',
    returnType: 'GSTR-3B',
    client: 'Sunrise Manufacturing',
    consultant: 'CA Neha Patel',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: 6,
    date: '2024-11-25',
    returnType: 'GSTR-1',
    client: 'City Electronics',
    consultant: 'CA Rajesh Kumar',
    status: 'Scheduled',
    priority: 'Low'
  },
  {
    id: 7,
    date: '2024-12-11',
    returnType: 'GSTR-1',
    client: 'Metro Traders',
    consultant: 'CA Priya Sharma',
    status: 'Scheduled',
    priority: 'Medium'
  },
  {
    id: 8,
    date: '2024-12-20',
    returnType: 'GSTR-3B',
    client: 'Smart Solutions',
    consultant: 'CA Amit Verma',
    status: 'Scheduled',
    priority: 'Medium'
  },
  {
    id: 9,
    date: '2024-12-31',
    returnType: 'GSTR-9',
    client: 'TechCorp India Pvt Ltd',
    consultant: 'CA Rajesh Kumar',
    status: 'Scheduled',
    priority: 'High'
  }
];

export function FilingCalendarModule() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
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
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Scheduled':
        return <Badge className="bg-gray-100 text-gray-800">Scheduled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'Medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'Low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysUntilDeadline = (dateString: string) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return deadlinesData.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      return deadlineDate >= today && deadline.status !== 'Completed';
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getDeadlinesByMonth = (month: number, year: number) => {
    return deadlinesData.filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      return deadlineDate.getMonth() === month && deadlineDate.getFullYear() === year;
    });
  };

  const upcomingDeadlines = getUpcomingDeadlines();
  const thisMonthDeadlines = getDeadlinesByMonth(currentMonth.getMonth(), currentMonth.getFullYear());

  const pendingCount = deadlinesData.filter(d => d.status === 'Pending').length;
  const inProgressCount = deadlinesData.filter(d => d.status === 'In Progress').length;
  const completedCount = deadlinesData.filter(d => d.status === 'Completed').length;

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Filing Calendar</h2>
          <p className="text-gray-600">Track GST filing deadlines and schedules</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Deadline
        </Button>
      </div>

      {/* Calendar Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deadlines</p>
                <p className="text-2xl text-gray-900">{deadlinesData.length}</p>
                <p className="text-sm text-blue-600">All periods</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl text-gray-900">{completedCount}</p>
                <p className="text-sm text-green-600">On time</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl text-gray-900">{inProgressCount}</p>
                <p className="text-sm text-blue-600">Ongoing</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl text-gray-900">{pendingCount}</p>
                <p className="text-sm text-orange-600">Action needed</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Next 30 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 6).map((deadline) => {
                const daysLeft = getDaysUntilDeadline(deadline.date);
                const isUrgent = daysLeft <= 3;
                
                return (
                  <div 
                    key={deadline.id} 
                    className={`p-4 rounded-lg border ${isUrgent ? 'border-red-200 bg-red-50' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {deadline.returnType}
                          </Badge>
                          {getPriorityBadge(deadline.priority)}
                          {getStatusBadge(deadline.status)}
                        </div>
                        <p className="text-gray-900">{deadline.client}</p>
                        <p className="text-sm text-gray-600">Consultant: {deadline.consultant}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span className={`text-sm ${isUrgent ? 'text-red-600' : 'text-gray-600'}`}>
                            {formatDate(deadline.date)}
                          </span>
                          <span className={`text-xs ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
                            ({daysLeft} {daysLeft === 1 ? 'day' : 'days'} left)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl text-blue-800">{thisMonthDeadlines.length}</p>
                  <p className="text-xs text-gray-600">Total Deadlines</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl text-green-800">
                    {thisMonthDeadlines.filter(d => d.status === 'Completed').length}
                  </p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-gray-600 mb-2">Key Dates</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">11th</span>
                    </div>
                    <span className="text-xs text-gray-500">GSTR-1</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">20th</span>
                    </div>
                    <span className="text-xs text-gray-500">GSTR-3B</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">31st</span>
                    </div>
                    <span className="text-xs text-gray-500">GSTR-9</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-gray-600 mb-2">By Status</p>
                <div className="space-y-2">
                  {thisMonthDeadlines.filter(d => d.status === 'Pending').length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pending</span>
                      <Badge className="bg-orange-100 text-orange-800">
                        {thisMonthDeadlines.filter(d => d.status === 'Pending').length}
                      </Badge>
                    </div>
                  )}
                  {thisMonthDeadlines.filter(d => d.status === 'In Progress').length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {thisMonthDeadlines.filter(d => d.status === 'In Progress').length}
                      </Badge>
                    </div>
                  )}
                  {thisMonthDeadlines.filter(d => d.status === 'Scheduled').length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Scheduled</span>
                      <Badge className="bg-gray-100 text-gray-800">
                        {thisMonthDeadlines.filter(d => d.status === 'Scheduled').length}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Deadlines Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Filing Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {deadlinesData.map((deadline) => (
              <div 
                key={deadline.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm text-gray-900">
                      {new Date(deadline.date).getDate()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(deadline.date).toLocaleDateString('en-IN', { month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {deadline.returnType}
                      </Badge>
                      {getPriorityBadge(deadline.priority)}
                    </div>
                    <p className="text-sm text-gray-900">{deadline.client}</p>
                    <p className="text-xs text-gray-500">{deadline.consultant}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(deadline.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
