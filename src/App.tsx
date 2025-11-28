import { AppShell } from './components/Layout';
import { ApplicationWizard } from './features/application/ApplicationWizard';

function App() {
  return (
    <AppShell>
      <ApplicationWizard />
    </AppShell>
  );
}

export default App;
