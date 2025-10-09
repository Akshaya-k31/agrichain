import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import FarmerDashboard from './pages/FarmerDashboard';
import TransporterDashboard from './pages/TransporterDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import Consumer from './pages/Consumer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/transporter-dashboard" element={<TransporterDashboard />} />
        <Route path="/retailer-dashboard" element={<RetailerDashboard />} />
        <Route path="/consumer" element={<Consumer />} />
      </Routes>
    </Router>
  );
}

export default App;
