import { useState } from 'react';
import { StoreProvider, useStore } from './store/store';
import { CareerDashboard } from './components/CareerDashboard';
import { TopBar } from './components/TopBar';
import type { Tab } from './components/TopBar';
import { SquadBoard } from './components/SquadBoard';
import { PitchView } from './components/PitchView';

function AppShell() {
  const { activeCareer } = useStore();
  const [tab, setTab] = useState<Tab>('squad');

  if (!activeCareer) return <CareerDashboard />;

  return (
    <div className="min-h-full pb-16">
      <TopBar tab={tab} onTabChange={setTab} />
      <main className="mx-auto max-w-6xl px-4 py-5">
        {tab === 'squad' && <SquadBoard />}
        {tab === 'pitch' && <PitchView />}
      </main>
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}

export default App;
