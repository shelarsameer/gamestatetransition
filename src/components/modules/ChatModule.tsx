import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Send, MessageSquare, Bot, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function ChatModule() {
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I\'m your GST Reconciliation AI assistant. Ask me anything about your data, mismatches, or trends.',
    },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: 'user', text: message }]);
      
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sender: 'ai',
            text: 'I\'ve analyzed your query. Based on the current data, there are 15 pending mismatches with a total value of ₹4.2L. Would you like more details?',
          },
        ]);
      }, 1000);
      
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Chat with Data</h2>
          <p className="text-gray-600">Ask questions and get AI-powered insights</p>
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

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 text-blue-600 mr-2" />
              AI Assistant
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Online
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">Welcome to AI-Powered Data Chat</h3>
              <p className="text-sm text-gray-600 mb-4">
                Ask me anything about your GST reconciliation data, and I'll provide instant insights.
              </p>
              <p className="text-xs text-gray-500">
                Try one of the suggested questions above to get started!
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-gray-700" />
                  )}
                </div>
                <div>
                  <div className={`rounded-lg p-4 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your GST data..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            AI responses are based on your reconciliation data. Press Enter to send.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Can I Help You With?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm text-gray-900">Reconciliation Queries</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Overall accuracy and performance metrics</li>
                <li>Mismatch trends and patterns</li>
                <li>Client-specific reconciliation status</li>
                <li>Period-over-period comparisons</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm text-gray-900">Actionable Insights</h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Identify clients requiring attention</li>
                <li>Recommend resolution priorities</li>
                <li>Detect compliance risks</li>
                <li>Suggest process improvements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}