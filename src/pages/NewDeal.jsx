import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_MASTER, BRANCH_CATEGORIES, R2_DEVIATIONS } from '../data/pricingRules';
import { calculateROI } from '../utils/calculator';
import BorrowerForm from '../components/BorrowerForm';
import ROIResult from '../components/ROIResult';
import '../styles/NewDeal.css';

const PRODUCTS = [...new Set(PRODUCT_MASTER.map((p) => p.product))];

function getSubProducts(product) {
  return PRODUCT_MASTER.filter((p) => p.product === product).map((p) => p.subProduct);
}

function emptyBorrower(name = '') {
  return {
    name,
    customerProfile: '',
    newToCredit: null,
    crifScore: '',
    income: '',
  };
}

export default function NewDeal({ user }) {
  const navigate = useNavigate();

  // Case details
  const [dealNumber, setDealNumber] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [product, setProduct] = useState('');
  const [subProduct, setSubProduct] = useState('');
  const [branchCategory, setBranchCategory] = useState('');

  // Borrowers
  const [borrowers, setBorrowers] = useState([emptyBorrower()]);

  // Common risk factors
  const [policyDeviations, setPolicyDeviations] = useState({});
  const [propertyLocation, setPropertyLocation] = useState('');
  const [ltvDeviation, setLtvDeviation] = useState(null);

  // Result
  const [result, setResult] = useState(null);
  const [finalized, setFinalized] = useState(false);
  const [errors, setErrors] = useState([]);

  const subProducts = product ? getSubProducts(product) : [];

  const clearBankSalariedDeviation = (borrowerList) => {
    if (!borrowerList.some((b) => b.customerProfile === 'Bank Salaried')) {
      setPolicyDeviations((prev) => ({ ...prev, bankSalariedWithoutStatutory: false }));
    }
  };

  const updateBorrower = (index, updated) => {
    const next = [...borrowers];
    next[index] = updated;
    setBorrowers(next);
    clearBankSalariedDeviation(next);
  };

  const removeBorrower = (index) => {
    const next = borrowers.filter((_, i) => i !== index);
    setBorrowers(next);
    clearBankSalariedDeviation(next);
  };

  const addCoApplicant = () => {
    setBorrowers([...borrowers, emptyBorrower()]);
  };

  const validate = () => {
    const errs = [];
    if (!dealNumber.trim()) errs.push('Deal Number is required');
    if (!applicantName.trim()) errs.push('Applicant Name is required');
    if (!loanAmount || parseFloat(loanAmount) <= 0) errs.push('Loan Amount must be greater than 0');
    if (!product) errs.push('Please select a Product');
    if (!subProduct) errs.push('Please select a Sub-Product');
    if (!branchCategory) errs.push('Please select a Branch Category');
    if (!propertyLocation) errs.push('Please select a Property Location');
    if (ltvDeviation === null) errs.push('Please select Deviation of LTV');

    borrowers.forEach((b, i) => {
      const label = i === 0 ? 'Applicant' : `Co-Applicant ${i}`;
      if (!b.customerProfile) errs.push(`${label}: Please select a Customer Profile`);
      if (b.newToCredit === null) errs.push(`${label}: Please select New to Credit`);
      if (b.newToCredit !== true && (!b.crifScore || b.crifScore < 300 || b.crifScore > 900))
        errs.push(`${label}: CRIF Score must be between 300 and 900`);
      if (!b.income || parseFloat(b.income) <= 0) errs.push(`${label}: Income must be greater than 0`);
    });

    return errs;
  };

  const handleCalculate = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      setResult(null);
      return;
    }
    setErrors([]);

    const borrowersWithNames = borrowers.map((b, i) => ({
      ...b,
      name: i === 0 ? applicantName : (b.name || `Co-Applicant ${i}`),
    }));

    const res = calculateROI({
      borrowers: borrowersWithNames,
      product,
      subProduct,
      branchCategory,
      loanAmount: parseFloat(loanAmount),
      policyDeviations,
      propertyLocation,
      ltvDeviation,
    });

    setResult(res);
  };

  const handleFinalize = () => {
    if (!result || result.error) return;
    if (window.confirm('Are you sure you want to finalize this ROI? The deal will be locked and no further changes will be allowed.')) {
      setFinalized(true);
    }
  };

  const handleReset = () => {
    setDealNumber('');
    setApplicantName('');
    setLoanAmount('');
    setProduct('');
    setSubProduct('');
    setBranchCategory('');
    setBorrowers([emptyBorrower()]);
    setPolicyDeviations({});
    setPropertyLocation('');
    setLtvDeviation(null);
    setResult(null);
    setFinalized(false);
    setErrors([]);
  };

  return (
    <div className="new-deal">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>← Dashboard</button>
        <h2>New Deal Calculation</h2>
        {finalized && <span className="status-badge finalized">Finalized</span>}
      </div>

      {errors.length > 0 && (
        <div className="error-box">
          <strong>Please fix the following errors:</strong>
          <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}

      {/* Case Details */}
      <section className="form-section">
        <h3>Case Details</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Deal Number *</label>
            <input
              type="text"
              placeholder="e.g. DL-2026-001"
              value={dealNumber}
              onChange={(e) => setDealNumber(e.target.value)}
              disabled={finalized}
            />
          </div>
          <div className="form-group">
            <label>Applicant Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              disabled={finalized}
            />
          </div>
          <div className="form-group">
            <label>Loan Amount (₹) *</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 2500000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              disabled={finalized}
            />
            {loanAmount > 0 && (
              <span className="input-hint">₹{Number(loanAmount).toLocaleString('en-IN')}</span>
            )}
          </div>
          <div className="form-group">
            <label>Product *</label>
            <select
              value={product}
              onChange={(e) => { setProduct(e.target.value); setSubProduct(''); }}
              disabled={finalized}
            >
              <option value="">Select Product</option>
              {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Sub-Product *</label>
            <select
              value={subProduct}
              onChange={(e) => setSubProduct(e.target.value)}
              disabled={!product || finalized}
            >
              <option value="">Select Sub-Product</option>
              {subProducts.map((sp) => <option key={sp} value={sp}>{sp}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Branch Category *</label>
            <select
              value={branchCategory}
              onChange={(e) => setBranchCategory(e.target.value)}
              disabled={finalized}
            >
              <option value="">Select Branch Category</option>
              {BRANCH_CATEGORIES.map((bc) => (
                <option key={bc.value} value={bc.value}>{bc.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Borrowers */}
      <section className="form-section">
        <h3>Borrower Details</h3>
        {borrowers.map((b, i) => (
          <BorrowerForm
            key={i}
            borrower={b}
            index={i}
            onChange={updateBorrower}
            onRemove={removeBorrower}
            isApplicant={i === 0}
            disabled={finalized}
          />
        ))}
        {!finalized && (
          <button type="button" className="btn-secondary" onClick={addCoApplicant}>
            + Add Co-Applicant
          </button>
        )}
      </section>

      {/* Risk Factors - Common */}
      <section className="form-section risk-factors-section">
        <h3>Risk Factors</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Policy Deviations</label>
            <div className="deviation-list">
              {R2_DEVIATIONS.filter((dev) => {
                if (dev.key === 'bankSalariedWithoutStatutory') {
                  return borrowers.some((b) => b.customerProfile === 'Bank Salaried');
                }
                return true;
              }).map((dev) => (
                <label key={dev.key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={policyDeviations[dev.key] || false}
                    onChange={(e) => setPolicyDeviations({ ...policyDeviations, [dev.key]: e.target.checked })}
                    disabled={finalized}
                  />
                  {dev.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Property Location *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="propertyLocation"
                  value="Within MC Limits"
                  checked={propertyLocation === 'Within MC Limits'}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  disabled={finalized}
                />
                Within MC Limits
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="propertyLocation"
                  value="Beyond MC Limits"
                  checked={propertyLocation === 'Beyond MC Limits'}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  disabled={finalized}
                />
                Beyond MC Limits
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Deviation of LTV?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="ltvDeviation"
                  checked={ltvDeviation === true}
                  onChange={() => !finalized && setLtvDeviation(true)}
                  disabled={finalized}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="ltvDeviation"
                  checked={ltvDeviation === false}
                  onChange={() => !finalized && setLtvDeviation(false)}
                  disabled={finalized}
                />
                No
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      {!finalized && (
        <div className="action-bar">
          <button className="btn-primary" onClick={handleCalculate}>
            Calculate ROI
          </button>
          {result && !result.error && (
            <button className="btn-finalize" onClick={handleFinalize}>
              Finalize ROI
            </button>
          )}
          <button className="btn-ghost" onClick={handleReset}>Reset</button>
        </div>
      )}

      {finalized && (
        <div className="finalized-banner">
          ROI finalized successfully. Deal is now locked.
          <button className="btn-secondary" onClick={handleReset} style={{ marginLeft: 16 }}>
            New Deal
          </button>
        </div>
      )}

      {/* Result */}
      <ROIResult result={result} />
    </div>
  );
}
