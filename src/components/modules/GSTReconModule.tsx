import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { MatchedRecordsModule } from './MatchedRecordsModule';
import { MismatchRecordsModule } from './MismatchRecordsModule';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';

export function GSTReconModule() {
  const [selectedMonth, setSelectedMonth] = useState('Jun');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">GST Reconciliation</h2>
          <p className="text-gray-600">Manage matched and mismatch records</p>
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

      <Tabs defaultValue="matched" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="matched" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Matched Records</span>
          </TabsTrigger>
          <TabsTrigger value="mismatches" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Mismatch Records</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matched" className="mt-6">
          <MatchedRecordsModule />
        </TabsContent>
        
        <TabsContent value="mismatches" className="mt-6">
          <MismatchRecordsModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}