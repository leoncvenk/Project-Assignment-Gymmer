import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CaloriesPage from './components/CaloriesPage';
import AuthPage from './components/AuthPage';
import RunningPage from './components/RunningPage';
import BottomPage from './components/BottomPage';
import ScrollManager from './components/ScrollManager';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import DashboardPage from './components/DashboardPage'; 

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
        <Route path="/running" element={<RunningPage />} />
        <Route path="/workout" element={<BottomPage />} />
        <Route path="/dashboard" element={<DashboardPage />} /> 
      </Routes>
    </div>
  );
}

export default App;