import { useState } from 'react';
import { AppShell } from './components/Layout';
import { ApplicationWizard } from './features/application/ApplicationWizard';
import { AdminDashboard } from './features/admin';
import { AuthModal } from './components/Auth';
import { useAuth } from './lib/authContext';
import { isAdminEmail } from './lib/adminConfig';

type View = 'form' | 'admin';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<View>('form');
  const { user } = useAuth();
  
  const isAdmin = isAdminEmail(user?.email);

  return (
    <>
      <AppShell onOpenAuth={() => setShowAuthModal(true)}>
        {/* Admin tab switcher */}
        {isAdmin && (
          <div className="mb-6 flex gap-2 border-b border-gray-200 pb-4">
            <button
              onClick={() => setCurrentView('form')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'form'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Formulário
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'admin'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Painel Admin
            </button>
          </div>
        )}

        {/* Content */}
        {currentView === 'admin' && isAdmin ? (
          <AdminDashboard />
        ) : (
          <ApplicationWizard onOpenAuth={() => setShowAuthModal(true)} />
        )}
      </AppShell>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}

export default App;
