/* import { useState } from 'react' */
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* This tells the app to show the LandingPage on the home route '/' */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App
