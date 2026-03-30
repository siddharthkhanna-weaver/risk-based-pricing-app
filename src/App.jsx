import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import NewDeal from './pages/NewDeal';
import ResultPage from './pages/ResultPage';
import './styles/App.css';

function emptyBorrower() {
  return {
    name: '',
    customerProfile: '',
    newToCredit: null,
    crifScore: '',
    income: '',
  };
}

const INITIAL_FORM = {
  dealNumber: '',
  applicantName: '',
  loanAmount: '',
  product: '',
  subProduct: '',
  branchCategory: '',
  borrowers: [emptyBorrower()],
  policyDeviations: {},
  propertyLocation: '',
  ltvDeviation: null,
};

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isResult = location.pathname === '/result';

  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/logo.png" alt="PeopleHome" className="header-logo-img" />
        <span className="header-title">Pricing Calculator</span>
      </div>
      {isResult && (
        <div className="header-right">
          <button className="btn-back-header" onClick={() => navigate(-1)}>
            ← Go back to Calculator
          </button>
        </div>
      )}
    </header>
  );
}

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const resetForm = () => setFormData(INITIAL_FORM);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<NewDeal formData={formData} setFormData={setFormData} resetForm={resetForm} />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
