import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BudgetChatPage from './components/BudgetChatPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import PageLayout from './components/PageLayout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<BudgetChatPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}
