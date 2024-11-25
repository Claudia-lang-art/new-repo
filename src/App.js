// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Register from './components/Statistique.js';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import AdminSettings from './components/AdminSettings';
import PaiementForm from './components/PaiementForm.js';
import StudentsPage from './pages/StudentsPage';
import PaymentsPage from './pages/PaymentsPage';
import RegistrationsPage from './pages/RegistrationsPage';
import FraisList from './components/FraisList.js';
import ClasseList from './components/ClasseList.js';
import VagueList from './components/VagueList.js';
import Exemple from './components/Exemple.jsx';
import CodeClassePage from './components/CodeClassePage.js';
import Statistiques from './components/Statistique.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin-settings" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
          <Route path="/statistique" element={<Statistiques />} />
          <Route path="/students" element={<PrivateRoute><StudentsPage /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><PaymentsPage /></PrivateRoute>} />
          <Route path="/registrations" element={<PrivateRoute><RegistrationsPage /></PrivateRoute>} />
          <Route path="/frais" element={<PrivateRoute><FraisList /></PrivateRoute>} />
        <Route path="/codeclasse" element={<PrivateRoute><CodeClassePage /></PrivateRoute>} />
        <Route path="/classes" element={<PrivateRoute><ClasseList /></PrivateRoute>} />
        <Route path="/vague" element={<PrivateRoute><VagueList /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
