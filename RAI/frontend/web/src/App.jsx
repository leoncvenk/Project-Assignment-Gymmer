import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import CaloriesPage from './components/CaloriesPage'; // Import your new page

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* I am mapping this to the /food route based on your dock icons */}
        <Route path="/food" element={<CaloriesPage />} /> 
      </Routes>
    </div>
  );
}

export default App;