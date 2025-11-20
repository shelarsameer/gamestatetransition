import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { HomeModule } from './components/modules/HomeModule';
import { GSTReconModule } from './components/modules/GSTReconModule';
import { ReconciliationResultsModule } from './components/modules/ReconciliationResultsModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { ChatModule } from './components/modules/ChatModule';
import { AISettingsModule } from './components/modules/AISettingsModule';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState('home');
  const [resultId, setResultId] = useState<string | null>(null);
  const [isCheckingUrl, setIsCheckingUrl] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // Check URL for results page
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/results/')) {
      const id = path.split('/results/')[1];
      setResultId(id);
      setActiveModule('results');
      setIsLoggedIn(true); // Auto-login for results page
    }
    setIsCheckingUrl(false);
  }, []);

  // Show login page if not logged in and not checking URL
  if (!isLoggedIn && isCheckingUrl) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div>
        <Login onLogin={handleLogin} />
        <Footer />
      </div>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'home':
        return <HomeModule />;
      case 'gst-recon':
        return <GSTReconModule />;
      case 'results':
        return resultId ? <ReconciliationResultsModule resultId={resultId} /> : <HomeModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'chat':
        return <ChatModule />;
      case 'ai-settings':
        return <AISettingsModule />;
      default:
        return <HomeModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 p-6 ml-64">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}