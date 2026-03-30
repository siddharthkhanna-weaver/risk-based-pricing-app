import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome</h2>
      </div>

      <div className="dashboard-cards">
        <div className="dash-card primary" onClick={() => navigate('/new-deal')}>
          <div className="card-icon">➕</div>
          <h3>New Deal Calculation</h3>
          <p>Create a new ROI calculation for a loan deal</p>
        </div>
      </div>
    </div>
  );
}
