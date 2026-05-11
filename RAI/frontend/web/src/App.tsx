import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage"; // Make sure this path matches where you saved it

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* You will add your /profile, /food, etc. routes here later */}
    </Routes>
  );
}

export default App;