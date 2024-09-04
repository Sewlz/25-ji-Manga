import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Info from "./dev-data/info/info.jsx";
import Reading from "./dev-data/reading/reading.jsx";
import "./App.css";
import Header from "./dev-data/header/header.jsx";
import Viewall from "./dev-data/view-all/viewall.jsx";
import LandingPage from "./dev-data/landing-page/landing.jsx";
function App() {
  return (
    <Router>
      <Header />
      <div className="app">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/viewall" element={<Viewall />} />
            <Route path="/info" element={<Info />} />
            <Route path="/reading" element={<Reading />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
