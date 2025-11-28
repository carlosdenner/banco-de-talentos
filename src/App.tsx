import { useState } from 'react';
import { AppShell } from './components/Layout';
import { ApplicationWizard } from './features/application/ApplicationWizard';
import { AuthModal } from './components/Auth';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <AppShell onOpenAuth={() => setShowAuthModal(true)}>
        <ApplicationWizard onOpenAuth={() => setShowAuthModal(true)} />
      </AppShell>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}

export default App;
