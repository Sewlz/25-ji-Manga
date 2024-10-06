import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Info from "./components/info/info";
import Reading from "./components/reading/reading";
import "./App.css";
import Header from "./components/header/header";
import Viewall from "./components/view-all/viewall";
import LandingPage from "./pages/landing-page/landing";
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
