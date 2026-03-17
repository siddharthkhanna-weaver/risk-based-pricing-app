import { CUSTOMER_PROFILES } from '../data/pricingRules';

export default function BorrowerForm({ borrower, index, onChange, onRemove, isApplicant, disabled }) {
  const update = (field, value) => {
    onChange(index, { ...borrower, [field]: value });
  };

  return (
    <div className="borrower-card">
      <div className="borrower-header">
        <h4>{isApplicant ? '👤 Primary Applicant' : `👥 Co-Applicant ${index}`}</h4>
        {!isApplicant && !disabled && (
          <button type="button" className="btn-remove" onClick={() => onRemove(index)}>
            Remove
          </button>
        )}
      </div>

      <div className="form-grid">
        {!isApplicant && (
          <div className="form-group full-width">
            <label>Name</label>
            <input
              type="text"
              placeholder="Co-applicant name"
              value={borrower.name || ''}
              onChange={(e) => update('name', e.target.value)}
              disabled={disabled}
            />
          </div>
        )}

        <div className="form-group">
          <label>Customer Profile *</label>
          <div className="radio-group">
            {CUSTOMER_PROFILES.map((p) => (
              <label key={p.value} className="radio-label">
                <input
                  type="radio"
                  name={`profile-${index}`}
                  value={p.value}
                  checked={borrower.customerProfile === p.value}
                  onChange={(e) => update('customerProfile', e.target.value)}
                  disabled={disabled}
                />
                {p.label}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>New to Credit?</label>
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${borrower.newToCredit ? 'active' : ''}`}
              onClick={() => !disabled && update('newToCredit', true)}
              disabled={disabled}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-btn ${!borrower.newToCredit ? 'active' : ''}`}
              onClick={() => !disabled && update('newToCredit', false)}
              disabled={disabled}
            >
              No
            </button>
          </div>
        </div>

        {!borrower.newToCredit && (
          <div className="form-group">
            <label>CRIF Score * (300–900)</label>
            <input
              type="number"
              min="300"
              max="900"
              placeholder="e.g. 750"
              value={borrower.crifScore || ''}
              onChange={(e) => update('crifScore', e.target.value)}
              disabled={disabled}
            />
          </div>
        )}

        <div className="form-group">
          <label>Income (₹) *</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 50000"
            value={borrower.income || ''}
            onChange={(e) => update('income', e.target.value)}
            disabled={disabled}
          />
          {borrower.income > 0 && (
            <span className="input-hint">
              ₹{Number(borrower.income).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
