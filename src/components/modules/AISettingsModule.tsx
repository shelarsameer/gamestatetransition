import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Bot, Brain, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';

export function AISettingsModule() {
  const [selectedMonth, setSelectedMonth] = useState('Jun');
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);

  const prompts = [
    { 
      id: 1, 
      name: 'Invoice Matching', 
      description: 'Prompt for matching invoices between books and GSTR-2A',
      prompt: 'Analyze and match the following invoice data...',
      lastUpdated: '2024-06-15'
    },
    { 
      id: 2, 
      name: 'Mismatch Detection', 
      description: 'Identify discrepancies in GST reconciliation',
      prompt: 'Compare the invoice amounts and identify mismatches...',
      lastUpdated: '2024-06-14'
    },
    { 
      id: 3, 
      name: 'Data Analysis', 
      description: 'Analyze trends and patterns in GST data',
      prompt: 'Examine the reconciliation data and provide insights...',
      lastUpdated: '2024-06-13'
    },
    { 
      id: 4, 
      name: 'Chat Response', 
      description: 'Generate responses for user queries',
      prompt: 'Answer the user query based on the GST reconciliation data...',
      lastUpdated: '2024-06-12'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">AI Settings</h2>
          <p className="text-gray-600">Configure AI behavior and preferences</p>
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

      {/* AI Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg text-gray-900">AI Engine Status</h3>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Select AI Model */}
      <Card>
        <CardHeader>
          <CardTitle>Select AI Model</CardTitle>
          <p className="text-sm text-gray-600">Gemini, OpenAI, etc ... free ver</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>AI Provider</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">
                  <div className="flex items-center justify-between w-full">
                    <span>Google Gemini 1.5 Flash</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="openai">
                  <div className="flex items-center justify-between w-full">
                    <span>OpenAI GPT-3.5 Turbo</span>
                    <Badge className="ml-2 bg-blue-100 text-blue-800">Free Tier</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="claude">
                  <div className="flex items-center justify-between w-full">
                    <span>Anthropic Claude Haiku</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="llama">
                  <div className="flex items-center justify-between w-full">
                    <span>Meta Llama 3.1 8B</span>
                    <Badge className="ml-2 bg-green-100 text-green-800">Free</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-900">
                  {selectedModel === 'gemini' && 'Google Gemini 1.5 Flash - Fast, efficient model for GST reconciliation'}
                  {selectedModel === 'openai' && 'OpenAI GPT-3.5 Turbo - Reliable performance for data analysis'}
                  {selectedModel === 'claude' && 'Anthropic Claude Haiku - Quick responses with good accuracy'}
                  {selectedModel === 'llama' && 'Meta Llama 3.1 8B - Open-source model for local processing'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Free tier includes 1000 requests per month
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Select AI Params */}
      <Card>
        <CardHeader>
          <CardTitle>Select AI Params</CardTitle>
          <p className="text-sm text-gray-600">Temp, Tokens, etc...</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Temperature</Label>
                <span className="text-sm text-gray-900">{temperature[0]}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-600 mt-2">
                Controls randomness. Lower values make output more focused and deterministic
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Max Tokens</Label>
                <span className="text-sm text-gray-900">{maxTokens[0]}</span>
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                min={256}
                max={4096}
                step={256}
                className="w-full"
              />
              <p className="text-xs text-gray-600 mt-2">
                Maximum length of the AI response. Higher values allow longer responses
              </p>
            </div>

            <div>
              <Label>Top P (Nucleus Sampling)</Label>
              <Input type="number" defaultValue="0.9" step="0.1" min="0" max="1" className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">
                Controls diversity via nucleus sampling. 1.0 means no restrictions
              </p>
            </div>

            <div>
              <Label>Frequency Penalty</Label>
              <Input type="number" defaultValue="0.0" step="0.1" min="-2" max="2" className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">
                Penalizes repeated tokens based on frequency. Higher values reduce repetition
              </p>
            </div>

            <div>
              <Label>Presence Penalty</Label>
              <Input type="number" defaultValue="0.0" step="0.1" min="-2" max="2" className="mt-2" />
              <p className="text-xs text-gray-600 mt-1">
                Penalizes tokens that already appeared. Higher values encourage new topics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Prompts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>View Prompts</CardTitle>
              <p className="text-sm text-gray-600">Tabular view of Prompts, editable</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add New Prompt
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prompt Preview</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell>{prompt.name}</TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-gray-600 truncate">{prompt.description}</p>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-gray-900 truncate font-mono bg-gray-50 px-2 py-1 rounded">
                      {prompt.prompt}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{prompt.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-3">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
      </div>
    </div>
  );
}
