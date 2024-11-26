import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Form from './pages/Form/index';
import Signin from './pages/Signin/index';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/protectedRoute';
import RealTimeStats from './pages/RealTimesStats';
import MeusFormularios from './pages/MeusFormularios';
import UpdateProfile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/form" element={<ProtectedRoute role="USER"><Form /></ProtectedRoute>} />
        <Route path="/AdminDashboard" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/dados" element={<RealTimeStats />} />
        <Route path="/meus-formularios" element={<MeusFormularios />} />
        <Route path="/perfil" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;