import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import CaloriesPage from './components/pages/CaloriesPage';
import AuthPage from './components/pages/AuthPage';
import RunningPage from './components/pages/RunningPage';
import BottomPage from './components/pages/BottomPage';
import ScrollManager from './components/pages/ScrollManager';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ProfilePage from './components/pages/ProfilePage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import TermsOfServicePage from './components/pages/TermsOfServicePage';
import DashboardPage from './components/pages/DashboardPage'; 
import RecipesPage from './components/pages/RecipesPage';

function App() {
  return (
    <div className="App">
      <ScrollManager />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<AuthPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/tos" element={<TermsOfServicePage />} />
        <Route path="/profile-setup" element={<ProfilePage />} />
        <Route path="/food" element={<CaloriesPage />} /> 
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/running" element={<RunningPage />} />
        <Route path="/workout" element={<BottomPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> 
      </Routes>
    </div>
  );
}

export default App;