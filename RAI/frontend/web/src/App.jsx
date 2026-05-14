import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CaloriesPage from './components/CaloriesPage';
import AuthPage from './components/AuthPage';
import RunningPage from './components/RunningPage';
import BottomPage from './components/BottomPage';
import ScrollManager from './components/ScrollManager';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';

function App() {
  return (
    <div className="App">
      <ScrollManager />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<AuthPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile-setup" element={<ProfilePage />} />
        <Route path="/food" element={<CaloriesPage />} /> 
        <Route path="/running" element={<RunningPage />} />
        <Route path="/workout" element={<BottomPage />} />
      </Routes>
    </div>
  );
}

export default App;