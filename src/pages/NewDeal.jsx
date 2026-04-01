import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCT_MASTER, BRANCH_MASTER, R2_DEVIATIONS } from '../data/pricingRules';
import { calculateROI } from '../utils/calculator';
import BorrowerForm from '../components/BorrowerForm';
import '../styles/NewDeal.css';

const PRODUCTS = [...new Set(PRODUCT_MASTER.map((p) => p.product))];

function getSubProducts(product) {
  return PRODUCT_MASTER.filter((p) => p.product === product).map((p) => p.subProduct);
}

function emptyBorrower() {
  return {
    name: '',
    customerProfile: '',
    newToCredit: null,
    crifScore: '',
    income: '',
  };
}

export default function NewDeal({ formData, setFormData, resetForm }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);

  const { dealNumber, applicantName, loanAmount, product, subProduct, branch, borrowers, policyDeviations, propertyLocation, ltvDeviation } = formData;

  const update = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const subProducts = product ? getSubProducts(product) : [];

  const clearBankSalariedDeviation = (borrowerList) => {
    if (!borrowerList.some((b) => b.customerProfile === 'Bank Salaried')) {
      setFormData((prev) => ({ ...prev, policyDeviations: { ...prev.policyDeviations, bankSalariedWithoutStatutory: false } }));
    }
  };

  const updateBorrower = (index, updated) => {
    const next = [...borrowers];
    next[index] = updated;
    setFormData((prev) => ({ ...prev, borrowers: next }));
    clearBankSalariedDeviation(next);
  };

  const removeBorrower = (index) => {
    const next = borrowers.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, borrowers: next }));
    clearBankSalariedDeviation(next);
  };

  const addCoApplicant = () => {
    setFormData((prev) => ({ ...prev, borrowers: [...prev.borrowers, emptyBorrower()] }));
  };

  const validate = () => {
    const errs = [];
    if (!dealNumber.trim()) errs.push('Deal Number is required');
    if (!applicantName.trim()) errs.push('Applicant Name is required');
    if (!loanAmount || parseFloat(loanAmount) <= 0) errs.push('Loan Amount must be greater than 0');
    if (!product) errs.push('Please select a Product');
    if (!subProduct) errs.push('Please select a Sub-Product');
    if (!branch) errs.push('Please select a Branch');
    if (!propertyLocation) errs.push('Please select a Property Location');
    if (ltvDeviation === null) errs.push('Please select Deviation of LTV');

    borrowers.forEach((b, i) => {
      const label = i === 0 ? 'Applicant' : `Co-Applicant ${i}`;
      if (!b.customerProfile) errs.push(`${label}: Please select a Customer Profile`);
      if (b.newToCredit === null) errs.push(`${label}: Please select New to Credit`);
      if (b.newToCredit !== true && (b.crifScore === '' || b.crifScore === undefined || b.crifScore < -50 || b.crifScore > 900))
        errs.push(`${label}: CRIF Score must be between -50 and 900`);
      if (b.income === '' || b.income === undefined || parseFloat(b.income) < 0) errs.push(`${label}: Income must be 0 or greater`);
    });

    return errs;
  };

  const handleCalculate = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);

    const borrowersWithNames = borrowers.map((b, i) => ({
      ...b,
      name: i === 0 ? applicantName : (b.name || `Co-Applicant ${i}`),
    }));

    const branchEntry = BRANCH_MASTER.find((b) => b.branch === branch);
    const branchCategory = branchEntry ? branchEntry.category : '';

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

    if (res.error) {
      setErrors([res.error]);
      return;
    }

    navigate('/result', {
      state: {
        result: res,
        dealDetails: {
          dealNumber,
          applicantName,
          loanAmount: parseFloat(loanAmount),
          product,
          subProduct,
          branch,
          branchCategory,
          borrowers: borrowersWithNames,
          policyDeviations,
          propertyLocation,
          ltvDeviation,
        },
      },
    });
  };

  const handleReset = () => {
    resetForm();
    setErrors([]);
  };

  return (
    <div className="new-deal">
      <div className="page-header">
        <h2>New Deal Calculation</h2>
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
              onChange={(e) => update('dealNumber', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Applicant Name *</label>
            <input
              type="text"
              placeholder="Full name"
              value={applicantName}
              onChange={(e) => update('applicantName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Loan Amount (₹) *</label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 2500000"
              value={loanAmount}
              onChange={(e) => update('loanAmount', e.target.value)}
            />
            {loanAmount > 0 && (
              <span className="input-hint">₹{Number(loanAmount).toLocaleString('en-IN')}</span>
            )}
          </div>
          <div className="form-group">
            <label>Product *</label>
            <select
              value={product}
              onChange={(e) => { update('product', e.target.value); update('subProduct', ''); }}
            >
              <option value="">Select Product</option>
              {PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Sub-Product *</label>
            <select
              value={subProduct}
              onChange={(e) => update('subProduct', e.target.value)}
              disabled={!product}
            >
              <option value="">Select Sub-Product</option>
              {subProducts.map((sp) => <option key={sp} value={sp}>{sp}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Branch *</label>
            <select
              value={branch}
              onChange={(e) => update('branch', e.target.value)}
            >
              <option value="">Select Branch</option>
              {BRANCH_MASTER.map((b) => (
                <option key={b.branch} value={b.branch}>{b.branch}</option>
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
          />
        ))}
        <button type="button" className="btn-secondary" onClick={addCoApplicant}>
          + Add Co-Applicant
        </button>
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
                    onChange={(e) => update('policyDeviations', { ...policyDeviations, [dev.key]: e.target.checked })}
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
                  onChange={(e) => update('propertyLocation', e.target.value)}
                />
                Within MC Limits
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="propertyLocation"
                  value="Beyond MC Limits"
                  checked={propertyLocation === 'Beyond MC Limits'}
                  onChange={(e) => update('propertyLocation', e.target.value)}
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
                  onChange={() => update('ltvDeviation', true)}
                />
                Yes
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="ltvDeviation"
                  checked={ltvDeviation === false}
                  onChange={() => update('ltvDeviation', false)}
                />
                No
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="action-bar">
        <button className="btn-primary" onClick={handleCalculate}>
          Calculate ROI
        </button>
        <button className="btn-ghost" onClick={handleReset}>Reset</button>
      </div>

      <footer className="disclaimer">
        <strong>&#9888; Disclaimer:</strong> This calculator is for the convenience of customers and may be used at their sole discretion. People Home does not guarantee or promise or forecast any returns and under no circumstances would be liable for any losses in any adverse event.
      </footer>
    </div>
  );
}
