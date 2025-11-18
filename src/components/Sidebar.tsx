import { Home, FileCheck, TrendingUp, MessageSquare, Settings, Building2 } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'gst-recon', label: 'GST Recon', icon: FileCheck },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'chat', label: 'Chat with Data', icon: MessageSquare },
  { id: 'ai-settings', label: 'AI Settings', icon: Settings },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-12 ${
                isActive 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => onModuleChange(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-800">Client Network</span>
        </div>
        <p className="text-xs text-blue-600">42 active clients</p>
        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
          <div className="w-4/5 bg-blue-600 h-2 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
}