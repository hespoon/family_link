
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MobileContainer } from './components/MobileContainer';
import { BottomNav } from './components/BottomNav';
import { LoginView } from './views/LoginView';
import { TimelineView } from './views/TimelineView';
import { FamilySharingView } from './views/FamilySharingView';
import { ProfileView } from './views/ProfileView';
import { MemoryDetailView } from './views/MemoryDetailView';
import { SettingsView } from './views/SettingsView';
import { AddMemoryView } from './views/AddMemoryView';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/add-memory';

  return (
    <MobileContainer>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/" element={<TimelineView />} />
        <Route path="/family" element={<FamilySharingView />} />
        <Route path="/archive" element={<ProfileView />} />
        <Route path="/profile/:id" element={<ProfileView />} />
        <Route path="/memory/:id" element={<MemoryDetailView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/add-memory" element={<AddMemoryView />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </MobileContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
