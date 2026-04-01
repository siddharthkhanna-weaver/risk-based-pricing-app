import { useLocation, useNavigate } from 'react-router-dom';
import { R2_DEVIATIONS } from '../data/pricingRules';
import ROIResult from '../components/ROIResult';
import '../styles/ResultPage.css';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, dealDetails } = location.state || {};

  if (!result) {
    navigate('/', { replace: true });
    return null;
  }

  const riskFactors = [];
  R2_DEVIATIONS.forEach((dev) => {
    if (dealDetails.policyDeviations?.[dev.key]) {
      riskFactors.push(dev.label);
    }
  });
  riskFactors.push(`Property: ${dealDetails.propertyLocation}`);
  if (dealDetails.ltvDeviation) {
    riskFactors.push('Deviation of LTV');
  }

  return (
    <div className="result-page">

      <div className="result-content">
        <div className="result-left">
          <div className="deal-summary-card">
            <h4>Deal Summary</h4>

            <div className="summary-section">
              <h5 className="summary-section-title">Loan Details</h5>
              <div className="summary-row-inline">
                <div className="summary-item">
                  <span className="sg-label">Deal No.</span>
                  <span className="sg-value">{dealDetails.dealNumber}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Loan Amount</span>
                  <span className="sg-value">₹{Number(dealDetails.loanAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Sub-Product</span>
                  <span className="sg-value">{dealDetails.subProduct}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Branch</span>
                  <span className="sg-value">{dealDetails.branch}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Category</span>
                  <span className="sg-value">{dealDetails.branchCategory}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h5 className="summary-section-title">Applicant Details</h5>
              <div className="summary-row-inline" key={0}>
                <div className="summary-item">
                  <span className="sg-label">Name</span>
                  <span className="sg-value">{dealDetails.borrowers[0].name}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Profile</span>
                  <span className="sg-value">{dealDetails.borrowers[0].customerProfile}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Income</span>
                  <span className="sg-value">₹{Number(dealDetails.borrowers[0].income).toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-item">
                  <span className="sg-label">Credit Score</span>
                  <span className="sg-value">{dealDetails.borrowers[0].newToCredit ? 'NTC' : dealDetails.borrowers[0].crifScore}</span>
                </div>
              </div>
            </div>

            {dealDetails.borrowers.length > 1 && (
              <div className="summary-section">
                <h5 className="summary-section-title">Co-Applicant Details</h5>
                {dealDetails.borrowers.slice(1, 3).map((b, i) => (
                  <div className="summary-row-inline" key={i}>
                    <div className="summary-item">
                      <span className="sg-label">Name</span>
                      <span className="sg-value">{b.name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="sg-label">Profile</span>
                      <span className="sg-value">{b.customerProfile}</span>
                    </div>
                    <div className="summary-item">
                      <span className="sg-label">Income</span>
                      <span className="sg-value">₹{Number(b.income).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-item">
                      <span className="sg-label">Credit Score</span>
                      <span className="sg-value">{b.newToCredit ? 'NTC' : b.crifScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-section">
              <h5 className="summary-section-title">Risk Factors</h5>
              <div className="risk-tags">
                {riskFactors.map((rf, i) => (
                  <span key={i} className="risk-tag">{rf}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="result-right">
          <ROIResult result={result} compact />
        </div>
      </div>

      <footer className="result-disclaimer">
        <strong>&#9888; Disclaimer:</strong> This calculator is for the convenience of customers and may be used at their sole discretion. People Home does not guarantee or promise or forecast any returns and under no circumstances would be liable for any losses in any adverse event.
      </footer>
    </div>
  );
}
