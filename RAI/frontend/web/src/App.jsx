import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CaloriesPage from './components/CaloriesPage';
import AuthPage from './components/AuthPage';
import RunningPage from './components/RunningPage';
import BottomPage from './components/BottomPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<AuthPage />} /> 
        <Route path="/food" element={<CaloriesPage />} /> 
        <Route path="/running" element={<RunningPage />} />
        <Route path="/workout" element={<BottomPage />} />
      </Routes>
    </div>
  );
}

export default App;