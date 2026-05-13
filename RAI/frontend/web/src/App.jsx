import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CaloriesPage from './components/CaloriesPage';
import AuthPage from './components/AuthPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profile" element={<AuthPage />} /> 
        <Route path="/food" element={<CaloriesPage />} /> 
      </Routes>
    </div>
  );
}

export default App;