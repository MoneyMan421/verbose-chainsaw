import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Calculator from './components/Calculator';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow text-center">
            <div className="card-body py-5">
              <h1 className="display-4 mb-3">🏃 OctoFit Tracker</h1>
              <p className="lead">Your personalized fitness tracking and calculation platform for Mergington High School.</p>
              <hr />
              <div className="row mt-4">
                <div className="col-md-4 mb-3">
                  <div className="card bg-primary text-white h-100">
                    <div className="card-body">
                      <h5>🏋️ Calculator</h5>
                      <p className="small">BMI, calories, and heart rate zone calculations with step-by-step walkthroughs.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-success text-white h-100">
                    <div className="card-body">
                      <h5>📊 Activities</h5>
                      <p className="small">Track and log your workouts and daily activities.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-warning text-dark h-100">
                    <div className="card-body">
                      <h5>🏆 Leaderboard</h5>
                      <p className="small">Compete with your team and see who tops the fitness chart.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <NavLink className="navbar-brand" to="/">🐙 OctoFit Tracker</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/calculator">Calculator</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/activities">Activities</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/teams">Teams</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/users">Users</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/leaderboard">Leaderboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/workouts">Workouts</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
