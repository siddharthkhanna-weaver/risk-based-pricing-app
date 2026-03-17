import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name}</h2>
        <span className="role-badge">{user?.role}</span>
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
