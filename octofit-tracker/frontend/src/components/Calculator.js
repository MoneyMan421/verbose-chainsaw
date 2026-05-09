import React, { useState, useEffect } from 'react';

function Calculator() {
  const [activeTab, setActiveTab] = useState('bmi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  // BMI form state
  const [bmiForm, setBmiForm] = useState({ height_cm: '', weight_kg: '', user_name: '' });
  // Calorie burn form state
  const [calorieForm, setCalorieForm] = useState({ weight_kg: '', duration_minutes: '', activity_type: 'walking', user_name: '' });
  // Heart rate form state
  const [heartRateForm, setHeartRateForm] = useState({ age: '', user_name: '' });

  const getBaseUrl = () => {
    if (process.env.REACT_APP_CODESPACE_NAME) {
      return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const url = `${getBaseUrl()}/api/calculator/history/`;
    console.log('Fetching calculation history from:', url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Calculation history data:', data);
      setHistory(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleCalculate = async (endpoint, formData) => {
    setLoading(true);
    setResult(null);
    setError(null);
    const url = `${getBaseUrl()}/api/calculator/${endpoint}/`;
    console.log(`Posting to ${url}`, formData);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Calculator result:', data);
      if (!response.ok) {
        setError(data.error || 'An error occurred');
      } else {
        setResult(data);
        fetchHistory();
      }
    } catch (err) {
      setError('Failed to connect to the server. Please ensure the backend is running.');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderBMIForm = () => (
    <div>
      <h4 className="mb-3">BMI Calculator</h4>
      <p className="text-muted">Body Mass Index measures body fat based on height and weight.</p>
      <div className="mb-3">
        <label className="form-label">Your Name (optional)</label>
        <input type="text" className="form-control" value={bmiForm.user_name}
          onChange={e => setBmiForm({...bmiForm, user_name: e.target.value})} placeholder="Enter your name" />
      </div>
      <div className="mb-3">
        <label className="form-label">Height (cm) *</label>
        <input type="number" className="form-control" value={bmiForm.height_cm}
          onChange={e => setBmiForm({...bmiForm, height_cm: e.target.value})} placeholder="e.g. 175" min="1" />
      </div>
      <div className="mb-3">
        <label className="form-label">Weight (kg) *</label>
        <input type="number" className="form-control" value={bmiForm.weight_kg}
          onChange={e => setBmiForm({...bmiForm, weight_kg: e.target.value})} placeholder="e.g. 70" min="1" />
      </div>
      <button className="btn btn-primary" disabled={loading}
        onClick={() => handleCalculate('bmi', bmiForm)}>
        {loading ? 'Calculating...' : 'Calculate BMI'}
      </button>
    </div>
  );

  const renderCalorieForm = () => (
    <div>
      <h4 className="mb-3">Calorie Burn Calculator</h4>
      <p className="text-muted">Estimate calories burned during physical activity using MET values.</p>
      <div className="mb-3">
        <label className="form-label">Your Name (optional)</label>
        <input type="text" className="form-control" value={calorieForm.user_name}
          onChange={e => setCalorieForm({...calorieForm, user_name: e.target.value})} placeholder="Enter your name" />
      </div>
      <div className="mb-3">
        <label className="form-label">Weight (kg) *</label>
        <input type="number" className="form-control" value={calorieForm.weight_kg}
          onChange={e => setCalorieForm({...calorieForm, weight_kg: e.target.value})} placeholder="e.g. 70" min="1" />
      </div>
      <div className="mb-3">
        <label className="form-label">Duration (minutes) *</label>
        <input type="number" className="form-control" value={calorieForm.duration_minutes}
          onChange={e => setCalorieForm({...calorieForm, duration_minutes: e.target.value})} placeholder="e.g. 30" min="1" />
      </div>
      <div className="mb-3">
        <label className="form-label">Activity Type *</label>
        <select className="form-select" value={calorieForm.activity_type}
          onChange={e => setCalorieForm({...calorieForm, activity_type: e.target.value})}>
          <option value="walking">Walking</option>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="swimming">Swimming</option>
        </select>
      </div>
      <button className="btn btn-success" disabled={loading}
        onClick={() => handleCalculate('calorie-burn', calorieForm)}>
        {loading ? 'Calculating...' : 'Calculate Calories'}
      </button>
    </div>
  );

  const renderHeartRateForm = () => (
    <div>
      <h4 className="mb-3">Heart Rate Zone Calculator</h4>
      <p className="text-muted">Calculate your maximum heart rate and optimal training zones.</p>
      <div className="mb-3">
        <label className="form-label">Your Name (optional)</label>
        <input type="text" className="form-control" value={heartRateForm.user_name}
          onChange={e => setHeartRateForm({...heartRateForm, user_name: e.target.value})} placeholder="Enter your name" />
      </div>
      <div className="mb-3">
        <label className="form-label">Age *</label>
        <input type="number" className="form-control" value={heartRateForm.age}
          onChange={e => setHeartRateForm({...heartRateForm, age: e.target.value})} placeholder="e.g. 25" min="1" max="150" />
      </div>
      <button className="btn btn-danger" disabled={loading}
        onClick={() => handleCalculate('heart-rate-zones', heartRateForm)}>
        {loading ? 'Calculating...' : 'Calculate Heart Rate Zones'}
      </button>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    const { steps } = result;
    return (
      <div className="mt-4">
        <div className="alert alert-success">
          <h5 className="alert-heading">✅ Calculation Complete!</h5>
          {activeTab === 'bmi' && result.result && (
            <div>
              <strong>BMI: {result.result.bmi}</strong> — Category: <span className="badge bg-info text-dark">{result.result.category}</span>
            </div>
          )}
          {activeTab === 'calorie' && result.result && (
            <div>
              <strong>Calories Burned: {result.result.calories_burned} kcal</strong>
              <span className="ms-2 badge bg-warning text-dark">{result.result.activity_type}</span>
            </div>
          )}
          {activeTab === 'heartrate' && result.result && (
            <div>
              <strong>Max Heart Rate: {result.result.max_heart_rate} bpm</strong>
            </div>
          )}
        </div>

        {activeTab === 'heartrate' && result.result && result.result.zones && (
          <div className="mb-3">
            <h6>Training Zones:</h6>
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr><th>Zone</th><th>Range (bpm)</th><th>% Max HR</th><th>Description</th></tr>
              </thead>
              <tbody>
                {Object.entries(result.result.zones).map(([zone, data]) => (
                  <tr key={zone}>
                    <td><strong>{zone}</strong></td>
                    <td>{data.min_bpm}–{data.max_bpm}</td>
                    <td>{data.percentage}</td>
                    <td>{data.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h5 className="mt-3">📋 Step-by-Step Walkthrough</h5>
        <div className="list-group">
          {steps && steps.map((step, index) => (
            <div key={index} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 align-items-center">
                <span className="badge bg-primary rounded-pill me-3">{index + 1}</span>
                <span>{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">🏋️ Fitness Calculator</h3>
              <small>Step-by-step calculations for all your fitness needs</small>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'bmi' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('bmi'); setResult(null); setError(null); }}>
                    ⚖️ BMI
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'calorie' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('calorie'); setResult(null); setError(null); }}>
                    🔥 Calorie Burn
                  </button>
                </li>
                <li className="nav-item">
                  <button className={`nav-link ${activeTab === 'heartrate' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('heartrate'); setResult(null); setError(null); }}>
                    ❤️ Heart Rate Zones
                  </button>
                </li>
              </ul>

              {activeTab === 'bmi' && renderBMIForm()}
              {activeTab === 'calorie' && renderCalorieForm()}
              {activeTab === 'heartrate' && renderHeartRateForm()}

              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {renderResult()}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">📜 Calculation History</h5>
            </div>
            <div className="card-body p-0">
              {history.length === 0 ? (
                <p className="text-muted p-3">No calculations yet. Try one!</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {history.slice(0, 10).map((item, index) => (
                    <li key={index} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <strong>{item.calculation_type}</strong>
                        <small className="text-muted">{item.user_name}</small>
                      </div>
                      <small className="text-muted">{new Date(item.created_at).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
